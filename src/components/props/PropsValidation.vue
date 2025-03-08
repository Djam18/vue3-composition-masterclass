<script setup lang="ts">
// PropsValidation — demonstrates Boolean casting and custom validators

import { type PropType, computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = defineProps({
  // ===== Boolean Casting Rules =====
  // Vue special-cases Boolean props:
  // <Component selected />  =>  :selected="true"
  // <Component />           =>  :selected="false" (if no default specified)
  selected: {
    type: Boolean,
  },

  // When Boolean is in a union type, Vue uses the order to decide casting:
  // Boolean before String: empty string '' is cast to true
  // String before Boolean: empty string '' stays ''
  booleanFirst: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },

  stringFirst: {
    type: [String, Boolean] as PropType<string | boolean>,
    default: false,
  },

  // ===== Custom Validators =====
  size: {
    type: String as PropType<Size>,
    default: 'md',
    validator: (value: string) => {
      const valid = ['sm', 'md', 'lg'].includes(value)
      if (!valid) {
        console.warn(`[PropsValidation] Invalid size: "${value}". Expected: sm | md | lg`)
      }
      return valid
    },
  },

  // Number range validator
  rating: {
    type: Number,
    default: 3,
    validator: (value: number) => value >= 1 && value <= 5,
  },
})

const sizeLabel = computed(() => {
  const labels: Record<Size, string> = { sm: 'Small', md: 'Medium', lg: 'Large' }
  return labels[props.size]
})

const stars = computed(() => '★'.repeat(props.rating) + '☆'.repeat(5 - props.rating))
</script>

<template>
  <div class="props-validation">
    <h4>Boolean Casting &amp; Custom Validators</h4>

    <section class="subsection">
      <h5>Boolean Casting</h5>

      <table class="cast-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Value Received</th>
            <th>Cast Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>selected</code> (Boolean)</td>
            <td>Attribute present (no value)</td>
            <td>
              <strong>{{ selected }}</strong>
            </td>
          </tr>
          <tr>
            <td><code>booleanFirst</code> ([Boolean, String])</td>
            <td>{{ JSON.stringify(booleanFirst) }}</td>
            <td>
              <strong>{{ booleanFirst }}</strong>
            </td>
          </tr>
          <tr>
            <td><code>stringFirst</code> ([String, Boolean])</td>
            <td>{{ JSON.stringify(stringFirst) }}</td>
            <td>
              <strong>{{ stringFirst }}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="tip">
        Rule: When <code>Boolean</code> appears before <code>String</code> in the type array, an
        empty string <code>""</code> is cast to <code>true</code>. When
        <code>String</code> comes first, it stays <code>""</code>.
      </div>
    </section>

    <section class="subsection">
      <h5>Custom Validators</h5>

      <div class="validator-row">
        <div>
          <strong>size</strong> (sm | md | lg, validator enforces allowed values)
          <br />
          <span :class="`size-${size}`">{{ sizeLabel }} ({{ size }})</span>
        </div>
        <div>
          <strong>rating</strong> (Number 1–5, validator enforces range)
          <br />
          <span class="stars">{{ stars }}</span> ({{ rating }}/5)
        </div>
      </div>

      <div class="tip">
        Validators run in development only. They warn in console but don't throw — they're
        a DX guard, not a runtime guarantee. Use TypeScript types for compile-time safety.
      </div>
    </section>
  </div>
</template>

<style scoped>
.props-validation {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fff;
}

.subsection {
  margin-top: 1rem;
}

h5 {
  margin: 0 0 0.5rem;
  color: #374151;
}

.cast-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.cast-table th,
.cast-table td {
  border: 1px solid #e5e7eb;
  padding: 0.4rem 0.6rem;
  text-align: left;
}

.cast-table th {
  background: #f9fafb;
  font-weight: 600;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.tip {
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  border-radius: 0 4px 4px 0;
}

.validator-row {
  display: flex;
  gap: 2rem;
  font-size: 0.875rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.size-sm {
  font-size: 0.75rem;
  color: #6b7280;
}
.size-md {
  font-size: 1rem;
  color: #374151;
}
.size-lg {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.stars {
  color: #f59e0b;
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
}
</style>
