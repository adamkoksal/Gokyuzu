<template>
  <q-page class="flex-center q-pa-md">
    <data-table
      :columns="columns"
      :rows="rows"
      :loading="loading"
      v-model="search"
    />
  </q-page>

</template>

<script>
import DataTable from "src/components/data-table.vue";
import axios from "axios";
import { defineComponent } from "vue";
import { notify } from "../utility";

const url = process.env.API;

const columns = [
  { name: "ad", label: "Ad", field: "ad" },
  { name: "soyad", label: "Soyad", field: "soyad" },
  { name: "okul", label: "Okul", field: "okul" },
  { name: "no", label: "No", field: "no" },
  { name: "sinif", label: "Sınıf", field: "sinif" },
  { name: "statu", label: "Statü", field: "statu" },
];

export default defineComponent({
  name: "student",

  components: {
    DataTable,
  },

  created() {
    this.getData();
  },

  watch: {
    search() {
      this.getData()
    }
  },

  data() {
    return {
      columns,
      rows: [],
      loading: false,
      search: ""
    };
  },

  computed: {
    sessionId() {
      return this.$store.getters.sessionId || "";
    },
    uniquekey() {
      return this.$store.getters.uniquekey;
    },
  },
  methods: {
    turnLoad() {
      this.loading = !this.loading
    },
    async getData() {
      this.loading = true;
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "ogrenciList",
          sessionId: this.sessionId,
        },
        body: { page: 1, row: 17, search: this.search },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          this.rows = data.body.content;
        } else {
          notify.error(data.envelope.message.detail);
        }
      });
      this.loading = false;
    },
  },
});
</script>
