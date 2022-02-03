<template>
  <q-table :rows="rows" :columns="columns" :loading="loading">
    <template v-slot:top-right>
      <q-input
        outlined
        dense
        debounce="300"
        placeholder="Ara"
        :modelValue="modelValue"
        @update:modelValue="event => $emit('update:modelValue', event)" 
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "data-table",

  props: {
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    loading: { type: Boolean, default: () => false },
    modelValue: { type: String, default: () => null },
  },

  data() {
    return {
    };
  },

  methods: {
  },
});
</script>
