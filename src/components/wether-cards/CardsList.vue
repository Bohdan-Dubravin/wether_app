<template>
  <div class="cards-list">
    <city-card
      v-for="city in data"
      @click="changeChart(city)"
      @add-favorite="toggleFavorites"
      @remove-city="handleRemoveCity"
      :key="city.city.id"
      :city="city"
      :class="{ card__active: isCardSelected(city.city.id) && !isFavoritesPage }"
      :isFavorite="isFavorite(city.city.id)"
      :period="period"
    />
    <div
      v-if="!data.length && !isFavoritesPage"
      :style="{ height: period === 'Day' ? '173px' : '271px' }"
      class="card-add"
    >
      <Loader :visible="!data.length && !isFavoritesPage" />
    </div>
    <div
      v-if="data.length < 4 && !isFavoritesPage"
      class="card-add"
      :style="{ height: period === 'Day' ? '173px' : '271px' }"
      @click="$emit('addNewCity')"
    >
      <img src="/assets/images/plus.svg" />
    </div>
    <confirm-dialogue ref="reachedMaxFavLimit" :showOkButton="false" />
    <confirm-dialogue ref="confirmDialogue" showOkButton />
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import Loader from "../ui/Loader.vue";
import CityCard from "./CityCard.vue";
import ConfirmDialogue from "../ui/ConfirmDialogue.vue";
import useWeatherCardsStore from "../../store/weatherCardsStore";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "CardsList",
  components: { CityCard, ConfirmDialogue, Loader },
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
    isFavoritesPage: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, refs }) {
    const confirmDialogue = ref(null);
    const weatherStore = useWeatherCardsStore();
    const { favoriteCities, selectedCities } = storeToRefs(weatherStore);

    const handleRemoveCity = async (city) => {
      if (!confirmDialogue.value) return;
      console.log(confirmDialogue.value);

      const confirm = await confirmDialogue.value.show({
        message: "Are you sure you want to remove this weather card?",
        okButton: "Remove",
      });
      if (confirm) {
        weatherStore.removeCity(city);
      }
    };

    const changeChart = (city) => {
      emit("chart-updated", city);
    };

    const isCardSelected = (id) => {
      return props.cardSelected ? props.cardSelected.city.id === id : false;
    };

    const toggleFavorites = async (card) => {
      if (favoriteCities.value.some((item) => item.city.id === card.city.id) || favoriteCities.value.length < 5) {
        weatherStore.toggleFavoriteCities(card);
      } else {
        await refs.reachedMaxFavLimit.show({
          message: "Maximum number of the favorites is 5. Remove any of them to add another one.",
          okButton: "Ok",
        });
      }
    };

    const isFavorite = (id) => {
      return favoriteCities.value.some((card) => card.city.id === id);
    };

    return {
      changeChart,
      isCardSelected,
      toggleFavorites,
      isFavorite,
      confirmDialogue,
      handleRemoveCity,
    };
  },
});
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
