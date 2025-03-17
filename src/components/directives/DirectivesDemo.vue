<script setup lang="ts">
// Custom Directives Demo
// Vue 3 directive hooks: beforeMount, mounted, updated, beforeUnmount, unmounted
// NEVER use Vue 2 hooks: bind, inserted, unbind — they are removed in Vue 3

import { ref } from 'vue'
import { vTooltip } from '../../directives/vTooltip'
import { vIntersect } from '../../directives/vIntersect'

// vFocus is registered globally in main.ts — used as v-focus in the template

// ── v-click-outside — local directive definition ────────────────────────────
// Demonstrates that directives can be defined locally in <script setup>
// by naming them with the camelCase `vXxx` convention
type ClickOutsideEl = HTMLElement & { _clickOutside?: (e: MouseEvent) => void }

const vClickOutside = {
  beforeMount(el: ClickOutsideEl, binding: { value: () => void }) {
    el._clickOutside = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el: ClickOutsideEl) {
    if (el._clickOutside) {
      document.removeEventListener('mousedown', el._clickOutside)
      delete el._clickOutside
    }
  },
}

// ── Demo state ───────────────────────────────────────────────────────────────
const tooltipText = ref('I am a tooltip!')
const dropdownOpen = ref(false)
const intersectCount = ref(0)
const showFocusInput = ref(false)

function onClickOutside() {
  dropdownOpen.value = false
}

function onIntersect() {
  intersectCount.value++
}

function toggleFocusDemo() {
  showFocusInput.value = !showFocusInput.value
}
</script>

<template>
  <div class="demo-page">
    <h2 class="demo-title">Custom Directives — v-focus, v-tooltip, v-click-outside, v-intersect</h2>
    <p class="demo-intro">
      Custom directives let you apply low-level DOM manipulation as reusable, declarative attributes.
      Vue 3 uses lifecycle-named hooks: <code>beforeMount</code>, <code>mounted</code>,
      <code>updated</code>, <code>beforeUnmount</code>, <code>unmounted</code>.
    </p>

    <div class="demo-grid">
      <!-- v-focus (global) -->
      <section class="demo-card">
        <div class="card-header">
          <code class="directive-name">v-focus</code>
          <span class="badge badge-global">Global</span>
        </div>
        <p class="demo-desc">
          Registered globally in <code>main.ts</code> via <code>app.directive('focus', vFocus)</code>.
          Calls <code>el.focus()</code> in the <code>mounted</code> hook.
        </p>
        <div class="demo-body">
          <button class="btn btn-primary" @click="toggleFocusDemo">
            {{ showFocusInput ? 'Hide' : 'Mount input with v-focus' }}
          </button>
          <div v-if="showFocusInput" class="focus-demo">
            <label class="input-label">This input is auto-focused on mount:</label>
            <!-- v-focus is the globally registered directive -->
            <input v-focus class="input" placeholder="Auto-focused via v-focus" />
          </div>
        </div>
        <pre class="code-snippet">&lt;input v-focus /&gt;
// mounted(el) { el.focus() }</pre>
      </section>

      <!-- v-tooltip -->
      <section class="demo-card">
        <div class="card-header">
          <code class="directive-name">v-tooltip</code>
          <span class="badge badge-local">Imported</span>
        </div>
        <p class="demo-desc">
          Sets <code>title</code> and <code>data-tooltip</code> attributes. Uses both
          <code>mounted</code> and <code>updated</code> hooks so it reacts to value changes.
        </p>
        <div class="demo-body">
          <input
            v-model="tooltipText"
            class="input"
            placeholder="Edit tooltip text..."
          />
          <div
            v-tooltip="tooltipText"
            class="tooltip-target"
          >
            Hover over me
            <span class="tooltip-bubble">{{ tooltipText }}</span>
          </div>
          <p class="demo-note">The directive sets data-tooltip="{{ tooltipText }}"</p>
        </div>
        <pre class="code-snippet">&lt;div v-tooltip="'My tooltip text'"&gt;
// mounted + updated: el.setAttribute('data-tooltip', value)</pre>
      </section>

      <!-- v-click-outside (local) -->
      <section class="demo-card">
        <div class="card-header">
          <code class="directive-name">v-click-outside</code>
          <span class="badge badge-local">Local</span>
        </div>
        <p class="demo-desc">
          Defined locally in <code>&lt;script setup&gt;</code> as <code>vClickOutside</code>.
          Uses <code>beforeMount</code> / <code>unmounted</code> to manage listener lifecycle.
        </p>
        <div class="demo-body">
          <div
            v-click-outside="onClickOutside"
            class="dropdown-wrapper"
          >
            <button class="btn btn-primary" @click="dropdownOpen = !dropdownOpen">
              Toggle Dropdown
            </button>
            <div v-if="dropdownOpen" class="dropdown-menu">
              <div class="dropdown-item">Option A</div>
              <div class="dropdown-item">Option B</div>
              <div class="dropdown-item">Option C</div>
            </div>
          </div>
          <p class="demo-note">Click outside the dropdown to close it.</p>
          <div class="status-badge" :class="dropdownOpen ? 'open' : 'closed'">
            Dropdown: {{ dropdownOpen ? 'open' : 'closed' }}
          </div>
        </div>
        <pre class="code-snippet">&lt;div v-click-outside="closeMenu"&gt;
// beforeMount: document.addEventListener('mousedown', handler)
// unmounted:   document.removeEventListener('mousedown', handler)</pre>
      </section>

      <!-- v-intersect -->
      <section class="demo-card">
        <div class="card-header">
          <code class="directive-name">v-intersect</code>
          <span class="badge badge-local">Imported</span>
        </div>
        <p class="demo-desc">
          Calls the bound function when the element enters the viewport.
          Uses <code>IntersectionObserver</code>, cleans up in <code>unmounted</code>.
        </p>
        <div class="demo-body">
          <div
            v-intersect="onIntersect"
            class="intersect-target"
          >
            I trigger when visible
          </div>
          <div class="label-row">
            <span class="label">Times intersected:</span>
            <code class="count">{{ intersectCount }}</code>
          </div>
          <p class="demo-note">Scroll away and back to increment the counter.</p>
        </div>
        <pre class="code-snippet">&lt;div v-intersect="onEnterViewport"&gt;
// mounted: new IntersectionObserver(cb).observe(el)
// unmounted: observer.disconnect()</pre>
      </section>
    </div>

    <!-- Hook comparison table -->
    <section class="hooks-table-section">
      <h3>Vue 2 vs Vue 3 Directive Hooks</h3>
      <div class="hooks-table">
        <div class="table-header">
          <span>Vue 2 (removed)</span>
          <span>Vue 3 (current)</span>
          <span>When it runs</span>
        </div>
        <div class="table-row danger">
          <code>bind</code>
          <code>beforeMount</code>
          <span>Before element is inserted into DOM</span>
        </div>
        <div class="table-row">
          <code>inserted</code>
          <code>mounted</code>
          <span>After element is inserted into parent DOM</span>
        </div>
        <div class="table-row">
          <code>update</code>
          <code>beforeUpdate</code>
          <span>Before component updates</span>
        </div>
        <div class="table-row">
          <code>componentUpdated</code>
          <code>updated</code>
          <span>After component and children update</span>
        </div>
        <div class="table-row danger">
          <code>unbind</code>
          <code>unmounted</code>
          <span>After element is removed from DOM</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  padding: 1.5rem;
  max-width: 960px;
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
  font-size: 0.9rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.demo-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.directive-name {
  font-size: 1rem;
  font-weight: 700;
  color: #4f46e5;
  background: #f5f3ff;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.badge {
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-global { background: #dcfce7; color: #15803d; }
.badge-local { background: #e0e7ff; color: #4338ca; }

.demo-desc {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.demo-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-note {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.code-snippet {
  background: #1e1b4b;
  color: #c4b5fd;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.72rem;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}

.btn {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover { background: #4338ca; }

.focus-demo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input-label {
  font-size: 0.8rem;
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

.tooltip-target {
  position: relative;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: default;
  font-size: 0.85rem;
  color: #374151;
}

.tooltip-bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #f9fafb;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.tooltip-target:hover .tooltip-bubble {
  opacity: 1;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-width: 150px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
}

.dropdown-item:hover { background: #f3f4f6; }

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.open { background: #dcfce7; color: #16a34a; }
.status-badge.closed { background: #fee2e2; color: #dc2626; }

.intersect-target {
  padding: 1rem;
  text-align: center;
  background: #f5f3ff;
  border: 2px solid #4f46e5;
  border-radius: 6px;
  color: #4f46e5;
  font-weight: 500;
  font-size: 0.9rem;
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
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}

.count {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4f46e5;
  background: #f5f3ff;
}

.hooks-table-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.hooks-table-section h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #374151;
}

.hooks-table {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  font-size: 0.82rem;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f3f4f6;
  align-items: center;
}

.table-row.danger {
  background: #fff7ed;
}

.table-row code:first-child {
  color: #dc2626;
  background: #fee2e2;
  text-decoration: line-through;
}
</style>
