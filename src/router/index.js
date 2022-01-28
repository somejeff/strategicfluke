import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import { } from "@/firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

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
    component: () => import(/* webpackChunkName: "host" */ '../views/Host.vue'),
    beforeEnter: async (to, from, next) => {
      const auth = getAuth();
      await signInAnonymously(auth);
      const owner = await get(ref(getDatabase(), `games/${to.params.gameid}/details/owner`));
      next(owner.val()===auth.currentUser.uid);
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
