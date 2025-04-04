<script setup lang="ts">
// Teleport — render a component's DOM outside its parent tree
// Key concepts:
//   - <Teleport to="..."> moves template content to a different DOM location
//   - The component still belongs logically to its parent (props, events, context work normally)
//   - :disabled="true" reverts to inline rendering (useful for SSR or conditional layout)
//   - Multiple teleports to the same target are appended in DOM order
//   - Vue 3.5: <Teleport defer> allows teleporting to elements rendered by Vue itself
//             (defers until after the render cycle, so the target may not exist yet in SSR)
import { ref } from 'vue'

const showModal = ref(false)
const showToast = ref(false)
const isInline = ref(false)
const toastMessage = ref('Hello from a Teleport toast!')

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function triggerToast() {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<template>
  <div class="demo-container">
    <h2>Teleport — Render Outside Component Tree</h2>

    <!-- Toggle: teleported vs inline -->
    <div class="toggle-row">
      <label class="toggle-label">
        <input v-model="isInline" type="checkbox" />
        Disable Teleport (render inline)
        <span v-if="isInline" class="badge badge-orange">Inline — inside component tree</span>
        <span v-else class="badge badge-blue">Teleported — in &lt;body&gt; / #toast-container</span>
      </label>
    </div>

    <!-- Demo 1: Modal teleported to body -->
    <div class="demo-section">
      <h3>Demo 1 — Modal via <code>&lt;Teleport to="body"&gt;</code></h3>
      <p class="demo-desc">
        The modal overlay renders directly inside <code>&lt;body&gt;</code>, outside this component's
        DOM subtree. This avoids z-index and overflow issues caused by ancestor elements.
      </p>
      <button class="btn btn-primary" @click="openModal">Open Modal</button>

      <!--
        Teleport to="body": the modal DOM is injected as a direct child of <body>
        :disabled="isInline": when true, renders inline as a regular child (no teleport)
      -->
      <Teleport to="body" :disabled="isInline">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-box">
            <div class="modal-header">
              <h4>Modal (Teleported to &lt;body&gt;)</h4>
              <button class="close-btn" @click="closeModal">x</button>
            </div>
            <div class="modal-body">
              <p>
                This modal is rendered as a direct child of <code>&lt;body&gt;</code>,
                not inside <code>#app</code>.
              </p>
              <p>
                Inspect the DOM — you will see this element outside the <code>#app</code> div
                when Teleport is enabled.
              </p>
              <p v-if="isInline" style="color: #b45309; font-weight: 600;">
                Teleport is currently DISABLED — this modal is rendering inline.
              </p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- Demo 2: Toast teleported to #toast-container -->
    <div class="demo-section">
      <h3>Demo 2 — Toast via <code>&lt;Teleport to="#toast-container"&gt;</code></h3>
      <p class="demo-desc">
        The toast renders inside <code>#toast-container</code> which is declared in
        <code>index.html</code> at the body level — separate from <code>#app</code>.
      </p>

      <div class="toast-controls">
        <input v-model="toastMessage" type="text" placeholder="Toast message..." class="toast-input" />
        <button class="btn btn-primary" @click="triggerToast">Show Toast</button>
      </div>

      <!--
        Multiple teleports to the same target (#toast-container) are stacked in DOM order.
        defer attribute (Vue 3.5): defers the teleport until after the render cycle.
        Use <Teleport defer> when the target element is rendered by Vue (not in HTML),
        so it is guaranteed to exist when the teleport resolves.
        Note: for #toast-container in index.html, defer is not needed here.
      -->
      <Teleport to="#toast-container" :disabled="isInline">
        <Transition name="toast">
          <div v-if="showToast" class="toast">
            {{ toastMessage }}
          </div>
        </Transition>
      </Teleport>

      <!-- When inline, show a placeholder so the toast is visible in context -->
      <div v-if="isInline && showToast" class="toast toast--inline">
        {{ toastMessage }}
        <span class="inline-note">(inline — Teleport disabled)</span>
      </div>
    </div>

    <!-- Concept notes -->
    <div class="concepts-section">
      <h3>Key Concepts</h3>

      <div class="concept-cards">
        <div class="concept-card">
          <div class="concept-title">Logical vs Physical Location</div>
          <div class="concept-desc">
            Teleport moves DOM but NOT component ownership. The teleported component
            still inherits provide/inject context from its logical parent, not the teleport target.
          </div>
        </div>

        <div class="concept-card">
          <div class="concept-title">Multiple Teleports to Same Target</div>
          <div class="concept-desc">
            Multiple <code>&lt;Teleport&gt;</code> components targeting the same element append
            their content in the order they appear in the source. Useful for stacking toasts.
          </div>
        </div>

        <div class="concept-card concept-card--highlight">
          <div class="concept-title">Vue 3.5: <code>defer</code> attribute</div>
          <div class="concept-desc">
            <code>&lt;Teleport defer&gt;</code> defers mounting until after the current render cycle.
            Required when the target element is rendered by Vue itself (not in static HTML),
            so Vue can guarantee the target DOM node exists before teleporting into it.
          </div>
          <div class="code-snippet">
            <pre><code>&lt;!-- Target rendered by Vue --&gt;
&lt;div v-if="ready" id="dynamic-target"&gt;&lt;/div&gt;

&lt;!-- defer: wait for target to exist --&gt;
&lt;Teleport defer to="#dynamic-target"&gt;
  &lt;MyModal /&gt;
&lt;/Teleport&gt;</code></pre>
          </div>
        </div>
      </div>
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
  margin: 0 0 0.5rem;
}

h4 {
  margin: 0;
  font-size: 1rem;
}

.toggle-row {
  margin-bottom: 1.25rem;
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

.badge-orange { background: #fef3c7; color: #92400e; }
.badge-blue   { background: #dbeafe; color: #1e40af; }

.demo-section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}

.demo-desc {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0.35rem 0 0.75rem;
  line-height: 1.5;
}

.toast-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.toast-input {
  flex: 1;
  max-width: 320px;
  padding: 0.4rem 0.65rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  outline: none;
}

.toast-input:focus {
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
}

.btn:hover { opacity: 0.85; }
.btn-primary { background: #4f46e5; color: #fff; }
.btn-secondary { background: #6b7280; color: #fff; }

/* Modal styles — these apply whether teleported or inline */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  width: 420px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.6;
}

.modal-body p {
  margin: 0 0 0.5rem;
}

.modal-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #9ca3af;
  line-height: 1;
  padding: 0.2rem;
}

.close-btn:hover {
  color: #374151;
}

/* Toast styles */
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #1e1b4b;
  color: #e0e7ff;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  z-index: 2000;
}

.toast--inline {
  position: static;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.inline-note {
  font-size: 0.75rem;
  color: #a5b4fc;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

/* Concepts section */
.concepts-section {
  margin-top: 1.25rem;
}

.concept-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.concept-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.concept-card--highlight {
  border-color: #a5b4fc;
  background: #f5f3ff;
}

.concept-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e1b4b;
  margin-bottom: 0.35rem;
}

.concept-desc {
  font-size: 0.82rem;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.concept-desc:last-child {
  margin-bottom: 0;
}

.code-snippet {
  background: #0f0e2a;
  border-radius: 4px;
  padding: 0.65rem 0.85rem;
  margin-top: 0.5rem;
  overflow-x: auto;
}

.code-snippet pre {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.77rem;
  line-height: 1.6;
  color: #c4b5fd;
}
</style>
