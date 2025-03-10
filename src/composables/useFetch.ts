import { ref, shallowRef } from 'vue'

export function useFetch<T>(url: string) {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function refresh() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  refresh()

  return { data, loading, error, refresh }
}
