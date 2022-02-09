<template>
  <div class="modal fade" id="instructionsModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">Instructions</div>
        <div class="modal-body">
          <div class="btn-group btn-group-vertical">
             <button
              @click="$emit('update:state', 'intro0')"
              :class="{ 'btn-secondary text-light': state == 'intro0' }"
              class="btn btn-outline-secondary"
            >
              Show Splash Page
            </button>
            <button
              @click="$emit('update:state', 'intro1')"
              :class="{ 'btn-secondary text-light': state == 'intro1' }"
              class="btn btn-outline-secondary"
            >
              Show Example Question
            </button>
            <button
              @click="$emit('update:state', 'intro2')"
              :class="{ 'btn-secondary text-light': state == 'intro2' }"
              class="btn btn-outline-secondary"
            >
              Show Example Answers
            </button>
            <button
              @click="$emit('update:state', 'intro3')"
              :class="{ 'btn-secondary text-light': state == 'intro3' }"
              class="btn btn-outline-secondary"
            >
              Show Example Scores
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["state"],
};
</script>
