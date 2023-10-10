import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoViewVue from '../views/TodoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/todo',
      name: 'todo',
      component: TodoViewVue,
      children: [
        {
          path: ':id',
          name: 'taskDetails',
          component: TodoViewVue
        }
      ]
    }
  ]
})

router.replace(router.currentRoute.value.fullPath)

export default router
