<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
} from 'vue'

const log = ref<string[]>([])
const count = ref<number>(0)
const showChild = ref<boolean>(false)

function addLog(msg: string) {
  log.value = [...log.value, `[${new Date().toLocaleTimeString()}] ${msg}`]
}

// ─── Mount hooks ─────────────────────────────────────────────────────────────
onBeforeMount(() => {
  // DOM does not exist yet — cannot access template refs here
  addLog('onBeforeMount: component about to be inserted into DOM')
})

onMounted(() => {
  // DOM is ready — safe to access template refs, start intervals, fetch data
  addLog('onMounted: component inserted into DOM')
})

// ─── Update hooks ─────────────────────────────────────────────────────────────
onBeforeUpdate(() => {
  // Reactive state changed, DOM update pending
  // Good for: reading DOM state before the update (e.g. scroll position)
  addLog(`onBeforeUpdate: reactive state changed, DOM about to update (count=${count.value})`)
})

onUpdated(() => {
  // DOM has been updated to reflect the latest state
  // Avoid mutating state here — causes infinite update loops
  addLog('onUpdated: DOM updated')
})

// ─── Unmount hooks ────────────────────────────────────────────────────────────
onBeforeUnmount(() => {
  // Component still mounted — last chance to do cleanup
  addLog('onBeforeUnmount: cleanup resources before removal')
})

onUnmounted(() => {
  // Component removed from DOM
  // Clear intervals, event listeners, abort controllers here
  addLog('onUnmounted: component removed')
})

// ─── Error handling ───────────────────────────────────────────────────────────
onErrorCaptured((err, instance, info) => {
  addLog(`onErrorCaptured: ${err.message} (${info})`)
  return false  // return false to stop propagation
})

// ─── Multiple hooks ───────────────────────────────────────────────────────────
// Multiple onMounted calls are allowed — they run in registration order
onMounted(() => {
  addLog('onMounted (second call): runs after first onMounted')
})

// ─── Cleanup pattern ──────────────────────────────────────────────────────────
// Intervals, event listeners, AbortControllers — register in onMounted, clear in onUnmounted
let intervalId: ReturnType<typeof setInterval> | null = null
const ticker = ref<number>(0)

onMounted(() => {
  intervalId = setInterval(() => {
    ticker.value++
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<template>
  <div class="lifecycle-demo">
    <h2>Lifecycle Hooks in Composition API</h2>

    <section>
      <h3>Hook mapping: Options API → Composition API</h3>
      <table>
        <thead>
          <tr><th>Options API</th><th>Composition API</th><th>When</th></tr>
        </thead>
        <tbody>
          <tr><td>beforeCreate / created</td><td><em>setup() itself</em></td><td>Before mount</td></tr>
          <tr><td>beforeMount</td><td>onBeforeMount</td><td>Before DOM insert</td></tr>
          <tr><td>mounted</td><td>onMounted</td><td>After DOM insert ✓ refs ready</td></tr>
          <tr><td>beforeUpdate</td><td>onBeforeUpdate</td><td>Before reactive update</td></tr>
          <tr><td>updated</td><td>onUpdated</td><td>After DOM update</td></tr>
          <tr><td>beforeUnmount</td><td>onBeforeUnmount</td><td>Before removal</td></tr>
          <tr><td>unmounted</td><td>onUnmounted</td><td>After removal ✓ cleanup</td></tr>
          <tr><td>activated</td><td>onActivated</td><td>KeepAlive: enter</td></tr>
          <tr><td>deactivated</td><td>onDeactivated</td><td>KeepAlive: leave</td></tr>
          <tr><td>errorCaptured</td><td>onErrorCaptured</td><td>Descendant error</td></tr>
          <tr><td>—</td><td>onServerPrefetch</td><td>SSR: await before serialize</td></tr>
        </tbody>
      </table>
    </section>

    <section>
      <h3>Live hooks — interact to trigger update hooks</h3>
      <p>Ticker (interval set in onMounted, cleared in onUnmounted): {{ ticker }}s</p>
      <div class="controls">
        <button @click="count++">count++ (triggers onBeforeUpdate + onUpdated)</button>
        <button @click="showChild = !showChild">
          {{ showChild ? 'Unmount child' : 'Mount child' }} (triggers mount/unmount hooks)
        </button>
      </div>
      <p v-if="showChild" class="child-indicator">Child component mounted</p>
    </section>

    <section>
      <h3>Lifecycle log</h3>
      <div class="log-box">
        <div v-if="log.length === 0" class="empty">Hooks fire automatically — watch here</div>
        <div v-for="(entry, i) in log" :key="i" class="log-entry">{{ entry }}</div>
      </div>
      <button @click="log = []">Clear</button>
    </section>

    <section class="note">
      <h3>Key differences from Options API</h3>
      <ul>
        <li><strong>No beforeCreate / created</strong> — setup() runs at the same point</li>
        <li><strong>Multiple calls allowed</strong> — multiple <code>onMounted()</code> calls run in order</li>
        <li><strong>Composable-friendly</strong> — composables can register their own lifecycle hooks</li>
        <li><strong>Cleanup pattern</strong> — pair onMounted (start) with onUnmounted (cleanup)</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.lifecycle-demo {
  padding: 1rem;
  max-width: 660px;
}

section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

section.note {
  background: #fffbe6;
  border-color: #e6c700;
}

h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

th, td {
  text-align: left;
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

button {
  padding: 0.3rem 0.75rem;
  cursor: pointer;
}

.child-indicator {
  background: #e8f5e9;
  border: 1px solid #81c784;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
}

.log-box {
  background: #1a1a1a;
  color: #7ec8a0;
  font-family: monospace;
  font-size: 0.78rem;
  padding: 0.75rem;
  border-radius: 4px;
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
}

.log-entry {
  margin-bottom: 0.2rem;
}

.empty {
  color: #666;
}

ul {
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
}

li {
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.85em;
}
</style>
