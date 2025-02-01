<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])
const clickPos = ref<{ x: number; y: number } | null>(null)
const inputValue = ref<string>('')

function addLog(msg: string) {
  log.value = [...log.value, `[${new Date().toLocaleTimeString()}] ${msg}`]
}

// All handler functions — template uses modifiers declaratively
function onEnterPressed() {
  addLog(`Enter pressed — value: "${inputValue.value}"`)
}

function onEscPressed() {
  addLog('Escape pressed — clearing input')
  inputValue.value = ''
}

function onCtrlS() {
  addLog('Ctrl+S — save triggered')
}

function onCtrlEnter() {
  addLog('Ctrl+Enter — submit triggered')
}

function onSelfClick(e: MouseEvent) {
  addLog(`.self — clicked the container directly (not a child): ${e.type}`)
}

function onCapture(e: MouseEvent) {
  addLog(`.capture — event captured on the way down: ${(e.target as HTMLElement).tagName}`)
}

function onClickOnce() {
  addLog('.once — fires only once (button now inert)')
}

function onPassiveScroll() {
  addLog('.passive — scroll event (cannot call preventDefault)')
}

function onRightClick() {
  addLog('.right — right mouse button clicked')
}

function onMiddleClick() {
  addLog('.middle — middle mouse button clicked')
}

function onClickCoords(e: MouseEvent) {
  clickPos.value = { x: e.offsetX, y: e.offsetY }
  addLog(`click at (${e.offsetX}, ${e.offsetY})`)
}
</script>

<template>
  <div class="keyboard-shortcuts">
    <h2>Event Handling — Modifiers</h2>

    <section>
      <h3>Key modifiers — keyboard shortcuts</h3>
      <input
        v-model="inputValue"
        type="text"
        placeholder="Type here..."
        class="demo-input"
        @keyup.enter="onEnterPressed"
        @keyup.escape="onEscPressed"
        @keydown.ctrl.s.prevent="onCtrlS"
        @keydown.ctrl.enter="onCtrlEnter"
        @keydown.tab.prevent="addLog('Tab intercepted')"
        @keydown.space="addLog('Space pressed')"
        @keyup.up="addLog('Arrow Up')"
        @keyup.down="addLog('Arrow Down')"
        @keyup.delete="addLog('Delete pressed')"
      />
      <div class="shortcuts-hint">
        <code>Enter</code> log value ·
        <code>Escape</code> clear ·
        <code>Ctrl+S</code> save ·
        <code>Ctrl+Enter</code> submit ·
        <code>Tab</code> intercepted ·
        <code>↑↓</code> navigate
      </div>
    </section>

    <section>
      <h3>Event modifiers</h3>
      <div class="modifier-demos">

        <!-- .prevent — preventDefault() -->
        <div class="demo-row">
          <label><code>@submit.prevent</code></label>
          <form @submit.prevent="addLog('.prevent — form submit prevented')">
            <input type="text" placeholder="Try submitting" />
            <button type="submit">Submit</button>
          </form>
        </div>

        <!-- .stop — stopPropagation() -->
        <div class="demo-row">
          <label><code>@click.stop</code></label>
          <div
            class="outer-box"
            @click="addLog('outer clicked (without .stop this fires for inner too)')"
          >
            outer
            <button @click.stop="addLog('.stop — inner clicked, propagation stopped')">
              inner (.stop)
            </button>
          </div>
        </div>

        <!-- .self — only fires when event target IS the element itself, not a child -->
        <div class="demo-row">
          <label><code>@click.self</code></label>
          <div class="outer-box" @click.self="onSelfClick">
            click me directly (not the button)
            <button @click="addLog('button clicked (not propagated to .self container)')">
              inner button
            </button>
          </div>
        </div>

        <!-- .capture — use capture phase (fires before bubbling listeners) -->
        <div class="demo-row">
          <label><code>@click.capture</code></label>
          <div class="outer-box" @click.capture="onCapture">
            capture container
            <button @click="addLog('button click (capture parent fires first)')">
              inner button
            </button>
          </div>
        </div>

        <!-- .once — auto-removed after first trigger -->
        <div class="demo-row">
          <label><code>@click.once</code></label>
          <button @click.once="onClickOnce">.once (click me — I fire once then stop)</button>
        </div>

      </div>
    </section>

    <section>
      <h3>Mouse button modifiers</h3>
      <div class="click-area"
        @click.left="onClickCoords"
        @click.right.prevent="onRightClick"
        @click.middle="onMiddleClick"
      >
        Click area — left / right / middle
        <span v-if="clickPos" class="pos">{{ clickPos.x }}, {{ clickPos.y }}</span>
      </div>
      <div class="shortcuts-hint">
        <code>.left</code> primary click ·
        <code>.right.prevent</code> context menu blocked ·
        <code>.middle</code> wheel button
      </div>
    </section>

    <section>
      <h3>System key modifiers — .ctrl .alt .shift .meta</h3>
      <div
        class="key-demo-box"
        tabindex="0"
        @click.ctrl="addLog('Ctrl+Click')"
        @click.alt="addLog('Alt+Click')"
        @click.shift="addLog('Shift+Click')"
        @click.meta="addLog('Meta/Cmd+Click')"
      >
        Click with Ctrl / Alt / Shift / Cmd held
      </div>
    </section>

    <section>
      <h3>Event log</h3>
      <div class="log-box">
        <div v-if="log.length === 0" class="empty">Interact above — events appear here</div>
        <div v-for="(entry, i) in log" :key="i" class="log-entry">{{ entry }}</div>
      </div>
      <button @click="log = []">Clear</button>
    </section>

    <section class="note">
      <h3>Modifier chaining — order matters</h3>
      <ul>
        <li><code>@click.self.stop</code> — first check self, then stop propagation</li>
        <li><code>@keydown.ctrl.s.prevent</code> — Ctrl+S, prevent browser save</li>
        <li><code>@click.right.prevent</code> — right click with prevented context menu</li>
        <li><code>.passive</code> cannot be combined with <code>.prevent</code> (they conflict)</li>
        <li>Key aliases: <code>.enter</code> <code>.esc</code> / <code>.escape</code> <code>.tab</code> <code>.space</code> <code>.up</code> <code>.down</code> <code>.left</code> <code>.right</code> <code>.delete</code></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.keyboard-shortcuts {
  padding: 1rem;
  max-width: 640px;
}

section {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

section.note {
  background: #fffbe6;
  border-color: #e6c700;
}

h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #555;
}

.demo-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95rem;
  width: 100%;
  margin-bottom: 0.4rem;
}

.shortcuts-hint {
  font-size: 0.78rem;
  color: #888;
}

.modifier-demos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.demo-row label {
  min-width: 160px;
  font-size: 0.85rem;
  padding-top: 0.35rem;
}

.outer-box {
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

button {
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.click-area {
  background: #e8f5e9;
  border: 2px dashed #81c784;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  font-size: 0.9rem;
}

.pos {
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 0.75rem;
  color: #555;
  font-family: monospace;
}

.key-demo-box {
  background: #f5f0ff;
  border: 2px dashed #9b59b6;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  outline: none;
}

.key-demo-box:focus {
  box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.3);
}

.log-box {
  background: #1a1a1a;
  color: #7ec8a0;
  font-family: monospace;
  font-size: 0.78rem;
  padding: 0.75rem;
  border-radius: 4px;
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
}

.log-entry {
  margin-bottom: 0.2rem;
}

.empty {
  color: #666;
}

ul {
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
}

li {
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
}

code {
  background: #eee;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.82em;
}
</style>
