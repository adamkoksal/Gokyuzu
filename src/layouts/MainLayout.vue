<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header" elevated>
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
            <img class="" src="icons/yazi.png" style="height: auto; width: 118px" />
            <!-- <img class="logo-sm" src="icons/logo.png" style="height: auto; width: 100px" /> -->
          </div>
        </q-toolbar-title>

        <settings />
        <q-btn color="primary" text-color="white" icon="logout" flat stretch>
          <q-tooltip anchor="bottom left">Oturumu Kapat</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>


    <q-drawer
      class="bg-dark text-white"
      v-model="leftDrawerOpen"
      show-if-above
      elevated
    >
      <div
        class="full-height"
      >
        <div style="padding:15px;">
          <q-toolbar>
            <q-icon size='md' name="mdi-account-circle"/>
            <q-toolbar-title>Abdurrahman Köksal</q-toolbar-title>
          </q-toolbar>
          <hr />
          <q-list padding>
            <q-item
              active-class="tab-active"
              to="/student"
              exact
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>

              <q-item-section>
                Öğrenci
              </q-item-section>
            </q-item>
            <q-item
              active-class="tab-active"
              to="/parent"
              exact
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="mdi-human-female-boy" />
              </q-item-section>

              <q-item-section>
                Veli
              </q-item-section>
            </q-item>
            <q-item
              active-class="tab-active"
              to="/potential"
              exact
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="mdi-account-question" />
              </q-item-section>

              <q-item-section>
                Potansiyel
              </q-item-section>
            </q-item>
      </q-list>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Settings from 'components/settings.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    Settings
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style>
.tab-active {
  background-color: #ff8547;
}
.navigation-item {
  border-radius: 5px;
}
.header {
  background: linear-gradient(
    145deg,
    rgb(5, 69, 84) 5%,
    rgb(22, 104, 122) 30%,
    rgb(77, 168, 189) 90%
  );
}
</style>
