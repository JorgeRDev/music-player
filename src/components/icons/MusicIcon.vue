<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "#000000",
  },
})
</script>

<template>
  <svg
    class="aspect:1/1 h:100%"
    viewBox="0 0 64.002 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Song" transform="scale(1 1)">
      <rect id="Background" width="64.002" height="64" transform="scale(1 1)" />
      <g id="Group" transform="matrix(1 0 0 1 2 1)">
        <path
          id="Vector"
          d="M26.014 7.48519C26.014 7.48519 26.3881 16.8686 14.0319 18.946C3.6513 19.7431 0.601566 14.8685 0.0527039 11.4707C-0.496147 8.07291 3.17921 0.278915 14.0139 0.0105324C19.1628 -0.120079 20.5222 1.00714 20.5222 1.00714L26.014 7.48519Z"
          :fill="props.color"
          fill-rule="evenodd"
          transform="matrix(1 0 0 1 33.985 33.974)"
        />
        <path
          id="Vector"
          d="M26.014 7.48519C26.014 7.48519 26.3881 16.8686 14.0319 18.946C3.6513 19.7431 0.601564 14.8685 0.0527064 11.4707C-0.49615 8.07291 3.1792 0.278915 14.0139 0.0105324C19.1628 -0.120079 20.5222 1.00714 20.5222 1.00714L26.014 7.48519Z"
          :fill="props.color"
          fill-rule="evenodd"
          transform="matrix(1 0 0 1 0 41.967)"
        />
        <path
          id="Vector"
          d="M39.9931 41.5014L39.9491 4.45237C40.0839 3.70471 38.9593 -0.966245 33.4194 0.180141L3.43954 7.52064C1.19905 8.99118 -0.115337 9.07588 0.00797272 17.0741L0.00749969 42.7892L6.03124 49.5972L6.04919 22.7836C6.07962 20.6852 7.89727 20.327 7.89727 20.327L32.3185 12.8294C34.4319 12.4702 34.4676 14.4078 34.4676 14.4078L34.4668 35.0507L39.9931 41.5014Z"
          :fill="props.color"
          fill-rule="evenodd"
          transform="matrix(1 0 0 1 19.991 0)"
        />
      </g>
    </g>
  </svg>
</template>
