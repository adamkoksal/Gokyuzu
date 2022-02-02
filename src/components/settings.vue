<template>
  <q-btn
    color="primary"
    text-color="white"
    icon="mdi-cog"
    flat
    stretch
    @click="isOpen = true"
  >
    <q-tooltip>Ayarlar</q-tooltip>
  </q-btn>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 500px">
      <q-bar class="header text-white">
        <q-icon name="mdi-cog" />
        <q-space />
        <div class="text-h6">Ayarlar</div>
        <q-space />
        <q-btn icon="close" flat dense v-close-popup />
      </q-bar>

      <q-splitter v-model="splitterModel" style="height: 330px">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">
            <q-tab
              name="password"
              icon="mdi-lock"
              label="Şifre"
              no-caps
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
            <q-tab-panel name="password">
              <div>
                <div class="text-h6 q-mb-xl">Şifre Değiştir</div>
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <q-input
                    v-model="password"
                    label="Yeni Şifre"
                    filled
                    type="password"
                    :rules="[required, minChar]"
                  />
                  <q-input
                    v-model="confirmPassword"
                    label="Yeni Şifre Tekrar"
                    :rules="[required, minChar, matchPassw]"
                    filled
                    type="password"
                  />
                  <q-btn label="Onayla" type="submit" color="secondary" />
                </q-form>
              </div>
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
import { notify, validate } from "../utility";

const url = process.env.API;

export default defineComponent({
  name: "settings",

  data() {
    return {
      isOpen: false,
      tab: "password",
      splitterModel: 20,
      password: null,
      confirmPassword: null,
    };
  },

  computed: {
    sessionId () {
      return this.$store.getters.sessionId || ""
    },
    username () {
      return this.$store.getters.user.email || ""
    },
  },

  methods: {
    required: (val) => validate.required(val),
    minChar: (val) => validate.minChar(val),
    matchPassw(val) {
      return val === this.password || "Şifreler eşleşmiyor";
    },
    onSubmit() {
      const data = {
        envelope: {
          uniquekey: {
            talentName: "HardedSoft",
            customerName: "HardedSoft",
            userName: this.username,
          },
          action: "changePassword",
          sessionId: this.sessionId.toString(),
        },
        body: { password: this.password },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data.envelope.message.succeed === true) {
          notify.success("Şifre başarıyla değiştirildi");
        } else {
          notify.error(data.envelope.message.detail);
        }
      });
    },
  },
});
</script>
