<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)

function handleSubmit() {
  if (name.value && email.value) {
    submitted.value = true
  }
}

function reset() {
  name.value = ''
  email.value = ''
  message.value = ''
  submitted.value = false
}
</script>

<template>
  <div class="form-tab">
    <h4>Form Tab</h4>
    <p class="tab-note">
      Switch to another tab and come back. With KeepAlive, your input is preserved.
      Without KeepAlive, all fields are cleared.
    </p>

    <div v-if="submitted" class="success-banner">
      <strong>Submitted!</strong> Name: {{ name }}, Email: {{ email }}
      <button class="btn btn-ghost" style="margin-left: 1rem" @click="reset">Reset</button>
    </div>

    <form v-else class="form" @submit.prevent="handleSubmit">
      <div class="form-field">
        <label>Name</label>
        <input v-model="name" type="text" placeholder="Your name" required />
      </div>
      <div class="form-field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="your@email.com" required />
      </div>
      <div class="form-field">
        <label>Message (optional)</label>
        <textarea v-model="message" placeholder="Type something..." rows="3" />
      </div>
      <button class="btn btn-primary" type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.form-tab {
  padding: 1rem;
}

h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #1e1b4b;
}

.tab-note {
  font-size: 0.82rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

input,
textarea {
  padding: 0.45rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: #4f46e5;
}

.btn {
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  align-self: flex-start;
}

.btn:hover { opacity: 0.85; }
.btn-primary { background: #4f46e5; color: #fff; }
.btn-ghost { background: #e5e7eb; color: #374151; }

.success-banner {
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #065f46;
  display: flex;
  align-items: center;
}
</style>
