<template>
  <div>
    <div class="outer-panel" v-if="details.state == 'intro0'">
      <div class="mid-panel">
        <div class="inner-panel">
          <div class="content d-flex justify-content-center align-items-center">
            <div class="title">{{details.name}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="main" v-if="details.state == 'intro1'||
                details.state == 'intro2' ||
                details.state == 'intro3'">
      <div class="row">
        <div class="col gameboard">
          <transition name="fade">
            <div
              v-show="
                details.state == 'intro1' ||
                details.state == 'intro2' ||
                details.state == 'intro3'
              "
            >
              <h1>My favourite time of day is...</h1>
              <h2>A: Morning</h2>
              <h2>B: Afternoon</h2>
              <h2>C: Evening</h2>
            </div>
          </transition>
        </div>
        <div class="col" style="position: relative">
          <div>
            <img src="/contestant0.png" />
            <img src="/contestant1.png" />
            <img src="/contestant2.png" />
          </div>
          <transition name="fade">
            <div
              v-show="details.state == 'intro2' || details.state == 'intro3'"
            >
              <div class="choice choice-b" style="top: 200px; left: 30px">
                B
              </div>
              <div class="choice choice-b" style="top: 200px; left: 185px">
                B
              </div>
              <div class="choice choice-c" style="top: 200px; left: 365px">
                C
              </div>
            </div>
          </transition>
          <transition name="fade">
            <div v-show="details.state == 'intro3'">
              <div class="score" style="top: 300px; left: 45px">4</div>
              <div class="score" style="top: 300px; left: 200px">4</div>
              <div class="score" style="top: 300px; left: 380px">3</div>
            </div>
          </transition>
        </div>
      </div>
      <div style="position: relative">
        <img style="width: 100%; margin-top: 120px" src="/audience.png" />
        <transition name="fade">
          <div v-show="details.state == 'intro2' || details.state == 'intro3'">
            <div class="choice choice-a" style="top: 0px; left: 500px">A</div>
            <div class="choice choice-a" style="top: 30px; left: 200px">A</div>
            <div class="choice choice-b" style="top: 25px; left: 1000px">B</div>
            <div class="choice choice-b" style="top: 40px; left: 1200px">B</div>
            <div class="choice choice-b" style="top: 0px; left: 100px">B</div>
            <div class="choice choice-b" style="top: 15px; left: 700px">B</div>
            <div class="choice choice-c" style="top: 20px; left: 400px">C</div>
            <div class="choice choice-c" style="top: 30px; left: 0px">C</div>
            <div class="choice choice-c" style="top: 45px; left: 900px">C</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Instructions",
  props: ["details"],
};
</script>

<style scoped>
.main {
  background-color: #ffe3b1;
}
.gameboard {
  border: 20px inset grey;
  margin: 50px;
  background-color: white;
}
.choice {
  position: absolute;
  border: 5px black solid;
  font-size: 50px;
  padding-left: 25px;
  padding-right: 25px;
  color: white;
  font-weight: bold;
  border-radius: 20px;
}
.choice-a {
  background-color: darkgoldenrod;
}
.choice-b {
  background-color: darkcyan;
}
.choice-c {
  background-color: darkred;
}

.score {
  position: absolute;
  border: 1px black solid;
  font-size: 30px;
  padding-left: 20px;
  padding-right: 20px;
  color: white;
  background-color: blue;
  font-weight: bold;
  border-radius: 10px;
  box-shadow: 0px 0px 15px blue;
}

.fade-enter-active {
  transition: all 2s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.outer-panel {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #3a3d3e;
  padding: 10px;
}
.outer-panel::before,
.outer-panel::after,
.inner-panel::before,
.inner-panel::after {
  background-image: url("/assets/corner-decoration.jpg");
  background-size: 100px 100px;
  background-repeat: no-repeat;
  content: "";
  position: absolute;
  height: 100px;
  width: 100px;
  z-index: 10;
}

.outer-panel::before {
  left: 24px;
  top: 24px;
}
.outer-panel::after {
  transform: rotate(90deg);
  right: 24px;
  top: 24px;
}
.inner-panel::before {
  transform: rotate(270deg);
  left: 24px;
  bottom: 24px;
}
.inner-panel::after {
  transform: rotate(180deg);
  right: 24px;
  bottom: 24px;
}

.mid-panel {
  height: 100%;
  padding: 6px;
  border: 2px solid #de9d73;
}
.inner-panel {
  height: 100%;
  padding: 6px;
  border: 6px solid #de9d73;
  border: 6px solid #de9d73;
  background: transparent
    url("/assets/horizontally-centered-vertical-decoration.png") no-repeat;
  background-size: 300px 52px;
  background-position: top;
  background-position-y: 10px;
}

@import url("https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=Besley&display=swap");
.content {
  height: 100%;
  color: #de9d73;
  border: 3px solid #de9d73;
}

.title {
  font-family: "Besley", cursive;
  font-size: 100px;
}
</style>