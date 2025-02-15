<script setup lang="ts">
// SingleModelInput — basic defineModel() usage (Vue 3.4+)
// defineModel() replaces the manual props + emits pattern for v-model

// Before Vue 3.4 (manual pattern):
//   const props = defineProps<{ modelValue: string }>()
//   const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
//   const value = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })

// Vue 3.4+: defineModel() does all of the above automatically
const model = defineModel<string>({ default: '' })

// defineModel returns a writable ref — bind directly to inputs
// The ref reads from the parent's binding and emits updates automatically
</script>

<template>
  <div class="single-model">
    <label class="label">Basic v-model (defineModel)</label>

    <div class="input-row">
      <input v-model="model" class="input" placeholder="Type here..." />
      <span class="value-badge">Value: "{{ model }}"</span>
    </div>

    <div class="char-count">{{ model.length }} chars</div>

    <div class="code-hint">
      <code>const model = defineModel&lt;string&gt;()</code>
      <code>&lt;input v-model="model" /&gt;</code>
    </div>
  </div>
</template>

<style scoped>
.single-model {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.input-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.input {
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
}

.value-badge {
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-family: monospace;
}

.char-count {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.code-hint {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

code {
  background: #1f2937;
  color: #a5f3fc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.78rem;
}
</style>
