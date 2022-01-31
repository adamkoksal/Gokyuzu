<template>
  <q-page class="flex-center q-pa-md">
    <data-table />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'src/components/data-table.vue'

export default defineComponent({
  name: 'student',

  components: {
    DataTable,
  }
})
</script>
