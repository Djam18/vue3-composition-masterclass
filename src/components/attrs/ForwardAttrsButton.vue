<script setup lang="ts">
// ForwardAttrsButton — selective attribute forwarding
// Sometimes you want to forward SOME attrs to one element and others to another.
// useAttrs() gives you the object to destructure manually.

import { useAttrs, computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

// Extract data-* attributes for a tooltip — forward the rest to the button
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-'))),
)

const nonDataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([k]) => !k.startsWith('data-'))),
)

const tooltipText = computed(() => (dataAttrs.value['data-tooltip'] as string) || '')
</script>

<template>
  <div class="forward-btn-wrapper" v-bind="dataAttrs">
    <!--
      Forward non-data-* attrs to the button (class, style, event listeners, aria-*).
      Data attrs go to the outer wrapper for tooltip purposes.
    -->
    <button class="forward-btn" v-bind="nonDataAttrs">
      <slot>Button</slot>
    </button>

    <span v-if="tooltipText" class="tooltip">{{ tooltipText }}</span>
  </div>
</template>

<style scoped>
.forward-btn-wrapper {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.forward-btn {
  padding: 0.4rem 1rem;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;
}

.forward-btn:hover {
  background: #4338ca;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.72rem;
  white-space: nowrap;
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1f2937;
}
</style>
