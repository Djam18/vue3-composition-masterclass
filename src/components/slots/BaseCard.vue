<script setup lang="ts">
// BaseCard — demonstrates default slot and named slots (header, body, footer)

interface Props {
  elevated?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  elevated: false,
  padding: 'md',
})
</script>

<template>
  <!--
    Named slots allow the parent to inject content into specific regions.
    Slot names: header, default (body), footer

    Usage:
      <BaseCard>
        <template #header>My Title</template>
        <p>Body content here</p>
        <template #footer>
          <button>Save</button>
        </template>
      </BaseCard>
  -->
  <div :class="['base-card', `base-card--${padding}`, { 'base-card--elevated': elevated }]">
    <!-- Named slot: header — only rendered if parent provides #header content -->
    <header v-if="$slots.header" class="card-header">
      <slot name="header" />
    </header>

    <!-- Default slot — receives content without a #name -->
    <div class="card-body">
      <slot>
        <!-- Fallback content when no default slot content is provided -->
        <p class="card-empty">No content provided.</p>
      </slot>
    </div>

    <!-- Named slot: footer — only rendered if parent provides #footer content -->
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.base-card--sm .card-body {
  padding: 0.75rem;
}
.base-card--md .card-body {
  padding: 1.25rem;
}
.base-card--lg .card-body {
  padding: 2rem;
}

.base-card--elevated {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.card-header {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
  font-weight: 600;
}

.card-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #f3f4f6;
  background: #f9fafb;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.card-empty {
  color: #9ca3af;
  font-style: italic;
  margin: 0;
}
</style>
