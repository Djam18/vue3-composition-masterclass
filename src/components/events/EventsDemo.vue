<script setup lang="ts">
// EventsDemo — parent component showing all event patterns

import TypedEmitsComponent from './TypedEmitsComponent.vue'
import EmitValidationComponent from './EmitValidationComponent.vue'
import { ref } from 'vue'

interface EventEntry {
  event: string
  payload: unknown
  time: string
}

const eventLog = ref<EventEntry[]>([])

function logEvent(event: string, payload: unknown = null) {
  eventLog.value = [
    {
      event,
      payload,
      time: new Date().toLocaleTimeString(),
    },
    ...eventLog.value,
  ].slice(0, 20)
}

function clearLog() {
  eventLog.value = []
}
</script>

<template>
  <div class="events-demo">
    <h2>Component Events</h2>

    <p class="intro">
      Child components communicate with parents by emitting custom events. Vue 3 provides
      <code>defineEmits()</code> with TypeScript support via the generic syntax. Events should be
      named in camelCase in <code>defineEmits</code> and listened to with kebab-case in templates.
    </p>

    <!-- ===== Section 1: Typed Emits ===== -->
    <section class="section">
      <h3>1. Typed Emits (TypeScript tuple syntax)</h3>
      <p>
        <code>defineEmits&lt;&#123; 'event-name': [arg1: Type, ...] &#125;&gt;()</code>
      </p>

      <TypedEmitsComponent
        @reset="logEvent('reset')"
        @search="(q) => logEvent('search', q)"
        @item-selected="(id, label) => logEvent('item-selected', { id, label })"
        @submit="(payload) => logEvent('submit', payload)"
      />
    </section>

    <!-- ===== Section 2: Emit Validation ===== -->
    <section class="section">
      <h3>2. Emit Validation (options object syntax)</h3>
      <p>
        <code>defineEmits(&#123; event: (arg) =&gt; boolean &#125;)</code> — validator function
        returns <code>true</code> if valid.
      </p>

      <EmitValidationComponent
        @click-happened="logEvent('click-happened')"
        @age-updated="(age) => logEvent('age-updated', age)"
        @email-changed="(email) => logEvent('email-changed', email)"
        @form-submitted="(payload) => logEvent('form-submitted', payload)"
      />
    </section>

    <!-- ===== Event Log ===== -->
    <section v-if="eventLog.length" class="section log-section">
      <div class="log-header">
        <h3>Event Log (parent received)</h3>
        <button class="btn-clear" @click="clearLog">Clear</button>
      </div>
      <table class="log-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, i) in eventLog" :key="i">
            <td class="time-cell">{{ entry.time }}</td>
            <td>
              <code class="event-name">{{ entry.event }}</code>
            </td>
            <td>
              <code class="payload">{{ JSON.stringify(entry.payload) }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- ===== Reference ===== -->
    <section class="section">
      <h3>Key Concepts</h3>
      <ul class="concept-list">
        <li>
          <strong>Naming:</strong> Events are declared in camelCase
          (<code>itemSelected</code>) but listened to in kebab-case (<code>@item-selected</code>)
        </li>
        <li>
          <strong>Typed tuple syntax:</strong> TypeScript-first, provides full type checking on
          both emit call and listener. Recommended for Vue 3.3+.
        </li>
        <li>
          <strong>Options object syntax:</strong> Allows runtime validation functions. Used when
          you need to validate payload at runtime in development.
        </li>
        <li>
          <strong>v-model:</strong> A special two-way binding shorthand built on top of props +
          events. Covered in the next section.
        </li>
        <li>
          <strong>$listeners removed:</strong> In Vue 3, listeners are merged into
          <code>$attrs</code>. Use <code>v-bind="$attrs"</code> to forward all attributes
          including event listeners.
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.events-demo {
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

.log-section {
  background: #0f172a;
  border-color: #1e293b;
}

.log-section h3 {
  color: #e2e8f0;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.btn-clear {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.log-table th,
.log-table td {
  border: 1px solid #1e293b;
  padding: 0.35rem 0.6rem;
  text-align: left;
}

.log-table th {
  background: #1e293b;
  color: #94a3b8;
  font-weight: 600;
}

.log-table td {
  color: #e2e8f0;
}

.time-cell {
  color: #64748b;
  font-size: 0.75rem;
}

.event-name {
  color: #38bdf8;
  font-family: monospace;
  font-size: 0.8rem;
}

.payload {
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.75rem;
  word-break: break-all;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.log-section code {
  background: transparent;
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
</style>
