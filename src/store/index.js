import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";
import { store } from "quasar/wrappers";

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const getDefaultState = () => {
  return {
    sessionId: null,
    sessionKeys: [],
    user: null,
    uniquekey: {},
  };
};

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    plugins: [
      createPersistedState()
    ],

    state() {
      return getDefaultState();
    },

    mutations: {
      setSessionId(state, val) {
        state.sessionId = val;
      },
      setSessionKeys(state, val) {
        state.sessionKeys = val;
      },
      setUserData(state, val) {
        state.user = val;
      },
      setUniqueKey(state, val) {
        state.uniquekey = val;
      },
      resetState(state) {
        Object.assign(state, getDefaultState());
      },
    },
    
    getters: {
      sessionId: (state) => state.sessionId,
      user: (state) => state.user,
      uniquekey: (state) => state.uniquekey,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
