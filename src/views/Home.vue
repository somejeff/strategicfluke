<template>
  <div class="container d-flex justify-content-center align-items-center">
    <img alt="Vue logo" src="loading.gif" height="250" />
    <div v-if="false">
      <div
        class="mb-3"
        :class="{ 'is-valid': gameValid, 'is-invalid': gameValid === false }"
      >
        <label for="gameid" class="form-label">Game Number</label>
        <input
          type="number"
          v-model="gameid"
          class="form-control"
          :class="{
            'is-valid': gameValid,
            'is-invalid': gameValid === false,
          }"
          id="gameid"
          required
          @change="getGame"
          @keyup.enter="getGame"
          
        />
        <div class="invalid-feedback">
          {{ gameError }}
        </div>
        <div class="valid-feedback">
          {{ gameName }}
        </div>
      </div>
      <div
        class="mb-3"
        :class="{
          'is-valid': playerValid,
          'is-invalid': playerValid === false,
        }"
      >
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          v-model="playerName"
          class="form-control"
          id="name"
          required
          :class="{
            'is-valid': playerValid,
            'is-invalid': playerValid == false,
          }"
        />
        <div class="invalid-feedback">
          {{ playerError }}
        </div>
      </div>
      <div class="mb-3">
        <button class="btn btn-primary btn-lg" @click="login">Play</button>
      </div>
    </div>
  </div>
</template>

<script>
import {} from "@/firebaseConfig";
import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

export default {
  name: "Home",
  data: function () {
    return {
      user: null,
      gameid: 1,
      gameValid: null,
      gameError: null,
      gameName: null,
      playerName: null,
      playerValid: null,
      playerError: null,
    };
  },
  created: function () {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        this.user = auth.currentUser.uid;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getGame: async function () {
      if (this.gameid * 1 == this.gameid) {
        const db = getDatabase();
        const game = ref(db, `games/${this.gameid}/details`);
        try {
          const snapshot = await get(game);
          if (snapshot.exists()) {
            this.gameValid = true;
            this.gameName = snapshot.val().name;
          } else {
            this.gameValid = false;
            this.gameError = "Game not found";
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        this.gameValid = false;
        this.gameError = "Game ID is required";
      }
    },
    login: async function () {
      if (!this.gameValid) {
        await this.getGame();
      }
      if (!this.gameValid) {
        return;
      }
      const db = getDatabase();
      if (this.playerName && this.playerName.trim()) {
        this.playerValid = true;
        set(ref(db, `games/${this.gameid}/players/${this.user}`), {
          name: this.playerName
        });
      } else {
        this.playerValid = false;
        this.playerError = "Name is required";
      }
    },
  },
};
</script>
