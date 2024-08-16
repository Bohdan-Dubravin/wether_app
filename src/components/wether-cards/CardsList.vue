<template>
  <div class="cards-list">
    <city-card
      v-for="city in cardsData ? favorites : data"
      @click="changeChart(city)"
      @add-favorite="toggleFavorites"
      @remove-city="$emit('remove-city', $event)"
      :key="city.city.id"
      :city="city"
      :class="{ card__active: isCardSelected(city.city.id) }"
      :isFavorite="isFavorite(city.city.id)"
      :period="period"
    />
    <div v-if="data.length < 4" class="card-add" @click="$emit('addNewCity')">
      <img src="/assets/images/plus.svg" />
    </div>
    <confirm-dialogue ref="reachedMaxFavLimit" :showOkButton="false" />
  </div>
</template>

<script>
import CityCard from "./CityCard.vue";
import ConfirmDialogue from "../ui/ConfirmDialogue.vue";

export default {
  name: "CardsList",
  components: { CityCard, ConfirmDialogue },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    cardSelected: {
      type: Object,
      default: null,
    },
    period: {
      type: String,
      default: "Day",
    },
  },
  data() {
    return {
      cities: [],
      favorites: [],
    };
  },

  methods: {
    changeChart(city) {
      this.$emit("chart-updated", city);
    },
    isCardSelected(id) {
      if (this.cardSelected) {
        return this.cardSelected.city.id === id;
      }
    },
    async toggleFavorites(card) {
      if (this.favorites.some((item) => item.city.id === card.city.id)) {
        this.favorites = this.favorites.filter((item) => item.city.id !== card.city.id);
        this.updateStorageFavorites();
      } else if (this.favorites.length < 5) {
        this.favorites.push(card);
        this.updateStorageFavorites();
      } else {
        await this.$refs.reachedMaxFavLimit.show({
          message: "Maximum number of the favorites is 5. Remove any of them to add another one.",
          okButton: "Ok",
        });
      }
    },
    isFavorite(id) {
      return this.favorites.some((card) => card.city.id === id);
    },
    updateStorageFavorites() {
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
  },
  mounted() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  },
  computed: {
    cardsData() {
      return this.$route.name === "favorites";
    },
  },
};
</script>

<style scoped lang="scss">
.card-add {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.2);
  -webkit-animation: open 0.5s cubic-bezier(0.39, 0, 0.38, 1);
  border: 1px solid transparent;
  font-size: 80px;
  &:hover {
    box-shadow: 1px 2px 10px rgb(50, 131, 131);
    border: 1px solid rgba(48, 64, 124, 0.9);
  }
}

.cards-list {
  display: grid;
  grid-template-columns: minmax(350px, 1fr) minmax(350px, 1fr) minmax(350px, 1fr);
  gap: 20px;

  @include onTablet {
    grid-template-columns: minmax(340px, 400px) minmax(330px, 400px);
  }

  @include onMobile {
    grid-template-columns: minmax(280px, 400px);
    margin: 0 auto;
  }
}
</style>
