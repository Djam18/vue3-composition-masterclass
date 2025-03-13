<script setup lang="ts">
// Commit 2: Composables vs Mixins — definitive comparison
// This file demonstrates why mixins are deprecated in Vue 3 and composables
// are the correct replacement. The same "user fetching" feature is shown both ways.

import { ref, onMounted } from 'vue'

// ── COMPOSABLE VERSION ───────────────────────────────────────────────────────
// All concerns are explicit, self-contained, and named.
// Source is always clear — you know exactly where each value comes from.

interface User { id: number; name: string; email: string }

function useUserFetcher(userId: number) {
  // State is local — no namespace pollution, no name collisions
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const fetchError = ref<string | null>(null)

  // Side effect is encapsulated with cleanup
  onMounted(async () => {
    isLoading.value = true
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      user.value = await res.json()
    } catch (e) {
      fetchError.value = String(e)
    } finally {
      isLoading.value = false
    }
  })

  // Explicit: caller knows exactly what they receive
  return { user, isLoading, fetchError }
}

// Using the composable — source is crystal clear
const { user, isLoading, fetchError } = useUserFetcher(1)

// ── MIXIN PROBLEMS (illustrated as comments) ─────────────────────────────────
// In Vue 2, the same feature would be a mixin:
//
// const userMixin = {
//   data() {
//     return {
//       user: null,        // Problem 1: where does this come from?
//       isLoading: false,  // could be from ANY mixin
//       fetchError: null,  //
//     }
//   },
//   methods: {
//     async fetchUser(id) { ... },
//   },
//   mounted() {
//     this.fetchUser(this.userId) // Problem 2: implicit dependency on `userId`
//   }
// }
//
// In the component using it:
// export default {
//   mixins: [userMixin, anotherMixin],
//   // Problem 3: if anotherMixin also has `isLoading`, SILENT OVERRIDE
//   // Problem 4: reading template — which mixin owns `user`? You must read all mixins.
//   // Problem 5: mixins can mutate each other's data — spooky action at a distance
// }
</script>

<template>
  <div class="demo-page">
    <h2 class="demo-title">Composables vs Mixins — Definitive Comparison</h2>

    <div class="deprecation-banner">
      <strong>Mixins are deprecated in Vue 3</strong> — use composables instead.
      They solve every problem mixins had.
    </div>

    <div class="comparison-grid">
      <!-- MIXIN SIDE -->
      <div class="comparison-col mixin-col">
        <div class="col-header mixin-header">
          <span class="badge badge-deprecated">Deprecated</span>
          <h3>Vue 2 Mixin Pattern</h3>
        </div>

        <div class="code-block-wrapper">
          <div class="code-label">userMixin.js</div>
          <pre class="code-block code-bad">// userMixin.js
export const userMixin = {
  data() {
    return {
      user: null,       // ambiguous source
      isLoading: false, // who owns this?
      fetchError: null,
    }
  },
  methods: {
    async fetchUser(id) {
      this.isLoading = true
      try {
        const res = await fetch(`/users/${id}`)
        this.user = await res.json()
      } catch (e) {
        this.fetchError = String(e)
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    // implicit dependency — `this.userId` must
    // exist somewhere in the component
    this.fetchUser(this.userId)
  }
}</pre>
        </div>

        <div class="code-block-wrapper">
          <div class="code-label">UserProfile.vue (using mixin)</div>
          <pre class="code-block code-bad">// UserProfile.vue
export default {
  mixins: [userMixin, paginationMixin],
  props: ['userId'],
  // PROBLEM 1: Name collision
  // if paginationMixin also has `isLoading`
  // → silent override, no warning!

  // PROBLEM 2: Unclear source
  // In template, where does `user` come from?
  // userMixin? paginationMixin? component?
  // → You must read ALL mixin files to know.

  // PROBLEM 3: Implicit dependency
  // userMixin reads `this.userId` — but
  // where is it defined? prop? data? other mixin?
  // → Spooky action at a distance.

  // PROBLEM 4: Refactoring is fragile
  // Rename `user` anywhere → breaks all consumers
  // silently
}</pre>
        </div>

        <ul class="problem-list">
          <li class="problem">Name collision — silent override between mixins</li>
          <li class="problem">Unclear source — impossible to know which mixin owns a property</li>
          <li class="problem">Implicit dependencies — mixins read each other's data</li>
          <li class="problem">Spooky coupling — mixins mutate shared `this` context</li>
          <li class="problem">No TypeScript support — `this.user` is untyped</li>
        </ul>
      </div>

      <!-- COMPOSABLE SIDE -->
      <div class="comparison-col composable-col">
        <div class="col-header composable-header">
          <span class="badge badge-recommended">Recommended</span>
          <h3>Vue 3 Composable Pattern</h3>
        </div>

        <div class="code-block-wrapper">
          <div class="code-label">useUserFetcher.ts</div>
          <pre class="code-block code-good">// useUserFetcher.ts
export function useUserFetcher(userId: number) {
  // State is LOCAL — no namespace pollution
  const user = ref&lt;User | null&gt;(null)
  const isLoading = ref(false)
  const fetchError = ref&lt;string | null&gt;(null)

  // Side effect with automatic cleanup
  onMounted(async () => {
    isLoading.value = true
    try {
      const res = await fetch(`/users/${userId}`)
      user.value = await res.json()
    } catch (e) {
      fetchError.value = String(e)
    } finally {
      isLoading.value = false
    }
  })

  // Explicit return — caller knows exactly
  // what they receive, fully typed
  return { user, isLoading, fetchError }
}</pre>
        </div>

        <div class="code-block-wrapper">
          <div class="code-label">UserProfile.vue (using composable)</div>
          <pre class="code-block code-good">// UserProfile.vue
&lt;script setup lang="ts"&gt;
import { useUserFetcher } from './useUserFetcher'
import { usePagination } from './usePagination'

// SOURCE IS EXPLICIT — no ambiguity
const { user, isLoading, fetchError } = useUserFetcher(1)
const { page, nextPage } = usePagination()

// SOLUTION 1: Name collision — destructure with alias
// const { isLoading: pageLoading } = usePagination()

// SOLUTION 2: Source is clear — IDE jump-to-def works
// SOLUTION 3: Explicit dependency — userId is a param
// SOLUTION 4: Full TypeScript — user is typed as User|null
&lt;/script&gt;</pre>
        </div>

        <ul class="problem-list">
          <li class="solution">No collisions — each composable has its own scope</li>
          <li class="solution">Crystal clear source — destructuring shows the origin</li>
          <li class="solution">Explicit dependencies — passed as function arguments</li>
          <li class="solution">No shared context — composables are pure functions</li>
          <li class="solution">Full TypeScript support — IDE autocomplete, type safety</li>
        </ul>
      </div>
    </div>

    <!-- Live Demo -->
    <section class="live-demo">
      <h3>Live Demo — useUserFetcher composable</h3>
      <p class="demo-desc">
        This component uses <code>useUserFetcher(1)</code>. The source is unambiguous — you can
        command-click it in your IDE and jump directly to the implementation.
      </p>
      <div v-if="isLoading" class="status loading">Loading user...</div>
      <div v-else-if="fetchError" class="status error">{{ fetchError }}</div>
      <div v-else-if="user" class="user-card">
        <div class="user-avatar">{{ user.name[0] }}</div>
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
      </div>
    </section>

    <!-- Migration Guide -->
    <section class="migration-guide">
      <h3>Migration: Mixin to Composable</h3>
      <ol class="migration-steps">
        <li>Extract <code>data()</code> properties into <code>ref()</code> / <code>reactive()</code></li>
        <li>Move <code>methods</code> into regular functions inside the composable</li>
        <li>Move <code>mounted</code> / lifecycle hooks into <code>onMounted</code> etc.</li>
        <li>Replace implicit <code>this.xyz</code> references with function parameters</li>
        <li>Return only what callers need — keep internals private</li>
        <li>Add TypeScript types — composables support generics natively</li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  padding: 1.5rem;
  max-width: 1100px;
}

.demo-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0 0 0.75rem;
}

.deprecation-banner {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-left: 4px solid #f59e0b;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #92400e;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 800px) {
  .comparison-grid { grid-template-columns: 1fr; }
}

.comparison-col {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.col-header {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mixin-header { background: #fee2e2; }
.composable-header { background: #dcfce7; }

.col-header h3 { margin: 0; font-size: 0.95rem; }

.badge {
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-deprecated { background: #dc2626; color: #fff; }
.badge-recommended { background: #16a34a; color: #fff; }

.code-block-wrapper {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.code-label {
  font-size: 0.72rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
  font-family: monospace;
}

.code-block {
  font-size: 0.72rem;
  line-height: 1.55;
  padding: 0.75rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  white-space: pre;
}

.code-bad {
  background: #1c1917;
  color: #fca5a5;
}

.code-good {
  background: #052e16;
  color: #86efac;
}

.problem-list {
  list-style: none;
  padding: 0.5rem 0.75rem 0.75rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-top: 1px solid #e5e7eb;
}

.problem-list li {
  font-size: 0.82rem;
  padding-left: 1.2rem;
  position: relative;
}

.problem::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #dc2626;
  font-weight: 700;
}

.solution::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #16a34a;
  font-weight: 700;
}

.live-demo,
.migration-guide {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.live-demo h3,
.migration-guide h3 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #374151;
}

.demo-desc {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 0.75rem;
}

.status {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status.loading { background: #f0f9ff; color: #0369a1; }
.status.error { background: #fee2e2; color: #dc2626; }

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.user-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.9rem;
}

.user-email {
  font-size: 0.8rem;
  color: #6b7280;
}

.migration-steps {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.migration-steps li {
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.5;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}
</style>
