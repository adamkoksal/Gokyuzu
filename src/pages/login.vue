<template>
  <q-layout>
    <q-page-container class="login-background">
      <q-page class="flex flex-center">
        <q-card class="login-form" style="width: 30%">
          <div class="row justify-center q-pa-md">
            <q-img
              src="/icons/gokyuzu.png"
              style="height: auto; width: 200px"
            ></q-img>
          </div>
          <q-card-section>
            <q-form class="q-gutter-md q-pa-md" @submit="login">
              <q-input
                filled
                v-model="username"
                label="Kullanıcı"
                :rules="[required]"
              />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Şifre"
                :rules="[required]"
              />
              <div class="row justify-between">
                <q-btn
                  flat
                  color="primary"
                  label="Şifremi unuttum"
                  dense
                  no-caps
                  @click="forgotPass"
                />
                <q-btn label="Login" type="submit" color="secondary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { notify, validate } from "../utility";

// TODO
const url = process.env.API + "auth/";

export default defineComponent({
  name: "settings",

  data() {
    return {
      username: null,
      password: null,
    };
  },

  methods: {
    required: (val) => validate.required(val),
    login() {
      const uniquekey = {
        talentName: "HardedSoft",
        customerName: "HardedSoft",
        userName: this.username,
      }
      const data = {
        envelope: {
          uniquekey, 
          action: "login",
        },
        body: { password: this.password },
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          notify.success("Success");
          this.$store.commit("setSessionId", data.body.content.sessionId);
          this.$store.commit("setSessionKeys", data.body.content.keys);
          this.$store.commit("setUserData", data.body.content.personal);
          this.$store.commit("setUniqueKey", uniquekey);
          this.$router.push({ name: "student" })
        } else {
          // TODO
          notify.error("Error");
        }
      });
    },
    forgotPass() {
      const data = {
        envelope: {
          uniquekey: {
            talentName: "HardedSoft",
            customerName: "HardedSoft",
            userName: this.username,
          },
          action: "resetPassword",
        },
        body: {},
      };
      axios.put(url, JSON.stringify(data)).then(({ data }) => {
        if (data?.envelope?.message?.succeed === true) {
          // TODO
          notify.success("Success");
        } else {
          // TODO
          notify.error("Error");
        }
      });
    },
  },
});
</script>

<style scoped>
.login-background {
  background: linear-gradient(
    145deg,
    rgb(5, 69, 84) 5%,
    rgb(22, 104, 122) 30%,
    rgb(77, 168, 189) 90%
  );
}
</style>
