<script setup lang="ts">
import { ref } from 'vue'

const items = ref<string[]>(['Vue 3', 'Composition API', 'KeepAlive'])
const newItem = ref('')

function addItem() {
  const trimmed = newItem.value.trim()
  if (trimmed) {
    items.value = [...items.value, trimmed]
    newItem.value = ''
  }
}

function removeItem(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div class="list-tab">
    <h4>List Tab</h4>
    <p class="tab-note">
      Add items and switch tabs. With KeepAlive, your list survives navigation.
    </p>

    <div class="add-row">
      <input
        v-model="newItem"
        type="text"
        placeholder="Add an item..."
        @keydown.enter="addItem"
      />
      <button class="btn btn-primary" @click="addItem">Add</button>
    </div>

    <ul v-if="items.length" class="item-list">
      <li v-for="(item, i) in items" :key="i" class="item">
        <span>{{ item }}</span>
        <button class="remove-btn" @click="removeItem(i)" title="Remove">x</button>
      </li>
    </ul>

    <p v-else class="empty">No items yet. Add one above.</p>
  </div>
</template>

<style scoped>
.list-tab {
  padding: 1rem;
}

h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #1e1b4b;
}

.tab-note {
  font-size: 0.82rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.add-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  max-width: 380px;
}

input {
  flex: 1;
  padding: 0.45rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: #4f46e5;
}

.btn {
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn:hover { opacity: 0.85; }
.btn-primary { background: #4f46e5; color: #fff; }

.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 380px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.875rem;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 0.8rem;
  padding: 0 0.25rem;
  line-height: 1;
  transition: color 0.15s;
}

.remove-btn:hover {
  color: #dc2626;
}

.empty {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.875rem;
}
</style>
