<script setup lang="ts">
// DataTable — scoped slot for row rendering
// A scoped slot allows the parent to control HOW each row looks,
// while the child controls the loop and data access.

interface Column {
  key: string
  label: string
  width?: string
}

interface Props {
  columns: Column[]
  rows: Record<string, unknown>[]
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
})
</script>

<template>
  <!--
    DataTable exposes a scoped slot named 'row'.
    The parent decides how to render each row's cells.

    Usage:
      <DataTable :columns="cols" :rows="data">
        <template #row="{ row, index }">
          <td>{{ row.name }}</td>
          <td>{{ row.age }}</td>
        </template>
      </DataTable>
  -->
  <div class="data-table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? `width: ${col.width}` : undefined"
          >
            <!-- Named slot for header cell customization -->
            <slot :name="`header-${col.key}`" :column="col">
              {{ col.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="String(row[props.rowKey] ?? index)">
          <!--
            Scoped slot 'row' exposes: row (the data), index, columns
            The parent receives these via v-slot="{ row, index }"
          -->
          <slot name="row" :row="row" :index="index" :columns="columns">
            <!-- Default rendering fallback — renders each column's value -->
            <td v-for="col in columns" :key="col.key">
              {{ row[col.key] ?? '—' }}
            </td>
          </slot>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="empty-row">
            <slot name="empty">No data available.</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.data-table-wrapper {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  background: #f9fafb;
  padding: 0.6rem 0.85rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 0.5rem 0.85rem;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.empty-row {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 1rem;
}
</style>
