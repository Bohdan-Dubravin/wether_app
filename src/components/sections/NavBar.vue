<template>
  <nav class="nav">
    <div class="nav__links">
      <router-link :class="{ 'nav__active-link': isActivePath('/') }" class="nav__link" to="/">{{
        $t("home")
      }}</router-link>
      <router-link :class="{ 'nav__active-link': isActivePath('/favorites') }" class="nav__link" to="/favorites">{{
        $t("favorites")
      }}</router-link>
    </div>
    <div class="nav__tools">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  </nav>
</template>

<script>
import { defineComponent } from "vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: { LanguageSwitcher, ThemeSwitcher },
  setup() {
    const route = useRoute();

    const isActivePath = (path) => {
      return route.path === path;
    };

    return {
      isActivePath,
    };
  },
});
</script>

<style scoped lang="scss">
.nav {
  padding: 7px 10px;
  border-bottom: 1px solid #c9c9c9;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__link {
    color: inherit;
    padding: 5px 0;
    text-decoration: none;
    margin-right: 30px;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
    &:hover {
      border-bottom: 2px solid #517dcf;
    }
  }

  &__active-link {
    border-bottom: 2px solid #517dcf !important;
  }

  &__tools {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
