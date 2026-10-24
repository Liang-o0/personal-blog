<template>
  <!-- Static photo layer: no hydration or continuously animated blur needed. -->
  <div class="glassy-background" aria-hidden="true">
    <picture>
      <source media="(max-width: 800px)" srcset="/backgrounds/botanical-mobile.webp" />
      <img src="/backgrounds/botanical-desktop.webp" alt="" width="2400" height="1950" decoding="async" />
    </picture>
    <div class="glassy-background-tint" />
  </div>
  <slot />
</template>

<style scoped>
.glassy-background { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; background: #0c1517; }
.glassy-background picture, .glassy-background img { display: block; width: 100%; height: 100%; }
.glassy-background img { object-fit: cover; object-position: center; }
.glassy-background-tint { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12, 21, 23, .38), rgba(12, 21, 23, .58)); }
</style>
