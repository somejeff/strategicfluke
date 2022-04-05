<template>
  <div class="modal fade" id="scoringModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">Scoring</div>
        <div class="modal-body">
          <b>Return all contestants before showing winners</b><br />
          <div
            class="btn-group btn-group-vertical"
            v-if="details.type == 'online'"
          >
            <button
              class="btn btn-outline-primary"
              @click="showWinners(5, true)"
            >
              Runner Ups
            </button>
            <button
              class="btn btn-outline-primary"
              @click="showWinners(4, false)"
            >
              Fourth
            </button>
            <button
              class="btn btn-outline-primary"
              @click="showWinners(3, false)"
            >
              Third
            </button>
            <button
              class="btn btn-outline-primary"
              @click="showWinners(2, false)"
            >
              Second
            </button>
            <button
              class="btn btn-outline-primary"
              @click="showWinners(1, false)"
            >
              First
            </button>
            <button
              class="btn btn-outline-primary"
              @click="showWinners(0, false)"
            >
              Zeroth
            </button>
          </div>

          <button class="btn btn-outline-primary" @click="showWinners(3, true)">
            Runner Ups
          </button>
          <button
            class="btn btn-outline-primary"
            @click="showWinners(2, false)"
          >
            Third
          </button>
          <button
            class="btn btn-outline-primary"
            @click="showWinners(1, false)"
          >
            Second
          </button>
          <button
            class="btn btn-outline-primary"
            @click="showWinners(0, false)"
          >
            First
          </button>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { ref, set, onValue } from "@firebase/database";
export default {
  name: "Scoring",
  props: ["gameid", "details"],
  data: function () {
    return {
      players: null,
    };
  },
  created: function () {
    onValue(ref(fb.db, `games/${this.gameid}/players`), (snap) => {
      this.players = snap.val();
    });
  },
  methods: {
    showWinners: function (val, showRest) {
      const players = Object.values(this.players).sort((a, b) =>
        a.score < b.score ? 1 : -1
      );
      set(ref(fb.db, `games/${this.gameid}/details/winners/${val}`), {
        place: val,
        name: players[val].name,
        score: players[val].score,
      });

      if (showRest) {
        players.forEach((e, i) => {
          if (i <= val) {
            return;
          }
          set(ref(fb.db, `games/${this.gameid}/details/winners/${i}`), {
            name: e.name,
            score: e.score,
          });
        });
      } 
    },
  },
};
</script>
