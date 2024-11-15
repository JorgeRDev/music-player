import { Ref, ref } from "vue"
import { create, SliderAPI } from "vue-slider-component"
const isDragging: Ref<boolean> = ref(false)
const tempSliderValue: Ref<number> = ref(0)
const slider: Ref<SliderAPI> = ref(null)

export { isDragging, tempSliderValue, slider }
