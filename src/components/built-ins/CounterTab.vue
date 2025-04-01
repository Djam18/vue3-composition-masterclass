<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

const count = ref(0)
const activations = ref(0)
const log = ref<string[]>([])

onActivated(() => {
  activations.value++
  log.value.push(`[onActivated] tab entered — count is ${count.value}`)
  console.log('[CounterTab] onActivated — component re-mounted from KeepAlive cache')
})

onDeactivated(() => {
  log.value.push(`[onDeactivated] tab left — count preserved at ${count.value}`)
  console.log('[CounterTab] onDeactivated — component cached, not destroyed')
})

function increment() {
  count.value++
}

function decrement() {
  count.value = Math.max(0, count.value - 1)
}

function reset() {
  count.value = 0
}
</script>

<template>
  <div class="counter-tab">
    <h4>Counter Tab</h4>
    <p class="tab-note">
      With KeepAlive: state is preserved when you switch tabs.
      Without KeepAlive: counter resets to 0 every time you return.
    </p>

    <div class="counter-controls">
      <button class="btn btn-secondary" @click="decrement">-</button>
      <span class="counter-value">{{ count }}</span>
      <button class="btn btn-primary" @click="increment">+</button>
      <button class="btn btn-ghost" @click="reset">Reset</button>
    </div>

    <div class="lifecycle-log">
      <p class="log-header">Lifecycle log (activations: {{ activations }})</p>
      <div v-if="log.length === 0" class="log-empty">No events yet — switch tabs to see onActivated / onDeactivated</div>
      <div v-for="(entry, i) in log" :key="i" class="log-entry">{{ entry }}</div>
    </div>
  </div>
</template>

<style scoped>
.counter-tab {
  padding: 1rem;
}

h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #1e1b4b;
}

.tab-note {
  font-size: 0.82rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.counter-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.counter-value {
  font-size: 2rem;
  font-weight: 700;
  color: #4f46e5;
  min-width: 3rem;
  text-align: center;
}

.btn {
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn:hover { opacity: 0.85; }

.btn-primary { background: #4f46e5; color: #fff; }
.btn-secondary { background: #6b7280; color: #fff; }
.btn-ghost { background: #e5e7eb; color: #374151; }

.lifecycle-log {
  background: #f3f4f6;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.8rem;
}

.log-header {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: #374151;
}

.log-empty {
  color: #9ca3af;
  font-style: italic;
}

.log-entry {
  padding: 0.2rem 0;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.log-entry:last-child {
  border-bottom: none;
}
</style>
