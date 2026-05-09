import { computed, shallowRef } from "vue"
import { useIntervalFn } from "@vueuse/core"

export interface KeyStats {
  char: string
  misses: number
  totalAttempts: number
  accuracy: number
}

export interface NGramStats {
  ngram: string
  occurrences: number
  totalDeltaMs: number
  averageDeltaMs: number
}

export interface WPMStats {
  rawWpm: number
  netWpm: number
  totalKeystrokes: number
  uncorrectedErrors: number
  timeMinutes: number
}

export interface SessionMetadata {
  sessionId: string
  startTime: number
  endTime: number | null
  durationMs: number
  totalKeystrokes: number
  backspaceCount: number
}

export interface WpmPoint {
  elapsedSeconds: number
  rawWpm: number
  netWpm: number
}

export interface AnalyticsPayload {
  session: SessionMetadata
  wpm: WPMStats
  keyStats: KeyStats[]
  bigramStats: NGramStats[]
  trigramStats: NGramStats[]
}

interface NGramBufferEntry {
  char: string
  timestamp: number
}

interface KeyMissEntry {
  misses: number
  totalAttempts: number
}

interface NGramEntry {
  occurrences: number
  totalDeltaMs: number
}

const THROTTLE_MS = 500

function computeAccuracy(misses: number, totalAttempts: number): number {
  if (totalAttempts === 0) return 100
  return Math.round(((totalAttempts - misses) / totalAttempts) * 100)
}

export function useTypingAnalytics() {
  const keyStatsMap = new Map<string, KeyMissEntry>()
  const bigramMap = new Map<string, NGramEntry>()
  const trigramMap = new Map<string, NGramEntry>()
  const ngramBuffer: NGramBufferEntry[] = []

  const wpmSnapshots: WpmPoint[] = []

  let totalKeystrokesInternal = 0
  let backspaceCountInternal = 0

  const sessionId = crypto.randomUUID()
  const sessionStartTime = Date.now()
  let sessionEndTime: number | null = null

  const rawWpm = shallowRef(0)
  const netWpm = shallowRef(0)
  const totalKeystrokes = shallowRef(0)
  const backspaceCount = shallowRef(0)

  const uncorrectedErrors = computed(() => {
    let errors = 0
    for (const [, stats] of keyStatsMap) {
      errors += stats.misses
    }
    return errors
  })

  function updateThrottledValues() {
    totalKeystrokes.value = totalKeystrokesInternal
    backspaceCount.value = backspaceCountInternal

    const now = sessionEndTime ?? Date.now()
    const elapsedMs = now - sessionStartTime
    if (elapsedMs === 0) return
    const mins = elapsedMs / 60000

    const raw = (totalKeystrokesInternal / 5) / mins
    const uncorrected = uncorrectedErrors.value
    const net = Math.max(0, raw - (uncorrected / mins))

    rawWpm.value = Math.round(raw)
    netWpm.value = Math.round(net)

    wpmSnapshots.push({
      elapsedSeconds: Math.round(elapsedMs / 1000),
      rawWpm: rawWpm.value,
      netWpm: netWpm.value,
    })
  }

  const { pause } = useIntervalFn(updateThrottledValues, THROTTLE_MS, { immediate: true })

  function recordKeystroke(
    actualKey: string,
    intendedChar: string,
    isBackspace: boolean = false,
  ) {
    if (isBackspace) {
      backspaceCountInternal++
      ngramBuffer.pop()
      return
    }

    if (actualKey.length !== 1) return
    if (!intendedChar || intendedChar.length !== 1) return

    totalKeystrokesInternal++

    const existing = keyStatsMap.get(intendedChar) ?? { misses: 0, totalAttempts: 0 }
    existing.totalAttempts++
    if (actualKey !== intendedChar) {
      existing.misses++
    }
    keyStatsMap.set(intendedChar, existing)

    const now = performance.now()
    ngramBuffer.push({ char: intendedChar, timestamp: now })

    const len = ngramBuffer.length
    if (len >= 2) {
      const a = ngramBuffer[len - 2]
      const b = ngramBuffer[len - 1]
      const bigram = a.char + b.char
      const delta = b.timestamp - a.timestamp
      const bigramEntry = bigramMap.get(bigram) ?? { occurrences: 0, totalDeltaMs: 0 }
      bigramEntry.occurrences++
      bigramEntry.totalDeltaMs += delta
      bigramMap.set(bigram, bigramEntry)
    }

    if (len >= 3) {
      const a = ngramBuffer[len - 3]
      const c = ngramBuffer[len - 1]
      const trigram = ngramBuffer[len - 3].char + ngramBuffer[len - 2].char + c.char
      const delta = c.timestamp - a.timestamp
      const trigramEntry = trigramMap.get(trigram) ?? { occurrences: 0, totalDeltaMs: 0 }
      trigramEntry.occurrences++
      trigramEntry.totalDeltaMs += delta
      trigramMap.set(trigram, trigramEntry)
    }

    while (ngramBuffer.length > 3) {
      ngramBuffer.shift()
    }
  }

  function complete() {
    sessionEndTime = Date.now()
    pause()
    updateThrottledValues()
  }

  function generateAnalyticsPayload(): AnalyticsPayload {
    const now = sessionEndTime ?? Date.now()
    const durationMs = now - sessionStartTime
    const mins = durationMs / 60000 || 0

    const uncorrected = uncorrectedErrors.value
    const raw = mins > 0 ? (totalKeystrokesInternal / 5) / mins : 0
    const net = Math.max(0, mins > 0 ? raw - (uncorrected / mins) : 0)

    return {
      session: {
        sessionId,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        durationMs,
        totalKeystrokes: totalKeystrokesInternal,
        backspaceCount: backspaceCountInternal,
      },
      wpm: {
        rawWpm: Math.round(raw),
        netWpm: Math.round(net),
        totalKeystrokes: totalKeystrokesInternal,
        uncorrectedErrors: uncorrected,
        timeMinutes: mins,
      },
      keyStats: Array.from(keyStatsMap.entries()).map(([char, stats]) => ({
        char,
        misses: stats.misses,
        totalAttempts: stats.totalAttempts,
        accuracy: computeAccuracy(stats.misses, stats.totalAttempts),
      })),
      bigramStats: Array.from(bigramMap.entries()).map(([ngram, stats]) => ({
        ngram,
        occurrences: stats.occurrences,
        totalDeltaMs: stats.totalDeltaMs,
        averageDeltaMs:
          stats.occurrences > 0
            ? Math.round(stats.totalDeltaMs / stats.occurrences)
            : 0,
      })),
      trigramStats: Array.from(trigramMap.entries()).map(([ngram, stats]) => ({
        ngram,
        occurrences: stats.occurrences,
        totalDeltaMs: stats.totalDeltaMs,
        averageDeltaMs:
          stats.occurrences > 0
            ? Math.round(stats.totalDeltaMs / stats.occurrences)
            : 0,
      })),
    }
  }

  return {
    rawWpm,
    netWpm,
    totalKeystrokes,
    backspaceCount,
    uncorrectedErrors,
    wpmSnapshots,
    recordKeystroke,
    complete,
    generateAnalyticsPayload,
  }
}
