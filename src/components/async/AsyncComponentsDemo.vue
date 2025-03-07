<script setup lang="ts">
// AsyncComponentsDemo — defineAsyncComponent + Suspense with fallback/error states
//
// defineAsyncComponent() is the REQUIRED way to create async components:
//   - Supports loading fallback, error state, delay, timeout
//   - Works with top-level await SFCs (via <Suspense>)
//   - NOT the shorthand: component: () => import('./Foo.vue') — that has no options
//
// <Suspense> coordinates async children:
//   - #default slot: shown when async component is ready
//   - #fallback slot: shown while loading

import { defineAsyncComponent, ref } from 'vue'

// 1. Basic async component — no options
const AsyncHeavyChart = defineAsyncComponent(
  () => import('./HeavyChart.vue'),
  // No options — just returns the import promise
)

// 2. Async component with full options
const AsyncHeavyChartWithOptions = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),

  // Show a loading component while the async component loads
  loadingComponent: {
    template: `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading chart data...</p>
      </div>
    `,
  },

  // Show this if the loader throws
  errorComponent: {
    template: `
      <div class="error-state">
        <p>Failed to load the chart. Please refresh.</p>
      </div>
    `,
  },

  // Delay before showing loading component (prevents flash on fast connections)
  delay: 200,

  // Timeout — if component hasn't loaded after this, show error
  timeout: 10000,

  // Called when loading fails
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      console.warn(`[AsyncComponentsDemo] Retrying load (attempt ${attempts})...`)
      retry()
    } else {
      fail()
    }
  },
})

// Control state
const showBasic = ref(false)
const showAdvanced = ref(false)
const showKey = ref(0) // increment to force re-mount (re-triggers Suspense)

function reload() {
  showKey.value++
}
</script>

<template>
  <div class="async-demo">
    <h2>Async Components</h2>

    <p class="intro">
      <code>defineAsyncComponent()</code> lets you lazy-load components — they're only fetched from
      the server when needed. Combined with <code>&lt;Suspense&gt;</code>, you can show a loading
      state while the component and its async setup resolves.
    </p>

    <!-- ===== Section 1: Basic defineAsyncComponent ===== -->
    <section class="section">
      <h3>1. Basic defineAsyncComponent</h3>
      <p>The component bundle is only downloaded when it's first rendered.</p>

      <div class="controls">
        <button class="btn-primary" @click="showBasic = !showBasic">
          {{ showBasic ? 'Hide' : 'Show' }} Chart
        </button>
      </div>

      <!--
        <Suspense> is required to coordinate async components.
        Without it, Vue throws a warning.
        #fallback content shows while the async component is setting up.
      -->
      <Suspense v-if="showBasic">
        <template #default>
          <AsyncHeavyChart />
        </template>
        <template #fallback>
          <div class="suspense-fallback">
            <div class="spinner-large"></div>
            <p>Suspense fallback — waiting for AsyncHeavyChart...</p>
          </div>
        </template>
      </Suspense>
    </section>

    <!-- ===== Section 2: defineAsyncComponent with options ===== -->
    <section class="section">
      <h3>2. defineAsyncComponent with Full Options</h3>
      <p>
        Includes <code>loadingComponent</code>, <code>errorComponent</code>,
        <code>delay</code>, <code>timeout</code>, and retry logic via <code>onError</code>.
      </p>

      <div class="controls">
        <button class="btn-primary" @click="showAdvanced = !showAdvanced">
          {{ showAdvanced ? 'Hide' : 'Show' }} Chart (with options)
        </button>
        <button class="btn-secondary" @click="reload">Reload (re-trigger Suspense)</button>
      </div>

      <!--
        :key="showKey" forces the Suspense boundary to remount,
        re-triggering the fallback and re-running the async setup.
      -->
      <Suspense v-if="showAdvanced" :key="showKey">
        <template #default>
          <AsyncHeavyChartWithOptions />
        </template>
        <template #fallback>
          <div class="suspense-fallback">
            <div class="spinner-large"></div>
            <p>Loading — the loadingComponent also shows inside async component itself...</p>
          </div>
        </template>
      </Suspense>
    </section>

    <!-- ===== Section 3: How it works ===== -->
    <section class="section">
      <h3>How Suspense + defineAsyncComponent Work Together</h3>

      <div class="flow-diagram">
        <div class="flow-step">
          <span class="step-num">1</span>
          <p>Component first rendered → async component bundle not yet downloaded</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <span class="step-num">2</span>
          <p>Suspense shows <code>#fallback</code> slot while waiting</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <span class="step-num">3</span>
          <p>Bundle loads AND async setup() / top-level await completes</p>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <span class="step-num">4</span>
          <p>Suspense swaps to <code>#default</code> slot — component renders</p>
        </div>
      </div>

      <div class="code-block">
        <pre>
// defineAsyncComponent with options
const AsyncChart = defineAsyncComponent(&#123;
  loader: () =&gt; import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorState,
  delay: 200,      // wait 200ms before showing loadingComponent
  timeout: 10000,  // fail after 10s
  onError(error, retry, fail, attempts) &#123;
    attempts &lt;= 3 ? retry() : fail()
  &#125;,
&#125;)

// Template
&lt;Suspense&gt;
  &lt;template #default&gt;
    &lt;AsyncChart /&gt;
  &lt;/template&gt;
  &lt;template #fallback&gt;
    &lt;p&gt;Loading...&lt;/p&gt;
  &lt;/template&gt;
&lt;/Suspense&gt;</pre
        >
      </div>
    </section>

    <!-- ===== Section 4: Key concepts ===== -->
    <section class="section">
      <h3>Key Concepts</h3>
      <table class="comparison">
        <thead>
          <tr>
            <th>Concept</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>defineAsyncComponent()</strong></td>
            <td>
              Required for async components with options (loading, error, timeout). Use
              <code>() =&gt; import()</code> only for the loader, not as the component itself.
            </td>
          </tr>
          <tr>
            <td><strong>Top-level await</strong></td>
            <td>
              Any <code>&lt;script setup&gt;</code> with a top-level <code>await</code> is
              automatically async. Requires <code>&lt;Suspense&gt;</code> in the parent.
            </td>
          </tr>
          <tr>
            <td><strong>&lt;Suspense&gt;</strong></td>
            <td>
              Coordinates multiple async children. Shows <code>#fallback</code> until ALL async
              children in <code>#default</code> are ready.
            </td>
          </tr>
          <tr>
            <td><strong>delay option</strong></td>
            <td>
              Prevents loading flash on fast connections. The loading component only shows after
              the delay elapses.
            </td>
          </tr>
          <tr>
            <td><strong>onError + retry</strong></td>
            <td>Allows implementing automatic retry logic for failed component loads.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.async-demo {
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

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.4rem 0.85rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
}

.btn-secondary {
  background: #6b7280;
  color: #fff;
  border: none;
  padding: 0.4rem 0.85rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.suspense-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px dashed #d1d5db;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #6b7280;
}

.error-state {
  padding: 1rem;
  background: #fee2e2;
  border-radius: 6px;
  color: #dc2626;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.spinner-large {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.flow-diagram {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 0.75rem 0;
}

.flow-step {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  flex: 1;
  min-width: 160px;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.step-num {
  background: #4f46e5;
  color: #fff;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

.flow-step p {
  margin: 0;
  font-size: 0.78rem;
  color: #374151;
}

.flow-arrow {
  color: #9ca3af;
  font-size: 1.25rem;
}

.code-block {
  background: #1f2937;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  overflow-x: auto;
}

.code-block pre {
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.76rem;
  margin: 0;
  white-space: pre-wrap;
}

.comparison {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  margin-top: 0.75rem;
}

.comparison th,
.comparison td {
  border: 1px solid #e5e7eb;
  padding: 0.45rem 0.65rem;
  text-align: left;
}

.comparison th {
  background: #f3f4f6;
  font-weight: 600;
}
</style>
