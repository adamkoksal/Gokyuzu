<template>
  <q-dialog
    :modelValue="isOpen"
    @update:modelValue="$emit('update:is-open', false)"
    persistent
  >
    <q-card style="width: 5500px">
      <q-bar class="header text-white">
        <q-icon name="mdi-information" />
        <q-space />
        <div class="text-h6">Öğrenci Hakkında {{ name }}</div>
        <q-space />
        <q-btn icon="close" flat dense v-close-popup />
      </q-bar>

      <q-splitter v-model="splitterModel" style="height: 420px">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">
            <q-tab
              name="student"
              icon="mdi-school"
              label="Öğrenci"
              no-caps
            ></q-tab>
            <q-tab name="parent" icon="mdi-school" label="Veli" no-caps></q-tab>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="student">
              <q-form v-if="student" @submit="onSubmit" class="q-gutter-md">
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
                    style="width: 200px"
                    dense
                    outlined
                  />
                  <q-input
                    class="on-right"
                    v-model="student.soyad"
                    label="Soyad"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                  />
                </div>
                <div class="row no-wrap">
                  <q-input
                    v-model="student.detail.tc"
                    label="TC No"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                  />
                  <q-input
                    class="on-right"
                    v-model="student.detail.dogumTarihi"
                    label="Doğum Tarihi"
                    type="date"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                  />
                </div>
                <div class="row no-wrap">
                  <div class="col">
                    <q-select
                      v-model="student.okul"
                      :options="okulOptions"
                      :readonly="!canEdit"
                      label="Okul"
                      style="width: 200px"
                      dense
                      outlined
                      options-dense
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
                        style="width: 100px"
                        dense
                        outlined
                        options-dense
                      />
                      <q-input
                        class="on-right"
                        v-model="student.no"
                        label="Okul No"
                        type="number"
                        :readonly="!canEdit"
                        style="width: 100px"
                        maxlength="5"
                        dense
                        outlined
                      />
                    </div>
                  </div>
                </div>
                <div class="row no-wrap">
                  <q-select
                    v-model="student.sinif"
                    :options="sinifOptions"
                    :readonly="!canEdit"
                    label="Sınıf"
                    style="width: 200px"
                    dense
                    outlined
                    options-dense
                  />
                  <q-select
                    class="on-right"
                    v-model="student.statu"
                    :options="statuOptions"
                    label="Statü"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                    options-dense
                  />
                </div>
                <div class="row no-wrap">
                  <q-input
                    v-model="student.detail.email"
                    label="Email"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                  />
                  <q-input
                    class="on-right"
                    v-model="student.detail.phone"
                    label="Telefon"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                    mask="(###) ### ## ##"
                  />
                </div>
                <div class="row no-wrap">
                  <q-input
                    v-model="student.detail.lgs"
                    label="LGS Puanı"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                    mask="###.###"
                  />
                  <q-select
                    class="on-right"
                    v-model="student.servis"
                    :options="servisOptions"
                    label="Servis Durumu"
                    :readonly="!canEdit"
                    style="width: 200px"
                    dense
                    outlined
                    options-dense
                  />
                </div>
              </q-form>
              <div v-else  class="row flex flex-center">
                <q-spinner size="xl" />
              </div>
            </q-tab-panel>
            <q-tab-panel name="parent">
              <div class="text-h6 q-mb-xl">Parent</div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { notify } from "../utility";

const url = process.env.API;

export default defineComponent({
  name: "student-modal",
  props: {
    isOpen: { type: Boolean, default: false },
    studentId: { type: Number, default: null },
  },

  watch: {
    isOpen(val) {
      if (val && this.studentId) this.getStudentData();
      else Object.assign(this.$data, this.$options.data());
    },
  },

  data() {
    return {
      tab: "student",
      splitterModel: 20,
      canEdit: false,
      student: null,
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

  methods: {
    getStudentData() {
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
          this.student = data.body.content;
        } else {
          notify.error(data?.envelope?.message?.detail);
        }
      });
    },
    getParentData() {},
    onSubmit() {
      console.log("submitted");
    },
  },
});
</script>
