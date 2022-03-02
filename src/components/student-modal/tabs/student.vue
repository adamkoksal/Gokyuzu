<template>
  <div v-if="loading" class="row flex flex-center">
    <q-spinner size="xl" />
  </div>
  <q-form v-else-if="!studentId || (studentId && student.ad)" @submit="onSubmit" class="q-gutter-md">
    <div class="row justify-end">
      <q-btn
        v-if="!canEdit"
        icon="mdi-account-edit"
        @click="canEdit = !canEdit"
        color="secondary"
        rounded
        dense
      >
        <q-tooltip>Düzenle</q-tooltip>
      </q-btn>
      <div v-if="canEdit">
        <q-btn
          icon="mdi-content-save"
          type="submit"
          color="secondary"
          rounded
          dense
        >
          <q-tooltip>Kaydet</q-tooltip>
        </q-btn>
        <q-btn
          class="on-right"
          icon="mdi-cancel"
          color="secondary"
          @click="discardChanges"
          rounded
          dense
        >
          <q-tooltip>İptal</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="row no-wrap">
      <q-input
        v-model="student.ad"
        label="Ad"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        :rules="[required]"
      />
      <q-input
        class="on-right"
        v-model="student.soyad"
        label="Soyad"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        :rules="[required]"
      />
    </div>
    <div class="row no-wrap">
      <q-input
        v-model="student.detail.tc"
        label="TC No"
        type="number"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        :rules="[required]"
      />
      <q-input
        class="on-right"
        v-model="student.detail.dogumTarihi"
        label="Doğum Tarihi"
        type="date"
        :readonly="!canEdit"
        style="width: 300px"
        stack-label
        outlined
        :rules="[required]"
      />
    </div>
    <div class="row no-wrap q-mb-lg">
      <div class="col">
        <q-select
          v-model="student.okul"
          :options="okulOptions"
          :readonly="!canEdit"
          label="Okul"
          style="width: 300px"
          outlined
          options-dense
          emit-value
        />
      </div>
      <div class="col">
        <div class="row no-wrap">
          <q-select
            class="q-ml-xs"
            v-model="student.detail.sube"
            :options="subeOptions"
            :readonly="!canEdit"
            label="Şube"
            style="width: 150px"
            outlined
            options-dense
            emit-value
          />
          <q-input
            class="on-right"
            v-model="student.no"
            label="Okul No"
            type="number"
            :readonly="!canEdit"
            style="width: 150px"
            maxlength="5"
            outlined
          />
        </div>
      </div>
    </div>
    <div class="row no-wrap q-mb-lg">
      <q-select
        v-model="student.sinif"
        :options="sinifOptions"
        :readonly="!canEdit"
        label="Sınıf"
        style="width: 300px"
        outlined
        options-dense
        emit-value
      />
      <q-select
        class="on-right"
        v-model="student.statu"
        :options="statuOptions"
        label="Statü"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        options-dense
        emit-value
      />
    </div>
    <div class="row no-wrap q-mb-lg">
      <q-input
        v-model="student.detail.email"
        label="Email"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
      />
      <q-input
        class="on-right"
        v-model="student.detail.phone"
        label="Telefon"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        mask="(###) ### ## ##"
      />
    </div>
    <div class="row no-wrap">
      <q-input
        v-model="student.detail.lgs"
        label="LGS Puanı"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        mask="###.###"
      />
      <q-select
        class="on-right"
        v-model="student.detail.servis"
        :options="servisOptions"
        label="Servis Durumu"
        :readonly="!canEdit"
        style="width: 300px"
        outlined
        options-dense
        emit-value
      />
    </div>
  </q-form>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { notify, validate } from "../../../utility";

const url = process.env.API;

export default defineComponent({
  name: "student-tab",

  props: {
    studentId: { type: Number, default: null },
  },

  created() {
    if (this.studentId) this.getData();
    else this.canEdit = true;
  },

  data() {
    return {
      canEdit: false,
      loading: false,
      student: {
        ogrenciId: null,
        ad: null,
        soyad: null,
        okul: null,
        no: null,
        sinif: null,
        statu: null,
        detail: {
          tc: null,
          dogumTarihi: null,
          email: null,
          phone: null,
          sube: null,
          lgs: null,
          servis: null,
        },
      },
      okulOptions: [
        { value: "ANASINIFI", label: "İLKOKUL - ANASINIFI" },
        { value: "İLKOKUL", label: "İLKOKUL" },
        { value: "ORTAOKUL", label: "ORTAOKUL" },
        { value: "KOLEJ", label: "KOLEJ" },
        { value: "FEN LİSESİ", label: "FEN LİSESİ" },
        { value: "Gökyüzü Marmara Salonu", label: "Gökyüzü Marmara Salonu" },
        { value: "Gökyüzü Sosyal Tesisler", label: "Gökyüzü Sosyal Tesisler" },
      ],
      subeOptions: ["A", "B", "C", "D", "E", "F"],
      statuOptions: ["Öğrenci", "Mezun", "Ayrıldı"],
      sinifOptions: [
        { value: "4 yaş", label: "4 yaş grubu" },
        { value: "5 yaş", label: "5 yaş grubu" },
        { value: "6 yaş", label: "6 yaş grubu" },
        { value: "1", label: "1. sınıf" },
        { value: "2", label: "2. sınıf" },
        { value: "3", label: "3. sınıf" },
        { value: "4", label: "4. sınıf" },
        { value: "5", label: "5. sınıf" },
        { value: "6", label: "6. sınıf" },
        { value: "7", label: "7. sınıf" },
        { value: "8", label: "8. sınıf" },
        { value: "9", label: "9. sınıf" },
        { value: "10", label: "10. sınıf" },
        { value: "11", label: "11 sınıf" },
        { value: "12", label: "12 sınıf" },
      ],
      servisOptions: [
        { value: "Yok", label: "Servis kullanmıyor" },
        { value: "Var", label: "Servis kullanıyor" },
      ],
    };
  },

  computed: {
    sessionId() {
      return this.$store.getters.sessionId || "";
    },
    uniquekey() {
      return this.$store.getters.uniquekey;
    },
    name() {
      return this.student?.ad
        ? "(" +
            (this.student?.ad || "") +
            " " +
            (this.student?.soyad || "") +
            ")"
        : null;
    },
  },

  watch: {
    canEdit(val) {
      this.$emit("updateEdit", val);
    },
  },

  methods: {
    required: (val) => validate.required(val),

    getData() {
      this.loading = true;
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "ogrenciDetail",
          sessionId: this.sessionId,
        },
        body: {
          ogrenciId: this.studentId,
        },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          // console.log(data);
          this.student = data.body.content;
          // TODO emit name here so we can display it on dialog title
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
      this.loading = false;
    },

    onSubmit() {
      const data = {
        envelope: {
          uniquekey: this.uniquekey,
          action: "ogrenciUpdate",
          sessionId: this.sessionId,
        },
        body: this.student,
      };
      console.log(JSON.stringify(data));
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
      console.log(data)
      if (data?.envelope?.message?.succeed === true) {
        notify.success(data?.envelope?.message?.detail);
        // this.studentId = data.body.ogrenciId;
        // this.getData();
        this.canEdit = false;
      } else {
        notify.error(data?.envelope?.message?.detail);
      }
      });
    },

    discardChanges() {
      this.getData();
      this.canEdit = false;
    },
  },
});
</script>
