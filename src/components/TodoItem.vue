<script setup lang="ts">
// Full <script setup lang="ts"> example
// Demonstrates: defineProps, defineEmits, defineModel, defineExpose, defineOptions

import { computed, ref } from 'vue'

// ─── defineOptions — component options without Options API ────────────────
// Set component name and options that don't fit compiler macros
defineOptions({
  name: 'TodoItem',
  inheritAttrs: false,  // we'll manually forward attrs to the right element
})

// ─── defineProps — TypeScript generics (no runtime declaration) ───────────
interface Props {
  id: number
  text: string
  done: boolean
  priority?: 'low' | 'normal' | 'high'
}

// Vue 3.5: reactive props destructure — defaults via assignment
const { id, text, done, priority = 'normal' } = defineProps<Props>()

// ─── defineEmits — typed tuple syntax ────────────────────────────────────
// Each event: eventName: [arg1Type, arg2Type, ...]
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, newText: string]
}>()

// ─── defineModel — two-way binding (Vue 3.4+) ────────────────────────────
// Replaces: modelValue prop + update:modelValue emit
// Parent uses: v-model:notes="itemNotes"
const notes = defineModel<string>('notes', { default: '' })

// ─── Local state ──────────────────────────────────────────────────────────
const isEditing = ref<boolean>(false)
const editText = ref<string>(text)

const priorityColor = computed<string>(() => {
  if (priority === 'high') return '#e74c3c'
  if (priority === 'low') return '#95a5a6'
  return '#2c3e50'
})

// ─── Methods ──────────────────────────────────────────────────────────────
function startEdit() {
  editText.value = text
  isEditing.value = true
}

function commitEdit() {
  if (editText.value.trim()) {
    emit('edit', id, editText.value.trim())
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

// ─── defineExpose — explicitly expose to parent template refs ─────────────
// Only exposed items are accessible via ref="todoRef" in parent
// Everything else stays private (unlike Options API where methods were public)
defineExpose({
  startEdit,
  focus: () => {
    // parent can call todoRef.value?.focus() to programmatically trigger edit
    startEdit()
  },
})
</script>

<template>
  <li
    class="todo-item"
    :class="{ done, editing: isEditing }"
    v-bind="$attrs"
  >
    <span class="priority-dot" :style="{ background: priorityColor }" />

    <template v-if="isEditing">
      <input
        v-model="editText"
        class="edit-input"
        @keyup.enter="commitEdit"
        @keyup.escape="cancelEdit"
        @blur="commitEdit"
        autofocus
      />
    </template>
    <template v-else>
      <span class="text" @dblclick="startEdit">{{ text }}</span>
    </template>

    <div class="actions">
      <button @click="emit('toggle', id)" :title="done ? 'Mark active' : 'Mark done'">
        {{ done ? '↩' : '✓' }}
      </button>
      <button @click="startEdit" title="Edit">✎</button>
      <button @click="emit('delete', id)" title="Delete" class="delete">✕</button>
    </div>

    <div class="notes-row">
      <!-- notes uses defineModel — two-way bound to parent v-model:notes -->
      <input
        v-model="notes"
        placeholder="Add notes..."
        class="notes-input"
      />
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.todo-item.done .text {
  text-decoration: line-through;
  color: #aaa;
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.text {
  flex: 1;
  cursor: pointer;
  font-size: 0.95rem;
}

.edit-input {
  flex: 1;
  padding: 0.2rem 0.4rem;
  border: 1px solid #42b883;
  border-radius: 4px;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 0.25rem;
}

.actions button {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  cursor: pointer;
  font-size: 0.8rem;
}

.actions button.delete:hover {
  background: #fee;
  border-color: #e74c3c;
}

.notes-row {
  width: 100%;
  padding-left: 1rem;
}

.notes-input {
  width: 100%;
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #777;
}
</style>
