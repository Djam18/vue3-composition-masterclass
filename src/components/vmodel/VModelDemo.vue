<script setup lang="ts">
// VModelDemo — parent demonstrating all v-model patterns

import SingleModelInput from './SingleModelInput.vue'
import MultipleModelInput from './MultipleModelInput.vue'
import ModifierModelInput from './ModifierModelInput.vue'
import { ref } from 'vue'

// Single model
const singleText = ref('')

// Multiple models
const postTitle = ref('My Post')
const postContent = ref('Write something...')
const postPinned = ref(false)

// Modifier model
const capitalizedText = ref('')
const tagValue = ref('')
</script>

<template>
  <div class="vmodel-demo">
    <h2>Component v-model</h2>

    <p class="intro">
      <code>v-model</code> on a component is syntactic sugar for a prop + event pair. Vue 3.4
      introduced <code>defineModel()</code> — a macro that eliminates the boilerplate of manually
      defining <code>modelValue</code> prop and <code>update:modelValue</code> emit.
    </p>

    <!-- ===== Section 1: Single v-model ===== -->
    <section class="section">
      <h3>1. Single v-model (defineModel)</h3>
      <p>
        Parent uses <code>v-model="singleText"</code>. Child uses
        <code>const model = defineModel()</code>.
      </p>

      <SingleModelInput v-model="singleText" />

      <div class="parent-state">
        <strong>Parent state:</strong>
        <code>singleText = {{ JSON.stringify(singleText) }}</code>
      </div>
    </section>

    <!-- ===== Section 2: Multiple v-model ===== -->
    <section class="section">
      <h3>2. Multiple v-model Bindings</h3>
      <p>A component can expose multiple named v-model bindings simultaneously.</p>

      <MultipleModelInput
        v-model:title="postTitle"
        v-model:content="postContent"
        v-model:pinned="postPinned"
      />

      <div class="parent-state">
        <strong>Parent state:</strong>
        <code>title = {{ JSON.stringify(postTitle) }}</code>
        <code>content = {{ JSON.stringify(postContent) }}</code>
        <code>pinned = {{ postPinned }}</code>
      </div>
    </section>

    <!-- ===== Section 3: Modifiers ===== -->
    <section class="section">
      <h3>3. v-model with Custom Modifiers</h3>
      <p>
        Custom modifiers are defined by the component author. The parent passes them via dot syntax:
        <code>v-model.capitalize</code>.
      </p>

      <ModifierModelInput v-model.capitalize="capitalizedText" v-model:tag.trim="tagValue" />

      <div class="parent-state">
        <strong>Parent state:</strong>
        <code>capitalizedText = {{ JSON.stringify(capitalizedText) }}</code>
        <code>tagValue = {{ JSON.stringify(tagValue) }}</code>
      </div>
    </section>

    <!-- ===== Section 4: Under the hood ===== -->
    <section class="section">
      <h3>How defineModel() Works Under the Hood</h3>

      <div class="expansion-panels">
        <div class="panel">
          <h4>Before Vue 3.4 (manual pattern)</h4>
          <pre class="code dark">
// Child component
const props = defineProps&lt;&#123; modelValue: string &#125;&gt;()
const emit = defineEmits&lt;&#123; 'update:modelValue': [value: string] &#125;&gt;()

const model = computed(&#123;
  get: () =&gt; props.modelValue,
  set: (v) =&gt; emit('update:modelValue', v),
&#125;)</pre
          >
        </div>

        <div class="panel">
          <h4>Vue 3.4+ (defineModel macro)</h4>
          <pre class="code dark">
// Child component — same result, zero boilerplate
const model = defineModel&lt;string&gt;()</pre
          >
        </div>

        <div class="panel">
          <h4>Named v-model (multiple)</h4>
          <pre class="code dark">
// Parent
// &lt;MyEditor v-model:title="t" v-model:body="b" /&gt;

// Child
const title = defineModel&lt;string&gt;('title')
const body = defineModel&lt;string&gt;('body')</pre
          >
        </div>
      </div>

      <table class="comparison">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Manual (pre-3.4)</th>
            <th>defineModel() (3.4+)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Boilerplate</td>
            <td>High — props + emit + computed</td>
            <td>Zero — one macro call</td>
          </tr>
          <tr>
            <td>Multiple bindings</td>
            <td>One prop + one emit per model</td>
            <td><code>defineModel('name')</code> per model</td>
          </tr>
          <tr>
            <td>Modifiers</td>
            <td>Access via <code>modelModifiers</code> prop</td>
            <td>Second return value of defineModel</td>
          </tr>
          <tr>
            <td>Type safety</td>
            <td>Manual types on prop and emit</td>
            <td>Single generic <code>&lt;T&gt;</code></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.vmodel-demo {
  padding: 1.5rem;
  max-width: 860px;
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

.parent-state {
  margin-top: 0.75rem;
  background: #1f2937;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.parent-state strong {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-bottom: 0.15rem;
}

.parent-state code {
  background: transparent;
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.82rem;
}

.expansion-panels {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.panel h4 {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  color: #374151;
}

.code {
  background: #1f2937;
  color: #a5f3fc;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  font-family: monospace;
  font-size: 0.78rem;
  white-space: pre-wrap;
  margin: 0;
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
  padding: 0.4rem 0.6rem;
  text-align: left;
}

.comparison th {
  background: #f3f4f6;
  font-weight: 600;
}
</style>
