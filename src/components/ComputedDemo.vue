<script setup lang="ts">
import { ref, computed } from 'vue'

// --- computed() — reactive derived state ---
// Lazy: only evaluates when accessed
// Cached: only recomputes when reactive dependencies change
// Unlike methods: methods re-run on every render regardless

interface Todo {
  id: number
  text: string
  done: boolean
}

const todos = ref<Todo[]>([
  { id: 1, text: 'Learn ref()', done: true },
  { id: 2, text: 'Learn reactive()', done: true },
  { id: 3, text: 'Learn computed()', done: false },
  { id: 4, text: 'Learn watchers', done: false },
])

const filter = ref<'all' | 'active' | 'done'>('all')

// Read-only computed — getter only
// Only recomputes when todos or filter changes
const filteredTodos = computed<Todo[]>(() => {
  if (filter.value === 'active') return todos.value.filter((t) => !t.done)
  if (filter.value === 'done') return todos.value.filter((t) => t.done)
  return todos.value
})

// Computed from computed — dependency chain works correctly
const doneCount = computed<number>(() => todos.value.filter((t) => t.done).length)
const activeCount = computed<number>(() => todos.value.length - doneCount.value)
const progress = computed<string>(() => `${doneCount.value} / ${todos.value.length} done`)

// --- Writable computed — { get, set } ---
// Use when you need to both read derived state and write back through it
const firstName = ref<string>('Ada')
const lastName = ref<string>('Lovelace')

const fullName = computed<string>({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string) {
    const parts = newValue.trim().split(' ')
    firstName.value = parts[0] ?? ''
    lastName.value = parts.slice(1).join(' ')
  },
})

// --- Performance note ---
// computed vs method:
//   computed:  cached — result stored, reused until deps change
//   method:    always executes — runs fresh on every render
// For expensive derivations, always use computed

function toggleTodo(id: number) {
  const todo = todos.value.find((t) => t.id === id)
  if (todo) {
    todo.done = !todo.done
  }
}

function addTodo(text: string) {
  todos.value = [
    ...todos.value,
    { id: Date.now(), text, done: false },
  ]
}

const newTodoText = ref<string>('')

function handleAdd() {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value.trim())
    newTodoText.value = ''
  }
}
</script>

<template>
  <div class="computed-demo">
    <h2>computed() — Reactive Derived State</h2>

    <section>
      <h3>Filtered todos — computed from todos + filter</h3>
      <p>{{ progress }} | active: {{ activeCount }}</p>
      <div class="filters">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'active' }" @click="filter = 'active'">Active</button>
        <button :class="{ active: filter === 'done' }" @click="filter = 'done'">Done</button>
      </div>
      <ul>
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ done: todo.done }"
          @click="toggleTodo(todo.id)"
        >
          {{ todo.text }}
        </li>
      </ul>
      <div class="add-row">
        <input v-model="newTodoText" placeholder="New todo..." @keyup.enter="handleAdd" />
        <button @click="handleAdd">Add</button>
      </div>
    </section>

    <section>
      <h3>Writable computed — fullName splits into firstName + lastName</h3>
      <p>firstName: {{ firstName }} | lastName: {{ lastName }}</p>
      <p>fullName (computed): {{ fullName }}</p>
      <input
        :value="fullName"
        @input="fullName = ($event.target as HTMLInputElement).value"
        placeholder="Type full name..."
      />
      <p><em>Editing full name updates firstName and lastName via the setter</em></p>
    </section>

    <section class="note">
      <h3>computed vs method</h3>
      <ul>
        <li><strong>computed</strong>: cached — result reused until reactive deps change</li>
        <li><strong>method</strong>: always runs — re-executes on every render</li>
        <li>For expensive derivations (sort, filter, format) — always use computed</li>
        <li>Use methods when you explicitly want fresh execution every time</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.computed-demo {
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

h3 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #555;
}

.filters {
  margin-bottom: 0.5rem;
}

button {
  margin: 0.25rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

button.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

li {
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

li:hover {
  background: #f5f5f5;
}

li.done {
  text-decoration: line-through;
  color: #aaa;
}

.add-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

input {
  flex: 1;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
