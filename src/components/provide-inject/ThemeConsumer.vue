<script setup lang="ts">
// ThemeConsumer — injects theme, shows it and allows switching
// Uses the useTheme() composable rather than calling inject() directly.

import { useTheme } from './useTheme'
import type { Theme } from './keys'

const { theme, setTheme, isDark } = useTheme()

const themes: Theme[] = ['light', 'dark', 'system']
</script>

<template>
  <div class="theme-consumer">
    <h4>Theme Consumer (deeply nested)</h4>

    <p>
      Current theme: <strong class="theme-badge">{{ theme }}</strong>
      — isDark: <strong>{{ isDark }}</strong>
    </p>

    <div class="theme-buttons">
      <button
        v-for="t in themes"
        :key="t"
        :class="['theme-btn', theme === t ? 'active' : '']"
        @click="setTheme(t)"
      >
        {{ t }}
      </button>
    </div>

    <p class="note">
      This component injects theme via <code>useTheme()</code> — no props needed from parent!
    </p>
  </div>
</template>

<style scoped>
.theme-consumer {
  border: 1px dashed #6b7280;
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

.theme-badge {
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.theme-buttons {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.theme-btn {
  padding: 0.3rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.15s;
}

.theme-btn.active {
  background: #4f46e5;
  color: #fff;
  border-color: #4f46e5;
}

.note {
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0.25rem 0 0;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.78rem;
}
</style>
