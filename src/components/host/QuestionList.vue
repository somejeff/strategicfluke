<template>
  <div>
    <table class="table table-condensed table-bordered">
      <thead>
        <tr>
          <th>Question</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
         <tr  v-for="(entry, key) in questions"
          :key="key"
          class="bg-opacity-10"
          :class="{
            'bg-success': entry.played,
          }">
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
          <a class="btn btn-primary" href="#" @click="setQuestion(key)">Play</a>
        </td>
      </tr>
      </tbody>
    </table>
    <textarea v-model="rawQuestions"></textarea
    ><button @click="loadQuestions">Load</button>
  </div>
</template>

<script>
import fb from "@/firebaseConfig";
import { ref, onValue, remove, push, child, set } from "@firebase/database";

export default {
  name: "QuestionList",
  props: ["gameid"],
  data: function () {
    return {
      questions: null,
      rawQuestions: null,
    };
  },
  created: function () {
    onValue(ref(fb.db, `games/${this.gameid}/questions`), (snap) => {
      this.questions = snap.val();
    });
  },
  methods: {
    setQuestion: function (key) {
      set(ref(fb.db, `games/${this.gameid}/questions/${key}/played`), true);
      set(
        ref(fb.db, `games/${this.gameid}/details/question`),
        this.questions[key]
      );
    },
    loadQuestions: function () {
      remove(ref(fb.db, `games/${this.gameid}/questions`));
      this.rawQuestions.split("\n").map((d, i) => {
        d = d.split("\t");
        const key = push(
          child(ref(fb.db), `games/${this.gameid}/questions`)
        ).key;
        const question = {
          question: d[0],
          a: d[1] || null,
          b: d[2] || null,
          c: d[3] || null,
          d: d[4] || null,
          e: d[5] || null,
          played: false,
          order: i,
        };
        set(ref(fb.db, `games/${this.gameid}/questions/${key}`), question);
      });
    },
  },
};
</script>

<style scoped>
.answers {
  list-style-type: upper-alpha;
}
</style>