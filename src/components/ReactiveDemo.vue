<script setup lang="ts">
import { reactive, readonly, shallowReactive, toRefs, ref } from 'vue'

// --- reactive() — Proxy-based deep reactive object ---
// No .value — access properties directly
const state = reactive({
  count: 0,
  name: 'Vue 3.5',
  nested: { score: 100 },
})

function incrementCount() {
  state.count++
}

function updateNested() {
  state.nested.score += 10  // deep reactivity — this triggers update
}

// --- readonly() — make a reactive object read-only ---
// Useful for providing state to children that must not mutate it
const readonlyState = readonly(state)
// readonlyState.count++  // ← runtime warning: "Set operation on key count failed: target is readonly."

// --- shallowReactive() — only root-level properties are reactive ---
// Nested properties are NOT tracked — use for performance with large flat objects
const shallowState = shallowReactive({
  count: 0,
  nested: { value: 42 },
})

function incrementShallow() {
  shallowState.count++  // reactive — triggers update
}

function updateShallowNested() {
  shallowState.nested.value++  // NOT reactive — won't trigger update
}

// --- Destructuring breaks reactivity ---
// const { count } = state  →  count is a plain number, NOT reactive
// This is the biggest reactive() gotcha

// WRONG — count is a plain number, reactivity lost:
const { count: brokenCount } = state   // plain number 0
// brokenCount will never update even as state.count changes

// CORRECT — use toRefs() to destructure while preserving reactivity:
const { count: reactiveCount, name } = toRefs(state)
// reactiveCount.value === state.count — stays in sync

// --- ref vs reactive recommendation ---
// Prefer ref for primitive values and for consistency.
// With ref, .value is always explicit — no gotchas.
// reactive is convenient for objects but destructuring breaks reactivity.
//
// Vue 3.5 reactive props destructure solves this for props specifically (Commit 6).
const preferRef = ref({ x: 1, y: 2 })
// Replacing the whole object: preferRef.value = { x: 10, y: 20 } — works
// Mutating: preferRef.value.x = 10 — also works (deep reactive)
</script>

<template>
  <div class="reactive-demo">
    <h2>reactive() — Reactive Objects</h2>

    <section>
      <h3>reactive() — deep reactive Proxy</h3>
      <p>state.count: {{ state.count }}</p>
      <p>state.name: {{ state.name }}</p>
      <p>state.nested.score: {{ state.nested.score }}</p>
      <button @click="incrementCount">count++</button>
      <button @click="updateNested">nested.score += 10</button>
    </section>

    <section>
      <h3>readonly() — prevents mutation</h3>
      <p>readonlyState.count: {{ readonlyState.count }}</p>
      <!-- NOTE: readonlyState.count reflects state.count because readonly() is a live view.
           If this value changes, it's because state.count changed (other buttons above),
           NOT because the readonly mutation succeeded. The mutation is always blocked. -->
      <p><em>Attempting to write triggers a runtime warning (check DevTools) — the value does NOT change</em></p>
      <button @click="(readonlyState as any).count++">try to mutate (console warning)</button>
    </section>

    <section>
      <h3>shallowReactive() — only root properties are tracked</h3>
      <p>shallowState.count: {{ shallowState.count }}</p>
      <p>shallowState.nested.value: {{ shallowState.nested.value }}</p>
      <button @click="incrementShallow">count++ (reactive ✓)</button>
      <button @click="updateShallowNested">nested.value++ (NOT reactive ✗)</button>
    </section>

    <section>
      <h3>Destructuring gotcha — toRefs() fixes it</h3>
      <p>brokenCount (plain number, never updates): {{ brokenCount }}</p>
      <p>reactiveCount via toRefs (updates with state): {{ reactiveCount }}</p>
      <button @click="state.count++">state.count++ (watch both values above)</button>
    </section>

    <section class="advice">
      <h3>ref vs reactive — rule of thumb</h3>
      <ul>
        <li><strong>Prefer ref</strong> — works for primitives and objects, always explicit with <code>.value</code></li>
        <li><strong>reactive</strong> — convenient for grouped object state, but beware destructuring</li>
        <li>Vue 3.5 reactive props destructure (Commit 6) solves the props case specifically</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.reactive-demo {
  padding: 1rem;
  max-width: 600px;
}

section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

section.advice {
  background: #f0f8ff;
  border-color: #99c;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #555;
}

button {
  margin: 0.25rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>
