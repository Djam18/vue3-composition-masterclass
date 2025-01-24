<script setup lang="ts">
// Vue 3.5: Reactive Props Destructure
// Before 3.5, destructuring props lost reactivity.
// The compiler now transforms destructured props into reactive accesses.

interface Props {
  count: number
  label?: string
  multiplier?: number
}

// ─── Before Vue 3.5 ───────────────────────────────────────────────────────
// const props = defineProps<Props>()
// Must access as props.count — destructuring breaks reactivity:
//   const { count } = defineProps<Props>()  // count was a plain number, NOT reactive

// ─── Vue 3.5+ ─────────────────────────────────────────────────────────────
// Destructuring now works — the compiler transforms it to reactive access
const { count, label = 'Count', multiplier = 1 } = defineProps<Props>()
// Equivalent to:  const { count = 0 } = defineProps<Props>()
// Replaces:       withDefaults(defineProps<Props>(), { label: 'Count', multiplier: 1 })

// count, label, multiplier are reactive — they update when parent changes props
// The Babel/compiler transform preserves the reactive binding

// Computed still works — count is reactive so derived values update too
import { computed } from 'vue'

const result = computed(() => count * multiplier)
const displayLabel = computed(() => label.toUpperCase())
</script>

<template>
  <div class="child">
    <p><strong>{{ displayLabel }}</strong>: {{ count }}</p>
    <p>× {{ multiplier }} = {{ result }}</p>
    <p class="note">Props destructured with defaults — reactivity preserved by compiler</p>
  </div>
</template>

<style scoped>
.child {
  background: #f0f8ff;
  border: 1px solid #99c;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.note {
  font-size: 0.8rem;
  color: #888;
  margin: 0.5rem 0 0;
}
</style>
