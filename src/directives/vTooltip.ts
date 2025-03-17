import type { Directive } from 'vue'

export const vTooltip: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    el.setAttribute('title', binding.value)
    el.setAttribute('data-tooltip', binding.value)
  },
  updated(el, binding) {
    el.setAttribute('title', binding.value)
    el.setAttribute('data-tooltip', binding.value)
  },
  unmounted(el) {
    el.removeAttribute('title')
    el.removeAttribute('data-tooltip')
  },
}
