<script setup lang="ts">
// TypedEmitsComponent — typed tuple syntax for defineEmits
// The tuple syntax: [argType1, argType2, ...] defines the payload shape per event

import { ref } from 'vue'

// Typed emits using the TypeScript generic (preferred in Vue 3.3+)
// Each key is an event name, value is a tuple of the argument types
const emit = defineEmits<{
  // Simple event with no payload
  reset: []
  // Event with a single string payload
  search: [query: string]
  // Event with multiple named params
  'item-selected': [id: number, label: string]
  // Event with an object payload
  submit: [payload: { name: string; email: string; agree: boolean }]
}>()

const query = ref('')
const selectedId = ref<number | null>(null)

const formData = ref({
  name: '',
  email: '',
  agree: false,
})

function handleSearch() {
  if (query.value.trim()) {
    emit('search', query.value.trim())
  }
}

function handleSelect(id: number, label: string) {
  selectedId.value = id
  emit('item-selected', id, label)
}

function handleSubmit() {
  emit('submit', { ...formData.value })
}

function handleReset() {
  query.value = ''
  selectedId.value = null
  formData.value = { name: '', email: '', agree: false }
  emit('reset')
}

const items = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
]
</script>

<template>
  <div class="typed-emits">
    <h4>Typed Emits Component</h4>

    <!-- reset: [] — no payload -->
    <div class="demo-row">
      <button class="btn-secondary" @click="handleReset">emit('reset') — no payload</button>
    </div>

    <!-- search: [query: string] -->
    <div class="demo-row">
      <input v-model="query" placeholder="Search..." class="input" @keyup.enter="handleSearch" />
      <button class="btn-primary" @click="handleSearch">emit('search', query)</button>
    </div>

    <!-- item-selected: [id: number, label: string] -->
    <div class="demo-row">
      <button
        v-for="item in items"
        :key="item.id"
        :class="['btn-outline', selectedId === item.id ? 'btn-active' : '']"
        @click="handleSelect(item.id, item.label)"
      >
        {{ item.label }}
      </button>
      <small v-if="selectedId !== null" class="hint">
        emit('item-selected', {{ selectedId }}, '...')
      </small>
    </div>

    <!-- submit: [payload: {...}] -->
    <form class="mini-form" @submit.prevent="handleSubmit">
      <input v-model="formData.name" placeholder="Name" class="input" />
      <input v-model="formData.email" placeholder="Email" class="input" />
      <label class="checkbox-label">
        <input v-model="formData.agree" type="checkbox" />
        Agree
      </label>
      <button type="submit" class="btn-primary">emit('submit', payload)</button>
    </form>
  </div>
</template>

<style scoped>
.typed-emits {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.demo-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.mini-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.input {
  padding: 0.35rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.btn-primary {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-secondary {
  background: #6b7280;
  color: #fff;
  border: none;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-outline {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-active {
  background: #ede9fe;
  border-color: #7c3aed;
  color: #5b21b6;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
}

.hint {
  color: #6b7280;
  font-size: 0.75rem;
}
</style>
