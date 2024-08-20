<template>
  <nav class="nav">
    <div class="nav__links">
      <router-link class="nav__link" to="/">{{ $t("home") }}</router-link>
      <router-link class="nav__link" to="/favorites">{{ $t("favorites") }}</router-link>
    </div>
    <div class="nav__tools">
      <!-- <LanguageSwitcher /> -->
      <button @click="toggleTheme" class="nav__themeSwitch">
        <img
          class="nav__themeSwitch"
          :src="`/assets/images/${isDark ? 'moon.png' : 'sun-icon.svg'}`"
          alt="theme-switch"
        />
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, defineComponent } from "vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";

export default defineComponent({
  components: { LanguageSwitcher },
  setup() {
    const isDark = ref(false);

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      const theme = isDark.value ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    };

    onMounted(() => {
      isDark.value = localStorage.getItem("theme") === "dark";
    });

    return {
      isDark,
      toggleTheme,
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

    &:hover {
      opacity: 0.8;
      font-weight: 500;
    }
  }

  &__themeSwitch {
    max-width: 40px;
    background: none !important;
    outline: none;
    border: none;
  }

  &__tools {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
