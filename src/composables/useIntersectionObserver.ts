import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useIntersectionObserver(
  targetRef: Ref<Element | null>,
  options?: IntersectionObserverInit,
) {
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
    }, options)
    observer.observe(targetRef.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { isIntersecting }
}
