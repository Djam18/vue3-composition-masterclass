<script setup lang="ts">
// AttrsDemo — shows $attrs contents and fallthrough behavior

import BaseInput from './BaseInput.vue'
import ForwardAttrsButton from './ForwardAttrsButton.vue'
import { ref } from 'vue'

const email = ref('')
const hasError = ref(false)
const clickCount = ref(0)
</script>

<template>
  <div class="attrs-demo">
    <h2>Fallthrough Attributes</h2>

    <p class="intro">
      Attributes that are <em>not</em> declared as props or emits are called "fallthrough
      attributes". By default, Vue automatically applies them to the component's root element. You
      can disable this with <code>inheritAttrs: false</code> and manually apply them with
      <code>v-bind="$attrs"</code>.
    </p>

    <!-- ===== Section 1: Default fallthrough ===== -->
    <section class="section">
      <h3>1. Default Fallthrough Behavior</h3>
      <p>
        When <code>inheritAttrs</code> is <code>true</code> (default), Vue merges
        <code>class</code>, <code>style</code>, and other non-prop attributes onto the root element.
      </p>

      <div class="demo-box">
        <!-- These attrs fall through to the root <div> of a component
             that has NOT set inheritAttrs: false -->
        <p class="note">
          Example: if a component's root is <code>&lt;div&gt;</code>, passing
          <code>class="extra"</code> adds it to that div.
        </p>
        <div class="code-block">
          <pre>
&lt;!-- Parent --&gt;
&lt;MyComponent class="extra" data-id="42" /&gt;

&lt;!-- Rendered HTML (inheritAttrs: true, default) --&gt;
&lt;div class="my-component extra" data-id="42"&gt;...&lt;/div&gt;</pre
          >
        </div>
      </div>
    </section>

    <!-- ===== Section 2: BaseInput with inheritAttrs: false ===== -->
    <section class="section">
      <h3>2. inheritAttrs: false — Manual Forwarding to Inner Element</h3>
      <p>
        <code>BaseInput</code> has <code>inheritAttrs: false</code>. Attributes like
        <code>placeholder</code>, <code>type</code>, <code>aria-label</code> are forwarded to the
        inner <code>&lt;input&gt;</code> via <code>v-bind="$attrs"</code>.
      </p>

      <div class="demo-box">
        <BaseInput
          label="Email Address"
          :error="hasError ? 'Invalid email format' : ''"
          type="email"
          placeholder="user@example.com"
          aria-label="Email input"
          class="email-override"
          @input="(e: Event) => (email = (e.target as HTMLInputElement).value)"
        />

        <div class="controls">
          <label class="toggle-label">
            <input v-model="hasError" type="checkbox" />
            Simulate error
          </label>
        </div>

        <div class="state-display">
          <code>email = {{ JSON.stringify(email) }}</code>
        </div>

        <div class="code-block">
          <pre>
&lt;!-- Parent passes: type, placeholder, aria-label, class --&gt;
&lt;BaseInput
  label="Email"
  type="email"
  placeholder="user@example.com"
  aria-label="Email input"
  class="email-override"
/&gt;

&lt;!-- BaseInput internals --&gt;
defineOptions(&#123; inheritAttrs: false &#125;)
&lt;input v-bind="$attrs" ... /&gt;
&lt;!-- attrs go to &lt;input&gt;, not the wrapper &lt;div&gt; --&gt;</pre
          >
        </div>
      </div>
    </section>

    <!-- ===== Section 3: Selective forwarding ===== -->
    <section class="section">
      <h3>3. Selective Forwarding with useAttrs()</h3>
      <p>
        <code>ForwardAttrsButton</code> splits <code>$attrs</code>: <code>data-*</code> attributes
        go to the tooltip wrapper, everything else goes to the inner <code>&lt;button&gt;</code>.
      </p>

      <div class="demo-box">
        <ForwardAttrsButton
          class="custom-class"
          aria-label="Save document"
          data-tooltip="Saves your work"
          data-track="save-btn"
          @click="clickCount++"
        >
          Save
        </ForwardAttrsButton>

        <div class="state-display">
          <code>clicked {{ clickCount }} times</code>
        </div>

        <div class="code-block">
          <pre>
&lt;!-- class + aria-* forwarded to &lt;button&gt; --&gt;
&lt;!-- data-* forwarded to wrapper div (tooltip source) --&gt;
const dataAttrs = computed(() =&gt;
  Object.fromEntries(Object.entries(attrs).filter(([k]) =&gt; k.startsWith('data-')))
)
const nonDataAttrs = computed(() =&gt;
  Object.fromEntries(Object.entries(attrs).filter(([k]) =&gt; !k.startsWith('data-')))
)</pre
          >
        </div>
      </div>
    </section>

    <!-- ===== Section 4: useAttrs() in script ===== -->
    <section class="section">
      <h3>Key Points</h3>
      <ul class="concept-list">
        <li>
          <strong>$attrs in template:</strong> Access the fallthrough object directly as
          <code>$attrs</code> in any template expression.
        </li>
        <li>
          <strong>useAttrs() in script:</strong> Same object, accessible in
          <code>&lt;script setup&gt;</code>. Reactive — updates when parent changes.
        </li>
        <li>
          <strong>$listeners removed:</strong> In Vue 3, event listeners are part of
          <code>$attrs</code> (they appear as <code>onXxx</code>). There is no separate
          <code>$listeners</code> object.
        </li>
        <li>
          <strong>Multi-root components:</strong> Vue 3 supports multiple root elements. With
          multiple roots, Vue <em>cannot</em> automatically determine which element should receive
          attrs — you must disable and manually forward.
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.attrs-demo {
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

.demo-box {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.note {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0;
}

.code-block {
  background: #1f2937;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  overflow-x: auto;
}

.code-block pre {
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.76rem;
  margin: 0;
  white-space: pre-wrap;
}

.controls {
  display: flex;
  gap: 1rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.state-display {
  background: #1f2937;
  border-radius: 4px;
  padding: 0.35rem 0.65rem;
}

.state-display code {
  background: transparent;
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.82rem;
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
