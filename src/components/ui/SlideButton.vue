<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :disabled="disabled"
    class="relative inline-flex items-center justify-center overflow-hidden px-7 py-3 rounded-full transition-all duration-500 ease-custom group hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)] hover:scale-[1.03] border border-white/20 dark:border-white/10 select-none bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm cursor-pointer z-10"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
  >
    <span class="relative z-10 flex items-center transition-all duration-500 ease-custom group-hover:-translate-x-2">
      <!-- Text 1: Initial state, slides up and fades out -->
      <span
        class="transition-all duration-500 ease-custom"
        :class="isHovered ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'"
      >
        {{ text1 }}
      </span>
      <!-- Text 2: Hover state, slides in from below -->
      <span
        class="absolute left-0 transition-all duration-500 ease-custom"
        :class="isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        {{ text2 }}
      </span>

      <!-- Sliding Arrow -->
      <span class="relative ml-2 transition-all duration-500 ease-custom">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-all duration-700 ease-custom"
          :class="[
            isHovered ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0',
            isClicked ? 'translate-x-[200px]' : ''
          ]"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="absolute top-0 left-0 transition-all duration-700 ease-custom"
          :class="[
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            isClicked ? 'translate-x-[200px]' : ''
          ]"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </span>

    <!-- Premium glassmorphic backdrop overlay scaling effects -->
    <span class="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-custom origin-left rounded-full"></span>
    <span class="absolute inset-0 w-full h-full bg-white/10 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-custom origin-bottom rounded-full"></span>
  </component>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  text1: {
    type: String,
    required: true
  },
  text2: {
    type: String,
    required: true
  },
  to: {
    type: String,
    default: null
  },
  href: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const isHovered = ref(false)
const isClicked = ref(false)

const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const handleClick = (e) => {
  if (props.disabled) return
  isClicked.value = true
  emit('click', e)
  setTimeout(() => {
    isClicked.value = false
  }, 1000)
}
</script>
