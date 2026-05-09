import { ref, computed, onMounted } from "vue";
import { useTextProvider } from "@/providers/text";

export type CharState = "correct" | "incorrect" | "pending" | "current";
export type WordState = "correct" | "incorrect" | "pending" | "active";

export interface WordGroup {
  word: string;
  startIndex: number;
  state: WordState;
  chars: CharState[];
}

export interface TypingGameResult {
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  correctChars: number;
  totalChars: number;
  errors: number;
}

export function useTypingGame() {
  const textProvider = useTextProvider();

  const text = ref("");
  const currentIndex = ref(0);
  const errors = ref<Record<number, boolean>>({});
  const isPaused = ref(false);
  const isFocused = ref(false);
  const isStarted = ref(false);
  const isComplete = ref(false);
  const startTime = ref<number | null>(null);
  const endTime = ref<number | null>(null);

  const charStates = computed<CharState[]>(() => {
    return text.value.split("").map((_, i) => {
      if (isComplete.value) {
        if (errors.value[i]) return "incorrect";
        if (i < currentIndex.value) return "correct";
        return "pending";
      }
      if (i === currentIndex.value) return "current";
      if (i > currentIndex.value) return "pending";
      if (errors.value[i]) return "incorrect";
      return "correct";
    });
  });

  const progress = computed(() => {
    if (text.value.length === 0) return 0;
    return Math.round((currentIndex.value / text.value.length) * 100);
  });

  const wordGroups = computed<WordGroup[]>(() => {
    const words: WordGroup[] = [];
    const chars = text.value.split("");
    let wordStart = 0;

    for (let i = 0; i <= chars.length; i++) {
      const isEnd = i === chars.length || chars[i] === " ";
      if (isEnd) {
        const wordEnd = i === chars.length ? i : i + 1;
        const word = chars.slice(wordStart, wordEnd).join("");
        const wordCharStates = charStates.value.slice(wordStart, wordEnd);

        const allTyped = wordCharStates.every(
          (s) => s === "correct" || s === "incorrect",
        );
        const hasError = wordCharStates.some((s) => s === "incorrect");
        const hasCurrent = wordCharStates.some((s) => s === "current");

        let state: WordState;
        if (hasCurrent) {
          state = "active";
        } else if (!allTyped) {
          state = "pending";
        } else if (hasError) {
          state = "incorrect";
        } else {
          state = "correct";
        }

        words.push({
          word,
          startIndex: wordStart,
          state,
          chars: wordCharStates,
        });

        wordStart = wordEnd;
      }
    }

    return words;
  });

  const totalErrors = computed(() => Object.keys(errors.value).length);

  const correctChars = computed(() => {
    let count = 0;
    for (let i = 0; i < currentIndex.value; i++) {
      if (!errors.value[i]) count++;
    }
    return count;
  });

  const wpm = computed(() => {
    if (!startTime.value) return 0;
    const end = endTime.value ?? Date.now();
    const elapsedMinutes = (end - startTime.value) / 60000;
    if (elapsedMinutes === 0) return 0;
    return Math.round(correctChars.value / 5 / elapsedMinutes);
  });

  const accuracy = computed(() => {
    if (currentIndex.value === 0) return 100;
    return Math.round((correctChars.value / currentIndex.value) * 100);
  });

  const durationSeconds = computed(() => {
    if (!startTime.value) return 0;
    const end = endTime.value ?? Date.now();
    return Math.round((end - startTime.value) / 1000);
  });

  const isActive = computed(
    () => isFocused.value && !isPaused.value && !isComplete.value,
  );

  const result = computed<TypingGameResult | null>(() => {
    if (!isComplete.value) return null;
    return {
      wpm: wpm.value,
      accuracy: accuracy.value,
      durationSeconds: durationSeconds.value,
      correctChars: correctChars.value,
      totalChars: text.value.length,
      errors: totalErrors.value,
    };
  });

  async function loadText() {
    text.value = await textProvider.getText();
    reset();
  }

  function reset() {
    currentIndex.value = 0;
    errors.value = {};
    isPaused.value = false;
    isComplete.value = false;
    startTime.value = null;
    endTime.value = null;
    isStarted.value = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isActive.value) {
      if (!isComplete.value && !isPaused.value) return;
      return;
    }

    if (isComplete.value) return;

    if (e.key === "Backspace") {
      if (e.ctrlKey || e.metaKey) {
        const prevSpace = text.value.lastIndexOf(" ", currentIndex.value - 1);
        const newIndex = prevSpace === -1 ? 0 : prevSpace + 1;
        for (let i = newIndex; i < currentIndex.value; i++) {
          delete errors.value[i];
        }
        currentIndex.value = newIndex;
      } else if (currentIndex.value > 0) {
        currentIndex.value--;
        delete errors.value[currentIndex.value];
      }
      return;
    }

    if (e.key === "Delete") {
      if (e.ctrlKey || e.metaKey) {
        const nextSpace = text.value.indexOf(" ", currentIndex.value);
        const end = nextSpace === -1 ? text.value.length : nextSpace;
        for (let i = currentIndex.value; i < end; i++) {
          delete errors.value[i];
        }
      }
      return;
    }

    if (e.key.length !== 1) return;

    if (!isStarted.value) {
      isStarted.value = true;
      startTime.value = Date.now();
    }

    const expected = text.value[currentIndex.value];
    if (e.key !== expected) {
      errors.value[currentIndex.value] = true;
    }

    currentIndex.value++;

    if (currentIndex.value >= text.value.length) {
      isComplete.value = true;
      endTime.value = Date.now();
    }
  }

  function pause() {
    isPaused.value = true;
  }

  function resume() {
    isPaused.value = false;
  }

  function focus() {
    isFocused.value = true;
  }

  function blur() {
    isFocused.value = false;
    if (!isComplete.value && isStarted.value) {
      pause();
    }
  }

  onMounted(() => {
    loadText();
  });

  return {
    text,
    currentIndex,
    charStates,
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
    totalErrors,
    result,
    handleKeyDown,
    pause,
    resume,
    focus,
    blur,
    reset,
    loadText,
  };
}

