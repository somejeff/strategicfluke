<template>
  <div id="main">
    <template v-if="user">
      <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-secondary">
        <div class="container-fluid">
          <div>
            <span class="navbar-text" v-if="details"
              >{{ details.name }} Url:
              <a
                :href="`https://strategicfluke.web.app/${details.type}/${gameid}`"
                target="_blank"
                >https://strategicfluke.web.app/{{ details.type }}/{{
                  gameid
                }}</a
              ></span
            >
          </div>

          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                {{ user.displayName }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item text-danger"
                    href="#"
                    @click="resetEverything"
                    >Reset</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="signOutUser"
                    >Sign Out</a
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      <div class="alert alert-danger" v-if="details === false">
        Game #{{ gameid }} access denied
      </div>
      <div v-if="details">
        <div class="row">
          <div class="col">
            <h1>Contestants</h1>
            <PlayerList
              type="contestant"
              :details="details"
              :gameid="gameid"
              :dbRefKey="contestantRefKey"
            />
          </div>
          <div class="col">
            <h1>Current Word</h1>
            {{ details.time }} <br />{{ details.points }} <br />{{
              details_host.answer
            }}
            <br />
            <select v-model="details.visibility" @change="updateVisibility()">
              <option value="audience">Audience</option>
              <option value="team">Team</option>
              <option value="all">All</option></select
            ><br />
            <button @click="prepareRound">Prepare Round</button>

            <button @click="startRound">Start</button
            ><button @click="endRound">Stop</button>

            <div
              class="btn-group btn-group-vertical"
              v-if="details.state == 'scoring'"
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
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h1>Players</h1>
            <PlayerList
              type="player"
              :details="details"
              :gameid="gameid"
              :dbRefKey="playerRefKey"
            />
          </div>
          <div class="col">
            <div class="container" v-if="state.indexOf('teams') == 0">
              <h4>Players</h4>
              <div
                class="d-flex flex-wrap align-items-center justify-items-center"
              >
                <div v-for="(player, key) in details.contestants" :key="key">
                  <div
                    v-if="!player.team"
                    class="border bg-info bg-opacity-25 px-3 m-1 fs-3"
                    draggable="true"
                    @dragstart="startDrag($event, key)"
                  >
                    {{ player.name }}
                  </div>
                </div>
              </div>
              <h4>Teams</h4>
              <div
                class="
                  mt-4
                  d-flex
                  flex-wrap
                  align-items-center
                  justify-items-center
                "
              >
                <div
                  v-for="(team, k) in details.teams"
                  :key="k"
                  class="bg-secondary bg-opacity-10 p-4 m-2"
                  @drop="onDrop($event, team)"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div v-for="(player, key) in details.contestants" :key="key">
                    <div
                      v-if="team == player.team"
                      class="border bg-info bg-opacity-25 px-3 m-1 fs-3"
                      draggable="true"
                      @dragstart="startDrag($event, key)"
                    >
                      {{ player.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav class="navbar fixed-bottom navbar-dark bg-dark">
          <div class="container-fluid">
            <button
              class="btn btn-secondary me-4"
              data-bs-toggle="modal"
              data-bs-target="#instructionsModal"
              @click="details.state = 'intro0'"
            >
              Instructions
            </button>

            <button
              class="btn btn-secondary me-4"
              @click="details.state = 'contestants'"
            >
              Contestants
            </button>
            <button
              class="btn btn-secondary me-4"
              @click="details.state = 'teams'"
            >
              Teams
            </button>
            <button
              class="btn btn-secondary me-4"
              @click="details.state = 'round_prep'"
            >
              Game Play
            </button>
            <button
              class="btn btn-secondary me-4"
              data-bs-toggle="modal"
              data-bs-target="#scoringModal"
              @click="details.state = 'scoring'"
            >
              Scoring
            </button>
          </div>
        </nav>
      </div>
    </template>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import {
  ref,
  set,
  get,
  serverTimestamp,
  push,
  child,
  onValue,
  update,
  remove,
} from "@firebase/database";
import { onAuthStateChanged, signOut } from "@firebase/auth";
const wordlist = require("./wordlist.json");
import format from "format-duration";
import PlayerList from "../components/host/PlayerList.vue";
export default {
  name: "Host",
  components: {
    PlayerList,
  },
  data: function () {
    return {
      user: null,
      gameid: this.$route.params.gameid,
      details: null,
      players: null,
      detailsRef: `games/${this.$route.params.gameid}/details`,
      playerRefKey: `games/${this.$route.params.gameid}/players`,
      contestantRefKey: `games/${this.$route.params.gameid}/details/contestants`,
      details_host: null,
    };
  },
  computed: {
    state: function () {
      return this.details && this.details.state;
    },
    contestants: function () {
      return this.details && this.details.contestants;
    },
  },
  watch: {
    state: function (newVal) {
      set(ref(fb.db, `${this.detailsRef}/state`), newVal);
    },
    players: {
      handler: function (newVal) {
        if (newVal) {
          set(
            ref(fb.db, `${this.detailsRef}/scores`),
            Object.values(newVal)
              .sort((a, b) => (a.name < b.name ? -1 : 1))
              .map((e) => {
                return {
                  name: e.name || "",
                  score: e.score || 0,
                  connected: e.connected || false,
                };
              })
          );
          // key,player
          Object.entries(newVal).forEach((e) =>
            this.handleContestantWord(e[0], e[1])
          );
        }
      },
      deep: true,
    },
  },
  created: function () {
    onAuthStateChanged(fb.auth, async (user) => {
      if (user) {
        console.log(user.uid);
        await this.loadGame();
        this.user = user;
      } else {
        this.$router.go("/");
      }
    });
  },
  methods: {
    signOutUser: async function () {
      await signOut(fb.auth);
      this.$router.go("/");
    },
    loadGame: async function () {
      try {
        // try to update the last modified date in details_host (that only the host has access to)
        await set(
          ref(fb.db, `games/${this.gameid}/details_host/lastmodified`),
          serverTimestamp()
        );
        onValue(ref(fb.db, `games/${this.gameid}/details_host`), (snap) => {
          this.details_host = snap.val();
        });
        onValue(ref(fb.db, `games/${this.gameid}/details`), (snap) => {
          this.details = snap.val();
        });
        onValue(ref(fb.db, this.playerRefKey), (snap) => {
          this.players = snap.val();
        });


        const k = push(
          child(
            ref(fb.db),
            `games/${this.gameid}/details/teams`
          )
        ).key;
        set(ref(fb.db,`games/${this.gameid}/details/teams/${k}`),k);
      } catch (e) {
        console.error(e);
        this.details = false;
      }
    },
    updateVisibility: function () {
      set(
        ref(fb.db, `games/${this.gameid}/details/visibility`),
        this.details.visibility
      );
    },
    prepareRound: function () {
      Object.keys(this.players).forEach((key) => {
        remove(ref(fb.db, `games/${this.gameid}/players/${key}/words`));
        remove(ref(fb.db, `games/${this.gameid}/players/${key}/word`));
        remove(ref(fb.db, `games/${this.gameid}/players/${key}/time`));
        remove(ref(fb.db, `games/${this.gameid}/players/${key}/points`));
      });

      Object.keys(this.details.contestants).forEach((key) => {
        remove(
          ref(fb.db, `games/${this.gameid}/details/contestants/${key}/words`)
        );
        remove(
          ref(fb.db, `games/${this.gameid}/details/contestants/${key}/word`)
        );
        remove(
          ref(fb.db, `games/${this.gameid}/details/contestants/${key}/time`)
        );
      });

      set(
        ref(fb.db, `games/${this.gameid}/details/points`),
        this.details.starting_points
      );
      set(
        ref(fb.db, `games/${this.gameid}/details/time`),
        format(this.details.starting_points)
      );

      window.clearInterval(this.timer);
      this.details.time = null;
      this.details.state = "round_prep";

      set(
        ref(fb.db, `games/${this.gameid}/details_host/answer`),
        wordlist[Math.round(Math.random() * wordlist.length, 0)]
      );
    },
    startRound: function () {
      this.details.state = "round_play";
      this.clock = +new Date();
      this.timer = window.setInterval(this.runloop, 1000);
    },
    runloop: function () {
      let seconds = +new Date() - this.clock;
      set(
        ref(fb.db, `games/${this.gameid}/details/points`),
        this.details.points * 1 - 1
      );
      set(ref(fb.db, `games/${this.gameid}/details/time`), format(seconds));
      if (this.details.points <= 0) {
        window.clearInterval(this.timer);
      }
    },
    endRound: function () {
      Object.keys(this.details.contestants).forEach((key) => {
        if (this.players[key] && this.players[key].words) {
          set(
            ref(fb.db, `games/${this.gameid}/details/contestants/${key}/words`),
            this.players[key].words
          );
        }
      });
      this.details.state = "round_score";
      window.clearInterval(this.timer);
    },
    handleContestantWord: function (key, player) {
      if (player.word) {
        const result = this.evaluateWord(player.word);
        // wiener!!!
        if (result == 992) {
          set(
            ref(fb.db, `games/${this.gameid}/details/contestants/${key}/time`),
            this.details.time
          );
          set(
            ref(fb.db, `games/${this.gameid}/details/contestants/${key}/score`),
            this.details.contestants[key].score * 1 + this.details.points
          );
        }
        const k = push(
          child(
            ref(fb.db),
            `games/${this.gameid}/details/contestants/${key}/words`
          )
        ).key;
        let word = {
          word: player.word,
          bit: result,
        };
        set(
          ref(
            fb.db,
            `games/${this.gameid}/details/contestants/${key}/words/${k}`
          ),
          word
        );
        set(ref(fb.db, `games/${this.gameid}/players/${key}/word`), null);
        set(ref(fb.db, `games/${this.gameid}/players/${key}/words/${k}`), {
          word: player.word,
          bit: result,
        });
      }
    },

    /* Compares a given word against the answer word, returning a bit representing the matching letters
     */
    evaluateWord: function (word) {
      if (this.details.state != "round_play") {
        return 0;
      }
      if (word.join("") == this.details_host.answer) {
        return 992; // all 5 match
      }
      const tmpAnswer = [...this.details_host.answer.split("")];
      const tmpWord = [...word];
      // first, substitute matching letters with high bits (32,64,128,256,512)
      tmpWord.forEach((letter, i) => {
        if (tmpAnswer[i] == letter) {
          tmpAnswer[i] = Math.pow(2, i) * 32;
          // also remove the matching letters from the word
          tmpWord[i] = null;
        }
      });
      // second, substitute related letters with low bits (1,2,4,8,16)
      tmpWord.forEach((letter, i) => {
        const x = tmpAnswer.indexOf(letter);
        if (x > -1) {
          tmpAnswer[x] = Math.pow(2, i);
        }
      });
      // combine all the numbers (remaining letters add 0)
      return tmpAnswer.reduce((r, v) => (r += v * 1 ? v : 0), 0);
    },
    showResults: async function () {
      const questionRef = ref(fb.db, `games/${this.gameid}/details/question`);
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
      update(ref(fb.db), updates);
    },
    clearChoices: async function () {
      const updates = {};
      if (this.details.contestants) {
        Object.keys(this.details.contestants).forEach((key) => {
          updates[`games/${this.gameid}/details/contestants/${key}/words`] =
            null;
        });
      }
      if (this.players) {
        Object.keys(this.players).forEach((key) => {
          updates[`games/${this.gameid}/players/${key}/words`] = "";
        });
      }
      update(ref(fb.db), updates);
    },

    startDrag(evt, key) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("key", key);
    },
    onDrop(evt, team) {
      const key = evt.dataTransfer.getData("key");
      set(
        ref(fb.db, `games/${this.gameid}/details/contestants/${key}/team`),
        team
      );

      // auto manage teams
      // remove empty teams
      Object.values(this.details.teams).forEach((t) => {
        let keep = false;
        if (this.details.contestants) {
          keep = Object.values(this.details.contestants).filter(
            (c) => c.team == t
          ).length;
        }
        if (!keep) {
          remove(ref(fb.db, `games/${this.gameid}/details/teams/${t}`));
        }
      });
      // create an empty trailing team
      
       const k = push(
          child(
            ref(fb.db),
            `games/${this.gameid}/details/teams`
          )
        ).key;
        set(ref(fb.db,`games/${this.gameid}/details/teams/${k}`),k);
    },

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
    resetEverything: async function () {
      if (confirm("Reset Scores and Play Status?")) {
        const updates = {};
        updates[`games/${this.gameid}/details/state`] = "intro0";
        updates[`games/${this.gameid}/details/question`] = null;
        updates[`games/${this.gameid}/details/contestants`] = null;
        updates[`games/${this.gameid}/details/winners`] = null;
        const players = await get(ref(fb.db, `games/${this.gameid}/players`));
        Object.keys(players.val()).forEach((k) => {
          updates[`games/${this.gameid}/players/${k}/words`] = null;
          updates[`games/${this.gameid}/players/${k}/score`] = 0;
          updates[`games/${this.gameid}/players/${k}/played`] = false;
        });
        update(ref(fb.db), updates);
      }
    },
  },
};
</script>
<style scoped>
#main {
  padding-top: 57px;
  padding-bottom: 57px;
}
</style>