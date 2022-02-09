<template>
  <div class="outer-panel">
    <div class="mid-panel">
      <div class="inner-panel">
        <div class="content d-flex flex-column align-items-center">
          <div class="title">Contestants</div>
          <div class="d-flex flex-wrap p-4">
              <transition-group name="slide">
            <div
              v-for="(player, key) in details.contestants"
              :key="key"
              class="
                result
                text-nowrap
                d-flex
                justify-content-around 
                align-content-between
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Scoring",
  props: ["details"],
};
</script>

<style scoped>
.result {
  transition: all 1s ease-out;
  display: inline-block;

}

.slide-enter-from {
  transform: translateY(100px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
.slide-leave-active {
  position: absolute;
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
  margin-top: 40px;
  font-family: "Besley", cursive;
  font-size: 64px;
}
.result {
  font-size: 48px;
  font-family: "Besley", serif;
  padding:50px;
}

.badge {
  width: 120px;
  height: 60px;
}
</style>