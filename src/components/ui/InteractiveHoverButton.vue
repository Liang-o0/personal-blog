<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    class="group relative inline-flex items-center justify-center cursor-pointer overflow-hidden rounded-full border border-slate-200/80 bg-white/70 px-6 py-3 text-center font-semibold text-slate-700 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300"
    v-bind="$attrs"
  >
    <!-- Normal state content -->
    <span class="inline-block translate-x-0 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
      <slot>{{ text }}</slot>
    </span>

    <!-- Hover state content (centered) -->
    <div class="absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-0 group-hover:opacity-100 dark:text-slate-950">
      <span class="font-semibold">
        <slot>{{ text }}</slot>
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>

    <!-- Expanding circle background -->
    <div class="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-slate-950 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] dark:bg-white"></div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Button'
  },
  to: {
    type: String,
    default: null
  },
  href: {
    type: String,
    default: null
  }
})

const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})
</script>
