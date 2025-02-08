<script setup lang="ts">
// TypescriptProps — compile-time prop declarations using TypeScript generic syntax
// Requires lang="ts". Supports Vue 3.5 reactive destructure with withDefaults.

interface Address {
  street: string
  city: string
}

interface Props {
  // required — no default
  name: string
  // optional with explicit type
  age?: number
  // union
  role: 'admin' | 'user' | 'guest'
  // optional complex type
  address?: Address
  // optional array
  permissions?: string[]
}

// Vue 3.5: Reactive props destructure — replaces toRefs(props)
// Each variable is a reactive ref, and the prop name is preserved
const {
  name,
  age = 18,
  role,
  address = { street: 'Unknown', city: 'Unknown' },
  permissions = [],
} = defineProps<Props>()

// Vue 3.5 reactive destructure: these ARE reactive — they update when parent changes
// Before 3.5: you had to use toRefs(props) or access props.name directly
// The compiler transforms these into computed getters under the hood

function describeRole(r: typeof role): string {
  const descriptions: Record<typeof role, string> = {
    admin: 'Full access to all features',
    user: 'Standard access',
    guest: 'Read-only access',
  }
  return descriptions[r]
}
</script>

<template>
  <div class="ts-props">
    <h4>TypeScript Props (Vue 3.5 reactive destructure)</h4>

    <dl class="prop-list">
      <dt>name (string, required)</dt>
      <dd>{{ name }}</dd>

      <dt>age (number, default: 18)</dt>
      <dd>{{ age }}</dd>

      <dt>role ('admin' | 'user' | 'guest')</dt>
      <dd>
        <span class="role-badge">{{ role }}</span>
        — {{ describeRole(role) }}
      </dd>

      <dt>address (Address, optional)</dt>
      <dd>{{ address.street }}, {{ address.city }}</dd>

      <dt>permissions (string[], default: [])</dt>
      <dd>{{ permissions.length ? permissions.join(', ') : 'none' }}</dd>
    </dl>

    <div class="note">
      <strong>Vue 3.5 Reactive Destructure:</strong>
      <code>const &#123; name, age = 18 &#125; = defineProps&lt;Props&gt;()</code>
      <p>
        Each destructured variable is reactive — the compiler wraps them in computed getters.
        Before 3.5, you needed <code>toRefs(props)</code> to preserve reactivity.
      </p>
    </div>
  </div>
</template>

<style scoped>
.ts-props {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.prop-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem 1rem;
  font-size: 0.85rem;
}

dt {
  font-weight: 600;
  color: #374151;
  padding: 0.25rem 0;
  border-bottom: 1px dashed #f3f4f6;
}

dd {
  margin: 0;
  padding: 0.25rem 0;
  border-bottom: 1px dashed #f3f4f6;
}

.role-badge {
  background: #ede9fe;
  color: #5b21b6;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.note {
  margin-top: 1rem;
  background: #f0f9ff;
  border-left: 3px solid #0ea5e9;
  padding: 0.75rem;
  border-radius: 0 4px 4px 0;
  font-size: 0.8rem;
}

code {
  display: block;
  background: #1e3a5f;
  color: #bae6fd;
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  margin: 0.35rem 0;
}
</style>
