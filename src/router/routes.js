const routes = [
  {
    path: '/',
    redirect:  { name: 'student' },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/student', name: 'student', component: () => import('src/pages/student.vue') },
      { path: '/parent', name: 'parent', component: () => import('src/pages/parent.vue') },
      { path: '/potential', name: 'potential', component: () => import('src/pages/potential.vue') }
    ]
  },
  {
    path: '/login', 
    name: 'login',
    component: () => import('pages/login.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
