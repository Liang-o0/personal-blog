<template>
  <div class="min-h-screen flex flex-col font-sans">
    <Navbar />
    <main class="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>
