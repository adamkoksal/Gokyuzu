<template>
  <q-page class="flex-center q-pa-md">
    <student-modal v-model:is-open="isModalOpen" :student-id="selectedStudentId"></student-modal>
    <q-table
      class="q-pa-md cursor-pointer"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :rows-per-page-options="[0]"
      :pagination-label="() => `${pagination.page} - ${pageCount}`"
      v-model:pagination="pagination"
      @request="onRequest"
      @row-click="onRowClick"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          placeholder="Ara"
          color="secondary"
          v-model="search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import StudentModal from "../components/student-modal.vue";
import axios from "axios";
import { defineComponent } from "vue";
import { notify } from "../utility";

const url = process.env.API;

const columns = [
  { name: "ad", label: "Ad", field: "ad", align: "left", headerStyle: `width: 20%` },
  { name: "soyad", label: "Soyad", field: "soyad", align: "left", headerStyle: `width: 20%` },
  { name: "okul", label: "Okul", field: "okul", align: "left", headerStyle: `width: 20%` },
  { name: "no", label: "No", field: "no", align: "left", headerStyle: `width: 15%` },
  { name: "sinif", label: "Sınıf", field: "sinif", align: "left", headerStyle: `width: 12%` },
  { name: "statu", label: "Statü", field: "statu", align: "left", headerStyle: `width: 12%` },
];

export default defineComponent({
  name: "student",

  components: {
    StudentModal
  },

  created() {
    this.getData();
  },

  watch: {
    search() {
      this.pagination.page = 1;
      this.getData();
    },
  },

  data() {
    return {
      columns,
      rows: [],
      loading: true,
      search: "",
      pageCount: 0,
      isModalOpen: false,
      selectedStudentId: null,
      pagination: {
        page: 1,
        rowsPerPage: 4,
        rowsNumber: 20,
      },
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
    async getData() {
      this.loading = true;
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "ogrenciList",
          sessionId: this.sessionId,
        },
        body: {
          row: this.pagination.rowsPerPage,
          page: this.pagination.page,
          search: this.search,
        },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          this.rows = data.body.content;
          this.pagination.rowsNumber =
            data.envelope.paging.rowCount * data.envelope.paging.pageCount;
          this.pageCount = data.envelope.paging.pageCount;
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await timeout(400);
      this.loading = false;
    },

    onRequest(props) {
      this.pagination.page = props.pagination.page;
      this.getData();
    },

    onRowClick(event, row) {
      this.selectedStudentId = row.ogrenciId;
      this.isModalOpen = true;
    }
  },
});
</script>
