<template>
  <div class="container justify-content-center align-items-center">
    <img src="loading.gif" height="250" />
    <h1>Welcome to Strategic Fluke</h1>
    <div class="col-4" id="firebaseui-auth-container"></div>
  </div>
</template>
<script>
import fb from "@/firebaseConfig";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  mounted: async function () {
    this.initfirebaseUI();
  },
  methods: {
    initfirebaseUI: async function () {
      let ui;
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(fb.auth);
      }
      ui.start("#firebaseui-auth-container", {
        signInSuccessUrl: "/host",
        signInOptions: [
          EmailAuthProvider.PROVIDER_ID,
          GoogleAuthProvider.PROVIDER_ID,
        ],
      });
    },
  },
};
</script>