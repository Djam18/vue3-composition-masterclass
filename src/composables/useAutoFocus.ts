import { onMounted, useTemplateRef } from 'vue'

/**
 * useAutoFocus — focuses a named template ref on mount.
 *
 * Vue 3.5: useTemplateRef() works in composables.
 * The composable calls useTemplateRef() with the ref name — it hooks into
 * the current component's template ref registry.
 *
 * Usage in component:
 *   const { el } = useAutoFocus<HTMLInputElement>('myInput')
 *   // In template: <input ref="myInput" ... />
 */
export function useAutoFocus<T extends HTMLElement>(refName: string) {
  // useTemplateRef() — declared in a composable, binds to the host component's template
  // This is NOT possible with the old pattern (const el = ref(null))
  // because a composable can't know which DOM element to bind to without the ref name
  const el = useTemplateRef<T>(refName)

  onMounted(() => {
    el.value?.focus()
  })

  return { el }
}
