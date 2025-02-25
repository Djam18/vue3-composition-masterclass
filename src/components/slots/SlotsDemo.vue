<script setup lang="ts">
// SlotsDemo — parent using all slot patterns

import BaseCard from './BaseCard.vue'
import DataTable from './DataTable.vue'
import DynamicSlotDemo from './DynamicSlotDemo.vue'
import { ref } from 'vue'

// DataTable demo data
const columns = [
  { key: 'id', label: '#', width: '50px' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

const users = ref([
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active' },
  { id: 2, name: 'Grace Hopper', role: 'Admiral', status: 'active' },
  { id: 3, name: 'Linus Torvalds', role: 'Creator', status: 'inactive' },
])

const showEmpty = ref(false)
</script>

<template>
  <div class="slots-demo">
    <h2>Slots</h2>

    <p class="intro">
      Slots enable component composition by letting the parent inject arbitrary content into
      specific regions of a child component. Vue supports default slots, named slots, scoped slots
      (slots that expose data from the child), and dynamic slot names.
    </p>

    <!-- ===== Section 1: Default + Named Slots ===== -->
    <section class="section">
      <h3>1. Default + Named Slots (BaseCard)</h3>
      <p>
        <code>BaseCard</code> has three slot regions: <code>#header</code>, default body,
        <code>#footer</code>.
      </p>

      <div class="card-grid">
        <!-- Full card with all slots filled -->
        <BaseCard elevated>
          <template #header>
            <h4 style="margin: 0">User Profile</h4>
          </template>

          <p>This content goes into the <strong>default slot</strong>.</p>
          <p style="font-size: 0.85rem; color: #6b7280">Member since 2023</p>

          <template #footer>
            <button class="btn btn-outline">Cancel</button>
            <button class="btn btn-primary">Save</button>
          </template>
        </BaseCard>

        <!-- Card with only default slot -->
        <BaseCard>
          <p>This card has no <code>#header</code> or <code>#footer</code>.</p>
          <p style="font-size: 0.85rem; color: #6b7280">
            The <code>v-if="$slots.header"</code> condition hides the empty header.
          </p>
        </BaseCard>

        <!-- Card with fallback content (no slot provided) -->
        <BaseCard elevated>
          <template #header>Fallback Demo</template>
          <!-- No default slot — shows fallback: "No content provided." -->
        </BaseCard>
      </div>
    </section>

    <!-- ===== Section 2: Scoped Slots ===== -->
    <section class="section">
      <h3>2. Scoped Slots (DataTable)</h3>
      <p>
        The child (<code>DataTable</code>) exposes row data via a scoped slot. The parent controls
        rendering — including custom status badges — while the child manages the loop.
      </p>

      <div class="demo-row">
        <label class="toggle-label">
          <input v-model="showEmpty" type="checkbox" />
          Show empty table
        </label>
      </div>

      <DataTable :columns="columns" :rows="showEmpty ? [] : users" row-key="id">
        <!-- Scoped slot: receive row + index from child -->
        <template #row="{ row, index }">
          <td>{{ index + 1 }}</td>
          <td>
            <strong>{{ row['name'] }}</strong>
          </td>
          <td>
            <span class="role-badge">{{ row['role'] }}</span>
          </td>
          <td>
            <span :class="`status-${row['status']}`">{{ row['status'] }}</span>
          </td>
        </template>

        <!-- Named slot for the empty state -->
        <template #empty>
          <div class="empty-state">No users found. Try adjusting filters.</div>
        </template>
      </DataTable>

      <div class="code-block">
        <pre>
&lt;!-- Parent controls row rendering via scoped slot --&gt;
&lt;DataTable :columns="cols" :rows="users"&gt;
  &lt;template #row="&#123; row, index &#125;"&gt;
    &lt;td&gt;&#123;&#123; index + 1 &#125;&#125;&lt;/td&gt;
    &lt;td&gt;&#123;&#123; row.name &#125;&#125;&lt;/td&gt;
    &lt;td&gt;&lt;StatusBadge :status="row.status" /&gt;&lt;/td&gt;
  &lt;/template&gt;
&lt;/DataTable&gt;

&lt;!-- Child exposes slot props --&gt;
&lt;slot name="row" :row="row" :index="index" :columns="columns" /&gt;</pre
        >
      </div>
    </section>

    <!-- ===== Section 3: Dynamic Slots ===== -->
    <section class="section">
      <h3>3. Dynamic Slot Names</h3>
      <DynamicSlotDemo />
    </section>

    <!-- ===== Section 4: Key Concepts ===== -->
    <section class="section">
      <h3>Key Concepts</h3>
      <table class="comparison">
        <thead>
          <tr>
            <th>Slot Type</th>
            <th>Syntax</th>
            <th>Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Default</strong></td>
            <td><code>&lt;slot /&gt;</code></td>
            <td>Single content injection point</td>
          </tr>
          <tr>
            <td><strong>Named</strong></td>
            <td><code>&lt;slot name="header" /&gt;</code></td>
            <td>Multiple injection regions (header, body, footer)</td>
          </tr>
          <tr>
            <td><strong>Scoped</strong></td>
            <td><code>&lt;slot :data="value" /&gt;</code></td>
            <td>Child exposes data for parent to use in slot content</td>
          </tr>
          <tr>
            <td><strong>Dynamic</strong></td>
            <td><code>#[slotName]</code></td>
            <td>Slot name determined at runtime</td>
          </tr>
          <tr>
            <td><strong>Fallback</strong></td>
            <td>Content inside <code>&lt;slot&gt;...&lt;/slot&gt;</code></td>
            <td>Default content when parent doesn't provide anything</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.slots-demo {
  padding: 1.5rem;
  max-width: 900px;
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

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
}

.demo-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  cursor: pointer;
}

code {
  background: #f3f4f6;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.code-block {
  background: #1f2937;
  border-radius: 6px;
  padding: 0.6rem 0.85rem;
  margin-top: 0.75rem;
}

.code-block pre {
  color: #a5f3fc;
  font-family: monospace;
  font-size: 0.76rem;
  margin: 0;
  white-space: pre-wrap;
}

.btn {
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
}

.btn-primary {
  background: #4f46e5;
  color: #fff;
}

.btn-outline {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.role-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active {
  color: #059669;
  font-weight: 600;
  font-size: 0.85rem;
}

.status-inactive {
  color: #6b7280;
  font-size: 0.85rem;
}

.empty-state {
  color: #6b7280;
  font-style: italic;
  font-size: 0.875rem;
}

.comparison {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  margin-top: 0.75rem;
}

.comparison th,
.comparison td {
  border: 1px solid #e5e7eb;
  padding: 0.4rem 0.6rem;
  text-align: left;
}

.comparison th {
  background: #f3f4f6;
  font-weight: 600;
}
</style>
