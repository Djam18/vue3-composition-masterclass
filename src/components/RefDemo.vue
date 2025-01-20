<script setup lang="ts">
import { ref, shallowRef, isRef, unref, toRef, toRefs, reactive } from 'vue'

// --- ref(0) wraps any value in a reactive reference ---
// .value required in <script>, auto-unwrapped in <template>
const count = ref<number>(0)
const message = ref<string>('Hello Vue 3.5')
const isVisible = ref<boolean>(true)

// ref with object — deep reactive (every nested property is tracked)
const user = ref<{ name: string; age: number }>({ name: 'Ada', age: 30 })

function increment() {
  count.value++
}

function updateUser() {
  user.value.name = 'Grace'
  user.value.age = 28
}

// --- shallowRef() — only the .value itself is reactive, not deep properties ---
// Use for large objects where you replace wholesale, not mutate properties
const shallowUser = shallowRef({ name: 'Alan', score: 100 })

function replaceShallowUser() {
  // This triggers reactivity — replacing .value entirely
  shallowUser.value = { name: 'Tim', score: 200 }
}

// --- isRef() type guard ---
// Useful in composables that accept both refs and plain values
function logIfRef(val: unknown) {
  if (isRef(val)) {
    console.log('It is a ref, value:', val.value)
  } else {
    console.log('Not a ref, value:', val)
  }
}

// --- unref() — safely unwrap: works whether arg is a ref or plain value ---
// unref(count) === count.value
// unref(42) === 42
const rawOrRef = ref(99)
const unwrapped = unref(rawOrRef)  // 99 (number)
const alsoUnwrapped = unref(42)    // 42 (unchanged)

// --- toRef(object, 'key') — create a ref linked to an object property ---
const state = reactive({ x: 1, y: 2 })
const xRef = toRef(state, 'x')
// xRef.value === state.x — they stay in sync

// --- toRefs(reactiveObj) — destructure reactive object preserving reactivity ---
// Without toRefs: const { x, y } = state  →  x and y are plain numbers, NOT reactive
// With toRefs:    const { x, y } = toRefs(state)  →  x and y are refs, reactive
const { x, y } = toRefs(state)
</script>

<template>
  <div class="ref-demo">
    <h2>ref() — Reactive Primitives</h2>

    <!-- In template: auto-unwrapped, no .value needed -->
    <section>
      <h3>Basic refs</h3>
      <p>count: {{ count }}</p>
      <p>message: {{ message }}</p>
      <p>isVisible: {{ isVisible }}</p>
      <button @click="increment">increment</button>
      <button @click="isVisible = !isVisible">toggle</button>
    </section>

    <section>
      <h3>ref with object (deep reactive)</h3>
      <p>user.name: {{ user.name }} | user.age: {{ user.age }}</p>
      <button @click="updateUser">update user</button>
    </section>

    <section>
      <h3>shallowRef (only .value is reactive)</h3>
      <p>shallowUser: {{ shallowUser.name }} — {{ shallowUser.score }}</p>
      <button @click="replaceShallowUser">replace (triggers update)</button>
    </section>

    <section>
      <h3>toRefs — destructure reactive object preserving reactivity</h3>
      <p>x: {{ x }} | y: {{ y }}</p>
      <button @click="state.x++; state.y++">increment state.x and state.y</button>
      <!-- x and y refs update because toRefs links them to state -->
    </section>

    <section>
      <h3>Console demos (open DevTools)</h3>
      <button @click="logIfRef(count)">logIfRef(count)</button>
      <button @click="logIfRef(42)">logIfRef(42)</button>
    </section>
  </div>
</template>

<style scoped>
.ref-demo {
  padding: 1rem;
  max-width: 600px;
}

section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
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
</style>
