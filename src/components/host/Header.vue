<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-secondary">
    <div class="container-fluid">
      <div class="text-light" v-if="user">{{ user.email }}</div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["user"],
};
</script>
