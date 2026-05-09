<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'

const userStore = useUserStore()
</script>

<template>
  <div class="flex flex-col items-center py-20 space-y-6">
    <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
      {{ userStore.initials }}
    </div>
    <h1 class="text-3xl font-bold">{{ userStore.name }}</h1>
    <p class="text-muted-foreground">{{ userStore.email }}</p>
    <div class="mt-6 space-y-2 text-center">
      <p class="text-sm text-muted-foreground">Member since {{ userStore.createdAt }}</p>
      <p class="text-sm text-muted-foreground">Role: {{ userStore.role }}</p>
    </div>
    <Button variant="outline" class="mt-4">Edit Profile</Button>
  </div>
</template>