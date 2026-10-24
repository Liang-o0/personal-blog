<template>
  <component
    :is="destination ? 'a' : 'button'"
    :href="disabled ? undefined : destination"
    :type="destination ? undefined : 'button'"
    :disabled="destination ? undefined : disabled"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    :aria-label="label || text1"
    class="slide-button"
    :class="{ 'slide-button--back': arrowDirection === 'left' }"
    @click="handleClick"
  >
    <span class="slide-button__overlay" aria-hidden="true"></span>
    <span class="slide-button__content" aria-hidden="true">
      <span class="slide-button__labels">
        <span class="slide-button__initial">{{ text1 }}</span>
        <span class="slide-button__alternate">{{ text2 || text1 }}</span>
      </span>
      <span v-if="arrow" class="slide-button__arrows">
        <svg v-for="state in ['initial', 'alternate']" :key="state" :class="`slide-button__${state}`" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path :d="arrowDirection === 'left' ? 'M19 12H5m7-7-7 7 7 7' : 'M5 12h14m-7-7 7 7-7 7'" />
        </svg>
      </span>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import '../../styles/slide-button.css';

const props = withDefaults(defineProps<{
  text1: string;
  text2?: string;
  href?: string;
  /** Backward-compatible URL alias; Astro uses native links. */
  to?: string;
  label?: string;
  disabled?: boolean;
  arrow?: boolean;
  arrowDirection?: 'left' | 'right';
}>(), { disabled: false, arrow: true, arrowDirection: 'right' });
const emit = defineEmits<{ click: [event: MouseEvent] }>();
const destination = computed(() => props.href || props.to);
function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>
