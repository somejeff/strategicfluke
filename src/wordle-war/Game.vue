<template>
  <div v-if="details">
    <div class="container" v-if="state.indexOf('contestants') == 0">
      <div class="d-flex flex-wrap align-items-center justify-items-center">
        <div
          v-for="(player, key) in details.scores"
          :key="key"
          class="d-flex align-items-center"
        >
          <div
            class="border bg-opacity-25 p-1 m-1 fs-3"
            :class="{
              'border-success bg-success ': player.connected,
              'border-danger bg-danger ': !player.connected,
            }"
          >
            <span class="px-4">{{ player.name }} </span>
            <span class="badge bg-secondary rounded-pill">{{
              player.score
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="state.indexOf('teams') == 0">
      <h4>Players</h4>
      <div class="d-flex flex-wrap align-items-center justify-items-center">
        <div v-for="(player, key) in details.contestants" :key="key">
          <div
            v-if="!player.team"
            class="border bg-info bg-opacity-25 px-3 m-1 fs-3"
          >
            {{ player.name }}
          </div>
        </div>
      </div>
      <h4>Teams</h4>
      <div
        class="mt-4 d-flex flex-wrap align-items-center justify-items-center"
      >
        <div
          v-for="(team, k) in details.teams"
          :key="k"
          class="bg-secondary bg-opacity-10 p-2 m-2"
        >
          <div v-for="(player, key) in details.contestants" :key="key">
            <div
              v-if="team == player.team"
              class="border bg-info bg-opacity-25 px-3 m-1 fs-3"
            >
              {{ player.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="state.indexOf('scoring') == 0" class="container">
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
    <div v-if="details.state.indexOf('round_') == 0">
      <div class="alert alert-secondary">
        <b>Points: </b
        ><span class="badge bg-secondary">{{ details.points }}</span
        >&nbsp;&nbsp;&nbsp; <b>Time: </b>
        <span class="badge bg-secondary">{{ details.time }}</span>
        <span
          class="badge mx-5 fs-4 bg-warning text-dark"
          v-if="details.state == 'round_prep'"
          >Get Ready...</span
        >
        <span
          class="badge mx-5 fs-4 bg-success"
          v-if="details.state == 'round_play'"
          >GO!</span
        >
      </div>
      <div class="p-2 d-flex justify-content-between">
        <div class="d-flex justify-content-center" v-on:keyup="addLetter">
          <div class="gameboard text-center" v-if="contestant">
            <div>
              <div v-if="contestant.score > 0">
                Score:
                <span class="badge bg-success">{{ contestant.score }}</span>
              </div>
              <div
                v-for="entry in player.words"
                :key="entry"
                class="d-flex flex-row"
              >
                <div
                  class="letter border border-secondary"
                  v-for="n in 5"
                  :key="n"
                  :class="{
                    'bg-success border-4 border-success':
                      entry.bit & (Math.pow(2, n - 1) * 32),
                    'bg-warning border-2 border-warning':
                      entry.bit & Math.pow(2, n - 1),
                    'bg-secondary border-4  bg-opacity-10':
                      (0 & Math.pow(2, n - 1)) == 0,
                  }"
                >
                  {{ entry.word[n - 1] }}
                </div>
              </div>
              <div v-if="player.word" class="d-flex flex-row">
                <div
                  class="letter border"
                  :class="{
                    'border-danger border-4 bg-danger bg-opacity-10': !valid,
                  }"
                  v-for="n in 5"
                  :key="n"
                >
                  {{ player.word[n - 1] }}
                </div>
              </div>
              <div v-for="n in fillerRows" :key="n" class="d-flex flex-row">
                <div class="letter border" v-for="n in 5" :key="n">&nbsp;</div>
              </div>
              <div class="keyboard text-center">
                <div class="d-flex justify-content-center">
                  <div
                    v-for="key in keyboard.top"
                    :key="key"
                    class="key text-light"
                    :class="[
                      wrongLetters.has(key) ? 'bg-secondary' : 'bg-primary',
                    ]"
                  >
                    {{ key }}
                  </div>
                </div>
                <div class="d-flex justify-content-center">
                  <div
                    v-for="key in keyboard.middle"
                    :key="key"
                    class="key text-light"
                    :class="[
                      wrongLetters.has(key) ? 'bg-secondary' : 'bg-primary',
                    ]"
                  >
                    {{ key }}
                  </div>
                </div>
                <div class="d-flex justify-content-center">
                  <div
                    v-for="key in keyboard.bottom"
                    :key="key"
                    class="key text-light"
                    :class="[
                      wrongLetters.has(key) ? 'bg-secondary' : 'bg-primary',
                    ]"
                  >
                    {{ key }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Everyone else -->
        <div>
          <div class="d-flex flex-wrap">
            <template v-for="player in contestants" :key="player.key">
              <div
                v-if="player.key != uid"
                class="minigameboard d-flex justify-content-center flex-column"
              >
                <div class="fw-bold text-center">
                  {{ player.name }} {{ player.score }}
                </div>
                <div>
                  <template v-if="player.words">
                    <div
                      v-for="entry in player.words"
                      :key="entry"
                      class="d-flex justify-content-center"
                    >
                      <div
                        class="letter border border-secondary"
                        v-for="n in 5"
                        :key="n"
                        :class="{
                          'bg-success border-2 border-success':
                            entry.bit & (Math.pow(2, n - 1) * 32),
                          'bg-warning border-2 border-warning':
                            entry.bit & Math.pow(2, n - 1),
                          'bg-secondary border-2 bg-opacity-10':
                            (0 & Math.pow(2, n - 1)) == 0,
                        }"
                      >
                        <span
                          v-if="
                            (details.visibility == 'audience' && !contestant) ||
                            details.visibility == 'all' ||
                            (details.visibility == 'team' &&
                              contestant.team == player.team)
                          "
                          >{{ entry.word[n - 1] }}</span
                        >
                      </div>
                    </div>
                  </template>
                  <div
                    v-for="n in player.words
                      ? 6 - Object.keys(player.words).length
                      : 6"
                    :key="n"
                    class="d-flex justify-content-center"
                  >
                    <div class="letter border" v-for="n in 5" :key="n">
                      &nbsp;
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- Name Change -->
        <div
          class="modal fade"
          id="nameModal"
          tabindex="-1"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
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
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  @click="setPlayerName"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Name Change -->
    <div
      class="modal fade"
      id="nameModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
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
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="setPlayerName"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="position: absolute; bottom: 10px; right: 10px">
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-secondary bg-opacity-50"
          @click="nameChange"
        >
          {{ player.name }}
          <span class="badge bg-primary">{{ player.score }}</span>
        </button>
      </div>
      <div class="col-auto">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            v-model="player.available"
            id="flexCheckDefault"
            @change="setPlayStatus(player.available)"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Available to Play
          </label>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!details && loading" class="alert alert-info">Loading...</div>
  <div class="alert alert-danger" role="alert" v-if="!details && !loading">
    Game #{{ gameid }} does not exist.
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  ref,
  set,
  get,
  onValue,
  update,
  onDisconnect,
} from "firebase/database";
const dictionary = require("./dictionary.json");
export default {
  data: function () {
    return {
      loading: true,
      uid: null,
      player: {
        name: null,
        available: true,
      },
      gameid: this.$route.params.gameid,
      details: null,
      valid: true,
      keyboard: {
        top: "qwertyuiop".split(""),
        middle: "asdfghjkl".split(""),
        bottom: "zxcvbnm".split(""),
      },
      wrongLetters: new Set(),
    };
  },
  computed: {
    state: function () {
      return this.details && this.details.state;
    },
    contestant: function () {
      return (
        this.details &&
        this.details.contestants &&
        this.details.contestants[this.uid]
      );
    },
    contestants: function () {
      if (this.details && this.details.contestants) {
        const list = Object.keys(this.details.contestants)
          .map((key) => {
            const p = this.details.contestants[key];
            p.key = key;
            return p;
          })
          .sort((a, b) => (a.team > b.team ? 1 : -1));
        if (this.details.visibility == "team") {
          return [
            ...list.filter((p) => p.team == this.contestant.team),
            ...list.filter((p) => p.team != this.contestant.team),
          ];
        } else {
          return list;
        }
      } else {
        return [];
      }
    },
    fillerRows: function () {
      let count = 6;
      if (this.player?.words) {
        count -= Object.keys(this.player.words).length;
      }
      if (this.player?.word) {
        count--;
      }
      return count;
    },
    words: function () {
      return this.player.words;
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
  created: async function () {
    await this.signin();
    await this.load();
  },
  mounted: function () {
    window.addEventListener("keyup", this.captureKey);
  },
  beforeUnmount: function () {
    window.removeEventListener("keyup", this.captureKey);
  },
  watch: {
    words: function (newVal) {
      this.wrongLetters = new Set();
      if (newVal) {
        Object.values(newVal).forEach((w) => {
          for (let i = 0; i < 5; i++) {
            if (
              (w.bit & Math.pow(2, i) || w.bit & (Math.pow(2, i) * 32)) == 0
            ) {
              this.wrongLetters.add(w.word[i]);
            }
          }
        });
      }
    },
  },
  methods: {
    signin: async function () {
      const auth = getAuth();
      await signInAnonymously(auth);
      this.uid = auth.currentUser.uid;
    },

    nameChange: function () {
      this.nameModal.show();
    },

    setPlayerName: function () {
      const playerRef = ref(fb.db, `games/${this.gameid}/players/${this.uid}`);
      update(playerRef, { name: this.player.name });
    },
    setPlayStatus: function (status) {
      set(
        ref(fb.db, `games/${this.gameid}/players/${this.uid}/available`),
        status
      );
    },
    initNameChange: function () {
      this.nameModal = new window.bootstrap.Modal(
        document.getElementById("nameModal")
      );
      document
        .getElementById("nameModal")
        .addEventListener("shown.bs.modal", function () {
          document.getElementById("playerName").focus();
        });
      if (!this.player.name) {
        this.nameModal.show();
      }
    },

    load: async function () {
      const gameRef = ref(fb.db, `games/${this.gameid}/details`);
      const snap = await get(gameRef);
      if (snap.exists()) {
        await onValue(gameRef, (snap) => {
          this.details = snap.val();
        });
        const playerRef = ref(
          fb.db,
          `games/${this.gameid}/players/${this.uid}`
        );
        await update(playerRef, { connected: true });
        await onDisconnect(playerRef).update({ connected: false });
        await onValue(playerRef, (snap) => {
          this.player = snap.val();

          this.initNameChange();
        });
      } else {
        this.details = false;
        this.loading = false;
      }
    },
    captureKey: function (event) {
      if (
        !this.player ||
        (this.player.words && Object.keys(this.player.words).length >= 6) ||
        this.details.state !== "round_play" ||
        this.player.time
      ) {
        return;
      }

      const key = event.key;
      const word = this.player.word || [];
      if ("Backspace" == key) {
        this.valid = true;
        if (word.length) {
          word.pop();
        }
      } else if ("Enter" == key) {
        if (word.length == 5) {
          this.valid = dictionary.includes(word.join(""));
          if (this.valid) {
            set(
              ref(fb.db, `games/${this.gameid}/players/${this.uid}/word`),
              word
            );
            this.valid = true;
          }
        }
      } else if (/^[a-z]$/i.test(key)) {
        this.valid = true;
        if (word.length < 5) {
          word.push(key.toLowerCase());
        }
      }
      this.player.word = word;
    },
  },
};
</script>
<style scoped>
.minigameboard {
  border: 1px solid grey;
  margin: 5px;
  padding: 5px;
}
.minigameboard .letter {
  width: 20px;
  height: 20px;
  margin: 1px;
  font-size: 18px;
  padding: 0px;
  font-variant-caps: all-small-caps;
  line-height: 15px;
  text-align: center;
}
.gameboard .letter {
  width: 60px;
  height: 60px;
  font-size: 2rem;
  font-variant-caps: all-small-caps;
  margin: 3px;
}
.keyboard .key {
  height: 30px;
  width: 30px;
  margin: 2px;
  border-radius: 10px;
  font-variant-caps: all-small-caps;
}
</style>