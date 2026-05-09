<script setup lang="ts">
import AppNavbar from './AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppNavbar />
    <main>
      <RouterView />
    </main>
  </div>
</template>