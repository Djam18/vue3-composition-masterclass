import type { Directive } from 'vue'

type ClickOutsideEl = HTMLElement & { _clickOutside?: (e: MouseEvent) => void }

export const vClickOutside: Directive<ClickOutsideEl, () => void> = {
  beforeMount(el, binding) {
    el._clickOutside = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    if (el._clickOutside) {
      document.removeEventListener('mousedown', el._clickOutside)
    }
  },
}
