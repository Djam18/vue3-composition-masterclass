import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : initialValue)

  watch(data, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })

  function remove() {
    localStorage.removeItem(key)
    data.value = initialValue
  }

  return { data, remove }
}
