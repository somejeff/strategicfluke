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
    path: '/wordle/host/:gameid',
    name: 'WordleHost',
    component: () => import('../wordle-war/Host.vue')
  },
  {
    path: '/wordle/:gameid',
    name: 'Wordle',
    component: () => import('../wordle-war/Game.vue')
  },
  {
    path: '/onprem/:gameid',
    name: 'OnPrem',
    component: () => import('../views/OnPrem.vue')
  },
  {
    path: '/host/list',
    name: 'HostList',
    component: () => import('../views/List.vue')
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
