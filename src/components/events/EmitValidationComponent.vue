<script setup lang="ts">
// EmitValidationComponent — emit validation function
// The options-style defineEmits allows a validator function per event.
// The validator receives the arguments and must return a boolean.
// NOTE: validators only run in development mode.

import { ref } from 'vue'

// Options object syntax for defineEmits — allows validation functions
const emit = defineEmits({
  // Null means no validation
  'click-happened': null,

  // Validator: only allow age between 0 and 120
  'age-updated': (age: number) => {
    if (age < 0 || age > 120) {
      console.warn(`[EmitValidationComponent] Invalid age: ${age}. Must be 0–120.`)
      return false
    }
    return true
  },

  // Validator: require a non-empty email
  'email-changed': (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValid) {
      console.warn(`[EmitValidationComponent] Invalid email: "${email}"`)
      return false
    }
    return true
  },

  // Validator: payload must have required fields
  'form-submitted': (payload: { name: string; age: number }) => {
    if (!payload.name || payload.name.trim().length < 2) {
      console.warn(`[EmitValidationComponent] name must be at least 2 characters`)
      return false
    }
    if (payload.age < 18) {
      console.warn(`[EmitValidationComponent] age must be >= 18`)
      return false
    }
    return true
  },
})

const age = ref(25)
const email = ref('user@example.com')
const name = ref('Alice')
const validationLog = ref<string[]>([])

function tryEmitAge(value: number) {
  const label = `age-updated(${value}) — ${value >= 0 && value <= 120 ? 'VALID' : 'INVALID'}`
  validationLog.value = [...validationLog.value, label]
  emit('age-updated', value)
}

function tryEmitEmail(value: string) {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const label = `email-changed("${value}") — ${valid ? 'VALID' : 'INVALID'}`
  validationLog.value = [...validationLog.value, label]
  emit('email-changed', value)
}

function tryEmitForm() {
  const payload = { name: name.value, age: age.value }
  const valid = payload.name.trim().length >= 2 && payload.age >= 18
  const label = `form-submitted({name: "${name.value}", age: ${age.value}}) — ${valid ? 'VALID' : 'INVALID'}`
  validationLog.value = [...validationLog.value, label]
  emit('form-submitted', payload)
}

function clearLog() {
  validationLog.value = []
}
</script>

<template>
  <div class="emit-validation">
    <h4>Emit Validation Component</h4>

    <div class="controls">
      <!-- Test age validator -->
      <div class="control-group">
        <label>Age (valid: 0–120)</label>
        <div class="row">
          <input v-model.number="age" type="number" class="input" />
          <button class="btn-primary" @click="tryEmitAge(age)">Emit valid age</button>
          <button class="btn-danger" @click="tryEmitAge(-5)">Emit -5 (invalid)</button>
          <button class="btn-danger" @click="tryEmitAge(200)">Emit 200 (invalid)</button>
        </div>
      </div>

      <!-- Test email validator -->
      <div class="control-group">
        <label>Email</label>
        <div class="row">
          <input v-model="email" class="input" />
          <button class="btn-primary" @click="tryEmitEmail(email)">Emit email</button>
          <button class="btn-danger" @click="tryEmitEmail('not-an-email')">
            Emit "not-an-email"
          </button>
        </div>
      </div>

      <!-- Test form validator -->
      <div class="control-group">
        <label>Name (min 2 chars) &amp; Age (min 18)</label>
        <div class="row">
          <input v-model="name" placeholder="Name" class="input" />
          <input v-model.number="age" type="number" class="input input-sm" />
          <button class="btn-primary" @click="tryEmitForm">Submit form</button>
          <button class="btn-danger" @click="tryEmitForm">Try with current values</button>
        </div>
      </div>
    </div>

    <!-- Log -->
    <div v-if="validationLog.length" class="log-panel">
      <div class="log-header">
        <strong>Emit Log</strong>
        <button class="btn-clear" @click="clearLog">Clear</button>
      </div>
      <ul class="log">
        <li
          v-for="(entry, i) in validationLog"
          :key="i"
          :class="entry.includes('INVALID') ? 'log-invalid' : 'log-valid'"
        >
          {{ entry }}
        </li>
      </ul>
    </div>

    <div class="note">
      <strong>Note:</strong> Validators only run in development mode. They warn in the console but
      do <em>not</em> prevent the event from being emitted — they're a developer hint, not a
      runtime block. For runtime blocking, handle it in the emitting logic itself.
    </div>
  </div>
</template>

<style scoped>
.emit-validation {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0.75rem 0;
}

.control-group {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
}

.control-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: #374151;
}

.row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  align-items: center;
}

.input {
  padding: 0.3rem 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.85rem;
  flex: 1;
  min-width: 120px;
}

.input-sm {
  max-width: 80px;
  flex: 0 0 80px;
}

.btn-primary {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.log-panel {
  background: #1f2937;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0.75rem 0;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f3f4f6;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.btn-clear {
  background: transparent;
  color: #9ca3af;
  border: 1px solid #4b5563;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.log {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: monospace;
  font-size: 0.78rem;
}

.log-valid {
  color: #6ee7b7;
  padding: 0.15rem 0;
}

.log-invalid {
  color: #fca5a5;
  padding: 0.15rem 0;
}

.note {
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 0 4px 4px 0;
}
</style>
