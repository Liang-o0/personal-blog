<template>
  <span ref="containerRef" class="inline-block" v-bind="$attrs">
    <!-- Split by character -->
    <template v-if="by === 'character'">
      <span 
        v-for="(char, idx) in segments" 
        :key="idx" 
        class="inline-block whitespace-pre-wrap transition-all duration-700 ease-custom"
        :style="{ transitionDelay: `${idx * delay}ms` }"
        :class="isAnimated ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-4 blur-[3px]'"
      >
        {{ char }}
      </span>
    </template>
    <!-- Split by word -->
    <template v-else>
      <span 
        v-for="(word, idx) in segments" 
        :key="idx" 
        class="inline-block whitespace-pre transition-all duration-700 ease-custom mr-[0.25em]"
        :style="{ transitionDelay: `${idx * delay}ms` }"
        :class="isAnimated ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-4 blur-[3px]'"
      >
        {{ word }}
      </span>
    </template>
  </span>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  by: {
    type: String,
    default: 'character', // 'character' | 'word'
    validator: (val) => ['character', 'word'].includes(val)
  },
  delay: {
    type: Number,
    default: 25 // delay in ms per character/word
  }
})

const containerRef = ref(null)
const isAnimated = ref(false)

const segments = computed(() => {
  if (props.by === 'character') {
    return props.text.split('')
  } else {
    return props.text.split(' ')
  }
})

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isAnimated.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px'
    }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})
</script>
