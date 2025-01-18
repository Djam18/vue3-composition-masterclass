# Vue 3.5 Composition Masterclass

> Starting fresh with Vue 3.5. The Composition API deep-dive.
>
> After 5 years of React Native, TALL Stack, and FastAPI — coming back to Vue.
> Vue 3 now has the API I always wanted. `<script setup>` is the obvious default.
> TypeScript from the start. No Options API.

## Stack

- **Vue 3.5** (Vapor edition codename) — `useTemplateRef()`, reactive props destructure
- **Vite 6** — cold start < 300ms, HMR < 50ms
- **TypeScript** — strict mode
- **Vitest** — unit testing
- **ESLint + Prettier** — code quality

## Structure

```
src/
  components/      # Topic-specific demo components
  views/           # Page-level components (added with router later)
  composables/     # Reusable Composition API functions
  stores/          # Pinia stores (added later)
  api/             # API layer (added later)
```

## Topics Covered

| Commit | Topic |
|--------|-------|
| 01 | Scaffold — create-vue, Vite 6, TypeScript |
| 02 | `ref()` — reactive primitives, shallowRef, isRef, toRefs |
| 03 | `reactive()` — Proxy objects, readonly, destructuring gotcha |
| 04 | `computed()` — lazy, cached, writable |
| 05 | `watch()` / `watchEffect()` — side effects, cleanup |
| 06 | Vue 3.5 reactive props destructure |
| 07 | `<script setup>` — compiler macros, defineProps, defineEmits, defineModel |
| 08 | Lifecycle hooks in Composition API |
| 09 | Template refs — `useTemplateRef()` (Vue 3.5) |
| 10 | Form bindings — all input types, defineModel |
| 11 | Event handling — modifiers |

## Dev

```bash
npm install
npm run dev          # Vite dev server
npm run test:unit    # Vitest
npm run build        # Production build
```

---

*Jan 2025 — next: vue3-components-in-depth (Acte 4)*
