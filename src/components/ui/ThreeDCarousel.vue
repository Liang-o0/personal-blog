<template>
  <div class="relative w-full overflow-hidden select-none py-10" ref="containerRef">
    <!-- Perspective Wrapper -->
    <div 
      class="relative h-[320px] w-full flex items-center justify-center"
      style="perspective: 1000px;"
    >
      <!-- Cylinder Container -->
      <div
        class="relative flex h-full items-center justify-center cursor-grab active:cursor-grabbing"
        style="transform-style: preserve-3d; will-change: transform;"
        :style="{
          transform: `rotateY(${rotation}deg)`,
          width: `${width}px`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <!-- Carousel Faces -->
        <div
          v-for="(photo, index) in repeatedImages"
          :key="index"
          class="absolute flex flex-col items-center justify-center p-2 rounded-2xl group transition-all duration-300"
          style="height: 220px;"
          :style="getFaceStyle(index)"
        >
          <!-- Image Wrapper with Glassmorphic Border -->
          <div 
            class="w-full h-full rounded-2xl overflow-hidden glass-card-custom border border-white/20 dark:border-white/10 shadow-lg relative group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 ease-custom cursor-pointer"
            @click="handleClick(photo)"
          >
            <img
              :src="photo.url"
              :alt="photo.title"
              class="w-full h-full object-cover pointer-events-none"
            />
            <!-- Overlay Caption on Hover -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <span class="text-xs uppercase font-bold tracking-widest text-accent mb-1">{{ photo.date }}</span>
              <h4 class="font-bold text-sm leading-snug">{{ photo.title }}</h4>
              <p class="text-[10px] text-zinc-300 line-clamp-2 mt-1">{{ photo.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Transition name="lightbox">
      <div 
        v-if="activePhoto" 
        class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
        @click="activePhoto = null"
      >
        <!-- Modal Content -->
        <div 
          class="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
          @click.stop
        >
          <!-- Image with zoom-in -->
          <img 
            :src="activePhoto.url" 
            :alt="activePhoto.title" 
            class="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl border border-white/10"
          />
          <!-- Caption Box -->
          <div class="text-center text-white max-w-xl px-4 space-y-2">
            <span class="text-xs font-bold uppercase tracking-widest text-accent">{{ activePhoto.date }}</span>
            <h3 class="text-xl font-bold">{{ activePhoto.title }}</h3>
            <p class="text-sm text-zinc-400 leading-relaxed">{{ activePhoto.caption }}</p>
          </div>
          <!-- Close Button -->
          <button 
            type="button"
            class="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors duration-300 md:-right-16 md:top-0"
            @click="activePhoto = null"
          >
            <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  autoplaySpeed: {
    type: Number,
    default: 0.15 // degrees per frame
  }
})

const rotation = ref(0)
const isDragging = ref(false)
const activePhoto = ref(null)
const width = ref(1200)

let startX = 0
let startRotation = 0
let animationFrameId = null

// Responsive width calculation
const updateWidth = () => {
  if (typeof window !== 'undefined') {
    width.value = window.innerWidth < 640 ? 800 : 1200
  }
}

// Duplicate images to create a continuous 3D circle
const repeatedImages = computed(() => {
  const list = props.images || []
  if (list.length === 0) return []
  let result = [...list]
  while (result.length < 12) {
    result = [...result, ...list]
  }
  return result
})

const faceCount = computed(() => repeatedImages.value.length)
const faceWidth = computed(() => width.value / faceCount.value)
const radius = computed(() => (width.value / (2 * Math.PI)) * 0.95)

const getFaceStyle = (index) => {
  const angle = index * (360 / faceCount.value)
  return {
    width: `${faceWidth.value}px`,
    transform: `rotateY(${angle}deg) translateZ(${radius.value}px)`,
    position: 'absolute',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden'
  }
}

// Pointer events drag handlers
const onPointerDown = (e) => {
  isDragging.value = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
  startRotation = rotation.value
  
  if (e.target && e.target.setPointerCapture) {
    e.target.setPointerCapture(e.pointerId)
  }
}

const onPointerMove = (e) => {
  if (!isDragging.value) return
  const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const diffX = currentX - startX
  // Move 0.15 degrees per pixel dragged
  rotation.value = startRotation + diffX * 0.15 
}

const onPointerUp = (e) => {
  if (!isDragging.value) return
  isDragging.value = false
  
  if (e.target && e.target.releasePointerCapture) {
    e.target.releasePointerCapture(e.pointerId)
  }
}

const handleClick = (photo) => {
  activePhoto.value = photo
}

// Auto-rotation loop
const animate = () => {
  if (!isDragging.value && props.autoplay && !activePhoto.value) {
    rotation.value += props.autoplaySpeed
  }
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  updateWidth()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWidth)
  }
  animationFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWidth)
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
/* Lightbox Transition */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.lightbox-enter-active img,
.lightbox-leave-active img {
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-enter-from img,
.lightbox-leave-to img {
  transform: scale(0.95);
}
</style>
