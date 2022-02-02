const isLoggedIn = (store) => {
  return store.getters.sessionId
};

const routes = (store) => [
  {
    path: "/",
    redirect: { name: "student" },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/student",
        name: "student",
        component: () => import("src/pages/student.vue"),
        beforeEnter: (to, from, next) => {
          isLoggedIn(store) ? next() : next("/login")
        }
      },
      {
        path: "/parent",
        name: "parent",
        component: () => import("src/pages/parent.vue"),
        beforeEnter: (to, from, next) => {
          isLoggedIn(store) ? next() : next("/login")
        }
      },
      {
        path: "/potential",
        name: "potential",
        component: () => import("src/pages/potential.vue"),
        beforeEnter: (to, from, next) => {
          isLoggedIn(store) ? next() : next("/login")
        }
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/login.vue"),
    beforeEnter: (to, from, next) => {
      isLoggedIn(store) ? next("/") : next()
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default (store) => routes (store)
