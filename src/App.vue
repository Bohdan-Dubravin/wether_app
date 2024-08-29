<template>
  <div id="app" class="app">
    <div class="app__container">
      <NavBar />
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/sections/NavBar.vue";

export default {
  components: {
    NavBar,
  },
};
</script>

<style scoped lang="scss">
.app {
  &__container {
    max-width: 1200px;
    padding: 0 20px;
    margin: 0 auto;

    @include onMobile {
      padding: 0 10px;
    }
  }
}
</style>
