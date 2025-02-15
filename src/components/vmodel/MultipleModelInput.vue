<script setup lang="ts">
// MultipleModelInput — multiple v-model bindings on a single component
// Vue 3 allows multiple named v-model bindings via defineModel('name')
//
// Parent usage:
//   <MultipleModelInput v-model:title="title" v-model:content="content" />
//
// Each named model maps to:
//   prop:  the name (e.g. 'title')
//   event: 'update:name' (e.g. 'update:title')

const title = defineModel<string>('title', { default: '' })
const content = defineModel<string>('content', { default: '' })
const pinned = defineModel<boolean>('pinned', { default: false })

// word count is derived — not reactive to parent, just a display helper
function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}
</script>

<template>
  <div class="multiple-model">
    <h4>Multiple v-model Bindings</h4>

    <div class="field">
      <label>v-model:title</label>
      <input v-model="title" class="input" placeholder="Enter title..." />
      <span class="badge">{{ title.length }} chars</span>
    </div>

    <div class="field">
      <label>v-model:content</label>
      <textarea v-model="content" class="textarea" placeholder="Enter content..." rows="3" />
      <span class="badge">{{ wordCount(content) }} words</span>
    </div>

    <div class="field field-row">
      <label>v-model:pinned</label>
      <label class="toggle">
        <input v-model="pinned" type="checkbox" class="toggle-input" />
        <span class="toggle-track"></span>
        <span class="toggle-label">{{ pinned ? 'Pinned' : 'Not pinned' }}</span>
      </label>
    </div>

    <div class="preview">
      <strong>Preview:</strong>
      <p class="preview-title">{{ title || '(no title)' }}</p>
      <p class="preview-content">{{ content || '(no content)' }}</p>
      <p v-if="pinned" class="pinned-tag">Pinned</p>
    </div>
  </div>
</template>

<style scoped>
.multiple-model {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.field {
  margin-bottom: 0.75rem;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.input {
  width: 100%;
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
}

.badge {
  font-size: 0.72rem;
  color: #9ca3af;
  display: block;
  margin-top: 0.15rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-track {
  width: 2rem;
  height: 1.1rem;
  background: #d1d5db;
  border-radius: 999px;
  position: relative;
  transition: background 0.2s;
}

.toggle-track::after {
  content: '';
  position: absolute;
  width: 0.85rem;
  height: 0.85rem;
  background: white;
  border-radius: 50%;
  top: 0.125rem;
  left: 0.125rem;
  transition: transform 0.2s;
}

.toggle-input:checked ~ .toggle-track {
  background: #4f46e5;
}

.toggle-input:checked ~ .toggle-track::after {
  transform: translateX(0.9rem);
}

.toggle-label {
  font-size: 0.875rem;
  color: #374151;
}

.preview {
  margin-top: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
}

.preview-title {
  font-weight: 700;
  margin: 0.25rem 0;
}

.preview-content {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.pinned-tag {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
