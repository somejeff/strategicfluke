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
    path: '/:gameid',
    name: 'Game',
    component: Game
  },
  {
    path: '/:gameid/host',
    name: 'Host',
    component: () => import(/* webpackChunkName: "host" */ '../views/Host.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
