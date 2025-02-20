<script setup lang="ts">
// BaseInput — inheritAttrs: false with v-bind="$attrs" on inner input
//
// By default, Vue applies non-prop attributes (class, style, id, aria-*, data-*)
// to the component's root element. This is "fallthrough".
//
// Problem: We want attributes like 'class' and 'placeholder' to go to
// the INNER <input>, not the wrapper <div>.
// Solution: Set inheritAttrs: false, then manually bind $attrs where needed.

import { useAttrs } from 'vue'

// inheritAttrs: false MUST be set to prevent auto-fallthrough to root
defineOptions({
  inheritAttrs: false,
})

interface Props {
  label?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  error: '',
})

// useAttrs() gives access to the same object as template's $attrs
const attrs = useAttrs()

// We can inspect what's being passed in
const attrKeys = (): string[] => Object.keys(attrs)
</script>

<template>
  <div class="base-input-wrapper">
    <label v-if="props.label" class="input-label">{{ props.label }}</label>

    <!--
      v-bind="$attrs" forwards all non-prop attributes to the inner input.
      This includes: class, style, placeholder, id, aria-*, data-*, event listeners
      After inheritance is disabled, we manually target the input element.
    -->
    <input v-bind="$attrs" :class="['base-input', props.error ? 'base-input--error' : '']" />

    <p v-if="props.error" class="error-msg">{{ props.error }}</p>

    <div class="attrs-debug">
      <small>Attrs forwarded to &lt;input&gt;: {{ attrKeys().join(', ') || 'none' }}</small>
    </div>
  </div>
</template>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.base-input {
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.15s;
}

.base-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px #ede9fe;
}

.base-input--error {
  border-color: #dc2626;
}

.base-input--error:focus {
  box-shadow: 0 0 0 2px #fee2e2;
}

.error-msg {
  font-size: 0.75rem;
  color: #dc2626;
  margin: 0;
}

.attrs-debug {
  font-size: 0.7rem;
  color: #9ca3af;
}
</style>
