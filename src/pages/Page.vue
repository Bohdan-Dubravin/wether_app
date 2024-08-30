<template>
  <div class="input-wrapper">
    <search-autocomplete ref="autocompleteRef" />
  </div>

  <div class="cards-list-wrapper">
    <div class="period-links">
      <p
        class="period-link"
        v-for="link in periodLinks"
        :key="link"
        :class="{ 'period-link-active': period === link }"
        @click="togglePeriod"
      >
        {{ $t(link) }}
      </p>
    </div>
    <cards-list
      :data="!favoritesPage ? selectedCities : favoriteCities"
      :isFavoritesPage="favoritesPage"
      :cardSelected="cardSelected"
      :period="period"
      @chart-updated="handleChartUpdate"
      @addNewCity="handleAddNewCity"
    />
  </div>

  <temperature-chart
    v-if="cardSelected && !favoritesPage"
    :cardSelected="cardSelected"
    :period="period"
    :weekData="selectedCities"
  />

  <confirm-dialogue ref="confirmDialogue" :showsubmitButtonText="true" />
  <confirm-dialogue ref="reachedMaxLimit" :showsubmitButtonText="false" />
</template>

<script>
import { ref, defineComponent, watch, computed, onMounted } from "vue";
import { fetchGeolocationData } from "../api/weatherApi";
import SearchAutocomplete from "../components/ui/SearchAutocomplete.vue";
import CardsList from "../components/sections/wether-cards/CardsList.vue";
import ConfirmDialogue from "../components/ui/ConfirmDialogue.vue";
import useWeatherCardsStore from "../store/weatherCardsStore";
import TemperatureChart from "../components/sections/temperature-chart/TemperatureChart.vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "Page",
  components: {
    SearchAutocomplete,
    TemperatureChart,
    CardsList,
    ConfirmDialogue,
  },
  props: {
    favoritesPage: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const weatherStore = useWeatherCardsStore();
    const { favoriteCities, selectedCities } = storeToRefs(weatherStore);
    const autocompleteRef = ref(null);
    const period = ref("Day");
    const cardSelected = ref(null);
    const periodLinks = ["Day", "Week"];
    const selectedCitiesLength = computed(() => selectedCities.value.length);

    const togglePeriod = () => {
      period.value = period.value === "Day" ? "Week" : "Day";
    };

    const handleAddNewCity = () => {
      if (!autocompleteRef.value) return;

      autocompleteRef.value.openSearch();
    };

    const handleChartUpdate = (city) => {
      cardSelected.value = city;
    };
    const getIpInfo = async () => {
      const data = await fetchGeolocationData();
      weatherStore.addNewCity({ name: data.city, sys: { county: data.country_code2 } });
    };

    watch(selectedCitiesLength, (newLength) => {
      if (!newLength) {
        getIpInfo();
      }
    });

    onMounted(() => {
      if (!selectedCities.value.length) {
        getIpInfo();
      }
    });

    return {
      selectedCities,
      period,
      favoriteCities,
      cardSelected,
      periodLinks,
      togglePeriod,
      handleAddNewCity,
      autocompleteRef,
      handleChartUpdate,
    };
  },
});
</script>

<style lang="scss">
.cards-list-wrapper {
  height: fit-content;
  width: 100%;
  margin-bottom: 30px;
  background-color: rgba(75, 132, 192, 0.3);
  border-radius: 5px;
  padding: 20px;

  @include onMobile {
    padding: 10px;
  }
}
.period {
  &-links {
    display: flex;
    margin-bottom: 20px;
  }

  &-link {
    padding: 5px 10px;

    background-color: rgba(48, 80, 124, 0.2);
    border: 1px solid transparent;
    border-radius: 5px;
    margin-right: 20px;
    color: rgba(48, 75, 124, 0.9);

    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
  }

  &-link:hover,
  &-link-active {
    background-color: rgba(48, 69, 124, 0.6);
    border: 1px solid rgba(48, 80, 124, 0.9);
    color: white;
  }
}
.input-wrapper {
  margin-bottom: 20px;
}
</style>
