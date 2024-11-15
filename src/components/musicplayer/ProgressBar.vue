<script setup lang="ts">
import {
  ComputedRef,
  computed,
  inject,
  Ref,
  ref,
  watchEffect,
  onMounted,
  watch,
  provide,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "vue"
import ActualSong from "../../lib/actualSong"
import { create, API as SliderAPI } from "nouislider"
import pino from "pino"

const logger = pino({
  level: "trace",
})

const isFullScreen: Ref<boolean> = inject("isFullScreen", ref(false))

const isFullScreenComputed = computed(() => isFullScreen.value)

watch(isFullScreenComputed, () => {
  const styles = document.styleSheets[3]

  logger.info(`document.styleSheets`)
  if (isFullScreenComputed.value === true) {
    if (styles != null) {
      console.log(`updating ${styles}`)

      styles.insertRule(
        `.track-progress-handle { display: none; }`,
        styles.cssRules.length,
      )

      Array.from(styles.cssRules).findIndex(
        (rule) => rule.selectorText === ".track-progress-connect",
      ) >= 0 &&
        styles.deleteRule(
          Array.from(styles.cssRules).findIndex(
            (rule) => rule.selectorText === ".track-progress-connect",
          ),
        )
      styles.insertRule(
        `.track-progress-connect { background-color: white; opacity: 0.6; height: 3px; }`,
        styles.cssRules.length,
      )
    }
  } else {
    if (styles != null) {
      console.log(`updating ${styles}`)
      Array.from(styles.cssRules).findIndex(
        (rule) => rule.selectorText === ".track-progress-connect",
      ) >= 0 &&
        styles.deleteRule(
          Array.from(styles.cssRules).findIndex(
            (rule) => rule.selectorText === ".track-progress-connect",
          ),
        )
      styles.insertRule(
        `.track-progress-connect { background-color: var(--color-text); opacity: 0.6; height: 3px; }`,
        styles.cssRules.length,
      )

      styles.deleteRule(styles.cssRules.length - 1)
    }
  }
})

const actualSong: Ref<ActualSong | undefined> = inject(
  "actualSong",
  ref(new ActualSong()),
)

const actualSongMetadata: ComputedRef<SongMetadata | undefined> = computed(
  () => actualSong.value?.songMetadata,
)

const slider: Ref<SliderAPI | null> = inject("slider", ref(null))

const isDragging: Ref<boolean> = inject("isDragging", ref(false))

const totalDuration: ComputedRef<number | undefined> = inject(
  "totalDuration",
  computed(() => actualSong.value?.totalDuration),
)

const sliderHTMLElement: Ref<HTMLElement | null> = ref(null)

const actualDuration: ComputedRef<number> = inject(
  "actualDuration",
  computed(() => actualSong.value?.getActualDuration() ?? 0),
)

const tempSliderValue: Ref<number> = inject("tempSliderValue", ref(0))

watchEffect(() => {
  if (!isDragging.value) {
    tempSliderValue.value = actualDuration.value
  }
})

onActivated(() => {
  logger.trace("Activating ProgressBar")
  if (slider.value === null) {
    logger.trace("Initializing slider")

    logger.trace(
      `Trying to create slider HTMLElement within ${sliderHTMLElement.value}`,
    )

    slider.value = create(sliderHTMLElement.value!, {
      range: {
        min: 0,
        max: 100,
      },
      start: [0],
      cssPrefix: "track-progress-",
    })

    slider.value.disable()
  } else {
    logger.trace("Slider already initialized. Only updating options")
  }

  watch(actualSongMetadata, () => {
    if (actualSong.value?.songMetadata) {
      logger.info("enabling slider")
      slider.value?.enable()
      logger.info("updating slider options")
      slider.value?.updateOptions(
        {
          animate: false,
          range: {
            min: 0,
            max: totalDuration.value ?? 0,
          },
          connect: "lower",
          start: [0],
        },
        false,
      )
    } else {
      logger.warn("no buffer found. skipping slider update")
    }
  })

  slider.value?.on("start", () => {
    logger.info(`The user has started dragging the slider`)
    isDragging.value = true
  })

  slider.value?.on("end", () => {
    logger.info(`The user has stopped dragging the slider`)
    isDragging.value = false
  })

  slider.value?.on("slide", (value) => {
    tempSliderValue.value = value[0]
  })

  slider.value?.on("change", (value) => {
    logger.info(`The slider has changed to ${value}`)
    actualSong.value?.setActualDuration(value[0])
  })

  watch(actualDuration, () => {
    if (!isDragging.value) {
      slider.value?.set(actualDuration.value)
    }
  })
})

onDeactivated(() => {
  logger.trace("Deactivating ProgressBar")
})
</script>

<template>
  <div class="w:100% h:100%">
    <div ref="sliderHTMLElement" />
  </div>
</template>

<style>
[disabled] .track-progress-handle {
  display: none;
}

[disabled].track-progress-target {
  cursor: default;
}

.track-progress-horizontal {
  height: 12px;
  border-radius: 0;
}

.track-progress-horizontal .track-progress-handle {
  width: 10px;
  height: 10px;
  right: -6px;
  top: 1.49px;
}

.track-progress-handle {
  border-radius: 2rem;
  border: none;
  background-color: var(--color-text);
  box-shadow: none;
}

.track-progress-handle::before,
.track-progress-handle::after {
  display: none;
}

.track-progress-connect {
  background-color: var(--color-text);
  opacity: 0.6;
  height: 3px;
}

.track-progress-target {
  border: none;
  box-shadow: none;
  background-color: transparent;
}

.track-progress-touch-area {
  height: 150%;
  width: 150%;
  transform: translate(-11%, -20%);
}

.track-progress-base {
  height: 12px;
  padding: 5px 0 4px 0;
  background-color: transparent;
}

.track-progress-base::before {
  content: "";
  position: absolute;
  top: 50;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgba(184, 184, 184, 0.5);
}
</style>
