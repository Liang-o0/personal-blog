<template>
  <span ref="elementRef" class="inline-block" v-bind="$attrs">
    {{ displayedText }}<span v-if="cursor" class="animate-pulse" :class="cursorClass">{{ cursorChar }}</span>
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 100 // Time (in ms) between each character
  },
  delay: {
    type: Number,
    default: 0 // Delay (in ms) before starting
  },
  startOnView: {
    type: Boolean,
    default: false // Start only when entering viewport
  },
  cursor: {
    type: Boolean,
    default: false // Show a cursor blinking at the end of the text
  },
  cursorChar: {
    type: String,
    default: '|'
  },
  cursorClass: {
    type: String,
    default: 'font-normal opacity-70 ml-0.5'
  }
})

const elementRef = ref(null)
const displayedText = ref('')
let timer = null
let delayTimer = null

const startTyping = () => {
  let currentIndex = 0
  displayedText.value = ''
  
  if (timer) clearInterval(timer)
  
  timer = setInterval(() => {
    if (currentIndex < props.text.length) {
      displayedText.value += props.text.charAt(currentIndex)
      currentIndex++
    } else {
      clearInterval(timer)
      timer = null
    }
  }, props.duration)
}

const initAnimation = () => {
  if (delayTimer) clearTimeout(delayTimer)
  if (timer) clearInterval(timer)
  displayedText.value = ''
  
  delayTimer = setTimeout(() => {
    startTyping()
  }, props.delay)
}

onMounted(() => {
  if (props.startOnView) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initAnimation()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (elementRef.value) {
      observer.observe(elementRef.value)
    }
  } else {
    initAnimation()
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (delayTimer) clearTimeout(delayTimer)
})

watch(() => props.text, () => {
  initAnimation()
})
</script>
