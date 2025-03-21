import { ref, type App } from 'vue'
import type { InjectionKey } from 'vue'

export interface ToastMessage { id: number; text: string; type: 'success' | 'error' | 'info' }
export interface ToastAPI { show: (text: string, type?: ToastMessage['type']) => void; messages: ReturnType<typeof ref<ToastMessage[]>> }

export const ToastKey: InjectionKey<ToastAPI> = Symbol('toast')

export const ToastPlugin = {
  install(app: App) {
    const messages = ref<ToastMessage[]>([])
    let nextId = 0

    const toast: ToastAPI = {
      messages,
      show(text, type = 'info') {
        const id = ++nextId
        messages.value.push({ id, text, type })
        setTimeout(() => {
          messages.value = messages.value.filter((m) => m.id !== id)
        }, 3000)
      },
    }

    app.provide(ToastKey, toast)
  },
}
