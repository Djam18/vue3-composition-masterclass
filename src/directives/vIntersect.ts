import type { Directive } from 'vue'

export const vIntersect: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) binding.value()
    })
    observer.observe(el)
    ;(el as any)._intersectObserver = observer
  },
  unmounted(el) {
    ;(el as any)._intersectObserver?.disconnect()
  },
}
