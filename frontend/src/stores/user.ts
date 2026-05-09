import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const name = ref('Zone User')
  const email = ref('user@zonetype.dev')
  const role = ref('Member')
  const createdAt = ref('2026-01-01')

  const initials = computed(() => {
    return name.value
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  })

  return {
    name,
    email,
    role,
    createdAt,
    initials,
  }
})