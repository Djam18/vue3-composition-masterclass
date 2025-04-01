<script setup lang="ts">
// KeepAlive — preserve component state across tab switches
// Key concepts:
//   - <KeepAlive> caches inactive component instances (avoids destroy/recreate cycle)
//   - onActivated / onDeactivated replace mounted/unmounted for cached components
//   - include / exclude: control which components are cached by component name
//   - max: LRU cache — when limit reached, least-recently-used instance is evicted
import { ref, shallowRef, type Component } from 'vue'
import CounterTab from './CounterTab.vue'
import FormTab from './FormTab.vue'
import ListTab from './ListTab.vue'

const useKeepAlive = ref(true)

interface Tab {
  id: string
  label: string
  component: Component
  name: string
}

const tabs: Tab[] = [
  { id: 'counter', label: 'Counter', component: CounterTab, name: 'CounterTab' },
  { id: 'form',    label: 'Form',    component: FormTab,    name: 'FormTab'    },
  { id: 'list',    label: 'List',    component: ListTab,    name: 'ListTab'    },
]

const activeTab = shallowRef<Tab>(tabs[0])

function selectTab(tab: Tab) {
  activeTab.value = tab
}

// include demo: only CounterTab and FormTab are cached, ListTab is not
// Change this to observe the difference
const includeList = ref('CounterTab,FormTab')

// exclude demo: you could also exclude specific components
// const excludeList = ref('ListTab')

// max demo: LRU cache — if max=2, only 2 instances are cached at a time
// With 3 tabs and max=2, the oldest-accessed tab is evicted when a 3rd is visited
const maxCache = ref(10)
</script>

<template>
  <div class="demo-container">
    <h2>KeepAlive — Preserve Component State</h2>

    <!-- Toggle: with vs without KeepAlive -->
    <div class="toggle-row">
      <label class="toggle-label">
        <input v-model="useKeepAlive" type="checkbox" />
        Use <code>&lt;KeepAlive&gt;</code>
        <span v-if="useKeepAlive" class="badge badge-green">ON — state preserved</span>
        <span v-else class="badge badge-red">OFF — state lost on tab switch</span>
      </label>
    </div>

    <!-- Tab navigation -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', activeTab.id === tab.id ? 'tab-btn--active' : '']"
        @click="selectTab(tab)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content — with or without KeepAlive -->
    <div class="tab-content">
      <template v-if="useKeepAlive">
        <!--
          include: only cache CounterTab and FormTab by component name
          max: LRU — evict least-recently-used when cache exceeds limit
          Note: component names come from the `name` option or the filename-based name
          in <script setup> (Vue 3.5 infers it from filename)
        -->
        <KeepAlive :include="includeList" :max="maxCache">
          <component :is="activeTab.component" />
        </KeepAlive>
      </template>
      <template v-else>
        <!-- Without KeepAlive: component is destroyed and re-created on every switch -->
        <component :is="activeTab.component" />
      </template>
    </div>

    <!-- Props reference -->
    <div class="props-section">
      <h3>KeepAlive Props</h3>

      <div class="props-grid">
        <div class="prop-card">
          <div class="prop-name">include</div>
          <div class="prop-desc">
            Cache only components whose name matches. Accepts a string, RegExp, or array.
            Currently: <code>{{ includeList }}</code> — ListTab is NOT cached.
          </div>
          <div class="prop-controls">
            <label>
              <input v-model="includeList" type="text" />
              <span class="hint">Edit to change which components are cached</span>
            </label>
          </div>
        </div>

        <div class="prop-card">
          <div class="prop-name">exclude</div>
          <div class="prop-desc">
            Never cache components whose name matches.
            Works the same way as <code>include</code> but inverted.
            Example: <code>exclude="ListTab"</code>
          </div>
        </div>

        <div class="prop-card">
          <div class="prop-name">max</div>
          <div class="prop-desc">
            Maximum number of cached instances. Uses LRU (Least Recently Used) eviction.
            When the cache is full, the least-recently-accessed instance is destroyed.
          </div>
          <div class="prop-controls">
            <label>
              max: <input v-model.number="maxCache" type="number" min="1" max="20" style="width:60px" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Lifecycle note -->
    <div class="lifecycle-note">
      <h3>Lifecycle Hooks with KeepAlive</h3>
      <div class="code-block">
        <pre><code>// In a cached component:
import { onActivated, onDeactivated } from 'vue'

onActivated(() =&gt; {
  // Fires when component is inserted from cache (like mounted, but for cached)
  // Also fires on initial mount
})

onDeactivated(() =&gt; {
  // Fires when component is removed to cache (like unmounted, but component is kept alive)
  // State and DOM are preserved
})

// NOTE: onMounted / onUnmounted still fire for initial mount/final unmount
// but NOT on each tab switch when KeepAlive is active.</code></pre>
      </div>
      <p class="note-text">
        Open the browser console and switch tabs to see <code>onActivated</code> /
        <code>onDeactivated</code> firing in CounterTab.
      </p>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 1.5rem;
  max-width: 760px;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #1e1b4b;
}

h3 {
  font-size: 0.95rem;
  color: #1e1b4b;
  margin: 0 0 0.75rem;
}

.toggle-row {
  margin-bottom: 1rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.toggle-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.badge {
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-green { background: #d1fae5; color: #065f46; }
.badge-red   { background: #fee2e2; color: #991b1b; }

.tab-nav {
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 0;
}

.tab-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn--active {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
  font-weight: 600;
}

.tab-content {
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 6px 6px;
  background: #fff;
  min-height: 200px;
}

.props-section {
  margin-top: 1.5rem;
}

.props-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prop-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.prop-name {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 0.35rem;
}

.prop-desc {
  font-size: 0.82rem;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.prop-controls input[type='text'] {
  padding: 0.3rem 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.8rem;
  width: 250px;
  outline: none;
}

.prop-controls input[type='text']:focus {
  border-color: #4f46e5;
}

.hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-left: 0.5rem;
}

.lifecycle-note {
  margin-top: 1.5rem;
  background: #1e1b4b;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  color: #e0e7ff;
}

.lifecycle-note h3 {
  color: #a5b4fc;
  margin-bottom: 0.75rem;
}

.code-block {
  background: #0f0e2a;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.78rem;
  line-height: 1.6;
  color: #c4b5fd;
}

.note-text {
  margin: 0.75rem 0 0;
  font-size: 0.82rem;
  color: #a5b4fc;
  line-height: 1.5;
}
</style>
