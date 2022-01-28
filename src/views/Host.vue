<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between">
      <div class="btn-group" role="group" v-if="details">
        <button
          class="btn btn-outline-primary"
          :class="{ 'bg-primary bg-opacity-10': details.state === 'intro' }"
          @click="setGameState('intro')"
        >
          Intro
        </button>
        <button
          class="btn btn-outline-primary"
          :class="{
            'bg-primary bg-opacity-10':
              details.state && details.state.indexOf('round_prep') == 0,
          }"
          @click="
            clearChoices();
            setGameState('round_prep');
          "
        >
          Prepare Round
        </button>
        <button
          class="btn btn-outline-primary"
          :class="{
            'bg-primary bg-opacity-10':
              details.state && details.state.indexOf('round_play') == 0,
          }"
          @click="setGameState('round_play')"
        >
          Play Round
        </button>
        <button
          class="btn btn-outline-primary"
          :class="{
            'bg-primary bg-opacity-10':
              details.state && details.state.indexOf('round_score') == 0,
          }"
          @click="
            showResults();
            setGameState('round_score');
          "
        >
          Score Round
        </button>
        <button
          class="btn btn-outline-primary"
          :class="{ 'bg-primary bg-opacity-10': details.state === 'outro' }"
          @click="setGameState('outro')"
        >
          Outro
        </button>
      </div>

      <span
        ><button class="btn btn-danger p-2" @click="resetEverything">
          Reset Everything</button
        >{{ uid }}</span
      >
    </div>
    <div class="nav nav-bar p-5" v-if="details.state === 'outro'">
      <button class="btn btn-primary" @click="showWinners(-1)">
        Runner Ups
      </button>
      <button class="btn btn-primary" @click="showWinners(4)">Fourth</button>
      <button class="btn btn-primary" @click="showWinners(3)">Third</button>
      <button class="btn btn-primary" @click="showWinners(2)">Second</button>
      <button class="btn btn-primary" @click="showWinners(1)">First</button>
      <button class="btn btn-primary" @click="showWinners(0)">Zeroth</button>
    </div>

    <div class="row">
      <div class="col">
        <h3>Contestants</h3>
        <table class="table table-condensed table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Choice</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, key) in details.contestants" :key="key">
              <td>
                <span class="fw-bold fs-5">{{ entry.name }}</span
                ><br /><span class="fw-lighter">{{ key }}</span>
              </td>
              <td>{{ entry.choice }}</td>
              <td>
                <input
                  class="form-control"
                  size="1"
                  :value="entry.score"
                  @keyup="updateContestantScore(key)"
                />
              </td>
              <td>
                <button
                  class="btn btn-outline-secondary"
                  @click="setContestant(key, false)"
                >
                  Return
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col">
        <table
          class="table table-condensed table-bordered table-primary"
          v-if="details.question"
        >
          <thead>
            <tr>
              <th>Question</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>{{ details.question.question }}</div>
                <div>
                  <ol>
                    <li>{{ details.question.a }}</li>
                    <li>{{ details.question.b }}</li>
                    <li>{{ details.question.c }}</li>
                    <li>{{ details.question.d }}</li>
                    <li>{{ details.question.e }}</li>
                  </ol>
                </div>
              </td>
              <td>
                <button
                  class="btn btn-danger"
                  @click="setQuestion(null, false)"
                >
                  Done
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-condensed table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Choice</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, key) in players"
              :key="key"
              class="bg-opacity-10"
              :class="{
                'bg-info':
                  details.contestants &&
                  Object.keys(details.contestants).includes(key),
                'bg-success': entry.played,
              }"
            >
              <td>
                <input
                  class="form-control"
                  :value="entry.name"
                  @keyup="updatePlayerName(key)"
                /><span class="form-text"
                  >{{ key }}
                  <a href="#" class="text-danger" @click="removePlayer(key)"
                    >Remove</a
                  ></span
                >
              </td>
              <td>{{ entry.choice }}</td>
              <td>
                <input
                  class="form-control"
                  size="1"
                  :value="entry.score"
                  @keyup="updatePlayerScore(key)"
                />
              </td>
              <td>
                <button
                  class="btn btn-outline-secondary form-control"
                  @click="setContestant(key, true)"
                >
                  Play
                </button>
                <span class="form-text text-danger" v-if="!entry.connected"
                  >Disconnected</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col">
        <table class="table table-condensed table-bordered">
          <thead>
            <tr>
              <th>Question</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, key) in questions"
              :key="key"
              class="bg-opacity-10"
              :class="{
                'bg-success': entry.played,
              }"
            >
              <td>
                <div>{{ entry.question }}</div>
                <div>
                  <ol>
                    <li>{{ entry.a }}</li>
                    <li>{{ entry.b }}</li>
                    <li>{{ entry.c }}</li>
                    <li>{{ entry.d }}</li>
                    <li>{{ entry.e }}</li>
                  </ol>
                </div>
              </td>
              <td>
                <button class="btn btn-primary" @click="setQuestion(key, true)">
                  Play
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <textarea v-model="questionLoad"></textarea
        ><button @click="loadQuestions">Load</button>
      </div>
    </div>
  </div>
</template>
<script>
import {} from "@/firebaseConfig";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  update,
  push,
  child,
  serverTimestamp,
} from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
export default {
  name: "host",
  data: function () {
    return {
      details: "a",
      gameid: this.$route.params.gameid,
      uid: null,
      players: null,
      questions: null,
      questionLoad: null,
    };
  },
  created: async function () {
    await this.signin();
    await this.load();
  },
  methods: {
    signin: async function () {
      const auth = getAuth();
      await signInAnonymously(auth);
      this.uid = auth.currentUser.uid;
    },
    load: async function () {
      const db = getDatabase();
      const gameRef = ref(db, `games/${this.gameid}/details`);
      onValue(gameRef, (snap) => {
        this.details = snap.val();
        set(ref(db, `games/${this.gameid}/lastmodified`), serverTimestamp());
      });
      const playerRef = ref(db, `games/${this.gameid}/players`);
      onValue(playerRef, (snap) => {
        this.players = snap.val();
      });
      const questionRef = ref(db, `games/${this.gameid}/questions`);
      onValue(questionRef, (snap) => {
        this.questions = snap.val();
      });
    },
    removePlayer: function (key) {
      if (confirm(`Remove ${this.players[key].name}`)) {
        const db = getDatabase();
        remove(ref(db, `games/${this.gameid}/players/${key}`));
      }
    },
    resetEverything: function () {
      const db = getDatabase();
      const updates = {};
      updates[`games/${this.gameid}/details/contestants`] = null;
      updates[`games/${this.gameid}/details/winners`] = null;
      Object.keys(this.players).forEach((key) => {
        updates[`games/${this.gameid}/players/${key}/choice`] = null;
        updates[`games/${this.gameid}/players/${key}/score`] = 0;
        updates[`games/${this.gameid}/players/${key}/played`] = false;
      });
      Object.keys(this.questions).forEach((key) => {
        updates[`games/${this.gameid}/questions/${key}/played`] = false;
      });
      update(ref(db), updates);
    },
    setGameState: function (state) {
      const db = getDatabase();
      set(ref(db, `games/${this.gameid}/details/state`), state);
    },
    setContestant: function (key, playing) {
      const db = getDatabase();
      const gameRef = ref(
        db,
        `games/${this.gameid}/details/contestants/${key}`
      );
      if (playing) {
        set(gameRef, { score: 0, name: this.players[key].name });
        if (!this.players[key].score) {
          set(ref(db, `games/${this.gameid}/players/${key}/score`), 0);
        }
      } else {
        set(ref(db, `games/${this.gameid}/players/${key}/played`), true);
        if (this.details.contestants[key].score) {
          set(
            ref(db, `games/${this.gameid}/players/${key}/score`),
            this.players[key].score * 1 +
              this.details.contestants[key].score * 1
          );
        }
        remove(gameRef);
      }
    },
    updateContestantScore: function (key) {
      const db = getDatabase();
      set(
        ref(db, `games/${this.gameid}/details/contestants/${key}/score`),
        event.target.value * 1
      );
    },
    updatePlayerName: function (key) {
      const db = getDatabase();
      set(
        ref(db, `games/${this.gameid}/players/${key}/name`),
        event.target.value
      );
    },
    updatePlayerScore: function (key) {
      const db = getDatabase();
      set(
        ref(db, `games/${this.gameid}/players/${key}/score`),
        event.target.value * 1
      );
    },
    clearChoices: function () {
      const db = getDatabase();
      const updates = {};
      if(this.details.contestants) {
        Object.keys(this.details.contestants).forEach((key) => {
          updates[`games/${this.gameid}/details/contestants/${key}/choice`] =
            null;
        });
      }
      if(this.players) {
        Object.keys(this.players).forEach((key) => {
          updates[`games/${this.gameid}/players/${key}/choice`] = null;
        });
      }
      update(ref(db), updates);
    },
    setQuestion: function (key, playing) {
      const db = getDatabase();
      const gameRef = ref(db, `games/${this.gameid}/details/question`);
      if (playing) {
        set(ref(db, `games/${this.gameid}/questions/${key}/played`), true);
        set(gameRef, this.questions[key]);
      } else {
        this.clearChoices();
        remove(gameRef);
      }
    },
    showResults: function () {
      const db = getDatabase();
      const questionRef = ref(db, `games/${this.gameid}/details/question`);
      // remove contestant choices from the count
      let p = { ...this.players };
      Object.keys(this.details.contestants).forEach((k) => delete p[k]);
      p = Object.values(p);
      update(questionRef, {
        aCount: p.filter((p) => p.choice === "a").length,
        bCount: p.filter((p) => p.choice === "b").length,
        cCount: p.filter((p) => p.choice === "c").length,
        dCount: p.filter((p) => p.choice === "d").length,
        eCount: p.filter((p) => p.choice === "e").length,
      });

      const updates = {};
      Object.keys(this.details.contestants).forEach((key) => {
        const entry = this.details.contestants[key];
        entry.choice = this.players[key].choice || "";
        entry.score += this.details.question[`${entry.choice}Count`] || 0;
        updates[`games/${this.gameid}/details/contestants/${key}`] = entry;
      });
      update(ref(db), updates);
    },
    loadQuestions: function () {
      const db = getDatabase();
      remove(ref(db, `games/${this.gameid}/questions`));
      this.questionLoad.split("\n").map((d, i) => {
        d = d.split("\t");
        const key = push(child(ref(db), `games/${this.gameid}/questions`)).key;
        const question = {
          question: d[0],
          a: d[1],
          b: d[2],
          c: d[3],
          d: d[4],
          e: d[5],
          played: false,
          order: i,
        };
        set(ref(db, `games/${this.gameid}/questions/${key}`), question);
      });
    },
    showWinners: function (val) {
      const db = getDatabase();
      const players = Object.values(this.players).sort((a, b) =>
        a.score < b.score ? 1 : -1
      );
      if (val == -1) {
        players.forEach((e, i) => {
          if (i <= 4) {
            return;
          }
          set(ref(db, `games/${this.gameid}/details/winners/${i}`), {
            name: e.name,
            score: e.score,
          });
        });
      } else {
        set(ref(db, `games/${this.gameid}/details/winners/${val}`), {
          place: val,
          name: players[val].name,
          score: players[val].score,
        });
      }
    },
  },
};
</script>