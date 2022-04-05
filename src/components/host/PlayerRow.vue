<template>
  <tr
    v-if="player"
    class="bg-opacity-10"
    :class="{
      'bg-info': isContestant,
      'bg-success': player.played,
      'bg-secondary':!player.available
    }"
  >
    <td>
      <input class="form-control" v-model="player.name" /><span
        v-show="type == 'player'"
        class="form-text"
        >{{ playerKey }}
        <a href="#" class="text-danger" @click="removePlayer">Remove</a>  Available: {{player.available}}</span
      > 
    </td>
    <td>{{ player.choice }}</td>
    <td class="d-flex">
      <button @click="player.score--" class="btn btn-secondary">-</button>
      <input
        class="form-control"
        size="1"
        v-model="player.score"
        type="number"
      />
      <button @click="player.score++" class="btn btn-secondary">+</button>
    </td>
    <td>
      <button
        class="btn btn-outline-secondary form-control"
        v-if="!isContestant && type == 'player'"
        @click="setContestant"
      >
        Play
      </button>
      <button
        class="btn btn-outline-secondary form-control"
        v-if="isContestant && type == 'contestant'"
        @click="removeContestant"
      >
        Return
      </button>
      <span class="form-text text-danger" v-if="!player.connected"
        >Disconnected</span
      >
    </td>
  </tr>
</template>

<script>
import fb from "@/firebaseConfig";
import { ref, onValue, update, remove, set, get } from "@firebase/database";
export default {
  props: ["gameid", "playerKey", "type", "dbRefKey"],

  data: function () {
    return {
      refStr: `${this.dbRefKey}/${this.playerKey}`,
      player: null,
      isContestant: false,
    };
  },
  created: async function () {
    onValue(ref(fb.db, this.refStr), (snap) => {
      if (snap.exists()) {
        const player = snap.val();
        if (!player.score) {
          player.score = 0;
        }
        if (!player.played) {
          player.played = false;
        }
        this.player = player;
      }
    });
    onValue(
      ref(fb.db, `games/${this.gameid}/details/contestants/${this.playerKey}`),
      (snap) => {
        this.isContestant = snap.exists();
      }
    );
  },
  watch: {
    player: {
      handler: function () {
        update(ref(fb.db, this.refStr), this.player);
      },
      deep: true,
    },
  },
  methods: {
    removePlayer: function () {
      if (confirm(`Remove ${this.player.name}?\n${this.playerKey}`)) {
        remove(ref(fb.db, this.refStr));
      }
    },
    setContestant: function () {
      const gameRef = ref(
        fb.db,
        `games/${this.gameid}/details/contestants/${this.playerKey}`
      );
      set(gameRef, { score: 0, points:0, name: this.player.name });
    },
    removeContestant: async function () {
      // increment player score with contestant score
      const gameRef = ref(
        fb.db,
        `games/${this.gameid}/players/${this.playerKey}`
      );
      const player = (await get(gameRef)).val();
      console.log(player.score)
      update(gameRef, {
        score: (player.score||0) * 1 + this.player.score,
        played: true,
      });
      remove(ref(fb.db, this.refStr));
    },
  },
};
</script>

<style>
</style>