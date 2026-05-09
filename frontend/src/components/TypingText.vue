<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { useTypingGame } from '@/composables/useTypingGame'

const typingArea = ref<HTMLElement | null>(null)

const {
  text,
  wordGroups,
  progress,
  isPaused,
  isFocused,
  isStarted,
  isComplete,
  isActive,
  wpm,
  accuracy,
  durationSeconds,
  result,
  handleKeyDown,
  resume,
  focus,
  blur,
  reset,
  loadText,
} = useTypingGame()

function handleResume() {
  resume()
  nextTick(() => {
    typingArea.value?.focus()
  })
}

function handleReset() {
  reset()
  nextTick(() => {
    typingArea.value?.focus()
  })
}

function handleNewText() {
  loadText()
  nextTick(() => {
    typingArea.value?.focus()
  })
}

function handleFocus() {
  focus()
}

function handleBlur() {
  blur()
}

function handleClickToFocus() {
  nextTick(() => {
    typingArea.value?.focus()
  })
}

function handleKey(e: KeyboardEvent) {
  if (!isActive.value) return

  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      e.stopPropagation()
      handleKeyDown(e)
      return
    }
    return
  }

  e.preventDefault()
  e.stopPropagation()
  handleKeyDown(e)
}

function handleResumeKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleResume()
  }
}

function getWordClass(state: string) {
  switch (state) {
    case 'correct':
      return 'bg-primary/15 text-primary rounded'
    case 'incorrect':
      return 'bg-destructive/15 text-destructive rounded'
    case 'active':
      return 'bg-accent/50 rounded'
    default:
      return ''
  }
}

function getCharClass(charState: string) {
  switch (charState) {
    case 'correct':
      return 'text-primary'
    case 'incorrect':
      return 'text-destructive bg-destructive/30 rounded-sm'
    case 'current':
      return 'text-foreground border-b-2 border-primary animate-pulse'
    case 'pending':
      return 'text-muted-foreground'
    default:
      return ''
  }
}
</script>

<template>
  <div class="typing-practice w-full max-w-3xl mx-auto px-4">
    <div
      ref="typingArea"
      role="application"
      tabindex="0"
      :aria-label="isComplete
        ? `Typing complete. ${result?.wpm} words per minute. ${result?.accuracy} percent accuracy.`
        : isPaused
          ? 'Typing paused. Press the resume button or click here to continue.'
          : 'Typing practice area. Type the text shown below.'"
      aria-describedby="typing-instructions"
      class="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-6 bg-card border border-border transition-shadow"
      @keydown="handleKey"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <p id="typing-instructions" class="sr-only">
        Type each character as it appears. Press backspace to correct errors. Press control backspace to delete the previous word. The exercise will pause if you click away.
      </p>

      <div
        v-if="!isPaused && !isComplete"
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Typing active
      </div>

      <div v-if="isPaused && !isComplete" class="sr-only" aria-live="polite" aria-atomic="true">
        Typing paused
      </div>

      <div class="mb-4 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-200 ease-out rounded-full"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <div
        v-if="text && !(!isStarted && !isFocused)"
        class="font-mono text-lg leading-relaxed tracking-wide select-none"
        :aria-hidden="true"
      >
        <span
          v-for="(group, gi) in wordGroups"
          :key="gi"
          :class="['inline-block px-0.5 transition-colors duration-150', getWordClass(group.state)]"
        >
          <span
            v-for="(char, ci) in group.word"
            :key="ci"
            :class="['inline-block', getCharClass(group.chars[ci])]"
            :style="char === ' ' ? 'width: 0.5em' : undefined"
          >{{ char === ' ' ? '\u00A0' : char }}</span>
        </span>
      </div>

      <div v-if="!isStarted && !isFocused && !isComplete" class="flex flex-col items-center gap-3 py-8 cursor-pointer" @click="handleClickToFocus">
        <p class="text-lg font-medium text-muted-foreground">Click the text area to get ready</p>
      </div>

      <div v-if="!isStarted && isFocused && !isComplete" class="mt-3 text-center">
        <p class="text-sm text-muted-foreground animate-pulse">Type anything to start</p>
      </div>

      <div v-if="isPaused && !isComplete" class="flex flex-col items-center gap-4 py-8">
        <p class="text-lg font-medium text-muted-foreground">Paused</p>
        <Button
          @click="handleResume"
          @keydown="handleResumeKey"
        >
          Resume
        </Button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-4 text-center">
      <div class="rounded-lg border bg-card p-4">
        <p class="text-sm text-muted-foreground">WPM</p>
        <p class="text-2xl font-bold tabular-nums">{{ wpm }}</p>
      </div>
      <div class="rounded-lg border bg-card p-4">
        <p class="text-sm text-muted-foreground">Accuracy</p>
        <p class="text-2xl font-bold tabular-nums">{{ accuracy }}%</p>
      </div>
      <div class="rounded-lg border bg-card p-4">
        <p class="text-sm text-muted-foreground">Time</p>
        <p class="text-2xl font-bold tabular-nums">{{ durationSeconds }}s</p>
      </div>
    </div>

    <div class="mt-4 flex justify-center gap-3">
      <Button variant="outline" @click="handleReset">
        Reset
      </Button>
      <Button variant="outline" @click="handleNewText">
        New Text
      </Button>
    </div>

    <div
      v-if="isComplete && result"
      class="mt-6 rounded-lg border bg-primary/10 p-6 text-center"
      role="status"
      aria-live="polite"
    >
      <h2 class="text-xl font-bold">Complete!</h2>
      <p class="mt-2 text-muted-foreground">
        {{ result.wpm }} WPM &middot; {{ result.accuracy }}% accuracy &middot; {{ result.durationSeconds }}s
      </p>
      <p class="mt-1 text-sm text-muted-foreground">
        {{ result.correctChars }}/{{ result.totalChars }} correct characters &middot; {{ result.errors }} errors
      </p>
      <div class="mt-4 flex justify-center gap-3">
        <Button @click="handleReset">Try Again</Button>
        <Button variant="outline" @click="handleNewText">New Text</Button>
      </div>
    </div>
  </div>
</template>