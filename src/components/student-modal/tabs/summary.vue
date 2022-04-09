<template>
  <div v-if="loading" class="row flex flex-center">
    <q-spinner size="xl" />
  </div>
  <div v-if="detail.tc" class="details">
    <div class="text"><b>TC No:</b> {{detail.tc}}</div>
    <div class="text"><b>Doğum Tarihi:</b> {{detail.dogumTarihi}}</div>
    <div class="text"><b>Cep Telefonu:</b> {{detail.phone || "-"}}</div>
    <div class="text"><b>Email:</b> {{detail.email || "-"}}</div>
  </div>
  <q-scroll-area style="height: 400px; padding-top: 30px">
    <div v-if="parents.length" class="parents">
      <div class="parent" v-for="(parent, index) in parents" :key="parent.veliId">
        <h5 class="text"><b>Veli {{index + 1}}</b></h5>
        <div class="text text-capitalize"><b>Yakınlık: </b>{{parent.yakin || "-"}}</div>
        <div class="text text-capitalize"><b>Adı Soyadı:</b> {{parent.ad}} {{parent.soyad}}</div>
        <div class="text"><b>Cep Telefonu:</b> {{parent.phone || "-"}}</div>
        <div class="text"><b>Email:</b> {{parent.email || "-"}}</div>
      </div>
    </div>
  </q-scroll-area>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { notify } from "../../../utility";

const url = process.env.API;

export default defineComponent({
  name: "student-tab",

  props: {
    studentId: { type: Number, default: null },
  },

  created() {
    this.getData();
  },

  data() {
    return {
      loading: false,
      detail: {
        dogumTarihi: null,
        tc: null,
        email: null,
        phone: null,
        sube: null,
        lgs: null,
        servis: null,
      },
      parents: []
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

  watch: {
    canEdit(val) {
      this.$emit("updateEdit", val);
    },
  },

  methods: {
    getData() {
      this.loading = true;
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "ogrenciSummary",
          sessionId: this.sessionId
        },
        body: {
          ogrenciId: this.studentId,
        },
      };

      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          this.detail = data.body.content.detail;
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });

      data.envelope.action = "ogrenciVeliList";
      data.body = {...data.body, "page":1,"row":5,"search":""}
      
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          this.parents = data.body.content;
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
      this.loading = false;
    },
  },
});
</script>

<style scoped>
.details {
  font-size: 20px; 
  padding: 10px;
  border-bottom: 1px solid grey;
}
.parents {
  font-size: 20px; 
  padding: 10px;
  padding-top: 0;
  margin-top: 10px;
}

.parent {
  margin-bottom: 20px;
  padding-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid lightgray;
}

.text {
  margin: 10px;
}
</style>
