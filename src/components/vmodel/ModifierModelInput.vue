<script setup lang="ts">
// ModifierModelInput — defineModel with custom modifiers
// v-model supports built-in modifiers (.trim, .number, .lazy) on native inputs.
// For component v-model, you can define custom modifiers.
//
// Parent usage:
//   <ModifierModelInput v-model.capitalize="text" />
//   <ModifierModelInput v-model.uppercase="text" />
//   <ModifierModelInput v-model:tag.trim="tagValue" />

// Access modifiers via the second return from defineModel
const [text, textModifiers] = defineModel<string>({
  default: '',
  set(value) {
    if (textModifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    if (textModifiers.uppercase) {
      return value.toUpperCase()
    }
    return value
  },
})

// Named model with modifier
const [tag, tagModifiers] = defineModel<string>('tag', {
  default: '',
  set(value) {
    return tagModifiers.trim ? value.trim() : value
  },
})

// Describe active modifiers for the demo display
const activeModifiers = (): string => {
  const mods: string[] = []
  if (textModifiers.capitalize) mods.push('.capitalize')
  if (textModifiers.uppercase) mods.push('.uppercase')
  return mods.length ? mods.join(', ') : '(none)'
}
</script>

<template>
  <div class="modifier-model">
    <h4>v-model with Custom Modifiers</h4>

    <div class="field">
      <label>
        Default model with modifier (active: <strong>{{ activeModifiers() }}</strong
        >)
      </label>
      <div class="input-row">
        <input v-model="text" class="input" placeholder="Type here..." />
        <span class="value-badge">{{ JSON.stringify(text) }}</span>
      </div>
      <p class="hint">
        Modifiers are passed from parent: <code>v-model.capitalize="text"</code>. The
        <code>set</code> handler applies the transformation.
      </p>
    </div>

    <div class="field">
      <label>
        Named model <code>tag</code> with <code>.trim</code> modifier (active:
        {{ tagModifiers.trim ? '.trim' : '(none)' }})
      </label>
      <div class="input-row">
        <input v-model="tag" class="input" placeholder="  tag with spaces  " />
        <span class="value-badge">{{ JSON.stringify(tag) }}</span>
      </div>
    </div>

    <div class="code-panel">
      <strong>defineModel with modifier</strong>
      <pre>
const [model, modifiers] = defineModel&lt;string&gt;(&#123;
  set(value) &#123;
    if (modifiers.capitalize) &#123;
      return value.charAt(0).toUpperCase() + value.slice(1)
    &#125;
    return value
  &#125;,
&#125;)

// Parent:
// &lt;MyInput v-model.capitalize="text" /&gt;</pre
      >
    </div>
  </div>
</template>

<style scoped>
.modifier-model {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.field {
  margin-bottom: 0.75rem;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.input-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.input {
  padding: 0.4rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
}

.value-badge {
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-family: monospace;
}

.hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.78rem;
}

.code-panel {
  background: #1f2937;
  color: #f3f4f6;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-top: 0.75rem;
  font-size: 0.78rem;
}

.code-panel strong {
  color: #fbbf24;
  display: block;
  margin-bottom: 0.35rem;
}

.code-panel pre {
  color: #a5f3fc;
  font-family: monospace;
  margin: 0;
  white-space: pre-wrap;
}
</style>
