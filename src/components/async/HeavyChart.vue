<script setup lang="ts">
// HeavyChart — simulated heavy component using top-level await
// In Vue, a component can use top-level await inside <script setup>.
// This makes the component asynchronous — it won't render until the await resolves.
// The parent must wrap it in <Suspense> to handle the pending state.

import { ref, onMounted } from 'vue'

interface DataPoint {
  label: string
  value: number
  color: string
}

// Top-level await — this SFC is an async component
// Vue detects this and requires <Suspense> in the parent
const data = await new Promise<DataPoint[]>((resolve) => {
  setTimeout(() => {
    resolve([
      { label: 'Jan', value: 65, color: '#4f46e5' },
      { label: 'Feb', value: 82, color: '#7c3aed' },
      { label: 'Mar', value: 74, color: '#6d28d9' },
      { label: 'Apr', value: 91, color: '#5b21b6' },
      { label: 'May', value: 58, color: '#4c1d95' },
      { label: 'Jun', value: 87, color: '#3730a3' },
    ])
  }, 1800) // simulate 1.8s load time
})

const maxValue = Math.max(...data.map((d) => d.value))
const loadedAt = new Date().toLocaleTimeString()

// Simulate further async data fetch on mount
const insights = ref<string[]>([])

onMounted(() => {
  insights.value = [
    `Peak month: ${data.reduce((a, b) => (a.value > b.value ? a : b)).label}`,
    `Average: ${Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}`,
    `Total: ${data.reduce((sum, d) => sum + d.value, 0)}`,
  ]
})
</script>

<template>
  <div class="heavy-chart">
    <div class="chart-header">
      <h4>Monthly Performance Chart</h4>
      <span class="loaded-badge">Loaded at {{ loadedAt }}</span>
    </div>

    <!-- Bar chart visualization -->
    <div class="bar-chart">
      <div v-for="point in data" :key="point.label" class="bar-group">
        <div
          class="bar"
          :style="{
            height: `${(point.value / maxValue) * 120}px`,
            background: point.color,
          }"
        >
          <span class="bar-value">{{ point.value }}</span>
        </div>
        <span class="bar-label">{{ point.label }}</span>
      </div>
    </div>

    <!-- Insights -->
    <div v-if="insights.length" class="insights">
      <span v-for="insight in insights" :key="insight" class="insight-tag">{{ insight }}</span>
    </div>

    <p class="note">
      This component used <code>top-level await</code> in <code>&lt;script setup&gt;</code> —
      making it inherently async. The parent wraps it in <code>&lt;Suspense&gt;</code>.
    </p>
  </div>
</template>

<style scoped>
.heavy-chart {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  background: #fff;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h4 {
  margin: 0;
}

.loaded-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 140px;
  padding: 0 0.5rem;
  margin-bottom: 0.75rem;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  flex: 1;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 8px;
  transition: opacity 0.2s;
  position: relative;
}

.bar:hover {
  opacity: 0.8;
}

.bar-value {
  position: absolute;
  top: -1.2rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #374151;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.insights {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.insight-tag {
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.note {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.75rem;
}
</style>
