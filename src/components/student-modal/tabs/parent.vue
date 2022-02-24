<template>
  <q-table
    class="q-pa-md"
    :rows="rows"
    :columns="columns"
    :loading="loading"
    :rows-per-page-options="[0]"
  >
  </q-table>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";

const url = process.env.API;

export default defineComponent({
  name: "parent-tab",

  props: {
    studentId: { type: Number, default: null },
  },

  data() {
    return {
      columns: [
        { // name // email / phone // yakinlik // actions
          name: "ad",
          label: "Ad",
          field: "ad",
          align: "left",
          headerStyle: `width: 20%`,
        },
      ],
    };
  },
});
</script>
