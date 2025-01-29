<script setup lang="ts">
import { useAutoFocus } from '../composables/useAutoFocus'

// The composable uses useTemplateRef('searchInput') internally.
// 'searchInput' must match the ref="searchInput" attribute in the template below.
const { el: searchInput } = useAutoFocus<HTMLInputElement>('searchInput')

defineProps<{ placeholder?: string }>()
const emit = defineEmits<{ input: [value: string] }>()
</script>

<template>
  <!-- ref="searchInput" — matches the name passed to useAutoFocus -->
  <input
    ref="searchInput"
    type="text"
    :placeholder="placeholder ?? 'Auto-focused input...'"
    class="auto-focus-input"
    @input="emit('input', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.auto-focus-input {
  padding: 0.4rem 0.75rem;
  border: 2px solid #42b883;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  width: 100%;
}

.auto-focus-input:focus {
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.3);
}
</style>
