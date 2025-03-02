<script setup lang="ts">
// ProvideInjectDemo — full tree demo of provide/inject

import ThemeProvider from './ThemeProvider.vue'
import ThemeConsumer from './ThemeConsumer.vue'
import { provide, ref, computed, readonly } from 'vue'
import { UserKey } from './keys'
import type { User, UserContext } from './keys'

// Provide user context at this level — descendants can inject it
const currentUser = ref<User | null>({
  id: 1,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  role: 'admin',
})

const isLoggedIn = computed(() => currentUser.value !== null)

function logout() {
  currentUser.value = null
}

function login() {
  currentUser.value = {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'admin',
  }
}

const userContext: UserContext = {
  user: readonly(currentUser),
  isLoggedIn,
  logout,
}

provide(UserKey, userContext)
</script>

<template>
  <div class="provide-inject-demo">
    <h2>Provide / Inject</h2>

    <p class="intro">
      <code>provide()</code> and <code>inject()</code> enable cross-tree dependency injection —
      passing data from a parent to any descendant, no matter how deep, without prop drilling.
      Using <code>InjectionKey&lt;T&gt;</code> with TypeScript Symbols ensures full type safety.
    </p>

    <!-- ===== Section 1: Theme Provider tree ===== -->
    <section class="section">
      <h3>1. Theme Context — InjectionKey + composable wrapper</h3>
      <p>
        <code>ThemeProvider</code> wraps the subtree and provides theme state. Deeply nested
        consumers access it via <code>useTheme()</code>.
      </p>

      <!-- ThemeProvider wraps the consumer — simulating a deep component tree -->
      <ThemeProvider>
        <div class="depth-label">Depth 1 — ThemeProvider (provides ThemeKey)</div>
        <div class="depth indent-1">
          <div class="depth-label">Depth 2 — intermediate component (no theme props)</div>
          <div class="depth indent-2">
            <div class="depth-label">Depth 3 — ThemeConsumer (injects via useTheme())</div>
            <ThemeConsumer />
          </div>
        </div>
      </ThemeProvider>
    </section>

    <!-- ===== Section 2: User context ===== -->
    <section class="section">
      <h3>2. User Context — provide at demo level</h3>
      <p>
        This demo provides a <code>UserKey</code> context. Any descendant can inject it with
        <code>inject(UserKey)</code>.
      </p>

      <div class="user-panel">
        <div v-if="isLoggedIn" class="user-info">
          <strong>{{ currentUser?.name }}</strong>
          <span class="role-badge">{{ currentUser?.role }}</span>
          <small>{{ currentUser?.email }}</small>
          <button class="btn-danger" @click="logout">Logout</button>
        </div>
        <div v-else class="logged-out">
          <p>Not logged in</p>
          <button class="btn-primary" @click="login">Login as Ada</button>
        </div>
      </div>
    </section>

    <!-- ===== Section 3: Rules & best practices ===== -->
    <section class="section">
      <h3>Key Rules</h3>
      <ul class="concept-list">
        <li>
          <strong>Reactivity is preserved:</strong> If you provide a <code>ref()</code> or
          <code>computed()</code>, consumers see reactive updates automatically.
        </li>
        <li>
          <strong>Read-only by convention:</strong> Wrap the provided ref in
          <code>readonly()</code> to prevent consumers from mutating it directly. Mutation should
          only happen through provided setter functions.
        </li>
        <li>
          <strong>InjectionKey&lt;T&gt; for type safety:</strong> Use
          <code>Symbol() as InjectionKey&lt;T&gt;</code> — inject() will return the correctly typed
          value without manual casting.
        </li>
        <li>
          <strong>Composable wrappers:</strong> Wrap inject() calls in a composable
          (<code>useTheme()</code>). This validates the provider exists and provides a clean API.
        </li>
        <li>
          <strong>App-level provide:</strong> For global state, use
          <code>app.provide(key, value)</code> in <code>main.ts</code> — makes it available
          everywhere.
        </li>
        <li>
          <strong>Not a state manager:</strong> For complex global state, consider Pinia. Use
          provide/inject for feature-scoped or plugin-style DI.
        </li>
      </ul>
    </section>

    <!-- ===== Section 4: Code reference ===== -->
    <section class="section">
      <h3>Pattern Reference</h3>
      <div class="code-block">
        <pre>
// keys.ts
export const ThemeKey: InjectionKey&lt;ThemeContext&gt; = Symbol('theme')

// Provider component
provide(ThemeKey, &#123;
  theme: readonly(theme),
  setTheme,
  isDark,
&#125;)

// Consumer — direct inject
const ctx = inject(ThemeKey) // ThemeContext | undefined

// Consumer — via composable (recommended)
const &#123; theme, setTheme, isDark &#125; = useTheme()

// useTheme.ts
export function useTheme(): ThemeContext &#123;
  const ctx = inject(ThemeKey)
  if (!ctx) throw new Error('No ThemeProvider found')
  return ctx
&#125;</pre
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.provide-inject-demo {
  padding: 1.5rem;
  max-width: 900px;
}

.intro {
  color: #4b5563;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}

.section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.section h3 {
  margin: 0 0 0.5rem;
}

.depth-label {
  font-size: 0.78rem;
  color: #6b7280;
  margin-bottom: 0.35rem;
}

.depth {
  padding: 0.5rem;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.indent-1 {
  margin-left: 1rem;
}

.indent-2 {
  margin-left: 1rem;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.user-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.role-badge {
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.logged-out {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
}

.btn-primary {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.concept-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding-left: 1.25rem;
}

.concept-list li {
  line-height: 1.5;
}

.code-block {
  background: #1f2937;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  overflow-x: auto;
}

.code-block pre {
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.76rem;
  margin: 0;
  white-space: pre-wrap;
}
</style>
