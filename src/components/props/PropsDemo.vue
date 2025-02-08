<script setup lang="ts">
// PropsDemo — main demo page showing all prop patterns

import RuntimeProps from './RuntimeProps.vue'
import TypescriptProps from './TypescriptProps.vue'
import PropsValidation from './PropsValidation.vue'
</script>

<template>
  <div class="props-demo">
    <h2>Props — Complete Guide</h2>

    <p class="intro">
      Props are how parent components pass data down to children. Vue supports two declaration
      styles: <strong>runtime</strong> (object syntax, evaluated at runtime) and
      <strong>compile-time</strong> (TypeScript generics, erased at build time). Vue 3.5 adds
      reactive props destructure.
    </p>

    <!-- ===== Runtime Props ===== -->
    <section class="section">
      <h3>1. Runtime Declaration (defineProps with Object Syntax)</h3>
      <p>Supports validators, complex types via <code>PropType</code>, Boolean casting.</p>
      <RuntimeProps
        title="Hello from parent"
        :count="42"
        active
        status="active"
        :address="{ street: '10 Downing St', city: 'London', country: 'UK' }"
        :tags="['vue', 'typescript', 'composition-api']"
      />
    </section>

    <!-- ===== TypeScript Props ===== -->
    <section class="section">
      <h3>2. Compile-Time Declaration (TypeScript Generics)</h3>
      <p>
        Uses <code>defineProps&lt;Props&gt;()</code>. Vue 3.5 allows reactive destructure with
        default values.
      </p>
      <TypescriptProps
        name="Ada Lovelace"
        :age="27"
        role="admin"
        :address="{ street: 'Baker Street 221B', city: 'London' }"
        :permissions="['create', 'read', 'update', 'delete']"
      />
    </section>

    <!-- ===== Validation ===== -->
    <section class="section">
      <h3>3. Boolean Casting &amp; Custom Validators</h3>
      <PropsValidation selected :size="'lg'" :rating="4" />
    </section>

    <!-- ===== Comparison ===== -->
    <section class="section">
      <h3>Runtime vs Compile-Time — Key Differences</h3>
      <table class="comparison">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Runtime (Object syntax)</th>
            <th>Compile-Time (TS generics)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Custom validators</td>
            <td>Yes — <code>validator: fn</code></td>
            <td>No (use Zod/yup in setup)</td>
          </tr>
          <tr>
            <td>Default values</td>
            <td><code>default: value</code></td>
            <td><code>withDefaults()</code> or destructure defaults (3.5)</td>
          </tr>
          <tr>
            <td>TypeScript IDE support</td>
            <td>Partial (via <code>PropType</code>)</td>
            <td>Full — direct interface usage</td>
          </tr>
          <tr>
            <td>Runtime overhead</td>
            <td>Evaluated at runtime</td>
            <td>Erased at compile time</td>
          </tr>
          <tr>
            <td>Requires lang="ts"</td>
            <td>No</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>

      <div class="recommendation">
        Recommendation: Use <strong>TypeScript generics</strong> for new Vue 3 projects. Use
        runtime syntax only when you need custom runtime validators.
      </div>
    </section>
  </div>
</template>

<style scoped>
.props-demo {
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

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.recommendation {
  margin-top: 0.75rem;
  background: #ecfdf5;
  border-left: 3px solid #10b981;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0 4px 4px 0;
}
</style>
