<template>
  <div class="relative min-h-screen w-full overflow-hidden text-text transition-colors duration-500 ease-custom">
    <!-- Animated glassy background background layer -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      <!-- Base gradient moving background -->
      <div 
        class="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-teal-500/10 dark:from-rose-950/15 dark:via-amber-950/15 dark:to-teal-950/15 opacity-40 animate-gradient-x"
        style="background-size: 200% 200%;"
      />
      <!-- Dynamic floating blurred shapes -->
      <div
        v-for="(shape, index) in shapes"
        :key="index"
        class="absolute mix-blend-multiply dark:mix-blend-screen filter blur-[60px] opacity-25 dark:opacity-20 animate-combined"
        :class="shape.shape === 'circle' ? 'rounded-full' : 'rounded-3xl'"
        :style="{
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          left: `${shape.position.x}%`,
          top: `${shape.position.y}%`,
          backgroundColor: shape.color,
          animation: `
            glassy-float ${shape.floatDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite,
            glassy-pulse ${shape.pulseDuration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate,
            glassy-rotate ${shape.rotateDuration}s linear infinite
          `
        }"
      />
      <!-- Glass overlay backdrop blur -->
      <div class="absolute inset-0 backdrop-blur-[70px] bg-bg/20" />
    </div>

    <!-- Content layer -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const shapes = ref([])

onMounted(() => {
  // Brand color palette avoiding purple/indigo gradients
  const colors = [
    '#F43F5E', // Rose
    '#E11D48', // Rose-darker
    '#D97706', // Amber/Yellow
    '#0D9488', // Teal
    '#059669', // Emerald
    '#0284C7', // Sky
    '#0891B2', // Cyan
  ]

  shapes.value = Array.from({ length: 16 }, () => {
    return {
      size: Math.random() * 250 + 120, // 120px to 370px
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'circle' : 'square',
      floatDuration: Math.random() * 20 + 20, // 20s to 40s
      pulseDuration: Math.random() * 8 + 4,   // 4s to 12s
      rotateDuration: Math.random() * 40 + 20  // 20s to 60s
    }
  })
})
</script>
