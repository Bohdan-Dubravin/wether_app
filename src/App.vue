<template>
  <div id="app" class="app">
    <ErrorAlert :visible="showAlert" :text="alertText" />
    <div class="app__container">
      <NavBar />
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/sections/nav-bar/NavBar.vue";
import ErrorAlert from "./components/ui/ErrorAlert.vue";
import useHandleErrorStore from "./store/errorHandleStore";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    NavBar,
    ErrorAlert,
  },
  setup() {
    const alertStore = useHandleErrorStore();
    const showAlert = computed(() => alertStore.isAlertVisible);
    const alertText = computed(() => alertStore.alertText);
    return { showAlert, alertText };
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
