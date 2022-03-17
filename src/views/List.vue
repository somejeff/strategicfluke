<template>
  <div id="main" class="container">
    <Header :user="user" />
    <table class="table table-condensed table-bordered table-hover">
      <thead>
        <tr>
          <td>Game #</td>
          <td>Type</td>
          <td>Name</td>
          <td>Last Played</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id" @click="gotoGame(game.id)">
          <td>{{ game.id }}</td>
          <td>{{ game.type }}</td>
          <td>{{ game.name }}</td>
          <td>{{ game.lastPlayed }}</td>
        </tr>
      </tbody>
    </table>

    <div class="card col-6">
      <div class="card-body">
        <h5 class="card-title">Create a new Game</h5>
          <div class="mb-3">
            <label for="game_name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              id="game_name"
              v-model="newGame.name"
            />
            <div class="invalid-feedback">Required</div>
          </div>
          <div class="mb-3">
            <label for="game_name" class="form-label">Type</label>
            <select class="form-select" v-model="newGame.type">
              <option value="onprem">
                On Premise (Display on the big screen)
              </option>
              <option value="online">Online</option>
              <option value="wordle_war">Wordle War</option>
            </select>
          </div>
          <button class="btn btn-primary" @click="createGame">
            Create Game
          </button>
      </div>
    </div>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { customAlphabet } from "nanoid";
import { ref, get, set, onValue } from "@firebase/database";
import Header from "@/components/host/Header.vue";
export default {
  name: "Host",
  components: {
    Header,
  },
  data: function () {
    return {
      user: null,
      games: null,
      newGame: {
        name: null,
        type: "onprem",
      },
    };
  },

  created: function () {
    onAuthStateChanged(fb.auth, async (user) => {
      if (user) {
        console.log(user.uid);
        this.user = user;
        onValue(ref(fb.db, `hosts/${this.user.uid}/games`), (snap) => {
          this.games = snap.val();
        });
      } else {
        this.$router.push("/");
      }
    });
  },
  methods: {
    gotoGame: function (id) {
      console.log(`/host/${id}`);
      this.$router.push(`/host/${id}`);
    },
    createGame: async function () {
      // try 10 times to generate a simple game number
      for (let i = 0; i < 10; i++) {
        const id = customAlphabet("1234567890", 5)();
        const snap = await get(ref(fb.db, `games/${id}/details`));
        if (snap.exists()) {
          continue;
        }
        this.newGame.id = id;
      }
      if (this.newGame.id) {
        set(ref(fb.db, `games/${this.newGame.id}/details_host`), {
          owner: this.user.uid,
        });
        set(ref(fb.db, `games/${this.newGame.id}/details`), {
          type: this.newGame.type,
          state: 'intro0',
          name: this.newGame.name
        });
        set(
          ref(fb.db, `hosts/${this.user.uid}/games/${this.newGame.id}`),
          this.newGame
        );
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