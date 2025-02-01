<script setup lang="ts">
// <script setup> — the modern SFC format
// All top-level declarations are automatically available in the template.
// No return {}, no components: {}, no setup() function.

import { ref, useTemplateRef } from 'vue'
import TodoItem from './TodoItem.vue'
// Importing a component in <script setup> auto-registers it — no components: {} needed

interface Todo {
  id: number
  text: string
  done: boolean
  priority: 'low' | 'normal' | 'high'
  notes: string
}

const todos = ref<Todo[]>([
  { id: 1, text: 'Learn defineProps with TypeScript', done: true, priority: 'high', notes: '' },
  { id: 2, text: 'Learn defineEmits typed tuples', done: false, priority: 'high', notes: '' },
  { id: 3, text: 'Learn defineModel two-way binding', done: false, priority: 'normal', notes: '' },
  { id: 4, text: 'Learn defineExpose', done: false, priority: 'low', notes: '' },
])

const newText = ref<string>('')

function addTodo() {
  if (!newText.value.trim()) return
  todos.value = [
    ...todos.value,
    { id: Date.now(), text: newText.value.trim(), done: false, priority: 'normal', notes: '' },
  ]
  newText.value = ''
}

function toggleTodo(id: number) {
  todos.value = todos.value.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t,
  )
}

function deleteTodo(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id)
}

function editTodo(id: number, newTodoText: string) {
  todos.value = todos.value.map((t) =>
    t.id === id ? { ...t, text: newTodoText } : t,
  )
}

// useTemplateRef — access first TodoItem's exposed methods (preview of Commit 9)
const firstItemRef = useTemplateRef<InstanceType<typeof TodoItem>>('firstItem')

function focusFirstItem() {
  firstItemRef.value?.focus()
}
</script>

<template>
  <div class="script-setup-demo">
    <h2>&lt;script setup&gt; — The Modern SFC Format</h2>

    <section class="info">
      <h3>Compiler macros (no import needed)</h3>
      <ul>
        <li><code>defineProps&lt;T&gt;()</code> — typed props declaration</li>
        <li><code>defineEmits&lt;T&gt;()</code> — typed emit declaration</li>
        <li><code>defineModel&lt;T&gt;(name?)</code> — two-way binding (Vue 3.4)</li>
        <li><code>defineExpose(obj)</code> — expose to parent refs</li>
        <li><code>defineOptions(obj)</code> — component options (name, inheritAttrs)</li>
        <li><code>withDefaults(defineProps(), {})</code> — defaults (replaced by destructuring in 3.5)</li>
      </ul>
    </section>

    <section>
      <h3>TodoItem — uses all compiler macros</h3>
      <p>
        <em>Double-click text to edit. Notes field uses <code>defineModel</code> two-way binding.</em>
      </p>

      <div class="add-row">
        <input
          v-model="newText"
          placeholder="Add todo..."
          @keyup.enter="addTodo"
        />
        <button @click="addTodo">Add</button>
        <button @click="focusFirstItem">Focus first item (via defineExpose)</button>
      </div>

      <ul class="todo-list">
        <TodoItem
          v-for="(todo, i) in todos"
          :key="todo.id"
          :ref="i === 0 ? 'firstItem' : undefined"
          :id="todo.id"
          :text="todo.text"
          :done="todo.done"
          :priority="todo.priority"
          v-model:notes="todo.notes"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @edit="editTodo"
        />
      </ul>
    </section>

    <section class="info">
      <h3>&lt;script setup&gt; vs Options API</h3>
      <ul>
        <li>No <code>return {}</code> needed — all top-level vars exposed to template</li>
        <li>No <code>components: {}</code> — imported components auto-registered</li>
        <li>Smaller compiled output — tree-shakeable</li>
        <li>Better TypeScript inference — props/emits typed at compile time</li>
        <li>Private by default — use <code>defineExpose</code> to expose to parents</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.script-setup-demo {
  padding: 1rem;
  max-width: 640px;
}

section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

section.info {
  background: #f9f9f9;
}

h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

ul {
  padding-left: 1.25rem;
  margin: 0;
}

li {
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}

.add-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

input {
  flex: 1;
  min-width: 150px;
  padding: 0.3rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.3rem 0.75rem;
  cursor: pointer;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.85em;
}
</style>
