<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 items-center mx-auto px-4">
      <RouterLink to="/" class="mr-6 flex items-center space-x-2">
        <span class="text-xl font-bold tracking-tight">Zone Type</span>
      </RouterLink>
      <div class="flex flex-1 items-center space-x-6 text-sm font-medium">
        <RouterLink
          to="/"
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          active-class="text-foreground"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/profile"
          class="transition-colors hover:text-foreground/80 text-foreground/60"
          active-class="text-foreground"
        >
          Profile
        </RouterLink>
      </div>
    </div>
  </nav>
</template>