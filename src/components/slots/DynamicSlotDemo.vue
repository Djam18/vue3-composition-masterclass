<script setup lang="ts">
// DynamicSlotDemo — dynamic slot names
// Vue supports binding slot names dynamically: <template #[slotName]>
// This is useful when the slot to fill is determined at runtime.

import BaseCard from './BaseCard.vue'
import { ref } from 'vue'

const activeSlot = ref<'header' | 'footer'>('header')
const dynamicContent = ref('I am in a dynamic slot!')
</script>

<template>
  <div class="dynamic-slot-demo">
    <h4>Dynamic Slot Names</h4>

    <div class="controls">
      <label>Target slot:</label>
      <label class="radio-label">
        <input v-model="activeSlot" type="radio" value="header" />
        #header
      </label>
      <label class="radio-label">
        <input v-model="activeSlot" type="radio" value="footer" />
        #footer
      </label>
    </div>

    <input v-model="dynamicContent" class="input" placeholder="Content to inject..." />

    <!-- Dynamic slot: the slot name is bound to a reactive variable -->
    <BaseCard elevated style="margin-top: 0.75rem">
      <template #[activeSlot]>
        <span class="dynamic-badge">Dynamic: {{ dynamicContent }}</span>
      </template>
      <p>This is the default body slot content.</p>
    </BaseCard>

    <div class="code-block">
      <pre>
&lt;!-- Slot name computed at runtime --&gt;
&lt;template #[activeSlot]&gt;
  Content injected into: &#123;&#123; activeSlot &#125;&#125;
&lt;/template&gt;

&lt;!-- activeSlot can be any valid slot name: 'header' | 'footer' | 'row' --&gt;</pre
      >
    </div>
  </div>
</template>

<style scoped>
.dynamic-slot-demo {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
}

.input {
  width: 100%;
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.dynamic-badge {
  background: #ddd6fe;
  color: #4c1d95;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.code-block {
  background: #1f2937;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  margin-top: 0.75rem;
}

.code-block pre {
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.76rem;
  margin: 0;
  white-space: pre-wrap;
}
</style>
