<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="q-pt-sm">
            <img class="" src="icons/yazi.png" style="height: auto; width: 100px" />
            <!-- <img class="logo-sm" src="icons/logo.png" style="height: auto; width: 100px" /> -->
          </div>
        </q-toolbar-title>

        <q-btn color="primary" text-color="white" icon="mdi-cog" flat stretch>
          <q-tooltip>Ayarlar</q-tooltip>
        </q-btn>
        <q-btn color="primary" text-color="white" icon="logout" flat stretch>
          <q-tooltip anchor="bottom left">Oturumu Kapat</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-accent"
      v-model="leftDrawerOpen"
      show-if-above
    >
      <q-list padding>
        <q-toolbar>
          <q-icon size='md' name="mdi-account-circle"/>
          <q-toolbar-title>{ User Name }</q-toolbar-title>
        </q-toolbar>
        <hr />

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Öğrenci',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Veli',
    icon: 'mdi-human-female-boy',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Potansiyel',
    icon: 'mdi-account-question',
    link: 'https://github.com/quasarframework'
  },
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style>
.header {
  background: linear-gradient(
    145deg,
    rgb(5, 69, 84) 15%,
    rgb(77, 168, 189) 70%
  );
}
</style>
