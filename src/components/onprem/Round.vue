<template>
  <div>
      
        <transition name="fade">
    <div class="container p-5 round d-flex flex-column" v-if="details.question">
      <transition name="flip-fade">
        <div class="question" v-if="details.question.show_q">
          {{ details.question.question }}
        </div>
      </transition>
      <transition name="slide-fade">
        <div class="answer" v-if="details.question.show_a">
          A. {{ details.question.a }}
        </div>
      </transition>
      <transition name="slide-fade">
        <div class="answer" v-if="details.question.show_b">
          B. {{ details.question.b }}
        </div>
      </transition>
      <transition name="slide-fade">
        <div class="answer" v-if="details.question.show_c">
          C. {{ details.question.c }}
        </div>
      </transition>
    </div>
      </transition>
    <div
      class="offcanvas offcanvas-top bg-transparent"
      tabindex="-1"
      id="scores"
    >
      <div class="offcanvas-body">
        <transition-group name="slide-fade">
          <div
            v-for="(player, key) in contestants"
            :key="key"
            class="
              result
              text-nowrap
              d-flex
              justify-content-between
              align-items-center
            "
          >
            <span class="px-4">{{ player.name }} </span>
            <span class="badge bg-secondary rounded-pill">{{
              player.score
            }}</span>
          </div>
        </transition-group>
      </div>
    </div>
    <div class="background">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Round",
  props: ["details"],
  data: function () {
    return {
      showScores: true,
    };
  },
  computed: {
    contestants: function () {
      if (this.details) {
        return this.details.contestants;
      } else {
        return null;
      }
    },
  },
  watch: {
    contestants: function (newVal,oldVal) {
        if(JSON.stringify(newVal)==JSON.stringify(oldVal)) {
            return;
        }
      window.clearTimeout(this.timer);
      this.scoresPanel.show();
      this.timer = window.setTimeout(() => {
        this.scoresPanel.hide();
      }, 5000);
    },
  },
  mounted: function () {
    this.scoresPanel = new window.bootstrap.Offcanvas(
      document.getElementById("scores")
    );
    //this.scoresPanel.show();
  },
};
</script>
<style scoped>
.flip-fade-enter-active {
  transition: all 2s ease-out;
}

.flip-fade-enter-from {
  transform: rotateX(90deg);
  opacity: 0;
}

.slide-fade-enter-active {
  animation: swing 0.5s ease;
  transition: all 1s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.fade-enter-active {
  transition: all 2s ease-out;
}

.fade-enter-from {
  opacity: 0;
}
@import url("https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=Besley&display=swap");

.question {
  position: relative;
  display: inline-block;
  font-family: "Besley", serif;
  font-size: 52px;
  padding: 32px 32px;
  color: white;
  background: linear-gradient(to right, #ca2e55 0%, #ca2e55 100%),
    linear-gradient(to right, #ca2e55 0%, #ca2e55 100%),
    linear-gradient(to right, #ca2e55 0%, #ca2e55 100%),
    linear-gradient(to right, #ca2e55 0%, #ca2e55 100%),
    radial-gradient(
      circle at 100% 100%,
      #ca2e55 0%,
      #ca2e55 44%,
      #fff 46%,
      #fff 55%,
      #ca2e55 57%,
      #ca2e55 70%,
      transparent 72%,
      transparent 100%
    ),
    radial-gradient(
      circle at 0 100%,
      #ca2e55 0%,
      #ca2e55 44%,
      #fff 46%,
      #fff 55%,
      #ca2e55 57%,
      #ca2e55 70%,
      transparent 72%,
      transparent 100%
    ),
    radial-gradient(
      circle at 0 0,
      #ca2e55 0%,
      #ca2e55 44%,
      #fff 46%,
      #fff 55%,
      #ca2e55 57%,
      #ca2e55 70%,
      transparent 72%,
      transparent 100%
    ),
    radial-gradient(
      circle at 100% 0,
      #ca2e55 0%,
      #ca2e55 44%,
      #fff 46%,
      #fff 55%,
      #ca2e55 57%,
      #ca2e55 70%,
      transparent 72%,
      transparent 100%
    ),
    linear-gradient(
      to top,
      #ca2e55 0%,
      #ca2e55 63%,
      #fff 65%,
      #fff 78%,
      #ca2e55 80%,
      #ca2e55 100%
    ),
    linear-gradient(
      to bottom,
      #ca2e55 0%,
      #ca2e55 63%,
      #fff 65%,
      #fff 78%,
      #ca2e55 80%,
      #ca2e55 100%
    ),
    linear-gradient(
      to left,
      #ca2e55 0%,
      #ca2e55 63%,
      #fff 65%,
      #fff 78%,
      #ca2e55 80%,
      #ca2e55 100%
    ),
    linear-gradient(
      to left,
      #ca2e55 0%,
      #ca2e55 63%,
      #fff 65%,
      #fff 78%,
      #ca2e55 80%,
      #ca2e55 100%
    ),
    linear-gradient(
      to right,
      #ca2e55 0%,
      #ca2e55 63%,
      #fff 65%,
      #fff 78%,
      #ca2e55 80%,
      #ca2e55 100%
    ),
    linear-gradient(
      to right,
      #ca2e55 0%,
      #ca2e55 63%,
      #fff 65%,
      #fff 78%,
      #ca2e55 80%,
      #ca2e55 100%
    ),
    radial-gradient(
      circle at 0 50%,
      transparent 0%,
      transparent 30%,
      #ca2e55 32%,
      #ca2e55 42%,
      #fff 44%,
      #fff 48%,
      #ca2e55 50%,
      #ca2e55 100%
    ),
    radial-gradient(
      circle at 100% 50%,
      transparent 0%,
      transparent 30%,
      #ca2e55 32%,
      #ca2e55 42%,
      #fff 44%,
      #fff 48%,
      #ca2e55 50%,
      #ca2e55 100%
    ),
    linear-gradient(to right, #ca2e55 0%, #ca2e55 100%);
  background-size: 3px 3px, 3px 3px, 3px 3px, 3px 3px, 16px 16px, 16px 16px,
    16px 16px, 16px 16px, calc(100% - 32px + 4px) 16px,
    calc(100% - 32px + 4px) 16px, 16px calc(50% - 32px), 16px calc(50% - 32px),
    16px calc(50% - 32px), 16px calc(50% - 32px), 32px 32px, 32px 32px,
    calc(100% - 32px + 4px) calc(100% - 32px);
  background-position: 0 calc(50% - 16px), 100% calc(50% - 16px),
    0 calc(50% + 16px), 100% calc(50% + 16px), 0 0, 100% 0, 100% 100%, 0 100%,
    calc(16px - 1px) 0, calc(16px - 1px) 100%, 0 16px, 0 calc(100% - 16px),
    100% 16px, 100% calc(100% - 16px), 0 50%, 100% 50%, calc(16px - 1px) 16px;
  background-repeat: no-repeat;
}
.answer {
  margin: 20px;
  padding: 20px;
  font-family: "Besley", serif;
  font-size: 48px;
  background: beige;
  border: 5px dashed #ca2e55;
  box-shadow: 0 0 0 2.5px #ca2e55, 0 0 0 12.5px #fff, inset 0 0 0 2.5px #ca2e55,
    0 5px 10px 15px rgba(0, 0, 0, 0.5), inset 0 0 0 6px #fff,
    inset 0 0 100vw 100vw beige;
}

@import url("https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=Besley&display=swap");

.offcanvas {
  height: min-content;
}
.offcanvas-body {
  width: min-content;
  margin-left: 35%;
  margin-top: 30px;
  padding: 20px;
  background-color: #3a3d3e;
  color: #de9d73;
  border: 6px solid #3a3d3e;
  box-shadow: 6px 6px #de9d73, -6px -6px #de9d73, 6px -6px #de9d73,
    -6px 6px #de9d73, inset 2px 2px #de9d73, inset -2px -2px #de9d73,
    inset 2px -2px #de9d73, inset -2px 2px #de9d73;
  border-radius: 10px;
  overflow: hidden;
}

.result {
  font-size: 48px;
  font-family: "Besley", serif;
}

.background {
  z-index: -100;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: #3e1e68;
}

.background span {
  width: 20vmin;
  height: 20vmin;
  border-radius: 20vmin;
  backface-visibility: hidden;
  position: absolute;
  animation-name: move;
  animation-duration: 6s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.background span:nth-child(1) {
  color: #e45a84;
  top: 62%;
  left: 35%;
  animation-duration: 13.7s;
  animation-delay: -1.8s;
  transform-origin: -2vw 2vh;
  box-shadow: 40vmin 0 9.2120201317vmin currentColor;
}
.background span:nth-child(2) {
  color: #ffacac;
  top: 23%;
  left: 75%;
  animation-duration: 15.9s;
  animation-delay: -5.8s;
  transform-origin: -15vw 18vh;
  box-shadow: -40vmin 0 7.4490533349vmin currentColor;
}
.background span:nth-child(3) {
  color: #e45a84;
  top: 15%;
  left: 86%;
  animation-duration: 12.5s;
  animation-delay: -3.2s;
  transform-origin: -5vw -10vh;
  box-shadow: 40vmin 0 8.2594030861vmin currentColor;
}
.background span:nth-child(4) {
  color: #583c87;
  top: 83%;
  left: 35%;
  animation-duration: 15.7s;
  animation-delay: -0.2s;
  transform-origin: -15vw 19vh;
  box-shadow: -40vmin 0 10.0915651661vmin currentColor;
}
.background span:nth-child(5) {
  color: #583c87;
  top: 31%;
  left: 77%;
  animation-duration: 14.6s;
  animation-delay: -9.7s;
  transform-origin: -19vw 12vh;
  box-shadow: 40vmin 0 11.0227385061vmin currentColor;
}
.background span:nth-child(6) {
  color: #583c87;
  top: 45%;
  left: 45%;
  animation-duration: 13.6s;
  animation-delay: -8.8s;
  transform-origin: -8vw -17vh;
  box-shadow: -40vmin 0 12.102265078vmin currentColor;
}
.background span:nth-child(7) {
  color: #583c87;
  top: 35%;
  left: 94%;
  animation-duration: 15.2s;
  animation-delay: -7.7s;
  transform-origin: -2vw 8vh;
  box-shadow: 40vmin 0 11.3404386497vmin currentColor;
}
.background span:nth-child(8) {
  color: #e45a84;
  top: 99%;
  left: 9%;
  animation-duration: 14.2s;
  animation-delay: -9.8s;
  transform-origin: 14vw 22vh;
  box-shadow: 40vmin 0 6.1569836322vmin currentColor;
}
.background span:nth-child(9) {
  color: #583c87;
  top: 34%;
  left: 92%;
  animation-duration: 11.8s;
  animation-delay: -5.9s;
  transform-origin: -4vw 13vh;
  box-shadow: -40vmin 0 13.646551408vmin currentColor;
}
.background span:nth-child(10) {
  color: #583c87;
  top: 72%;
  left: 11%;
  animation-duration: 12.9s;
  animation-delay: -14.9s;
  transform-origin: 7vw 19vh;
  box-shadow: 40vmin 0 10.5625698668vmin currentColor;
}
.background span:nth-child(11) {
  color: #583c87;
  top: 3%;
  left: 87%;
  animation-duration: 14.7s;
  animation-delay: -7s;
  transform-origin: 24vw 14vh;
  box-shadow: -40vmin 0 13.6592052922vmin currentColor;
}
.background span:nth-child(12) {
  color: #583c87;
  top: 86%;
  left: 19%;
  animation-duration: 12.7s;
  animation-delay: -11.3s;
  transform-origin: 19vw -15vh;
  box-shadow: -40vmin 0 7.8184767319vmin currentColor;
}
.background span:nth-child(13) {
  color: #583c87;
  top: 39%;
  left: 78%;
  animation-duration: 14.6s;
  animation-delay: -6.2s;
  transform-origin: -14vw -24vh;
  box-shadow: -40vmin 0 14.1567431238vmin currentColor;
}
.background span:nth-child(14) {
  color: #e45a84;
  top: 15%;
  left: 30%;
  animation-duration: 10.4s;
  animation-delay: -4.7s;
  transform-origin: 9vw 9vh;
  box-shadow: 40vmin 0 14.7801422833vmin currentColor;
}
.background span:nth-child(15) {
  color: #ffacac;
  top: 97%;
  left: 90%;
  animation-duration: 12.4s;
  animation-delay: -12.3s;
  transform-origin: 15vw 16vh;
  box-shadow: -40vmin 0 5.2436400043vmin currentColor;
}
.background span:nth-child(16) {
  color: #ffacac;
  top: 50%;
  left: 63%;
  animation-duration: 14.9s;
  animation-delay: -14.4s;
  transform-origin: 4vw -9vh;
  box-shadow: 40vmin 0 8.1779975619vmin currentColor;
}
.background span:nth-child(17) {
  color: #e45a84;
  top: 69%;
  left: 64%;
  animation-duration: 13.9s;
  animation-delay: -15.7s;
  transform-origin: -2vw -5vh;
  box-shadow: -40vmin 0 8.9462750632vmin currentColor;
}
.background span:nth-child(18) {
  color: #e45a84;
  top: 43%;
  left: 91%;
  animation-duration: 13.6s;
  animation-delay: -8.5s;
  transform-origin: -2vw 10vh;
  box-shadow: 40vmin 0 12.4937706841vmin currentColor;
}
.background span:nth-child(19) {
  color: #583c87;
  top: 58%;
  left: 49%;
  animation-duration: 14.9s;
  animation-delay: -3.3s;
  transform-origin: -7vw 13vh;
  box-shadow: 40vmin 0 6.6075643331vmin currentColor;
}
.background span:nth-child(20) {
  color: #ffacac;
  top: 27%;
  left: 32%;
  animation-duration: 13.6s;
  animation-delay: -4.2s;
  transform-origin: -10vw -17vh;
  box-shadow: -40vmin 0 11.2891135219vmin currentColor;
}

@keyframes move {
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
}
</style>