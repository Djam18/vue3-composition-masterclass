<script setup lang="ts">
// LocalComponent — demonstrates local registration
// In <script setup>, imported components are automatically locally registered
// No need for a 'components: {}' option — Vue handles it at compile time

import { ref } from 'vue'

const message = ref('I am a locally registered component!')
const clickCount = ref(0)

function increment() {
  clickCount.value++
}
</script>

<template>
  <div class="local-component">
    <h3>Local Component</h3>
    <p>{{ message }}</p>
    <p>Click count: {{ clickCount }}</p>

    <!--
      GlobalButton is available without import because it was registered
      globally via app.component() in main.ts
    -->
    <GlobalButton @click="increment">Increment (using GlobalButton)</GlobalButton>

    <div class="info">
      <strong>How local registration works with &lt;script setup&gt;:</strong>
      <code>import LocalComponent from './LocalComponent.vue'</code>
      <p>That's it — no <code>components: &#123;&#125;</code> needed!</p>
    </div>
  </div>
</template>

<style scoped>
.local-component {
  border: 2px dashed #10b981;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
}

.info {
  margin-top: 1rem;
  background: #f0fdf4;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

code {
  display: block;
  background: #1f2937;
  color: #d1fae5;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-family: monospace;
}
</style>
