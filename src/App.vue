<template>
  <SharedContextProvider>
    <div id="app" class="app">
      <div class="app__container">
        <NavBar />
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </SharedContextProvider>
</template>

<script>
import NavBar from "./components/sections/NavBar.vue";
import SharedContextProvider from "./context/ContextProvider.vue";
export default {
  components: {
    NavBar,
    SharedContextProvider,
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
