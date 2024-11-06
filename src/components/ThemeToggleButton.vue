<script setup lang="ts">
import { ref, computed, watchEffect, inject } from 'vue'

const storagedTheme = inject(
  'storagedTheme',
  ref(localStorage.getItem('theme')),
)

const isDark = inject(
  'isDark',
  computed(
    () =>
      storagedTheme.value === 'dark' ||
      (!storagedTheme.value &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  ),
)
const htmlClassList = inject(
  'htmlClassList',
  computed(() => document.documentElement.classList),
)

const toggleTheme = () => {
  htmlClassList.value.toggle('dark', !isDark.value)
  htmlClassList.value.toggle('light', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'light' : 'dark')
  watchEffect(() => {
    storagedTheme.value = localStorage.getItem('theme')
  })
}
</script>

<template>
  <div>
    <button
      class="aspect:1/1 max-width:3rem rounded background-color:gray-90 background-color:gray-20@dark display:flex padding:0 place-content:center align-items:center cursor:pointer fill:gray-30:hover>svg>path fill:gray-70:hover>svg>path@dark border:none"
      @click="toggleTheme"
    >
      <svg
        v-if="isDark"
        class="aspect:1/1 max-height:50%"
        width="95"
        height="106"
        viewBox="0 0 95 106"
        fill="none"
        stroke="none"
        version="1.1"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vector"
          d="M43.1528 62.8808C31.9854 48.7261 39.1606 28.5814 39.1606 28.5814C42.6538 14.1264 57.125 5.06085 57.125 5.06085C57.125 5.06085 59.9058 1.3853 54.6299 0.076416C54.6299 0.076416 23.7231 -2.91792 5.54028 28.5815C-8.0918 58.7064 7.72339 80.8255 7.72339 80.8255C24.7446 106.092 50.3401 105.968 50.3401 105.968C79.543 106.919 93.8391 86.4252 93.8391 86.4252C97.8655 79.0344 90.1255 80.3833 90.1255 80.3833C90.1255 80.3833 63.8867 91.9647 43.1528 62.8808Z"
          class="fill:gray-50 fill:gray-60@dark"
        />
      </svg>
      <svg
        v-if="!isDark"
        class="aspect:1/1 max-height:50%"
        width="166"
        height="166"
        viewBox="0 0 166 166"
        fill="none"
        stroke="none"
        version="1.1"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group">
          <path
            id="Oval"
            d="M0 52.5014C0 23.5065 23.5051 0.00153732 52.5001 0.00153732L52.5 30.0013C43.51 29.8313 30 37.4716 30 52.5015C30 67.5313 42.8999 75.0013 52.5 75.0013C62.1001 75.0013 75 67.5317 75 52.5015C75 37.4713 61.7979 29.8792 52.5 30.0013L52.5 0.00152016C81.5 -0.218695 105 23.5065 105 52.5014C105 81.4965 81.495 105.001 52.5001 105.001C23.5051 105.001 0 81.4965 0 52.5014Z"
            style="fill: #f9bb11; fill-rule: evenodd; mix-blend-mode: normal"
            transform="translate(30 30)"
          />
          <path
            id="Rectangle"
            d="M11.9205 3.8147e-06C17.4442 3.8147e-06 21.9206 4.47643 21.9206 10.0001L21.9206 12.0001C21.9206 17.5237 17.4442 22.0001 11.9205 22.0001L10.0001 22.0001C4.47643 22.0001 1.90735e-06 17.5237 0 12.0001L0 10.0001C1.90735e-06 4.47643 4.47643 0 10.0001 0L11.9205 3.8147e-06Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(0.707 -0.707 0.707 0.707 14.5 33)"
          />
          <path
            id="Rectangle"
            d="M6.50004 0C10.0904 0 13.0001 2.90968 13.0001 6.50004L13.0001 11.5001C13.0001 15.0904 10.0904 18.0001 6.50004 18.0001L6.50004 18.0001C2.90968 18.0001 0 15.0904 0 11.5001L0 6.50004C0 2.90968 2.90968 0 6.50004 0Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(-0 -1 1 -0 0 91)"
          />
          <path
            id="Rectangle"
            d="M12.0001 0C17.5237 0 22.0001 4.47642 22.0001 10.0001L22.0001 11.9205C22.0001 17.4441 17.5237 21.9205 12.0001 21.9205L10.0001 21.9205C4.47644 21.9205 1.52588e-05 17.4441 0 11.9205L1.52588e-05 10.0001C1.52588e-05 4.47643 4.47644 7.62939e-06 10.0001 7.62939e-06L12.0001 0Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(-0.707 -0.707 0.707 -0.707 31 151.5)"
          />
          <path
            id="Rectangle"
            d="M6.50003 0C10.0904 0 13.0001 2.90967 13.0001 6.50003L13.0001 11.5C13.0001 15.0904 10.0904 18.0001 6.50002 18.0001L6.50002 18.0001C2.90967 18.0001 0 15.0904 0 11.5L0 6.50003C0 2.90967 2.90968 0 6.50003 0Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(-1 -0 0 -1 89 166)"
          />
          <path
            id="Rectangle"
            d="M12.0001 1.52588e-05C17.5237 0 22.0001 4.47643 22.0001 10L22.0001 11.9204C22.0001 17.444 17.5237 21.9205 12.0001 21.9205L10 21.9205C4.47642 21.9205 0 17.444 7.62939e-06 11.9204L0 10C0 4.47641 4.47642 0 10 0L12.0001 1.52588e-05Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(-0.707 0.707 -0.707 -0.707 151 135)"
          />
          <path
            id="Rectangle"
            d="M6.5 0C10.0904 0 13 2.90967 13 6.50002L13 11.5C13 15.0904 10.0904 18 6.5 18L6.5 18C2.90967 18 0 15.0904 0 11.5L0 6.50002C0 2.90967 2.90967 0 6.5 0Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(-0 1 -1 -0 166 77)"
          />
          <path
            id="Rectangle"
            d="M11.9203 0C17.444 0 21.9203 4.4764 21.9204 10L21.9204 12C21.9204 17.5236 17.4439 22 11.9203 22L10 22C4.47641 22 0 17.5236 0 12L7.62939e-06 10C0 4.47641 4.47641 0 10 0L11.9203 0Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="matrix(0.707 0.707 -0.707 0.707 135.5 15.25)"
          />
          <path
            id="Rectangle"
            d="M6.5 0C10.0903 0 13 2.90966 13 6.5L13 11.5C13 15.0903 10.0903 18 6.5 18L6.5 18C2.90966 18 0 15.0903 0 11.5L0 6.5C0 2.90966 2.90966 0 6.5 0Z"
            style="fill: #f9bb11; mix-blend-mode: normal"
            transform="translate(76 0)"
          />
        </g>
      </svg>
    </button>
  </div>
</template>
