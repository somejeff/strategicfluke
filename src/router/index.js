import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game/:gameid',
    name: 'Game',
    component: Game
  },
  {
    path: '/onprem/:gameid',
    name: 'OnPrem',
    component: () => import('../views/OnPrem.vue')
  },
  {
    path: '/host/:gameid',
    name: 'Host',
    component: () => import('../views/Host.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
