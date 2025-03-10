<script setup lang="ts">
import { ref } from 'vue'
import { useLocalStorage } from '../../composables/useLocalStorage'
import { useFetch } from '../../composables/useFetch'
import { useDebounce } from '../../composables/useDebounce'
import { useEventListener } from '../../composables/useEventListener'
import { useIntersectionObserver } from '../../composables/useIntersectionObserver'

// ── 1. useLocalStorage ──────────────────────────────────────────────────────
const { data: counter, remove: resetCounter } = useLocalStorage<number>('demo-counter', 0)

// ── 2. useFetch ─────────────────────────────────────────────────────────────
interface Post { id: number; title: string; body: string }
const { data: post, loading, error, refresh } = useFetch<Post>(
  'https://jsonplaceholder.typicode.com/posts/1',
)

// ── 3. useDebounce ──────────────────────────────────────────────────────────
const searchInput = ref('')
const debouncedSearch = useDebounce(searchInput, 400)

// ── 4. useEventListener ─────────────────────────────────────────────────────
const lastKey = ref('(press any key)')
useEventListener(window, 'keydown', (e: Event) => {
  lastKey.value = (e as KeyboardEvent).key
})

// ── 5. useIntersectionObserver ───────────────────────────────────────────────
const lazyImage = ref<Element | null>(null)
const { isIntersecting } = useIntersectionObserver(lazyImage)
</script>

<template>
  <div class="demo-page">
    <h2 class="demo-title">Composables — The Vue 3 Logic Reuse Pattern</h2>
    <p class="demo-intro">
      Composables are functions that leverage the Composition API to encapsulate and reuse
      stateful logic. They replace mixins, solving name collisions, unclear sources, and implicit dependencies.
    </p>

    <div class="demo-grid">
      <!-- 1. useLocalStorage -->
      <section class="demo-card">
        <h3>1. useLocalStorage</h3>
        <p class="demo-desc">Persists reactive state to localStorage automatically.</p>
        <div class="demo-body">
          <div class="counter-display">{{ counter }}</div>
          <div class="btn-row">
            <button class="btn btn-primary" @click="counter++">+ Increment</button>
            <button class="btn btn-secondary" @click="counter--">- Decrement</button>
            <button class="btn btn-danger" @click="resetCounter()">Reset</button>
          </div>
          <p class="demo-note">Reload the page — the value persists in localStorage.</p>
        </div>
      </section>

      <!-- 2. useFetch -->
      <section class="demo-card">
        <h3>2. useFetch</h3>
        <p class="demo-desc">Fetches data with reactive loading/error states. Uses shallowRef for performance.</p>
        <div class="demo-body">
          <div v-if="loading" class="status loading">Loading...</div>
          <div v-else-if="error" class="status error">Error: {{ error.message }}</div>
          <div v-else-if="post" class="post-preview">
            <strong>{{ post.title }}</strong>
            <p>{{ post.body.slice(0, 80) }}...</p>
          </div>
          <button class="btn btn-primary" @click="refresh()">Refresh</button>
        </div>
      </section>

      <!-- 3. useDebounce -->
      <section class="demo-card">
        <h3>3. useDebounce</h3>
        <p class="demo-desc">Delays updating a reactive value until typing stops (400ms).</p>
        <div class="demo-body">
          <input
            v-model="searchInput"
            class="input"
            placeholder="Type to search..."
          />
          <div class="label-row">
            <span class="label">Live:</span> <code>{{ searchInput }}</code>
          </div>
          <div class="label-row">
            <span class="label">Debounced:</span> <code>{{ debouncedSearch }}</code>
          </div>
        </div>
      </section>

      <!-- 4. useEventListener -->
      <section class="demo-card">
        <h3>4. useEventListener</h3>
        <p class="demo-desc">Attaches DOM event listeners with automatic cleanup on unmount.</p>
        <div class="demo-body">
          <div class="key-display">{{ lastKey }}</div>
          <p class="demo-note">Click anywhere and press any keyboard key.</p>
        </div>
      </section>

      <!-- 5. useIntersectionObserver -->
      <section class="demo-card intersection-card">
        <h3>5. useIntersectionObserver</h3>
        <p class="demo-desc">Detects when an element enters the viewport (lazy loading pattern).</p>
        <div class="demo-body">
          <div
            ref="lazyImage"
            class="lazy-box"
            :class="{ visible: isIntersecting }"
          >
            <span v-if="isIntersecting">In viewport — image would load here</span>
            <span v-else>Scroll down to see this element enter the viewport</span>
          </div>
          <div class="label-row">
            <span class="label">isIntersecting:</span>
            <code :class="isIntersecting ? 'text-green' : 'text-gray'">{{ isIntersecting }}</code>
          </div>
        </div>
      </section>
    </div>

    <section class="code-summary">
      <h3>Pattern Summary</h3>
      <pre class="code-block">// Any composable follows this shape:
export function useXxx(/* optional params */) {
  // reactive state internal to this composable
  const state = ref(...)

  // side effects with automatic cleanup
  onMounted(() => { ... })
  onUnmounted(() => { ... })

  // expose only what callers need
  return { state, someAction }
}</pre>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  padding: 1.5rem;
  max-width: 900px;
}

.demo-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0 0 0.5rem;
}

.demo-intro {
  color: #4b5563;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.demo-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.demo-card h3 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  color: #4f46e5;
}

.demo-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 0.75rem;
}

.demo-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.counter-display {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4f46e5;
  text-align: center;
  padding: 0.5rem;
  background: #f5f3ff;
  border-radius: 6px;
}

.btn-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover { background: #4338ca; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }
.btn-danger { background: #fee2e2; color: #dc2626; }
.btn-danger:hover { background: #fecaca; }

.demo-note {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.status {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status.loading { background: #f0f9ff; color: #0369a1; }
.status.error { background: #fee2e2; color: #dc2626; }

.post-preview {
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.post-preview strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #111827;
  text-transform: capitalize;
}

.post-preview p {
  margin: 0;
  color: #6b7280;
}

.input {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
}

.input:focus {
  outline: 2px solid #4f46e5;
  outline-offset: -1px;
  border-color: transparent;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.label {
  color: #6b7280;
  font-size: 0.8rem;
  min-width: 80px;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}

.text-green { color: #16a34a; }
.text-gray { color: #9ca3af; }

.key-display {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  text-align: center;
  padding: 0.75rem;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  min-height: 3rem;
}

.lazy-box {
  padding: 1rem;
  text-align: center;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.lazy-box.visible {
  border-color: #4f46e5;
  background: #f5f3ff;
  color: #4f46e5;
  font-weight: 500;
}

.code-summary {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.code-summary h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #374151;
}

.code-block {
  background: #1e1b4b;
  color: #c4b5fd;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}
</style>
