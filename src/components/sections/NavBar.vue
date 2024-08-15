<template>
  <nav class="nav">
    <div class="nav__links">
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/favorites">Favorites</router-link>
    </div>
    <button @click="toggleTheme" class="nav__themeSwitch">
      <img
        class="nav__themeSwitch"
        :src="`/assets/images/${isDark ? 'moon.png' : 'sun-icon.svg'}`"
        alt="theme-switch"
      />
    </button>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      period: "Day",
      isDark: localStorage.getItem("theme") === "dark",
    };
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      const theme = this.isDark ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    },
  },
};
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
}
</style>
