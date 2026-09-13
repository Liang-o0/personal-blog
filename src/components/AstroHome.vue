<template>
  <GlassyBackground>
    <div class="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <HomeView />
      </main>
      <Footer />
    </div>
  </GlassyBackground>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import HomeView from '../views/HomeView.vue'
import GlassyBackground from './ui/GlassyBackground.vue'
</script>
