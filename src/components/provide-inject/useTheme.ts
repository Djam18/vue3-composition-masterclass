// useTheme — composable wrapping inject(ThemeKey)
// Composables that wrap inject() are the recommended pattern for provide/inject.
// They:
// 1. Validate that the component is inside the provider tree
// 2. Provide a clean API surface (no need to import ThemeKey in consumers)
// 3. Can add extra computed/derived state on top

import { inject } from 'vue'
import { ThemeKey } from './keys'
import type { ThemeContext } from './keys'

export function useTheme(): ThemeContext {
  const context = inject(ThemeKey)

  if (!context) {
    throw new Error(
      '[useTheme] No ThemeProvider found in the component tree. ' +
        'Wrap your component with <ThemeProvider>.',
    )
  }

  return context
}
