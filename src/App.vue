<script setup lang="ts">
// Vue 3.5 Composition Masterclass
// Actes 1–4: ref, reactive, computed, watch, lifecycle, script setup, props destructure,
//            template refs, form bindings, event handling,
//            component registration, props, events, v-model, attrs, slots, provide/inject, async

import { ref, shallowRef } from 'vue'

// Acte 1–3 demos
import RefDemo from './components/RefDemo.vue'
import ReactiveDemo from './components/ReactiveDemo.vue'
import ComputedDemo from './components/ComputedDemo.vue'
import WatchDemo from './components/WatchDemo.vue'
import LifecycleDemo from './components/LifecycleDemo.vue'
import ScriptSetupDemo from './components/ScriptSetupDemo.vue'
import PropsDestructureDemo from './components/PropsDestructureDemo.vue'
import TemplateRefDemo from './components/TemplateRefDemo.vue'
import ContactForm from './components/ContactForm.vue'
import KeyboardShortcuts from './components/KeyboardShortcuts.vue'

// Acte 4 demos
import RegistrationDemo from './components/registration/RegistrationDemo.vue'
import PropsDemo from './components/props/PropsDemo.vue'
import EventsDemo from './components/events/EventsDemo.vue'
import VModelDemo from './components/vmodel/VModelDemo.vue'
import AttrsDemo from './components/attrs/AttrsDemo.vue'
import SlotsDemo from './components/slots/SlotsDemo.vue'
import ProvideInjectDemo from './components/provide-inject/ProvideInjectDemo.vue'
import AsyncComponentsDemo from './components/async/AsyncComponentsDemo.vue'

interface NavItem {
  id: string
  label: string
  acte: number
  component: ReturnType<typeof shallowRef>['value']
}

const navItems: NavItem[] = [
  // Acte 1: Reactivity
  { id: 'ref', label: 'ref()', acte: 1, component: RefDemo },
  { id: 'reactive', label: 'reactive()', acte: 1, component: ReactiveDemo },
  { id: 'computed', label: 'computed()', acte: 1, component: ComputedDemo },
  { id: 'watch', label: 'watch()', acte: 1, component: WatchDemo },
  // Acte 2: Composition API
  { id: 'lifecycle', label: 'Lifecycle', acte: 2, component: LifecycleDemo },
  { id: 'script-setup', label: '<script setup>', acte: 2, component: ScriptSetupDemo },
  { id: 'props-destructure', label: 'Props Destructure', acte: 2, component: PropsDestructureDemo },
  { id: 'template-ref', label: 'Template Refs', acte: 2, component: TemplateRefDemo },
  // Acte 3: Templates
  { id: 'contact-form', label: 'Form Bindings', acte: 3, component: ContactForm },
  { id: 'keyboard', label: 'Event Handling', acte: 3, component: KeyboardShortcuts },
  // Acte 4: Components in Depth
  { id: 'registration', label: 'Registration', acte: 4, component: RegistrationDemo },
  { id: 'props', label: 'Props', acte: 4, component: PropsDemo },
  { id: 'events', label: 'Events', acte: 4, component: EventsDemo },
  { id: 'vmodel', label: 'v-model', acte: 4, component: VModelDemo },
  { id: 'attrs', label: '$attrs', acte: 4, component: AttrsDemo },
  { id: 'slots', label: 'Slots', acte: 4, component: SlotsDemo },
  { id: 'provide-inject', label: 'Provide/Inject', acte: 4, component: ProvideInjectDemo },
  { id: 'async', label: 'Async', acte: 4, component: AsyncComponentsDemo },
]

const acteLabels: Record<number, string> = {
  1: 'Acte 1 — Reactivity Core',
  2: 'Acte 2 — Composition API',
  3: 'Acte 3 — Templates',
  4: 'Acte 4 — Components en Profondeur',
}

const actes = [1, 2, 3, 4]

const activeId = ref('registration')

const activeComponent = ref(
  navItems.find((n) => n.id === activeId.value)?.component ?? RegistrationDemo,
)

function navigate(item: NavItem) {
  activeId.value = item.id
  activeComponent.value = item.component
}

function itemsByActe(acte: number): NavItem[] {
  return navItems.filter((n) => n.acte === acte)
}
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>Vue 3.5 Composition Masterclass</h1>
      <p class="subtitle">ref · reactive · computed · watch · lifecycle · components</p>
    </header>

    <div class="app-layout">
      <!-- ===== Sidebar Navigation ===== -->
      <nav class="sidebar">
        <div v-for="acte in actes" :key="acte" class="nav-group">
          <div class="nav-group-label">{{ acteLabels[acte] }}</div>
          <button
            v-for="item in itemsByActe(acte)"
            :key="item.id"
            :class="['nav-item', activeId === item.id ? 'nav-item--active' : '']"
            @click="navigate(item)"
          >
            {{ item.label }}
          </button>
        </div>
      </nav>

      <!-- ===== Main Content ===== -->
      <main class="main-content">
        <component :is="activeComponent" />
      </main>
    </div>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #f9fafb;
  color: #111827;
}
</style>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #1e1b4b;
  color: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid #4f46e5;
}

.app-header h1 {
  margin: 0 0 0.15rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 0.8rem;
  color: #a5b4fc;
}

.app-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 0.75rem 0;
}

.nav-group {
  margin-bottom: 0.5rem;
}

.nav-group-label {
  padding: 0.35rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}

.nav-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.85rem 0.4rem 1.1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  color: #374151;
  transition: background 0.1s, color 0.1s;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.nav-item--active {
  background: #ede9fe;
  color: #4f46e5;
  font-weight: 600;
  border-left: 3px solid #4f46e5;
  padding-left: calc(1.1rem - 3px);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: #f9fafb;
}
</style>
