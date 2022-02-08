<template>
  <table class="table table-condensed table-bordered" v-if="entry">
    <thead>
      <tr>
        <th>Question</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div>{{ entry.question }}</div>
          <div>
            <ol class="answers">
              <li v-if="entry.a">{{ entry.a }}</li>
              <li v-if="entry.b">{{ entry.b }}</li>
              <li v-if="entry.c">{{ entry.c }}</li>
              <li v-if="entry.d">{{ entry.d }}</li>
              <li v-if="entry.e">{{ entry.e }}</li>
            </ol>
          </div>
        </td>
        <td>
          <button class="btn btn-primary" @click="unsetQuestion">Done</button>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="btn-group" v-if="type == 'onprem'">
            <button class="btn btn-outline-primary" @click="showChoice('q')">
              Show Question
            </button>
            <button
              class="btn btn-outline-primary"
              v-if="entry.a"
              @click="showChoice('a')"
            >
              Answer A
            </button>
            <button
              class="btn btn-outline-primary"
              v-if="entry.b"
              @click="showChoice('b')"
            >
              Answer B
            </button>
            <button
              class="btn btn-outline-primary"
              v-if="entry.c"
              @click="showChoice('c')"
            >
              Answer C
            </button>
            <button
              class="btn btn-outline-primary"
              v-if="entry.d"
              @click="showChoice('d')"
            >
              Answer D
            </button>
            <button
              class="btn btn-outline-primary"
              v-if="entry.e"
              @click="showChoice('e')"
            >
              Answer E
            </button>
          </div>
          <div class="btn-group" v-else>
            <button
              class="btn btn-outline-primary"
              @click="
                $emit('clearChoices');
                $emit('update:state', 'round_prep');
              "
            >
              Prepare Round
            </button>
            <button
              class="btn btn-outline-primary"
              @click="$emit('update:state', 'round_play')"
            >
              Play Round
            </button>
            <button
              class="btn btn-outline-primary"
              @click="
                $emit('showResults');
                $emit('update:state', 'round_score');
              "
            >
              Score Round
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import fb from "@/firebaseConfig";
import { set, ref, onValue, remove } from "@firebase/database";
export default {
  name: "Question",
  props: ["gameid", "type", "state"],
  data: function () {
    return {
      entry: null,
      ref: `games/${this.gameid}/details/question`,
    };
  },
  created: function () {
    onValue(ref(fb.db, this.ref), (snap) => {
      if (snap.exists()) {
        this.entry = snap.val();
      } else {
        this.entry = null;
      }
    });
  },
  methods: {
    unsetQuestion: function () {
      remove(ref(fb.db, this.ref));
    },
    showChoice: function (letter) {
      set(ref(fb.db, `${this.ref}/show_${letter}`), true);
    },
  },
};
</script>

<style scoped>
.answers {
  list-style-type: upper-alpha;
}
</style>

