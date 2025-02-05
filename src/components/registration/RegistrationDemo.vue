<script setup lang="ts">
// RegistrationDemo — demonstrates component registration patterns
// 1. Global registration (via app.component in main.ts)
// 2. Local registration (auto via <script setup> imports)
// 3. Auto-import (via unplugin-vue-components — conceptual demo)

import LocalComponent from './LocalComponent.vue'
import { ref } from 'vue'

const globalClickLog = ref<string[]>([])

function onGlobalClick() {
  globalClickLog.value = [
    ...globalClickLog.value,
    `Clicked at ${new Date().toLocaleTimeString()}`,
  ]
}
</script>

<template>
  <div class="registration-demo">
    <h2>Component Registration</h2>

    <!-- ========== SECTION 1: Global Registration ========== -->
    <section class="section">
      <h3>1. Global Registration</h3>
      <p>
        Registered in <code>main.ts</code> via
        <code>app.component('GlobalButton', GlobalButton)</code>. Available in
        <em>any</em> template — no import needed.
      </p>

      <div class="demo-row">
        <GlobalButton variant="primary" @click="onGlobalClick">Primary</GlobalButton>
        <GlobalButton variant="secondary" @click="onGlobalClick">Secondary</GlobalButton>
        <GlobalButton variant="danger" @click="onGlobalClick">Danger</GlobalButton>
        <GlobalButton disabled @click="onGlobalClick">Disabled</GlobalButton>
      </div>

      <ul v-if="globalClickLog.length" class="log">
        <li v-for="(entry, i) in globalClickLog" :key="i">{{ entry }}</li>
      </ul>

      <div class="code-block">
        <strong>main.ts</strong>
        <pre>
import GlobalButton from '@/components/registration/GlobalButton.vue'

const app = createApp(App)
app.component('GlobalButton', GlobalButton)
app.mount('#app')</pre
        >
      </div>
    </section>

    <!-- ========== SECTION 2: Local Registration ========== -->
    <section class="section">
      <h3>2. Local Registration (auto via &lt;script setup&gt;)</h3>
      <p>
        With <code>&lt;script setup&gt;</code>, any imported component is automatically locally
        registered. The compiler does it at build time.
      </p>

      <LocalComponent />

      <div class="code-block">
        <strong>RegistrationDemo.vue</strong>
        <pre>
import LocalComponent from './LocalComponent.vue'
// That import IS the registration — no extra config needed!</pre
        >
      </div>
    </section>

    <!-- ========== SECTION 3: Auto-import (conceptual) ========== -->
    <section class="section">
      <h3>3. Auto-Import with unplugin-vue-components</h3>
      <p>
        In production apps, <code>unplugin-vue-components</code> scans your
        <code>components/</code> folder and generates TypeScript declarations so you can use
        components with zero imports.
      </p>

      <div class="code-block">
        <strong>vite.config.ts</strong>
        <pre>
import Components from 'unplugin-vue-components/vite'

export default defineConfig(&#123;
  plugins: [
    vue(),
    Components(&#123;
      dirs: ['src/components'],
      dts: true, // generates components.d.ts
    &#125;),
  ],
&#125;)</pre
        >
      </div>

      <div class="code-block">
        <strong>Any.vue — no import needed!</strong>
        <pre>
&lt;template&gt;
  &lt;!-- Works without importing — auto-imported by the plugin --&gt;
  &lt;GlobalButton&gt;Click me&lt;/GlobalButton&gt;
&lt;/template&gt;</pre
        >
      </div>

      <div class="tip">
        Pros: Zero boilerplate. Cons: Less explicit — harder to trace where a component comes from.
        Use in large projects with clear naming conventions.
      </div>
    </section>

    <!-- ========== SECTION 4: Comparison ========== -->
    <section class="section">
      <h3>Global vs Local — When to use which?</h3>
      <table class="comparison">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Best For</th>
            <th>Drawback</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Global</strong></td>
            <td>Base UI components used everywhere (Button, Icon, Modal)</td>
            <td>Pollutes global namespace; harder to tree-shake</td>
          </tr>
          <tr>
            <td><strong>Local</strong></td>
            <td>Feature-specific components</td>
            <td>Requires import per file</td>
          </tr>
          <tr>
            <td><strong>Auto-import</strong></td>
            <td>Large apps with many reusable components</td>
            <td>Magic — less explicit; requires plugin setup</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.registration-demo {
  padding: 1.5rem;
  max-width: 860px;
}

.section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.demo-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1rem 0;
}

.log {
  font-size: 0.8rem;
  color: #6b7280;
  padding-left: 1.25rem;
}

.code-block {
  background: #1f2937;
  color: #f3f4f6;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  font-size: 0.8rem;
}

.code-block pre {
  margin: 0.25rem 0 0;
  white-space: pre-wrap;
  font-family: monospace;
  color: #a5f3fc;
}

.code-block strong {
  color: #fbbf24;
}

.tip {
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  border-radius: 0 4px 4px 0;
}

.comparison {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-top: 0.75rem;
}

.comparison th,
.comparison td {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.comparison th {
  background: #f3f4f6;
  font-weight: 600;
}
</style>
