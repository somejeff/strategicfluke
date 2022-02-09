<template>
  <div v-if="details">
    <transition name="fade">
      <Instructions
        v-if="details.state.indexOf('intro') == 0"
        v-bind:details="details"
      />
    </transition>
    <transition name="fade">
      <Contestants
        v-if="details.state.indexOf('contestants') == 0"
        v-bind:details="details"
      />
    </transition>
    <transition name="fade">
      <Round
        v-if="details.state.indexOf('round') == 0"
        v-bind:details="details"
      />
    </transition>
    <transition name="fade">
      <Scoring
        v-if="details.state.indexOf('scoring') == 0"
        v-bind:details="details"
      />
    </transition>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { ref, onValue } from "@firebase/database";
import { onAuthStateChanged, getAuth, signInAnonymously } from "@firebase/auth";
import Instructions from "@/components/onprem/Instructions.vue";
import Contestants from "@/components/onprem/Contestants.vue";
import Round from "@/components/onprem/Round.vue";
import Scoring from "@/components/onprem/Scoring.vue";
export default {
  name: "OnPrem",
  components: { Instructions, Contestants, Round, Scoring },
  data: function () {
    return {
      gameid: this.$route.params.gameid,
      details: null,
    };
  },

  created: function () {
    onAuthStateChanged(fb.auth, async (user) => {
      if (user) {
        console.log(user.uid);
        this.showLogin = false;
        await this.loadGame();
        this.user = user;
      } else {
        this.showLogin = true;
      }
    });
    signInAnonymously(getAuth());
  },
  methods: {
    loadGame: async function () {
      onValue(ref(fb.db, `games/${this.gameid}/details`), (snap) => {
        this.details = snap.val();
      });
    },
  },
};
</script>

<style>
html,
body {
  margin: 0px;
  height: 100%;
  overflow: hidden;
}

.fade-enter-active {
  transition: all 2s ease-out;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}
</style>