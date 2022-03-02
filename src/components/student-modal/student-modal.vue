<template>
  <q-dialog
    :modelValue="isOpen"
    @update:modelValue="$emit('update:is-open', false)"
    persistent
  >
    <q-card style="min-width: 800px">
      <q-bar class="header text-white">
        <q-icon name="mdi-information" />
        <q-space />
        <div class="text-h6">Öğrenci Hakkında - name</div>
        <q-space />
        <q-btn icon="close" flat dense v-close-popup :disable="canEdit" />
      </q-bar>

      <q-splitter v-model="splitterModel" style="height: 650px">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">
            <q-tab
              name="student"
              icon="mdi-school"
              label="Öğrenci"
              no-caps
            ></q-tab>
            <q-tab
              name="parent"
              icon="mdi-school"
              label="Veli"
              no-caps
              :disable="canEdit || !studentId"
            ></q-tab>
            <q-tab
              name="address"
              icon="mdi-home"
              label="Adres"
              no-caps
              :disable="canEdit || !studentId"
            ></q-tab>
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
              <student-tab :studentId="studentId" @update-edit="onUpdateEdit" />
            </q-tab-panel>
            <q-tab-panel name="parent">
              <parent-tab :studentId="studentId" />
            </q-tab-panel>
            <q-tab-panel name="address">
              <div class="text-h6 q-mb-xl">Address</div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import StudentTab from "./tabs/student.vue";
import ParentTab from "./tabs/parent.vue";

export default defineComponent({
  name: "student-modal",

  components: {
    StudentTab,
    ParentTab,
  },

  props: {
    isOpen: { type: Boolean, default: false },
    studentId: { type: Number, default: null },
  },

  watch: {
    isOpen(val) {
      if (!val) Object.assign(this.$data, this.$options.data());
    },
  },

  data() {
    return {
      tab: "student",
      splitterModel: 20,
      canEdit: false,
    };
  },

  computed: {},

  methods: {
    onUpdateEdit(canEdit) {
      this.canEdit = canEdit;
    },
  },
});
</script>
