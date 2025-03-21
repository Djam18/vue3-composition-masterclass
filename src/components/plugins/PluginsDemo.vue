<script setup lang="ts">
// Plugins Demo — install pattern, global registration
// Plugin shape: { install(app, options) { ... } }
// NEVER Vue.use() global pattern — that is Vue 2 only

import { inject, ref } from 'vue'
import { useToast } from '../../composables/useToast'

// ── i18n plugin — consumed via inject ────────────────────────────────────────
// I18nPlugin.install() provides 'i18n' at the app level
interface I18n { t: (key: string) => string; locale: string }
const i18n = inject<I18n>('i18n')!

// ── toast plugin — consumed via useToast composable ─────────────────────────
const toast = useToast()

// Demo state
const currentLocale = ref(i18n.locale)
const greetingKey = ref<'greeting' | 'farewell' | 'counter'>('greeting')

function showToast(type: 'success' | 'error' | 'info') {
  const msgs = {
    success: 'Operation completed successfully!',
    error: 'Something went wrong. Please retry.',
    info: 'Here is some useful information.',
  }
  toast.show(msgs[type], type)
}
</script>

<template>
  <div class="demo-page">
    <h2 class="demo-title">Plugins — Install Pattern & Global Registration</h2>
    <p class="demo-intro">
      Plugins add app-level functionality. They follow the
      <code>{ install(app, options) { ... } }</code> shape. Installed with
      <code>app.use(plugin, options)</code> in <code>main.ts</code>.
    </p>

    <div class="demo-grid">
      <!-- I18n Plugin -->
      <section class="demo-card">
        <div class="card-header">
          <span class="plugin-name">I18nPlugin</span>
          <span class="badge">app.provide('i18n', ...)</span>
        </div>
        <p class="demo-desc">
          Installed as <code>app.use(I18nPlugin, &lbrace; locale: 'fr' &rbrace;)</code>.
          Provides a translation function via <code>app.provide</code> and adds
          <code>$t</code> to <code>app.config.globalProperties</code>.
        </p>

        <div class="demo-body">
          <div class="locale-badge">
            Active locale: <strong>{{ currentLocale }}</strong>
          </div>

          <div class="key-selector">
            <span class="label">Select key:</span>
            <div class="btn-group">
              <button
                v-for="key in ['greeting', 'farewell', 'counter'] as const"
                :key="key"
                class="btn btn-sm"
                :class="{ active: greetingKey === key }"
                @click="greetingKey = key"
              >
                {{ key }}
              </button>
            </div>
          </div>

          <div class="translation-result">
            <div class="translation-row">
              <span class="t-label">Key:</span>
              <code>{{ greetingKey }}</code>
            </div>
            <div class="translation-row">
              <span class="t-label">Translated:</span>
              <strong class="t-value">{{ i18n.t(greetingKey) }}</strong>
            </div>
          </div>
        </div>

        <pre class="code-snippet">// main.ts
app.use(I18nPlugin, { locale: 'fr' })

// In component:
const i18n = inject&lt;I18n&gt;('i18n')!
i18n.t('greeting') // → 'Bonjour'</pre>
      </section>

      <!-- Toast Plugin -->
      <section class="demo-card">
        <div class="card-header">
          <span class="plugin-name">ToastPlugin</span>
          <span class="badge">InjectionKey&lt;ToastAPI&gt;</span>
        </div>
        <p class="demo-desc">
          Installed as <code>app.use(ToastPlugin)</code>. Uses a typed
          <code>InjectionKey&lt;ToastAPI&gt;</code> for type-safe injection.
          Consumed via the <code>useToast()</code> composable.
        </p>

        <div class="demo-body">
          <div class="btn-row">
            <button class="btn btn-success" @click="showToast('success')">
              Success Toast
            </button>
            <button class="btn btn-danger" @click="showToast('error')">
              Error Toast
            </button>
            <button class="btn btn-info" @click="showToast('info')">
              Info Toast
            </button>
          </div>
          <p class="demo-note">Toasts auto-dismiss after 3 seconds.</p>
        </div>

        <pre class="code-snippet">// main.ts
app.use(ToastPlugin)

// In component:
const toast = useToast() // composable wraps inject(ToastKey)
toast.show('Hello!', 'success')</pre>
      </section>
    </div>

    <!-- Plugin anatomy -->
    <section class="anatomy-section">
      <h3>Plugin Anatomy</h3>
      <div class="anatomy-grid">
        <div class="anatomy-block">
          <div class="anatomy-label">Minimal plugin</div>
          <pre class="code-block">// Simplest possible plugin
export const MyPlugin = {
  install(app: App) {
    app.config.globalProperties.$hello = 'world'
    app.provide('myKey', someValue)
    app.component('MyComp', MyComponent)
    app.directive('my-dir', myDirective)
  }
}</pre>
        </div>
        <div class="anatomy-block">
          <div class="anatomy-label">Plugin with options</div>
          <pre class="code-block">// Plugin that accepts options
export const ConfigurablePlugin = {
  install(app: App, options: { debug: boolean }) {
    const debug = options.debug ?? false

    app.provide('pluginConfig', {
      debug,
      log: (msg: string) => {
        if (debug) console.log('[Plugin]', msg)
      }
    })
  }
}

// Usage in main.ts:
app.use(ConfigurablePlugin, { debug: true })</pre>
        </div>
      </div>
    </section>

    <!-- Toast container — rendered at the bottom of the page -->
    <Teleport to="body">
      <div class="toast-container">
        <TransitionGroup name="toast" tag="div">
          <div
            v-for="msg in toast.messages.value"
            :key="msg.id"
            class="toast-message"
            :class="`toast-${msg.type}`"
          >
            {{ msg.text }}
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
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
  font-size: 0.9rem;
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
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.plugin-name {
  font-size: 1rem;
  font-weight: 700;
  color: #7c3aed;
  background: #f5f3ff;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.badge {
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #e0e7ff;
  color: #4338ca;
}

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

.locale-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #374151;
}

.key-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.label {
  font-size: 0.8rem;
  color: #6b7280;
}

.btn-group {
  display: flex;
  gap: 0.25rem;
}

.btn {
  padding: 0.35rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.82rem;
  color: #374151;
  transition: all 0.15s;
}

.btn.active,
.btn:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
}

.btn-sm { padding: 0.25rem 0.5rem; }

.translation-result {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
}

.translation-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.t-label {
  color: #6b7280;
  min-width: 80px;
  font-size: 0.8rem;
}

.t-value {
  color: #4f46e5;
  font-size: 1.1rem;
}

.btn-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-success {
  background: #16a34a;
  color: #fff;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-success:hover { background: #15803d; }

.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-danger:hover { background: #b91c1c; }

.btn-info {
  background: #0284c7;
  color: #fff;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-info:hover { background: #0369a1; }

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

.anatomy-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.anatomy-section h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #374151;
}

.anatomy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 700px) {
  .anatomy-grid { grid-template-columns: 1fr; }
}

.anatomy-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-block {
  background: #1e1b4b;
  color: #c4b5fd;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.72rem;
  line-height: 1.55;
  overflow-x: auto;
  margin: 0;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}

/* Toast styles */
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast-message {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  pointer-events: auto;
}

.toast-success { background: #dcfce7; color: #15803d; border-left: 4px solid #16a34a; }
.toast-error   { background: #fee2e2; color: #b91c1c; border-left: 4px solid #dc2626; }
.toast-info    { background: #e0f2fe; color: #0369a1; border-left: 4px solid #0284c7; }

.toast-enter-from { opacity: 0; transform: translateY(0.5rem); }
.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-to { opacity: 0; transform: translateY(0.5rem); }
.toast-leave-active { transition: all 0.25s ease; }
</style>
