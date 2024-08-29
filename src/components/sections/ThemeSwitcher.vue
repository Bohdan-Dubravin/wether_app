<template>
  <button @click="toggleTheme" class="theme-switch">
    <img class="nav__themeSwitch" :src="`/assets/images/${isDark ? 'moon.png' : 'sun-icon.svg'}`" alt="theme-switch" />
  </button>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "ThemeSwitcher",
  setup() {
    const isDark = ref(localStorage.getItem("theme") === "dark");

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      const theme = isDark.value ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    };

    onMounted(() => {
      const theme = isDark.value ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
    });

    return {
      isDark,
      toggleTheme,
    };
  },
});
</script>

<style scoped>
.theme-switch {
  max-width: 40px;
  background: none !important;
  outline: none;
  border: none;
}

.theme-switch img {
  width: 100%;
}
</style>
