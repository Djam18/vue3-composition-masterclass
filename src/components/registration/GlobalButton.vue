<script setup lang="ts">
// GlobalButton — registered globally in main.ts via app.component()
// This component is available in any template without local import

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="['global-btn', `global-btn--${variant}`, { 'global-btn--disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>Button</slot>
  </button>
</template>

<style scoped>
.global-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.global-btn--primary {
  background: #4f46e5;
  color: #fff;
}

.global-btn--secondary {
  background: #6b7280;
  color: #fff;
}

.global-btn--danger {
  background: #dc2626;
  color: #fff;
}

.global-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.global-btn:not(.global-btn--disabled):hover {
  opacity: 0.85;
}
</style>
