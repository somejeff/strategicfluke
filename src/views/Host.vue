<template>
  <div id="main">
    <Login v-if="showLogin" />
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
            <h1>Current Question</h1>
            <Question
              v-model:details="details"
              :gameid="gameid"
              :type="details.type"
              v-model:state="details.state"
              v-on:clearChoices="clearChoices"
              v-on:showResults="showResults"
            />
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
            <h1>Questions</h1>
            <QuestionList :gameid="gameid" />
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

        <Instructions v-model:state="details.state" :type="details.type" />
        <Scoring :gameid="gameid" :details="details" />
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
  onValue,
  update,
} from "@firebase/database";
import { onAuthStateChanged, signOut } from "@firebase/auth";
import Login from "@/components/host/Login.vue";
import QuestionList from "@/components/host/QuestionList.vue";
import PlayerList from "@/components/host/PlayerList.vue";
import Question from "@/components/host/Question.vue";
import Instructions from "@/components/host/Instructions.vue";
import Scoring from "@/components/host/Scoring.vue";
export default {
  name: "Host",
  components: {
    Login,
    QuestionList,
    PlayerList,
    Question,
    Instructions,
    Scoring,
  },
  data: function () {
    return {
      user: null,
      showLogin: false,
      gameid: this.$route.params.gameid,
      details: null,
      players: null,
      detailsRef: `games/${this.$route.params.gameid}/details`,
      playerRefKey: `games/${this.$route.params.gameid}/players`,
      contestantRefKey: `games/${this.$route.params.gameid}/details/contestants`,
    };
  },
  computed: {
    state: function () {
      return this.details && this.details.state;
    },
  },
  watch: {
    state: function (newVal) {
      set(ref(fb.db, `${this.detailsRef}/state`), newVal);
    },
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
        onValue(ref(fb.db, `games/${this.gameid}/details`), (snap) => {
          this.details = snap.val();
        });
        onValue(ref(fb.db, this.playerRefKey), (snap) => {
          this.players = snap.val();
        });
      } catch (e) {
        console.error(e);
        this.details = false;
      }
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
      update(ref(fb.db), updates);
    },
    resetEverything: async function () {
      if (confirm("Reset Scores and Play Status?")) {
        const updates = {};
        updates[`games/${this.gameid}/details/state`] = "intro0";
        updates[`games/${this.gameid}/details/question`] = null;
        updates[`games/${this.gameid}/details/contestants`] = null;
        updates[`games/${this.gameid}/details/winners`] = null;
        const questions = await get(
          ref(fb.db, `games/${this.gameid}/questions`)
        );
        Object.keys(questions.val()).forEach((k) => {
          updates[`games/${this.gameid}/questions/${k}/played`] = false;
        });
        const players = await get(ref(fb.db, `games/${this.gameid}/players`));
        Object.keys(players.val()).forEach((k) => {
          updates[`games/${this.gameid}/players/${k}/choice`] = null;
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