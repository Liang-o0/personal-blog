<template>
  <section ref="rootRef" class="answer-reveal" aria-label="答案" :inert="!revealed">
    <TextAnimate :html="content" :active="revealed" :observe="false" :mask="true" :progress="maskProgress" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import TextAnimate from './TextAnimate.vue';

defineProps<{ content: string }>();
const rootRef = ref<HTMLElement | null>(null);
const revealed = ref(false);
const maskProgress = ref(0);
let observer: IntersectionObserver | undefined;
let removeMotionListener: (() => void) | undefined;
let previousTop: number | undefined;
let frame = 0;
let removeScrollListener: (() => void) | undefined;

function updateMaskProgress() {
  frame = 0;
  const root = rootRef.value;
  if (!root || !revealed.value) return;
  const rect = root.getBoundingClientRect();
  /*
    使答案文字更快完成
  */
  const distance = window.innerHeight + rect.height;
  
  /*
    调整答案加载速度，使答案在快约35%就接近完成
  */
  const speed = 1.95
  maskProgress.value = distance > 0 ? Math.min(1, Math.max(0, (window.innerHeight - rect.top) / distance) * speed) : 1;
}

function requestMaskProgress() {
  if (!frame) frame = window.requestAnimationFrame(updateMaskProgress);
}

function startMaskProgress() {
  if (removeScrollListener) return;
  window.addEventListener('scroll', requestMaskProgress, { passive: true });
  removeScrollListener = () => window.removeEventListener('scroll', requestMaskProgress);
  requestMaskProgress();
}

function stopMaskProgress() {
  removeScrollListener?.();
  removeScrollListener = undefined;
  if (frame) window.cancelAnimationFrame(frame);
  frame = 0;
  maskProgress.value = 0;
}

onMounted(() => {
  const root = rootRef.value;
  if (!root) return;
  root.removeAttribute('data-answer-reveal-pending');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = () => {
    revealed.value = true;
    startMaskProgress();
  };
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    reveal();
    return;
  }
  observer = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    const currentTop = entry.boundingClientRect.top;
    const movingUp = previousTop !== undefined && currentTop > previousTop;
    if (entry.isIntersecting) {
      if (movingUp && currentTop < 0) {
        // Re-entering from above means the reader is moving back toward the question.
        revealed.value = false;
        stopMaskProgress();
      } else {
        reveal();
      }
    } else if (movingUp) {
      // The answer left through the top while the reader moved back upward.
      revealed.value = false;
      stopMaskProgress();
    }
    previousTop = currentTop;
  },
/*
控制答案在何时进入滚动效果
  threshold:0.12
    答案仅有12%进入观察区域即可触发
    改为0可以更早触发答案
    改为0.05会稍微晚一点触发答案
  rootMargin:上 右 下 左
    第三个参数-12%会把观察区底部向上收缩12%，控制"什么时候开始"
    -10%：答案更早触发
    -40%：答案更靠近视口中部时触发
      
*/
   { threshold: 0.42, rootMargin: '0px 0px -12% 0px' });
  observer.observe(root);
  const onMotionChange = () => { if (reduceMotion.matches) reveal(); };
  reduceMotion.addEventListener('change', onMotionChange);
  removeMotionListener = () => reduceMotion.removeEventListener('change', onMotionChange);
});

onUnmounted(() => {
  observer?.disconnect();
  removeMotionListener?.();
  stopMaskProgress();
});
</script>
