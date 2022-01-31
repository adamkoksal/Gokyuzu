<template>
  <q-layout>
    <q-page-container class="header">
      <q-page class="flex flex-center">
        <q-card class="login-form" style="width: 30%">
          <div class="row justify-center q-pa-md">
            <q-img src="/icons/gokyuzu.png" style="height: auto; width: 200px"></q-img>
          </div>
          <q-card-section>
            <q-form class="q-gutter-md q-pa-md">
              <q-input filled v-model="username" label="Kullanıcı" :rules="[required]"/>
              <q-input
                type="password"
                filled
                v-model="password"
                label="Şifre"
                :rules="[required]"
              />
              <div>
                <q-btn
                  label="Login"
                  to="/student"
                  type="submit"
                  color="teal"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { notify, validate } from '../utility'

export default defineComponent({
  name: 'settings',

  data() {
    return {
      username: null,
      password: null,
    }
  },

  methods: {
    required: (val) => validate.required(val),
    onSubmit () {
      notify.success("Success")
    }
  }
})
</script>