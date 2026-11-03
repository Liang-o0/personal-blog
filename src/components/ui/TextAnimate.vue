<template>
  <div v-if="html !== undefined" ref="containerRef" class="text-animate-rich" :class="[animated ? 'text-animate-visible' : 'text-animate-hidden', mask ? 'text-mask' : '']" :style="mask ? { '--text-mask-position': maskPosition } : undefined" v-html="html" />
  <span v-else ref="containerRef" class="inline-block" v-bind="$attrs">
    <template v-if="by === 'character'">
      <span v-for="(char, idx) in segments" :key="idx" class="inline-block whitespace-pre-wrap transition-all duration-700 ease-custom" :style="{ transitionDelay: `${idx * delay}ms` }" :class="animated ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-4 blur-[3px]'">{{ char }}</span>
    </template>
    <template v-else>
      <span v-for="(word, idx) in segments" :key="idx" class="inline-block whitespace-pre transition-all duration-700 ease-custom mr-[0.25em]" :style="{ transitionDelay: `${idx * delay}ms` }" :class="animated ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-4 blur-[3px]'">{{ word }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  html: { type: String, default: undefined },
  by: { type: String, default: 'character', validator: (val: string) => ['character', 'word'].includes(val) },
  delay: { type: Number, default: 25 },
  active: { type: Boolean, default: undefined },
  observe: { type: Boolean, default: true },
  mask: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
});
const containerRef = ref<HTMLElement | null>(null);
const isAnimated = ref(false);
const animated = computed(() => props.active ?? isAnimated.value);
const segments = computed(() => props.by === 'character' ? props.text.split('') : props.text.split(' '));
const maskWordCount = ref(0);
/*
  maskWordCount.value + 3,表示文字揭晓的扩展范围
  会让揭晓范围稍微提前
  加的数字越大，越早开始显示后面的文字
  +6，可以让更多文字提前进入变亮区
*/
const maskPosition = computed(() => props.progress * (maskWordCount.value + 5) - 1.5);

function tokenize(text: string) {
  return text.match(/[\s]+|[\u4e00-\u9fff]|[A-Za-z0-9]+(?:['’_-][A-Za-z0-9]+)*|[^\s]/gu) ?? [];
}

function prepareTextMask(container: HTMLElement) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    const textNode = current as Text;
    if (textNode.nodeValue?.trim() && !textNode.parentElement?.closest('script, style')) textNodes.push(textNode);
  }
  let index = 0;
  for (const textNode of textNodes) {
    const fragment = document.createDocumentFragment();
    for (const token of tokenize(textNode.nodeValue ?? '')) {
      if (/^\s+$/u.test(token)) {
        fragment.append(token);
        continue;
      }
      const word = document.createElement('span');
      word.className = 'text-mask-word';
      word.style.setProperty('--text-mask-index', String(index));
      word.textContent = token;
      fragment.append(word);
      index += 1;
    }
    textNode.replaceWith(fragment);
  }
  maskWordCount.value = index;
}

onMounted(() => {
  if (props.mask && containerRef.value) prepareTextMask(containerRef.value);
  if (!props.observe || props.active !== undefined || !containerRef.value) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isAnimated.value = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -25% 0px' });
  observer.observe(containerRef.value);
});
</script>

<style scoped>
.text-animate-rich { transition: opacity .1s var(--ease-custom), transform .1s var(--ease-custom), filter .1s var(--ease-custom); transform: translateY(1rem); filter: blur(3px); }
.text-animate-visible { opacity: 1; transform: translateY(0); filter: blur(0); }
.text-animate-hidden { opacity: 0; }
/*
调整每个文字"从暗到亮"的过渡速度，不改变文字随滚动推进的速度
transition: opacity .12s linear;
  .06s 文字变亮更快
  .25s 文字变亮更缓慢一点
linear:透明度均匀变化
*/
.text-mask :deep(.text-mask-word) { display: inline-block; opacity: clamp(.08, calc(var(--text-mask-position) - var(--text-mask-index)), 1); transition: opacity .25s linear; }
.text-mask.text-animate-visible { opacity: 1; transform: none; filter: none; transition: none; }
.text-mask.text-animate-hidden { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .text-mask :deep(.text-mask-word) { opacity: 1; transition: none; }
}
</style>
