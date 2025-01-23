<script setup lang="ts">
import { ref, reactive, watch, watchEffect, watchPostEffect, onWatcherCleanup } from 'vue'

// ─── Data ────────────────────────────────────────────────────────────────────
const count = ref<number>(0)
const name = ref<string>('Vue')
const state = reactive({ x: 0, y: 0 })
const searchQuery = ref<string>('')
const log = ref<string[]>([])

function addLog(msg: string) {
  log.value = [...log.value, `[${new Date().toLocaleTimeString()}] ${msg}`]
}

// ─── watch() ─────────────────────────────────────────────────────────────────

// 1. Single ref source
watch(count, (newVal, oldVal) => {
  addLog(`count: ${oldVal} → ${newVal}`)
})

// 2. Getter function — watch a specific property of a reactive object
watch(
  () => state.x,
  (newX) => {
    addLog(`state.x changed → ${newX}`)
  },
)

// 3. Multiple sources — destructure new/old values from arrays
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  addLog(`multi-watch: count=${newCount} name="${newName}"`)
})

// 4. immediate: true — runs on mount with the current value (no oldVal on first run)
watch(
  name,
  (newName) => {
    addLog(`name (immediate): "${newName}"`)
  },
  { immediate: true },
)

// 5. deep: true — watch nested object changes
// Without deep, watching a reactive() object only reacts to top-level replacement
// deep: true is the default when the source is a reactive() object directly
const deepObj = ref({ a: { b: 42 } })
watch(
  deepObj,
  (newVal) => {
    addLog(`deepObj.a.b changed → ${newVal.a.b}`)
  },
  { deep: true },
)

// 6. once: true (Vue 3.4+) — auto-stops after first trigger
watch(
  count,
  (val) => {
    addLog(`once watcher fired — count is now ${val} (will not fire again)`)
  },
  { once: true },
)

// 7. Manual stop — save the return value and call it to stop watching
const stopWatcher = watch(searchQuery, (query) => {
  addLog(`search: "${query}"`)
})

function stopSearchWatcher() {
  stopWatcher()
  addLog('search watcher stopped manually')
}

// ─── onWatcherCleanup (Vue 3.5) ──────────────────────────────────────────────
// Cleanup runs before the next callback execution or when the watcher stops.
// Use for: clearing timeouts, aborting fetch, removing event listeners.
watch(searchQuery, (query) => {
  const timer = setTimeout(() => {
    addLog(`debounced search executed for: "${query}"`)
  }, 500)

  // onWatcherCleanup — replaces the old cleanup pattern:
  //   watch(src, (newVal, oldVal, onCleanup) => { onCleanup(() => clearTimeout(timer)) })
  onWatcherCleanup(() => {
    clearTimeout(timer)
    // timer cleared if query changes before 500ms
  })
})

// ─── watchEffect() ───────────────────────────────────────────────────────────
// Runs immediately, auto-tracks any reactive dep accessed inside
// No explicit source declaration needed — Vue figures it out

watchEffect(() => {
  // Both count.value and name.value are accessed → both become tracked deps
  addLog(`watchEffect: count=${count.value}, name="${name.value}"`)
})

// watchPostEffect() — same but runs after DOM updates (flush: 'post')
// Useful when you need the updated DOM state in your effect
watchPostEffect(() => {
  // runs after DOM is updated — safe to read DOM refs here
})

// ─── Rule of thumb ───────────────────────────────────────────────────────────
// computed  → when you need a DERIVED VALUE (new data from existing data)
// watch     → when you need a SIDE EFFECT on specific source change
// watchEffect → when your effect naturally references multiple deps and you
//              want it to run immediately (less explicit, more ergonomic)
</script>

<template>
  <div class="watch-demo">
    <h2>watch() and watchEffect() — Reactive Side Effects</h2>

    <section class="controls">
      <h3>Controls (changes trigger watchers above)</h3>
      <div>
        <label>count: {{ count }}</label>
        <button @click="count++">count++</button>
      </div>
      <div>
        <label>name:</label>
        <input v-model="name" placeholder="name" />
      </div>
      <div>
        <label>state.x: {{ state.x }}</label>
        <button @click="state.x++">state.x++</button>
      </div>
      <div>
        <label>deepObj.a.b: {{ deepObj.a.b }}</label>
        <button @click="deepObj.a.b++">deepObj.a.b++</button>
      </div>
      <div>
        <label>search (debounced via onWatcherCleanup):</label>
        <input v-model="searchQuery" placeholder="type to search..." />
      </div>
      <button @click="stopSearchWatcher">Stop search watcher</button>
    </section>

    <section>
      <h3>Watcher log</h3>
      <div class="log-box">
        <div v-if="log.length === 0" class="empty">No events yet — interact above</div>
        <div v-for="(entry, i) in log" :key="i" class="log-entry">{{ entry }}</div>
      </div>
      <button @click="log = []">Clear log</button>
    </section>

    <section class="note">
      <h3>watch() options recap</h3>
      <ul>
        <li><code>immediate: true</code> — run callback immediately on mount</li>
        <li><code>deep: true</code> — watch nested object properties</li>
        <li><code>once: true</code> — auto-stop after first trigger (Vue 3.4+)</li>
        <li><code>flush: 'post'</code> — run after DOM updates (default: 'pre')</li>
        <li><code>onWatcherCleanup(fn)</code> — cleanup before re-run (Vue 3.5)</li>
      </ul>
    </section>

    <section class="note">
      <h3>No dependency arrays (unlike React useEffect)</h3>
      <p>
        Vue tracks reactive dependencies automatically using Proxy.
        You don't list deps — Vue sees which refs/reactive values you access inside the callback.
      </p>
    </section>
  </div>
</template>

<style scoped>
.watch-demo {
  padding: 1rem;
  max-width: 600px;
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

section.controls > div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

button {
  margin: 0.25rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.log-box {
  background: #1a1a1a;
  color: #7ec8a0;
  font-family: monospace;
  font-size: 0.8rem;
  border-radius: 4px;
  padding: 0.75rem;
  max-height: 200px;
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
  margin-bottom: 0.25rem;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>
