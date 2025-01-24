<script setup lang="ts">
import { ref } from 'vue'
import PropsDestructureChild from './PropsDestructureChild.vue'

const count = ref<number>(0)
const multiplier = ref<number>(2)
</script>

<template>
  <div class="props-destructure-demo">
    <h2>Vue 3.5 Reactive Props Destructure</h2>

    <section>
      <h3>The problem (before Vue 3.5)</h3>
      <pre class="code">// BROKEN — count is a plain number, loses reactivity
const { count } = defineProps&lt;{ count: number }&gt;()

// WORKAROUND — keep props object, don't destructure
const props = defineProps&lt;{ count: number }&gt;()
// access as props.count everywhere — verbose

// WORKAROUND 2 — withDefaults for default values
const props = withDefaults(defineProps&lt;Props&gt;(), {
  label: 'Count',
  multiplier: 1,
})</pre>
    </section>

    <section>
      <h3>The fix (Vue 3.5+ — compiler transform)</h3>
      <pre class="code">// NOW WORKS — compiler preserves reactivity
const { count, label = 'Count', multiplier = 1 } = defineProps&lt;Props&gt;()

// Defaults via destructuring assignment — replaces withDefaults()
// count, label, multiplier are reactive — update when parent changes props</pre>
    </section>

    <section>
      <h3>Live demo — change parent state, child props update reactively</h3>
      <div class="controls">
        <label>count: {{ count }}</label>
        <button @click="count--">−</button>
        <button @click="count++">+</button>

        <label>multiplier: {{ multiplier }}</label>
        <button @click="multiplier = Math.max(1, multiplier - 1)">−</button>
        <button @click="multiplier++">+</button>
      </div>

      <PropsDestructureChild
        :count="count"
        label="Score"
        :multiplier="multiplier"
      />
    </section>

    <section class="note">
      <h3>Details</h3>
      <ul>
        <li>The Babel/Vue compiler transform rewrites destructured props to <code>props.count</code> internally</li>
        <li>Default values via destructuring assignment: <code>const { x = 0 } = defineProps()</code></li>
        <li>Replaces the verbose <code>withDefaults(defineProps(), {})</code> pattern</li>
        <li><code>@vue/language-tools 2.1</code> shows inlay hints to distinguish prop vars from regular variables</li>
        <li>Stable since Vue 3.5 (was experimental in 3.3 as "reactive props destructure")</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.props-destructure-demo {
  padding: 1rem;
  max-width: 620px;
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

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

button {
  padding: 0.2rem 0.6rem;
  cursor: pointer;
}

pre.code {
  background: #1a1a1a;
  color: #7ec8a0;
  font-size: 0.78rem;
  padding: 0.75rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 0;
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
