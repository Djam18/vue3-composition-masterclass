import { onMounted, onUnmounted } from 'vue'

export function useEventListener(
  target: EventTarget | string,
  event: string,
  handler: EventListenerOrEventListenerObject,
) {
  const el = typeof target === 'string' ? document.querySelector(target) : target

  onMounted(() => el?.addEventListener(event, handler))
  onUnmounted(() => el?.removeEventListener(event, handler))
}
