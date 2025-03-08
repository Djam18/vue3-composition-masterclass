<script setup lang="ts">
// RuntimeProps — runtime prop declarations using defineProps() with the object syntax
// This approach works without TypeScript generics and supports validators

import { type PropType } from 'vue'

type Status = 'active' | 'inactive' | 'pending'

interface Address {
  street: string
  city: string
  country: string
}

// Runtime declaration — fully evaluated at runtime (no TS-only erasure)
const props = defineProps({
  // Basic type with required
  title: {
    type: String,
    required: true,
  },

  // With default value
  count: {
    type: Number,
    default: 0,
  },

  // Boolean — Vue applies casting rules
  // Passing <RuntimeProps active /> is the same as :active="true"
  active: {
    type: Boolean,
    default: false,
  },

  // Union type via array
  status: {
    type: String as PropType<Status>,
    default: 'pending',
    validator: (value: string) => ['active', 'inactive', 'pending'].includes(value),
  },

  // Complex type via PropType
  address: {
    type: Object as PropType<Address>,
    default: () => ({ street: '—', city: '—', country: '—' }),
  },

  // Array type
  tags: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
</script>

<template>
  <div class="runtime-props">
    <h4>Runtime Props Demo</h4>

    <dl class="prop-list">
      <dt>title (String, required)</dt>
      <dd>{{ props.title }}</dd>

      <dt>count (Number, default: 0)</dt>
      <dd>{{ props.count }}</dd>

      <dt>active (Boolean, default: false)</dt>
      <dd>
        <span :class="props.active ? 'badge-green' : 'badge-gray'">
          {{ props.active ? 'Active' : 'Inactive' }}
        </span>
      </dd>

      <dt>status (String as Status, with validator)</dt>
      <dd>
        <span :class="`badge-${props.status}`">{{ props.status }}</span>
      </dd>

      <dt>address (Object as PropType&lt;Address&gt;)</dt>
      <dd>{{ props.address.street }}, {{ props.address.city }}, {{ props.address.country }}</dd>

      <dt>tags (Array as PropType&lt;string[]&gt;)</dt>
      <dd>{{ props.tags.length ? props.tags.join(', ') : 'none' }}</dd>
    </dl>
  </div>
</template>

<style scoped>
.runtime-props {
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

.badge-green {
  background: #d1fae5;
  color: #065f46;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.badge-gray {
  background: #f3f4f6;
  color: #374151;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.badge-active {
  background: #d1fae5;
  color: #065f46;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.badge-inactive {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.badge-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
</style>
