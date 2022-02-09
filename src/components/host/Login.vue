<template>
  <div
    class="modal fade"
    id="signinModal"
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
          <button type="button" class="btn btn-primary" @click="signInUser">
            Sign in with Google
          </button>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
export default {
  name: "HeaderBar",
  data: function () {
    return {
      modal: null,
    };
  },
  mounted: function () {
    this.modal = new window.bootstrap.Modal(document.getElementById("signinModal"), {
      backdrop: "static",
      keyboard: false,
      focus: true,
    });
    this.modal.show();
  },
  methods: {
    signInUser: async function () {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(fb.auth, provider);
      this.modal.hide();
    },
  },
};
</script>