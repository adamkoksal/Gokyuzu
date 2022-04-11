<template>
  <div v-if="loading" class="row flex flex-center">
    <q-spinner size="xl" />
  </div>
  <div v-else-if="parents.length">
    <table>
      <tr>
        <th style="width: 150px">Ad Soyad</th>
        <th style="width: 100px">Yakınlık</th>
        <th>E-mail</th>
        <th>Phone</th>
        <th style="width: 80px"></th>
      </tr>
      <tr v-for="(parent, index) in parents" :key="index">
        <td class="text-capitalize">{{ parent.ad }} {{ parent.soyad }}</td>
        <td class="text-capitalize">
          {{
            yakinOptions.find((option) => option.value === parent.yakin)
              ?.label || parent.yakin
          }}
        </td>
        <td>{{ parent.email }}</td>
        <td>{{ parent.phone }}</td>
        <td>
          <div v-if="!parent.edit && !isAnyEdit">
            <q-btn
              @click="parent.edit = true"
              icon="mdi-account-edit"
              dense
              rounded
              flat
              size="10px"
            >
              <q-tooltip>Düzenle</q-tooltip>
            </q-btn>
            <!-- // TODO // Veliye git bagla -->
            <q-btn
              class="on-right"
              icon="mdi-account"
              dense
              rounded
              flat
              size="10px"
            >
              <q-tooltip>Veliye git</q-tooltip>
            </q-btn>
          </div>
          <div v-if="parent.edit">
            <q-btn
              icon="mdi-cancel"
              @click="parent.edit = false"
              rounded
              dense
              flat
              size="10px"
            >
              <q-tooltip>İptal</q-tooltip>
            </q-btn>
            <q-btn
              v-if="parent.veliId"
              class="on-right"
              icon="mdi-delete"
              @click="() => removeParent(parent.veliId)"
              rounded
              dense
              flat
              size="10px"
            >
              <q-tooltip>Kaldır</q-tooltip>
            </q-btn>
          </div>
        </td>
      </tr>
      <tr v-if="isNewParentRowOpen">
        <td style="max-width: 150px">
          <q-select
            v-model="newParent.veliId"
            use-input
            dense
            clearable
            borderless
            emit-value
            map-options
            label="Veli Ara"
            @input-value="searchParent"
            :options="parentOptions"
          />
        </td>
        <td style="max-width: 100px">
          <q-select
            v-model="newParent.yakin"
            dense
            borderless
            emit-value
            map-options
            :options="yakinOptions"
          />
        </td>
        <td></td>
        <td></td>
        <td>
          <q-btn
            @click="resetNewParent"
            icon="mdi-cancel"
            rounded
            dense
            flat
            size="10px"
          >
            <q-tooltip>İptal</q-tooltip>
          </q-btn>
          <q-btn
            @click="saveParent"
            class="on-right"
            icon="mdi-content-save"
            rounded
            dense
            flat
            size="10px"
          >
            <q-tooltip>Kaydet</q-tooltip>
          </q-btn>
        </td>
      </tr>
    </table>
    <div class="row justify-end">
      <q-btn
        v-if="!isAnyEdit && !isNewParentRowOpen"
        class="q-ma-sm"
        label="Yeni Veli Ekle"
        icon="person_add_alt_1"
        padding="md"
        flat
        no-caps
        @click="addRow"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { notify } from "../../../utility";

const url = process.env.API;

export default defineComponent({
  name: "parent-tab",

  emits: ["updateEdit"],

  props: {
    studentId: { type: Number, default: null },
  },

  created() {
    if (this.studentId) this.getData();
  },

  data() {
    return {
      loading: false,
      parents: [],
      parentOptions: [],
      yakinOptions: [
        { value: "anne", label: "Anne" },
        { value: "baba", label: "Baba" },
        { value: "kardeş", label: "Kardeş" },
        { value: "hala", label: "Hala" },
        { value: "teyze", label: "Teyze" },
        { value: "amca", label: "Amca" },
        { value: "dayı", label: "Dayı" },
        { value: "babanne", label: "Babaanne" },
        { value: "anane", label: "Anane" },
        { value: "dede-anne", label: "Dede (anne)" },
        { value: "dede-baba", label: "Dede (baba)" },
        { value: "diğer", label: "Diğer" },
      ],
      newParent: {
        veliId: null,
        yakin: null,
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
    isAnyEdit() {
      return this.parents.some((parent) => parent.edit);
    },
    isNewParentRowOpen() {
      return this.newParent.veliId != null || this.newParent.yakin != null;
    },
  },

  watch: {
    isAnyEdit(val) {
      this.$emit("updateEdit", val);
    },
  },

  methods: {
    getData() {
      this.loading = true;
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "ogrenciVeliList",
          sessionId: this.sessionId,
        },
        body: {
          ogrenciId: this.studentId,
          page: 1,
          row: 10,
          search: "",
        },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          this.parents = data.body.content.map((parent) => ({
            ...parent,
            edit: false,
          }));
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
      this.loading = false;
    },

    addRow() {
      this.searchParent("");
      this.newParent = {
        veliId: "",
        yakin: "",
      };
    },

    searchParent(search) {
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "veliSelectList",
          sessionId: this.sessionId,
        },
        body: { search },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          this.parentOptions = data.body.content.map((parent) => ({
            label: `${parent.ad} ${parent.soyad}`,
            value: parent.veliId,
          }));
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
    },

    saveParent() {
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "veliInsert",
          sessionId: this.sessionId,
        },
        body: {
          ogrenciId: this.studentId,
          veliId: this.newParent.veliId,
          yakin: this.newParent.yakin,
        },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          notify.success(data?.envelope?.message?.detail);
          this.getData();
          this.resetNewParent();
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
    },

    removeParent(veliId) {
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "veliDelete",
          sessionId: this.sessionId,
        },
        body: { ogrenciId: this.studentId, veliId },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          notify.success(data?.envelope?.message?.detail);
          this.getData();
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
    },

    resetNewParent() {
      Object.assign(this.$data.newParent, this.$options.data().newParent);
    },
  },
});
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border-bottom: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr {
  height: 55px;
}

</style>
