<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_30%),linear-gradient(180deg,_rgba(2,6,23,0.92),_rgba(2,6,23,1))]" />
    <div class="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/20" />
    <div class="pointer-events-none absolute -right-24 top-[28rem] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/20" />
    <div class="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <router-view />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>
