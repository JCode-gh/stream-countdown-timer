import { createRouter,  createWebHistory } from 'vue-router'
import SetupView from '../views/SetupView.vue'
import DisplayView from '../views/DisplayView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setup',
      component: SetupView,
      meta: {
        title: 'Timer Setup'
      }
    },
    {
      path: '/display',
      name: 'display',
      component: DisplayView,
      meta: {
        title: 'Countdown Timer'
      }
    }
  ]
})

router.beforeEach((to) => {
  // Update document title
  document.title = to.meta.title as string || 'Stream Countdown Timer'
})

export default router
