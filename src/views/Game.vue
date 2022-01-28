<template>
  <div>
    <div class="alert alert-danger" role="alert" v-if="details === false">
      Game #{{ gameid }} does not exist.
    </div>

    <div class="container" v-if="state == 'intro'">
      <h1>{{ details.name }}</h1>
      <h3>
        Contestants gain points by matching what the rest of the audience
        chooses
      </h3>
      <img
        class="img-fluid"
        style="border: inset 10px grey; padding: 10px"
        src="/intro.png"
      />
      <pre class="instructions">
          10   REM     TAKE TURNS 
          20   REM     SHOW STATEMENT 
          30   REM     CLICK BUTTONS
          40   REM     REVEAL POPULAR VOTES
          50   REM     ALLOCATE POINTS
          60   GOTO 10   REM NO OP
          </pre
      >
    </div>
    <div v-if="state == 'outro'" class="container">
      <div class="card">
        <div class="card-header bg-danger text-light">
          <h1>Congratulations!</h1>
        </div>
        <transition-group class="list-group" name="winner-list" tag="ul">
          <li
            class="
              list-group-item
              winner-list-item
              d-flex
              justify-content-between
            "
            :class="`fs-${entry.place + 1}`"
            v-for="entry in winners"
            :key="entry.name"
          >
            <span
              class="badge bg-primary rounded-pill"
              v-html="entry.placeStr"
            ></span>
            <span>{{ entry.name }}</span>
            <span class="badge bg-success">{{ entry.score }}</span>
          </li>
        </transition-group>
      </div>
    </div>
    <div v-if="state.indexOf('round_') == 0">
      <div class="d-flex stage">
        <div class="p-2 flex-fill">
          <div class="board">
            <canvas id="chart" ref="chart"></canvas>
          </div>
        </div>

        <div class="p-2 d-flex">
          <div
            style="position: relative"
            v-for="(entry, key, index) in details.contestants"
            :key="key"
          >
            <img
              style="height: 275px; padding-left: 50px"
              :src="`/contestant${index % 3}.png`"
            />
            <span class="badge bg-secondary podiumname">{{ entry.name }}</span>
            <span
              class="badge bg-secondary podiumscore bordered"
              :class="pickContestantColor(entry.choice)"
              >{{ entry.score }}</span
            >
          </div>
        </div>
      </div>
      <progress
        @click="updateChart"
        id="animationProgress"
        max="1"
        :value="progress"
        style="width: 100%"
      ></progress>
      <div class="answers" v-if="details.question">
        <h1>{{ details.question.question }}</h1>

        <div class="btn-group btn-group-lg d-flex">
          <input
            type="radio"
            v-model="choice"
            name="choice"
            value="a"
            class="btn-check"
            id="choice1"
            autocomplete="off"
          />
          <label
            class="btn lightpurple choice"
            :class="{ 'text-light purple bordered': choice == 'a' }"
            for="choice1"
            v-html="details.question.a"
          >
          </label>

          <input
            type="radio"
            v-model="choice"
            name="choice"
            value="b"
            class="btn-check"
            id="choice2"
            autocomplete="off"
          />
          <label
            class="btn lightgreen choice"
            :class="{ 'text-light green bordered': choice == 'b' }"
            for="choice2"
            v-html="details.question.b"
          >
          </label>

          <input
            type="radio"
            v-model="choice"
            name="choice"
            value="c"
            class="btn-check"
            id="choice3"
            autocomplete="off"
          />
          <label
            class="btn lightblue choice"
            :class="{ 'text-light blue bordered': choice == 'c' }"
            for="choice3"
            v-html="details.question.c"
          >
          </label>

          <input
            type="radio"
            v-model="choice"
            name="choice"
            value="d"
            class="btn-check"
            id="choice4"
            autocomplete="off"
          />
          <label
            class="btn lightred choice"
            :class="{ 'text-light red bordered': choice == 'd' }"
            for="choice4"
            v-html="details.question.d"
          >
          </label>

          <input
            type="radio"
            v-model="choice"
            name="choice"
            value="e"
            class="btn-check"
            id="choice5"
            autocomplete="off"
          />
          <label
            class="btn lightpink choice"
            :class="{ 'text-light pink bordered': choice == 'e' }"
            for="choice5"
            v-html="details.question.e"
          >
          </label>
        </div>
      </div>
    </div>

    <!-- Name Change -->
    <div
      class="modal fade"
      id="nameModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-focus="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Who dis?</h5>
          </div>
          <div class="modal-body">
            <label class="form-label">Player Name</label>
            <input
              class="form-control form-control-lg"
              id="playerName"
              type="text"
              v-model="player.name"
              @keyup.enter="setPlayerName"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="setPlayerName"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-secondary bg-opacity-50"
      @click="nameChange"
      style="position: absolute; bottom: 10px; right: 10px"
    >
      {{ player.name }}
      <span class="badge bg-primary">{{ player.score }}</span>
    </button>
    <div class="background"></div>
  </div>
</template>

<script>
import {} from "@/firebaseConfig";
import {
  getDatabase,
  ref,
  get,
  onValue,
  update,
  onDisconnect,
} from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
import Chart from "chart.js/auto";
import { shallowRef } from "vue";

Chart.defaults.plugins.legend = false;
Chart.defaults.plugins.tooltip = false;
Chart.defaults.font.size = 16;
Chart.defaults.scales.linear.suggestedMin = 0;
Chart.defaults.scales.linear.suggestedMax = 10;
export default {
  name: "Game",
  data: function () {
    return {
      uid: null,
      player: {
        name: null,
      },
      choice: null,
      gameid: this.$route.params.gameid,
      details: { state: "intro" },
      nameModal: null,
      progress: 0,
      chart: null,
      randomInterval: null,
    };
  },
  created: async function () {
    await this.signin();
    await this.load();
  },
  mounted: function () {
    this.nameChange();
  },
  computed: {
    state: function () {
      return this.details.state;
    },
    winners: function () {
      return (
        this.details.winners &&
        Object.values(this.details.winners)
          .filter((e) => e != null)
          .map((e) => {
            switch (e.place) {
              case 0:
                e.placeStr = "0<sup>ish</sup> Place";
                break;
              case 1:
                e.placeStr = "1<sup>st<sup>est</sup></sup> Place";
                break;
              case 2:
                e.placeStr = "2<sup>nd<sup>th</sup></sup> Place";
                break;
              case 3:
                e.placeStr = "Runner<sup>er</sup> Up";
                break;
              case 4:
                e.placeStr = "Runner Up";
                break;
            }
            return e;
          })
      );
    },
  },
  watch: {
    choice: function () {
      this.setChoice();
    },
    state: function () {
      this.updateChart();
    },
  },
  methods: {
    nameChange: function () {
      this.nameModal = new window.bootstrap.Modal(
        document.getElementById("nameModal")
      );
      document
        .getElementById("nameModal")
        .addEventListener("shown.bs.modal", function () {
          document.getElementById("playerName").focus();
        });
      this.nameModal.show();
    },
    signin: async function () {
      const auth = getAuth();
      await signInAnonymously(auth);
      this.uid = auth.currentUser.uid;
    },
    load: async function () {
      const db = getDatabase();
      const gameRef = ref(db, `games/${this.gameid}/details`);
      const snap = await get(gameRef);
      if (snap.exists()) {
        onValue(gameRef, (snap) => {
          this.details = snap.val();
        });
        const playerRef = ref(db, `games/${this.gameid}/players/${this.uid}`);
        update(playerRef, { connected: true });
        onDisconnect(playerRef).update({ connected: false });
        onValue(playerRef, (snap) => {
          this.player = snap.val();
        });
      } else {
        this.details = false;
      }
    },
    setPlayerName: function () {
      const db = getDatabase();
      const playerRef = ref(db, `games/${this.gameid}/players/${this.uid}`);
      update(playerRef, { name: this.player.name });
      this.nameModal.hide();
    },
    setChoice: function () {
      const db = getDatabase();
      const playerRef = ref(db, `games/${this.gameid}/players/${this.uid}`);
      update(playerRef, { choice: this.choice });
    },
    pickContestantColor: function (choice) {
      switch (choice) {
        case "a":
          return "purple";
        case "b":
          return "green";
        case "c":
          return "blue";
        case "d":
          return "red";
        case "e":
          return "pink";
      }
    },
    createChart: function () {
      this.chart = shallowRef(
        new Chart(this.$refs.chart, {
          type: "bar",
          data: {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [
              {
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                  "#7849b8",
                  "#138468",
                  "#009dd6",
                  "#ec111a",
                  "#f2609e",
                ],
              },
            ],
          },
          options: {
            indexAxis: "y",
            events: [],
          },
        })
      );
    },
    updateChart: function () {
      this.$nextTick(() => {
        if (this.state.indexOf("round_") == -1 && this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
        if (this.state.indexOf("round_") == 0 && this.chart == null) {
          this.createChart();
        }
        if (this.state == "round_prep") {
          this.chart.data.datasets[0].data = [0, 0, 0, 0, 0];
          this.chart.update();
        } else if (this.state == "round_play") {
          this.progress = 0;
          let data = [0, 0, 0, 0, 0];
          this.randomInterval = window.setInterval(() => {
            this.progress += 0.02;
            let index = Math.floor(Math.random() * 10);
            if (index > 4) return;
            data[index]++;
            let sum = data.reduce((a, v) => a + v);
            this.chart.data.datasets[0].data = data.map((v) => (v / sum) * 100);
            this.chart.update();
          }, 500);
        } else if (this.state == "round_score") {
          this.progress = 1;
          window.clearInterval(this.randomInterval);
          this.chart.data.datasets[0].data = [
            this.details.question.aCount || 0,
            this.details.question.bCount || 0,
            this.details.question.cCount || 0,
            this.details.question.dCount || 0,
            this.details.question.eCount || 0,
          ];
          this.chart.update();
        }
      });
    },
  },
};
</script>

<style scoped>
.background {
  width: 100%;
  height: 90px;
  background: transparent url("/audience.png") repeat-x 0 0;
  position: fixed;
  bottom: 0;
  z-index: -10;
}
.lightpurple {
  background-color: #aea9f4;
}
.lightgreen {
  background-color: #84d9c6;
}
.lightblue {
  background-color: #91ddf8;
}
.lightred {
  background-color: #ff969c;
}
.lightpink {
  background-color: #fda8de;
}
.purple,
.purple:active {
  background-color: #7849b8 !important;
}
.green,
.green:active {
  background-color: #138468 !important;
}
.blue,
.blue:active {
  background-color: #009dd6 !important;
}
.red,
.red:active {
  background-color: #ec111a !important;
}
.pink,
.pink:active {
  background-color: #f2609e !important;
}
.bordered {
  border: 2px solid black;
}
.board {
  position: relative;
  height: 200px;
  width: 400px;
  padding: 15px;
  margin: 5px;
  border: 5px dashed mediumseagreen;
  box-shadow: 0px 0px 0px 3px seagreen, 0px 5px 3px 7px rgba(0, 0, 0, 0.5),
    inset 0px 0px 0px 2px #fff;
}
.stage {
  background-color: #ffe3b1;
}
.podiumname {
  position: absolute;
  top: 145px;
  left: 50px;
  font-size: 20px;
}
.podiumscore {
  position: absolute;
  top: 185px;
  left: 65px;
  font-size: 24px;
}

.instructions {
  background-color: black;
  border: 1px solid black;
  color: #ffae36;
  font-family: "Apple2Forever80";
  font-size: 24px;
}
.winner-list-item {
  transition: all 1s;
}
.choice {
  min-height: 75px;
  border: 2px solid black;
  margin: 5px;
  width: 18%;
}
</style>