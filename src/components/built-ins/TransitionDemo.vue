<script setup lang="ts">
// Transition Component — CSS and JavaScript animations
// Vue 3 naming: v-enter-from, v-enter-active, v-enter-to
//               v-leave-from, v-leave-active, v-leave-to
// NOTE: Vue 2 used `v-enter` — in Vue 3 it MUST be `v-enter-from`

import { ref } from 'vue'

// ── Fade demo ────────────────────────────────────────────────────────────────
const showFade = ref(true)

// ── mode="out-in" demo — switch between components ───────────────────────────
const activeView = ref<'A' | 'B' | 'C'>('A')
const views = ['A', 'B', 'C'] as const

// ── appear demo — transition on first render ─────────────────────────────────
const showAppear = ref(false)

// ── JavaScript hooks demo ────────────────────────────────────────────────────
const showJs = ref(false)

function onBeforeEnter(el: Element) {
  const htmlEl = el as HTMLElement
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'scale(0.8)'
}

function onEnter(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  // Force reflow to start transition from initial state
  void htmlEl.offsetWidth
  htmlEl.style.opacity = '1'
  htmlEl.style.transform = 'scale(1)'
  setTimeout(done, 400)
}

function onLeave(el: Element, done: () => void) {
  const htmlEl = el as HTMLElement
  htmlEl.style.transition = 'all 0.3s ease-in'
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'scale(0.8)'
  setTimeout(done, 300)
}
</script>

<template>
  <div class="demo-page">
    <h2 class="demo-title">Transition Component — CSS and JS Animations</h2>
    <p class="demo-intro">
      <code>&lt;Transition&gt;</code> applies enter/leave animations to a single element.
      Use CSS classes or JavaScript hooks. Always use <code>v-enter-from</code>
      (Vue 3), not <code>v-enter</code> (Vue 2 — removed).
    </p>

    <div class="naming-banner">
      <strong>Vue 2 vs Vue 3 class names:</strong>
      <span class="old-name">.v-enter</span> → <span class="new-name">.v-enter-from</span>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <span class="old-name">.v-leave</span> → <span class="new-name">.v-leave-from</span>
    </div>

    <div class="demos-grid">
      <!-- 1. CSS fade transition -->
      <section class="demo-card">
        <h3>1. CSS Fade — <code>name="fade"</code></h3>
        <p class="demo-desc">
          Six classes drive the transition: <code>fade-enter-from</code>,
          <code>fade-enter-active</code>, <code>fade-enter-to</code> (and leave equivalents).
        </p>
        <div class="demo-body">
          <button class="btn btn-primary" @click="showFade = !showFade">
            {{ showFade ? 'Hide' : 'Show' }}
          </button>

          <!-- name="fade" → classes: .fade-enter-from, .fade-enter-active, .fade-enter-to,
                                      .fade-leave-from, .fade-leave-active, .fade-leave-to -->
          <Transition name="fade">
            <div v-if="showFade" class="animated-box">
              I fade in and out
            </div>
          </Transition>
        </div>
        <pre class="code-snippet">/* CSS */
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
/* .fade-enter-to and .fade-leave-from are defaults (opacity: 1) */

&lt;Transition name="fade"&gt;
  &lt;div v-if="show"&gt;...&lt;/div&gt;
&lt;/Transition&gt;</pre>
      </section>

      <!-- 2. mode="out-in" -->
      <section class="demo-card">
        <h3>2. mode="out-in" — Component Switching</h3>
        <p class="demo-desc">
          <code>mode="out-in"</code> waits for the leaving element to finish
          before the entering element begins. Prevents overlap.
        </p>
        <div class="demo-body">
          <div class="btn-group">
            <button
              v-for="v in views"
              :key="v"
              class="btn btn-sm"
              :class="{ active: activeView === v }"
              @click="activeView = v"
            >
              View {{ v }}
            </button>
          </div>

          <!-- mode="out-in": leave completes first, then enter starts -->
          <Transition name="slide" mode="out-in">
            <div :key="activeView" class="view-box" :class="`view-${activeView.toLowerCase()}`">
              <strong>View {{ activeView }}</strong>
              <p>Content for view {{ activeView }}</p>
            </div>
          </Transition>
        </div>
        <pre class="code-snippet">&lt;Transition name="slide" mode="out-in"&gt;
  &lt;!-- :key forces re-mount when activeView changes --&gt;
  &lt;div :key="activeView"&gt;View {{ activeView }}&lt;/div&gt;
&lt;/Transition&gt;

/* mode="out-in": old leaves → new enters (no overlap) */
/* mode="in-out": new enters → old leaves               */</pre>
      </section>

      <!-- 3. appear -->
      <section class="demo-card">
        <h3>3. appear — Transition on First Render</h3>
        <p class="demo-desc">
          The <code>appear</code> prop applies the enter transition when the
          component is first mounted, not just on subsequent toggles.
        </p>
        <div class="demo-body">
          <button class="btn btn-primary" @click="showAppear = !showAppear">
            {{ showAppear ? 'Unmount' : 'Mount with appear' }}
          </button>

          <!-- appear: applies enter transition even on initial render -->
          <Transition name="bounce" appear>
            <div v-if="showAppear" class="appear-box">
              I animate on mount (appear) and on unmount
            </div>
          </Transition>
        </div>
        <pre class="code-snippet">&lt;!-- appear applies enter classes on first render --&gt;
&lt;Transition name="bounce" appear&gt;
  &lt;div v-if="show"&gt;...&lt;/div&gt;
&lt;/Transition&gt;</pre>
      </section>

      <!-- 4. JavaScript hooks -->
      <section class="demo-card">
        <h3>4. JavaScript Hooks — Manual Animation</h3>
        <p class="demo-desc">
          Use JS hooks for animations that CSS cannot express (spring physics,
          GSAP, etc.). Call <code>done()</code> when the animation completes.
        </p>
        <div class="demo-body">
          <button class="btn btn-primary" @click="showJs = !showJs">
            {{ showJs ? 'Hide' : 'Show (spring)' }}
          </button>

          <!-- JS hooks: @before-enter, @enter, @leave -->
          <!-- :css="false" skips CSS class injection for pure JS animation -->
          <Transition
            :css="false"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @leave="onLeave"
          >
            <div v-if="showJs" class="js-box">
              Spring animation via JS hooks
            </div>
          </Transition>
        </div>
        <pre class="code-snippet">&lt;Transition
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
&gt;
  &lt;div v-if="show"&gt;...&lt;/div&gt;
&lt;/Transition&gt;

function onEnter(el, done) {
  el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  el.style.opacity = '1'
  setTimeout(done, 400) // MUST call done() to signal completion
}</pre>
      </section>
    </div>

    <!-- CSS class lifecycle diagram -->
    <section class="lifecycle-diagram">
      <h3>Transition Class Lifecycle</h3>
      <div class="timeline">
        <div class="phase enter-phase">
          <div class="phase-label">ENTER</div>
          <div class="timeline-steps">
            <div class="step">
              <code>v-enter-from</code>
              <span>Initial state (before insert)</span>
            </div>
            <div class="step step-active">
              <code>v-enter-active</code>
              <span>Duration + easing (entire enter phase)</span>
            </div>
            <div class="step">
              <code>v-enter-to</code>
              <span>End state (after insert)</span>
            </div>
          </div>
        </div>
        <div class="phase leave-phase">
          <div class="phase-label">LEAVE</div>
          <div class="timeline-steps">
            <div class="step">
              <code>v-leave-from</code>
              <span>Initial state (start of leave)</span>
            </div>
            <div class="step step-active">
              <code>v-leave-active</code>
              <span>Duration + easing (entire leave phase)</span>
            </div>
            <div class="step">
              <code>v-leave-to</code>
              <span>End state (after remove)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  padding: 1.5rem;
  max-width: 960px;
}

.demo-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e1b4b;
  margin: 0 0 0.5rem;
}

.demo-intro {
  color: #4b5563;
  margin: 0 0 1rem;
  line-height: 1.6;
  font-size: 0.9rem;
}

.naming-banner {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-left: 4px solid #f59e0b;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  color: #92400e;
}

.old-name {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
  text-decoration: line-through;
}

.new-name {
  background: #dcfce7;
  color: #16a34a;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
}

.demos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.demo-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.demo-card h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #1e1b4b;
}

.demo-desc {
  font-size: 0.82rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.demo-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 80px;
}

.btn {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  align-self: flex-start;
}

.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover { background: #4338ca; }

.btn-group { display: flex; gap: 0.25rem; flex-wrap: wrap; }

.btn-sm {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  color: #374151;
}

.btn-sm.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
}

.animated-box {
  padding: 0.75rem 1rem;
  background: #f5f3ff;
  border: 2px solid #4f46e5;
  border-radius: 6px;
  color: #4f46e5;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-box {
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.view-box p { margin: 0.3rem 0 0; font-size: 0.82rem; color: #6b7280; }

.view-a { background: #f5f3ff; border: 1px solid #a78bfa; color: #5b21b6; }
.view-b { background: #ecfdf5; border: 1px solid #6ee7b7; color: #065f46; }
.view-c { background: #fff7ed; border: 1px solid #fcd34d; color: #92400e; }

.appear-box {
  padding: 0.75rem 1rem;
  background: #ecfdf5;
  border: 2px solid #16a34a;
  border-radius: 6px;
  color: #15803d;
  font-weight: 500;
  font-size: 0.9rem;
}

.js-box {
  padding: 1rem;
  background: #fff7ed;
  border: 2px solid #f59e0b;
  border-radius: 6px;
  color: #92400e;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
}

.code-snippet {
  background: #1e1b4b;
  color: #c4b5fd;
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  font-size: 0.7rem;
  line-height: 1.55;
  overflow-x: auto;
  margin: 0;
  white-space: pre;
}

/* ── Fade CSS classes ───────────────────────────────────── */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

/* ── Slide CSS classes ─────────────────────────────────── */
.slide-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

/* ── Bounce CSS classes ────────────────────────────────── */
.bounce-enter-from {
  opacity: 0;
  transform: scale(0.7);
}

.bounce-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bounce-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.bounce-leave-active {
  transition: all 0.25s ease-in;
}

/* ── Lifecycle diagram ─────────────────────────────────── */
.lifecycle-diagram {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.lifecycle-diagram h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #374151;
}

.timeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .timeline { grid-template-columns: 1fr; }
}

.phase {
  border-radius: 6px;
  overflow: hidden;
}

.phase-label {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.enter-phase .phase-label { background: #dcfce7; color: #15803d; }
.leave-phase .phase-label { background: #fee2e2; color: #b91c1c; }

.timeline-steps {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 6px 6px;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0.75rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.8rem;
}

.step code {
  font-size: 0.75rem;
  background: #f3f4f6;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  min-width: 140px;
  flex-shrink: 0;
}

.step span { color: #6b7280; }

.step-active {
  background: #f9fafb;
}

.step-active code { background: #fef3c7; }

code {
  background: #f3f4f6;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  font-size: 0.82rem;
}
</style>
