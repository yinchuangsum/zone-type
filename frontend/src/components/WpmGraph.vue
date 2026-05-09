<script setup lang="ts">
import { computed } from 'vue'
import type { WpmPoint } from '@/composables/useTypingAnalytics'

const props = defineProps<{
  points: WpmPoint[]
}>()

const MARGIN = { top: 8, right: 8, bottom: 20, left: 36 }
const W = 600
const H = 200
const PLOT_W = W - MARGIN.left - MARGIN.right
const PLOT_H = H - MARGIN.top - MARGIN.bottom

const maxWpm = computed(() => {
  if (props.points.length === 0) return 100
  const max = Math.max(...props.points.map(p => Math.max(p.rawWpm, p.netWpm)))
  return Math.ceil(max / 20) * 20 || 20
})

const maxTime = computed(() => {
  if (props.points.length === 0) return 60
  const last = props.points[props.points.length - 1].elapsedSeconds
  return Math.max(Math.ceil(last / 5) * 5, 5)
})

function x(t: number) {
  return MARGIN.left + (t / maxTime.value) * PLOT_W
}

function y(v: number) {
  return MARGIN.top + (1 - v / maxWpm.value) * PLOT_H
}

const netPoints = computed(() =>
  props.points.map(p => `${x(p.elapsedSeconds)},${y(p.netWpm)}`).join(' ')
)

const rawPoints = computed(() =>
  props.points.map(p => `${x(p.elapsedSeconds)},${y(p.rawWpm)}`).join(' ')
)

const yTicks = computed(() => {
  const step = Math.ceil(maxWpm.value / 4 / 10) * 10
  const ticks: number[] = []
  for (let v = 0; v <= maxWpm.value; v += step) ticks.push(v)
  return ticks
})

const xTicks = computed(() => {
  const step = Math.max(Math.floor(maxTime.value / 6), 1)
  const ticks: number[] = []
  for (let v = 0; v <= maxTime.value; v += step) ticks.push(v)
  return ticks
})

const hasData = computed(() => props.points.length > 1)
</script>

<template>
  <div class="w-full">
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      class="w-full h-48"
      role="img"
      aria-label="WPM over time graph"
    >
      <g v-for="v in yTicks" :key="'y' + v">
        <line
          :x1="x(0)" :y1="y(v)"
          :x2="x(maxTime)" :y2="y(v)"
          class="stroke-border"
          stroke-width="1"
        />
        <text
          :x="x(0) - 6" :y="y(v) + 4"
          class="fill-muted-foreground text-[10px]"
          text-anchor="end"
        >
          {{ v }}
        </text>
      </g>

      <text
        :x="x(0) - 6" :y="MARGIN.top - 2"
        class="fill-muted-foreground text-[10px]"
        text-anchor="end"
      >
        WPM
      </text>

      <g v-for="t in xTicks" :key="'x' + t">
        <text
          :x="x(t)" :y="H - 4"
          class="fill-muted-foreground text-[10px]"
          text-anchor="middle"
        >
          {{ t }}s
        </text>
      </g>

      <polyline
        v-if="hasData"
        :points="rawPoints"
        class="stroke-muted-foreground/50"
        fill="none"
        stroke-width="1.5"
        stroke-dasharray="4 3"
      />

      <polyline
        v-if="hasData"
        :points="netPoints"
        class="stroke-primary"
        fill="none"
        stroke-width="2"
      />

      <g transform="translate(420, 8)">
        <line x1="0" y1="5" x2="16" y2="5" class="stroke-primary" stroke-width="2" />
        <text x="22" y="9" class="fill-muted-foreground text-[10px]">Net WPM</text>
        <line x1="0" y1="21" x2="16" y2="21" class="stroke-muted-foreground/50" stroke-width="1.5" stroke-dasharray="4 3" />
        <text x="22" y="25" class="fill-muted-foreground text-[10px]">Raw WPM</text>
      </g>

      <text
        v-if="!hasData"
        :x="W / 2" :y="H / 2"
        class="fill-muted-foreground/50 text-sm"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        Not enough data for graph
      </text>
    </svg>
  </div>
</template>
