<script setup lang="ts">
import { ref, computed } from 'vue'

// ─── Form state ───────────────────────────────────────────────────────────────

// Text input — basic v-model
const name = ref<string>('')

// .trim modifier — auto-trims whitespace on sync
const email = ref<string>('')

// .lazy modifier — syncs on 'change' event (blur/enter), not on every keystroke
const bio = ref<string>('')

// .number modifier — auto-casts to number via parseFloat
const age = ref<number | null>(null)

// Checkbox — boolean binding
const acceptTerms = ref<boolean>(false)

// Multiple checkboxes sharing array state
const selectedTopics = ref<string[]>([])

// Radio — string binding
const experience = ref<string>('')

// Select — single string binding
const country = ref<string>('')

// Select multiple — array binding
const languages = ref<string[]>([])

// Textarea — same as text input
const message = ref<string>('')

// ─── Computed ────────────────────────────────────────────────────────────────
const isValid = computed<boolean>(() =>
  name.value.trim().length > 0 &&
  email.value.includes('@') &&
  acceptTerms.value,
)

const formSummary = computed(() => ({
  name: name.value,
  email: email.value,
  bio: bio.value,
  age: age.value,
  acceptTerms: acceptTerms.value,
  selectedTopics: selectedTopics.value,
  experience: experience.value,
  country: country.value,
  languages: languages.value,
  message: message.value,
}))

const submitted = ref<boolean>(false)

function submitForm() {
  if (!isValid.value) return
  submitted.value = true
}

function resetForm() {
  name.value = ''
  email.value = ''
  bio.value = ''
  age.value = null
  acceptTerms.value = false
  selectedTopics.value = []
  experience.value = ''
  country.value = ''
  languages.value = []
  message.value = ''
  submitted.value = false
}

// ─── defineModel demo ─────────────────────────────────────────────────────────
// This component also accepts an external v-model for the name field
// demonstrating how defineModel replaces the old value/input pattern
const externalName = defineModel<string>('externalName', { default: '' })
</script>

<template>
  <div class="contact-form">
    <h2>Form Bindings — v-model Modifiers, All Input Types</h2>

    <div v-if="submitted" class="success">
      <h3>Form submitted!</h3>
      <pre>{{ JSON.stringify(formSummary, null, 2) }}</pre>
      <button @click="resetForm">Reset</button>
    </div>

    <form v-else @submit.prevent="submitForm" novalidate>
      <!-- Text input — basic v-model -->
      <div class="field">
        <label>Name *</label>
        <input v-model="name" type="text" placeholder="Your name" />
        <span class="hint">v-model — syncs on every input event</span>
      </div>

      <!-- .lazy — syncs on change (blur/enter), not on every keystroke -->
      <div class="field">
        <label>Email * <code>.lazy</code></label>
        <input v-model.lazy="email" type="email" placeholder="your@email.com" />
        <span class="hint">v-model.lazy — syncs on blur/enter, not on every keystroke</span>
      </div>

      <!-- .number — auto-cast to number -->
      <div class="field">
        <label>Age <code>.number</code></label>
        <input v-model.number="age" type="number" min="0" max="120" placeholder="25" />
        <span class="hint">v-model.number — value is a Number, not a String (uses parseFloat)</span>
      </div>

      <!-- .trim — auto-strip leading/trailing whitespace -->
      <div class="field">
        <label>Bio <code>.trim</code></label>
        <input v-model.trim="bio" type="text" placeholder="Short bio..." />
        <span class="hint">v-model.trim — whitespace stripped on sync</span>
      </div>

      <!-- Textarea — same API as text input -->
      <div class="field">
        <label>Message</label>
        <textarea v-model="message" placeholder="Your message..." rows="3" />
        <span class="hint">textarea — v-model works exactly like input[type=text]</span>
      </div>

      <!-- Checkbox — boolean -->
      <div class="field">
        <label>
          <input v-model="acceptTerms" type="checkbox" />
          I accept the terms and conditions *
        </label>
        <span class="hint">checkbox — boolean binding (true/false)</span>
      </div>

      <!-- Multiple checkboxes — array binding -->
      <div class="field">
        <label>Topics of interest</label>
        <div class="checkbox-group">
          <label v-for="topic in ['Vue', 'TypeScript', 'Vite', 'Testing', 'SSR']" :key="topic">
            <input v-model="selectedTopics" type="checkbox" :value="topic" />
            {{ topic }}
          </label>
        </div>
        <span class="hint">multiple checkboxes sharing v-model array — value added/removed automatically</span>
      </div>

      <!-- Radio — string binding -->
      <div class="field">
        <label>Experience level</label>
        <div class="radio-group">
          <label v-for="level in ['Beginner', 'Intermediate', 'Advanced']" :key="level">
            <input v-model="experience" type="radio" :value="level" />
            {{ level }}
          </label>
        </div>
        <span class="hint">radio — string binding (only one selected at a time)</span>
      </div>

      <!-- Select — single -->
      <div class="field">
        <label>Country</label>
        <select v-model="country">
          <option value="">— Select —</option>
          <option value="fr">France</option>
          <option value="de">Germany</option>
          <option value="us">United States</option>
          <option value="jp">Japan</option>
        </select>
        <span class="hint">select — string binding</span>
      </div>

      <!-- Select multiple — array binding -->
      <div class="field">
        <label>Languages</label>
        <select v-model="languages" multiple size="4">
          <option value="ts">TypeScript</option>
          <option value="py">Python</option>
          <option value="rs">Rust</option>
          <option value="go">Go</option>
        </select>
        <span class="hint">select[multiple] — array binding (hold Ctrl/Cmd to select multiple)</span>
      </div>

      <!-- defineModel external binding -->
      <div class="field">
        <label>External name binding <code>(defineModel)</code></label>
        <input v-model="externalName" type="text" placeholder="bound via defineModel..." />
        <span class="hint">defineModel — replaces the value prop + update:modelValue emit pattern</span>
      </div>

      <div class="submit-row">
        <button type="submit" :disabled="!isValid">Submit</button>
        <button type="button" @click="resetForm">Reset</button>
        <span v-if="!isValid" class="invalid-hint">Fill name, email, and accept terms</span>
      </div>
    </form>

    <!-- Live preview -->
    <div class="preview">
      <h3>Live state</h3>
      <div class="preview-grid">
        <span>name:</span><span>{{ name || '—' }}</span>
        <span>email:</span><span>{{ email || '—' }}</span>
        <span>age:</span><span>{{ age ?? '—' }}</span>
        <span>topics:</span><span>{{ selectedTopics.join(', ') || '—' }}</span>
        <span>experience:</span><span>{{ experience || '—' }}</span>
        <span>country:</span><span>{{ country || '—' }}</span>
        <span>languages:</span><span>{{ languages.join(', ') || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-form {
  padding: 1rem;
  max-width: 640px;
}

h2 {
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.hint {
  font-size: 0.75rem;
  color: #888;
  font-style: italic;
}

input[type='text'],
input[type='email'],
input[type='number'],
textarea,
select {
  padding: 0.35rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
}

select[multiple] {
  padding: 0.2rem;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.checkbox-group label,
.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: normal;
  font-size: 0.9rem;
  cursor: pointer;
}

.submit-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

button {
  padding: 0.4rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button[type='submit'] {
  background: #42b883;
  color: white;
  border-color: #42b883;
}

button[type='submit']:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invalid-hint {
  font-size: 0.8rem;
  color: #e74c3c;
}

.preview {
  margin-top: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  background: #f9f9f9;
}

.preview h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

.preview-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.2rem 0.5rem;
  font-size: 0.85rem;
}

.preview-grid span:nth-child(odd) {
  color: #888;
  font-weight: 600;
}

.success {
  background: #e8f5e9;
  border: 1px solid #81c784;
  border-radius: 6px;
  padding: 1rem;
}

.success pre {
  font-size: 0.78rem;
  overflow-x: auto;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.85em;
}
</style>
