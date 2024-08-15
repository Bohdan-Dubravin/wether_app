<template>
  <h1 class="favorites__title">Favorites List</h1>
  <div v-if="favorites.length" class="cards-list-wrapper">
    <div class="period-links">
      <p
        class="period-link"
        v-for="link in periodLinks"
        :key="link"
        :class="{ 'period-link-active': period === link }"
        @click="togglePeriod"
      >
        {{ link }}
      </p>
    </div>
    <cards-list :data="favorites" :period="period" />
  </div>
  <p v-if="!favorites.length">No favorites added.</p>
</template>

<script>
import CardsList from "../components/wether-cards/CardsList.vue";
export default {
  name: "FavoritesView",
  components: { CardsList },
  props: {
    period: {
      type: String,
    },
    togglePeriod: {
      type: Function,
    },
  },
  data() {
    return {
      favorites: [],
      periodLinks: ["Day", "Week"],
      data: [],
    };
  },
  created() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  },
};
</script>
<style scoped lang="scss">
.favorites {
  &__title {
    font-weight: 300;
    font-size: 30px;
    margin-bottom: 40px;
  }
}
</style>
