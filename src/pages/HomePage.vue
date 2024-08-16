<template>
  <div class="input-wrapper">
    <search-autocomplete @addCity="handleAddCity" ref="autocomplete" />
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
        {{ link }}
      </p>
    </div>
    <cards-list
      :data="cardsData"
      @chart-updated="handleChartUpdate"
      @addNewCity="handleAddNewCity"
      :cardSelected="cardSelected"
      :period="period"
      @remove-city="handleRemoveCity"
    />
  </div>

  <temperature-chart v-if="cardSelected" :cardSelected="cardSelected" :period="period" :weekData="cardsData" />

  <confirm-dialogue ref="confirmDialogue" :showOkButton="true" />
  <confirm-dialogue ref="reachedMaxLimit" :showOkButton="false" />
</template>

<script>
import { fetchCurrentWeather, fetchByCityCountry, fetchGeolocationData } from "../api/weatherApi";
import SearchAutocomplete from "../components/ui/SearchAutocomplete.vue";
import TemperatureChart from "../components/wether-cards/TemperatureChart.vue";
import CardsList from "../components/wether-cards/CardsList.vue";
import ConfirmDialogue from "../components/ui/ConfirmDialogue.vue";

export default {
  name: "HomeView",
  components: {
    SearchAutocomplete,
    TemperatureChart,
    CardsList,
    ConfirmDialogue,
  },
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
      weatherData: null,
      selectedValue: "",
      cardsData: [],
      averagedDataWeek: [],
      cardSelected: null,
      periodLinks: ["Day", "Week"],
      ipInfo: {
        city: "",
        countryCode: "",
      },
    };
  },
  methods: {
    handleAddNewCity() {
      this.$refs.autocomplete.openSearch();
    },
    async handleCitySelect(value) {
      this.selectedValue = value;
      const cityName = this.selectedValue.name;
      const countryCode = this.selectedValue.sys.country;
      const currentCityWeather = await fetchByCityCountry(cityName, countryCode);
      this.cardsData.push(this.formattedCard(currentCityWeather));
      this.cardSelected = this.cardsData[0];
      this.updateStorageDefaultList();
    },
    async handleChartUpdate(city) {
      this.cardSelected = city;
    },
    async handleAddCity(result) {
      if (this.cardsData.some((item) => item.city.id === result.id)) {
        await this.$refs.reachedMaxLimit.show({
          message: "The weather card already exists.",
          okButton: "Ok",
        });
      } else if (this.cardsData.length >= 5) {
        await this.$refs.reachedMaxLimit.show({
          message: "Maximum number of the cards is 5. Remove any of them to add another one.",
          okButton: "Ok",
        });
      } else {
        this.handleCitySelect(result);
      }
    },
    async handleRemoveCity(city) {
      const confirm = await this.$refs.confirmDialogue.show({
        message: "Are you sure you want to remove this weather card?",
        okButton: "Remove",
      });
      if (confirm) {
        this.cardsData = this.cardsData.filter((card) => card.city.id !== city.city.id);
        if (!this.cardsData.length) {
          await this.getIpInfo();
        }
        this.cardSelected = this.cardsData[0];
        this.updateStorageDefaultList();
      } else {
        return;
      }
    },

    calculateAverageTemperature(list) {
      const result = [];
      const dates = {};

      for (const item of list) {
        const date = item.dt_txt.split(" ")[0];

        const newDate = new Date(date);
        const options = { weekday: "long" };

        if (!dates[date]) {
          dates[date] = {
            date: date,
            temperatures: [item.main.temp],
            icon: item.weather[0].icon,
            weekDay: newDate.toLocaleDateString("en-US", options).substr(0, 3).toUpperCase(),
            humidity: item.main.humidity,
            wind: item.wind.speed.toFixed(0),
          };
        } else {
          dates[date].temperatures.push(item.main.temp);
        }
      }

      for (const date in dates) {
        const temperatures = dates[date].temperatures;
        const averageTemperature = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
        dates[date].averageTemperature = averageTemperature.toFixed(0);
        result.push(dates[date]);
      }

      return result;
    },
    updateStorageDefaultList() {
      localStorage.setItem("defaultList", JSON.stringify(this.cardsData));
    },
    async getIpInfo() {
      const data = await fetchGeolocationData();
      this.ipInfo.city = data.city;
      this.ipInfo.countryCode = data.country_code2;
      const cityWeatherByIp = await fetchByCityCountry(this.ipInfo.city, this.ipInfo.countryCode);
      this.cardsData.push(this.formattedCard(cityWeatherByIp));
      this.updateStorageDefaultList();

      this.cardSelected = this.cardsData[0];
    },
    formattedCard(card) {
      return { ...card, list: this.calculateAverageTemperature(card.list) };
    },
  },

  created() {
    const storedDefaultList = localStorage.getItem("defaultList");
    let defaultList;
    if (storedDefaultList) {
      defaultList = JSON.parse(storedDefaultList);
      if (defaultList.length) {
        this.cardsData = defaultList;

        this.cardSelected = this.cardsData[0];
      } else {
        this.getIpInfo();
      }
    } else {
      this.getIpInfo();
    }
  },
};
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
