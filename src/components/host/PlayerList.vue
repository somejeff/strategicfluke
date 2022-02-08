<template>
  <div>
    <table class="table table-condensed table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th v-if="details.type=='online'">Choice</th>
          <th>Score</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <PlayerRow
          :type="type"
          :gameid="gameid"
          :dbRefKey="dbRefKey"
          :playerKey="key"
          v-for="(entry, key) in players"
          :key="key"
        />
      </tbody>
    </table>
    <div v-if="type=='player'">
    <textarea v-model="raw"></textarea><button @click="load">Load</button>
    </div>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { ref, onValue, update, push, child, set } from "@firebase/database";
import PlayerRow from "@/components/host/PlayerRow.vue";
export default {
  name: "PlayerList",
  props: ["details","gameid", "dbRefKey", "type"],
  components: { PlayerRow },
  data: function () {
    return {
      players: null,
      raw: null,
    };
  },
  created: function () {
    onValue(ref(fb.db, this.dbRefKey), (snap) => {
      this.players = snap.val();
    });
  },
  methods: {
    clearChoices: function () {
      const updates = {};
      Object.keys(this.players).forEach((key) => {
        updates[`${this.dbRefKey}/${key}/choice`] = null;
      });
      update(ref(fb.db), updates);
    },
    load: function () {
        console.log(1);
      this.raw.split("\n").map((d) => {
        console.log(d);
        const key = push(child(ref(fb.db), `games/${this.gameid}/players`)).key;
        set(ref(fb.db, `games/${this.gameid}/players/${key}`), {
          name: d,
          played: false,
          score: 0,
        });
      });
    },
  },
};
</script>

<style>
</style>