<template>
  <div class="modal fade" id="scoringModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">Scoring</div>
        <div class="modal-body">
            <b>Return all contestants before showing winners</b><br/>
          <div
            class="btn-group btn-group-vertical"
            v-if="details.type == 'online'"
          >
            <button class="btn btn-outline-primary" @click="showWinners(-1)">
              Runner Ups
            </button>
            <button class="btn btn-outline-primary" @click="showWinners(4)">
              Fourth
            </button>
            <button class="btn btn-outline-primary" @click="showWinners(3)">
              Third
            </button>
            <button class="btn btn-outline-primary" @click="showWinners(2)">
              Second
            </button>
            <button class="btn btn-outline-primary" @click="showWinners(1)">
              First
            </button>
            <button class="btn btn-outline-primary" @click="showWinners(0)">
              Zeroth
            </button>
          </div>

          <button
            v-else
            class="btn btn-outline-primary"
            @click="showAllWinners"
          >
            Show Winners
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
    showAllWinners: function () {
      const players = Object.values(this.players).sort((a, b) =>
        a.score < b.score ? 1 : -1
      );
      players.forEach((e, i) => {
        set(ref(fb.db, `games/${this.gameid}/details/winners/${i}`), {
          name: e.name,
          score: e.score,
        });
      });
    },
    showWinners: function (val) {
      const players = Object.values(this.players).sort((a, b) =>
        a.score < b.score ? 1 : -1
      );
      if (val == -1) {
        players.forEach((e, i) => {
          if (i <= 4) {
            return;
          }
          set(ref(fb.db, `games/${this.gameid}/details/winners/${i}`), {
            name: e.name,
            score: e.score,
          });
        });
      } else {
        set(ref(fb.db, `games/${this.gameid}/details/winners/${val}`), {
          place: val,
          name: players[val].name,
          score: players[val].score,
        });
      }
    },
  },
};
</script>
