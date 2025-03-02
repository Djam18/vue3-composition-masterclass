<script setup lang="ts">
// ThemeProvider — provides theme context to all descendants
// Uses provide() with InjectionKey<T> for type-safe DI across the component tree.
// The provided value is readonly to prevent accidental mutation by consumers.

import { ref, computed, provide, readonly } from 'vue'
import { ThemeKey } from './keys'
import type { Theme, ThemeContext } from './keys'

const theme = ref<Theme>('light')

const isDark = computed(() => theme.value === 'dark')

function setTheme(newTheme: Theme) {
  theme.value = newTheme
}

// Provide a structured context object — consumers get all they need
const context: ThemeContext = {
  theme: readonly(theme), // readonly prevents consumers from mutating directly
  setTheme,
  isDark,
}

// Using the typed Symbol key ensures inject(ThemeKey) returns ThemeContext
provide(ThemeKey, context)
</script>

<template>
  <!--
    ThemeProvider wraps a subtree.
    Everything inside can inject ThemeKey — including deeply nested components.
    No props needed — that's the power of provide/inject!
  -->
  <div :class="['theme-provider', isDark ? 'theme-dark' : 'theme-light']">
    <slot />
  </div>
</template>

<style scoped>
.theme-provider {
  border-radius: 8px;
  padding: 1.25rem;
  transition: background 0.3s, color 0.3s;
}

.theme-light {
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.theme-dark {
  background: #1f2937;
  color: #f9fafb;
  border: 1px solid #374151;
}
</style>
