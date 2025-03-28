<script setup lang="ts">
// TransitionGroup — List Animations
// Uses FLIP (First Last Invert Play) technique via the .list-move class
// Staggered animations via :style="{ transitionDelay: index * 50 + 'ms' }"

import { ref } from 'vue'

interface ListItem {
  id: number
  label: string
  color: string
}

const colors = ['#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#16a34a', '#0284c7', '#0891b2']

let nextId = 8

const items = ref<ListItem[]>([
  { id: 1, label: 'Item Alpha', color: colors[0] },
  { id: 2, label: 'Item Beta', color: colors[1] },
  { id: 3, label: 'Item Gamma', color: colors[2] },
  { id: 4, label: 'Item Delta', color: colors[3] },
  { id: 5, label: 'Item Epsilon', color: colors[4] },
])

function addItem() {
  const id = ++nextId
  const color = colors[id % colors.length]
  // Add at a random position — triggers move animations for existing items
  const pos = Math.floor(Math.random() * (items.value.length + 1))
  items.value = [
    ...items.value.slice(0, pos),
    { id, label: `Item #${id}`, color },
    ...items.value.slice(pos),
  ]
}

function removeItem(id: number) {
  items.value = items.value.filter((item) => item.id !== id)
}

function shuffle() {
  // Fisher-Yates shuffle — immutable via spread
  const arr = [...items.value]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  items.value = arr
}

function reset() {
  items.value = [
    { id: 1, label: 'Item Alpha', color: colors[0] },
    { id: 2, label: 'Item Beta', color: colors[1] },
    { id: 3, label: 'Item Gamma', color: colors[2] },
    { id: 4, label: 'Item Delta', color: colors[3] },
    { id: 5, label: 'Item Epsilon', color: colors[4] },
  ]
  nextId = 8
}
</script>

<template>
  <div class="demo-page">
    <h2 class="demo-title">TransitionGroup — List Animations</h2>
    <p class="demo-intro">
      <code>&lt;TransitionGroup&gt;</code> animates lists: add, remove, and reorder items.
      The <code>.list-move</code> class enables FLIP animations for repositioning.
      Use <code>:style="&#123; transitionDelay &#125;"</code> for staggered effects.
    </p>

    <div class="demo-layout">
      <!-- Controls -->
      <div class="controls-bar">
        <button class="btn btn-primary" @click="addItem">+ Add item</button>
        <button class="btn btn-secondary" @click="shuffle">Shuffle</button>
        <button class="btn btn-ghost" @click="reset">Reset</button>
        <span class="item-count">{{ items.length }} items</span>
      </div>

      <!-- Main list with TransitionGroup -->
      <div class="list-container">
        <!-- tag="ul": TransitionGroup renders as a <ul> element
             name="list": generates .list-enter-from, .list-leave-to, .list-move classes -->
        <TransitionGroup tag="ul" name="list" class="item-list">
          <li
            v-for="(item, index) in items"
            :key="item.id"
            class="list-item"
            :style="{
              borderLeftColor: item.color,
              /* Staggered animation: each item delays by 50ms × its position */
              transitionDelay: `${index * 50}ms`,
            }"
          >
            <div class="item-dot" :style="{ background: item.color }" />
            <span class="item-label">{{ item.label }}</span>
            <span class="item-id">#{{ item.id }}</span>
            <button
              class="remove-btn"
              :style="{ color: item.color }"
              @click="removeItem(item.id)"
            >
              &times;
            </button>
          </li>
        </TransitionGroup>

        <div v-if="items.length === 0" class="empty-state">
          List is empty — click "Add item" to start
        </div>
      </div>

      <!-- CSS explanation -->
      <section class="css-explanation">
        <h3>Required CSS Classes</h3>
        <div class="css-grid">
          <div class="css-card enter-card">
            <div class="css-card-header">Enter (add)</div>
            <pre class="css-block">/* Starting state when added */
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

/* Duration & easing */
.list-enter-active {
  transition: all 0.35s ease;
}</pre>
          </div>

          <div class="css-card leave-card">
            <div class="css-card-header">Leave (remove)</div>
            <pre class="css-block">/* End state when removed */
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Must use position: absolute
   so others can FLIP into place */
.list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}</pre>
          </div>

          <div class="css-card move-card">
            <div class="css-card-header">Move (FLIP reorder)</div>
            <pre class="css-block">/* Applied to items that move
   position due to add/remove.
   FLIP: CSS handles the math. */
.list-move {
  transition: transform 0.35s ease;
}

/* Staggered — via :style binding */
/* transitionDelay: index * 50ms */</pre>
          </div>
        </div>
      </section>

      <!-- FLIP explanation -->
      <section class="flip-section">
        <h3>How FLIP Works</h3>
        <div class="flip-steps">
          <div class="flip-step">
            <span class="flip-letter">F</span>
            <div>
              <strong>First</strong>
              <p>Record each item's current position (getBoundingClientRect)</p>
            </div>
          </div>
          <div class="flip-step">
            <span class="flip-letter">L</span>
            <div>
              <strong>Last</strong>
              <p>Apply the change (add/remove/reorder) and record new positions</p>
            </div>
          </div>
          <div class="flip-step">
            <span class="flip-letter">I</span>
            <div>
              <strong>Invert</strong>
              <p>Apply a transform that moves items back to their original position</p>
            </div>
          </div>
          <div class="flip-step">
            <span class="flip-letter">P</span>
            <div>
              <strong>Play</strong>
              <p>Transition the inverse transform to identity — Vue handles all of this via <code>.list-move</code></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-page {
  padding: 1.5rem;
  max-width: 800px;
}

.demo-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0 0 0.5rem;
}

.demo-intro {
  color: #4b5563;
  margin: 0 0 1.5rem;
  line-height: 1.6;
  font-size: 0.9rem;
}

.demo-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.controls-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover { background: #4338ca; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-secondary:hover { background: #d1d5db; }
.btn-ghost { background: transparent; color: #6b7280; border: 1px solid #d1d5db; }
.btn-ghost:hover { background: #f3f4f6; }

.item-count {
  margin-left: auto;
  font-size: 0.82rem;
  color: #9ca3af;
  font-weight: 500;
}

.list-container {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
  min-height: 200px;
  position: relative;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  background: #f9fafb;
  border-left: 4px solid;
  border-radius: 4px;
  font-size: 0.88rem;
  /* transition-delay is set inline via :style for stagger effect */
}

.item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-label {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.item-id {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0 0.2rem;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.remove-btn:hover { opacity: 1; }

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

/* ── TransitionGroup CSS ─────────────────────────────────────────────────── */

/* Enter: item slides in from the left */
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-enter-active {
  transition: all 0.35s ease;
}

/* Leave: item slides out to the right */
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-leave-active {
  transition: all 0.3s ease;
  /* position: absolute allows remaining items to FLIP smoothly */
  position: absolute;
  width: calc(100% - 1.5rem);
}

/* Move: FLIP — items animate to their new position after add/remove/shuffle */
.list-move {
  transition: transform 0.35s ease;
}

/* ── CSS explanation section ─────────────────────────────────────────────── */

.css-explanation {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.css-explanation h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #374151;
}

.css-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}

.css-card {
  border-radius: 6px;
  overflow: hidden;
}

.css-card-header {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.enter-card .css-card-header { background: #dcfce7; color: #15803d; }
.leave-card .css-card-header { background: #fee2e2; color: #b91c1c; }
.move-card .css-card-header { background: #e0e7ff; color: #4338ca; }

.css-block {
  background: #1e1b4b;
  color: #c4b5fd;
  padding: 0.6rem 0.75rem;
  font-size: 0.7rem;
  line-height: 1.55;
  overflow-x: auto;
  margin: 0;
  border-radius: 0 0 6px 6px;
  white-space: pre;
}

/* ── FLIP section ────────────────────────────────────────────────────────── */

.flip-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.flip-section h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #374151;
}

.flip-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .flip-steps { grid-template-columns: 1fr 1fr; }
}

.flip-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.flip-letter {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-step strong {
  font-size: 0.85rem;
  color: #374151;
}

.flip-step p {
  font-size: 0.77rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.78rem;
}
</style>
