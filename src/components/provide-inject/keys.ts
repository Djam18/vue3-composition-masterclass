// keys.ts — Symbol InjectionKey definitions
// Using Symbol + InjectionKey<T> provides full TypeScript type inference for inject()
// The type parameter T tells inject() exactly what type to expect.
//
// Why Symbols instead of strings?
// - Symbols are globally unique — no naming collisions
// - The InjectionKey<T> generic ensures type-safe inject() calls
// - Group all injection keys in one file for easy discovery

import type { InjectionKey, Ref, ComputedRef } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export interface ThemeContext {
  theme: Readonly<Ref<Theme>>
  setTheme: (theme: Theme) => void
  isDark: ComputedRef<boolean>
}

export interface UserContext {
  user: Readonly<Ref<User | null>>
  isLoggedIn: ComputedRef<boolean>
  logout: () => void
}

// InjectionKey<T> is a typed Symbol — inject(ThemeKey) returns ThemeContext
export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')
export const UserKey: InjectionKey<UserContext> = Symbol('user')
