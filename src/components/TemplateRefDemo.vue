<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import AutoFocusInput from './AutoFocusInput.vue'

// ─── Before Vue 3.5 ───────────────────────────────────────────────────────
// const inputEl = ref<HTMLInputElement | null>(null)
// Problem: no way to tell from the name alone if it's a data ref or a DOM ref
// The type is the same: Ref<HTMLInputElement | null>

// ─── Vue 3.5: useTemplateRef() ───────────────────────────────────────────
// Self-documenting: clearly a template ref, not reactive data
// Template ref name ('manualInput') must match ref="manualInput" in template

const manualInput = useTemplateRef<HTMLInputElement>('manualInput')
const textareaEl = useTemplateRef<HTMLTextAreaElement>('notesArea')

// Always null before onMounted — the DOM doesn't exist during setup
onMounted(() => {
  // Safe to access after mount
  console.log('manualInput element:', manualInput.value)
})

function focusInput() {
  manualInput.value?.focus()
}

function selectAll() {
  manualInput.value?.select()
}

function getInputValue(): string {
  return manualInput.value?.value ?? ''
}

const capturedValue = ref<string>('')

function captureValue() {
  capturedValue.value = getInputValue()
}

// ─── Component ref — access exposed methods ───────────────────────────────
// InstanceType<typeof AutoFocusInput> gives us the exposed interface of the component
// Only what's in defineExpose() is accessible — nothing else
const autoFocusRef = useTemplateRef<InstanceType<typeof AutoFocusInput>>('autoFocusComp')
// autoFocusRef.value?.el (the input element, if AutoFocusInput exposes it)
// In practice, you'd call exposed methods like autoFocusRef.value?.someMethod()
</script>

<template>
  <div class="template-ref-demo">
    <h2>Template Refs — useTemplateRef() (Vue 3.5)</h2>

    <section>
      <h3>Old pattern vs new — useTemplateRef()</h3>
      <pre class="code">// BEFORE 3.5 — ambiguous: data ref or DOM ref?
const inputEl = ref&lt;HTMLInputElement | null&gt;(null)
// ref="inputEl" in template

// VUE 3.5 — self-documenting, composable-friendly
const inputEl = useTemplateRef&lt;HTMLInputElement&gt;('inputEl')
// ref="inputEl" in template — name must match</pre>
    </section>

    <section>
      <h3>useTemplateRef() on a DOM element</h3>
      <input ref="manualInput" type="text" placeholder="Type something..." class="demo-input" />
      <div class="actions">
        <button @click="focusInput">focus()</button>
        <button @click="selectAll">select()</button>
        <button @click="captureValue">capture value</button>
      </div>
      <p v-if="capturedValue">Captured: <strong>{{ capturedValue }}</strong></p>
      <p><em>null before onMounted — always access after mount</em></p>
    </section>

    <section>
      <h3>AutoFocusInput — useTemplateRef() inside a composable</h3>
      <p>
        <code>useAutoFocus()</code> composable calls <code>useTemplateRef('searchInput')</code> internally.
        The composable binds to this component's template ref — possible because of Vue 3.5.
      </p>
      <AutoFocusInput ref="autoFocusComp" placeholder="I auto-focus on mount" />
    </section>

    <section>
      <h3>Component ref — InstanceType pattern</h3>
      <pre class="code">// Access a child component's exposed API
const childRef = useTemplateRef&lt;InstanceType&lt;typeof MyComp&gt;&gt;('child')

// In template: &lt;MyComp ref="child" /&gt;

// Access exposed methods (only what defineExpose() declared):
childRef.value?.focus()
childRef.value?.reset()</pre>
    </section>

    <section>
      <h3>useTemplateRef in a textarea</h3>
      <textarea ref="notesArea" placeholder="Notes..." class="demo-textarea" />
      <button @click="textareaEl?.focus()">Focus textarea</button>
    </section>

    <section class="note">
      <h3>Rules</h3>
      <ul>
        <li>Always <code>null</code> before <code>onMounted</code> — DOM doesn't exist during setup</li>
        <li>The string in <code>useTemplateRef('name')</code> must match <code>ref="name"</code> in template</li>
        <li>Works in composables — the composable binds to the host component's ref registry</li>
        <li>For component refs: use <code>InstanceType&lt;typeof MyComp&gt;</code> to get exposed type</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.template-ref-demo {
  padding: 1rem;
  max-width: 640px;
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

.demo-input,
.demo-textarea {
  padding: 0.35rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  width: 100%;
  margin-bottom: 0.5rem;
}

.demo-textarea {
  height: 80px;
  resize: vertical;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

button {
  padding: 0.3rem 0.75rem;
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
