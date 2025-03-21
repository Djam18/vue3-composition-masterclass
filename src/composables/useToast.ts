import { inject } from 'vue'
import { ToastKey } from '../plugins/toast'

export function useToast() {
  const toast = inject(ToastKey)
  if (!toast) throw new Error('ToastPlugin not installed')
  return toast
}
