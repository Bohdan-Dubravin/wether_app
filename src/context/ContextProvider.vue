<template>
  <slot />
  <confirm-dialogue ref="reachedMaxLimit" :showOkButton="false" />
  <confirm-dialogue ref="confirmDialogue" showOkButton />
</template>

<script>
import { provide, reactive, defineComponent, ref, onMounted } from "vue";
import ConfirmDialogue from "../components/ui/ConfirmDialogue.vue";
import { fetchCurrentWeather, fetchByCityCountry, fetchGeolocationData } from "../api/weatherApi";
import calculateAverageTemperature from "../utils/calculateAverageTemperature";

export default defineComponent({
  name: "SharedContextProvider",
  components: {
    ConfirmDialogue,
  },
  setup(_, { slots }) {
    const favoritesCities = reactive(JSON.parse(localStorage.getItem("favorites")) || []);
    const selectedCities = reactive(JSON.parse(localStorage.getItem("defaultList")) || []);

    const updateStorageDefaultList = (currentCities) => {
      localStorage.setItem("defaultList", JSON.stringify(currentCities));
    };

    const addNewCity = async (result) => {
      if (selectedCities.some((item) => item.city.id === result.id)) {
        await refs.reachedMaxLimit.show({
          message: "The weather card already exists.",
          okButton: "Ok",
        });
      } else if (selectedCities.length >= 5) {
        await refs.reachedMaxLimit.show({
          message: "Maximum number of the cards is 5. Remove any of them to add another one.",
          okButton: "Ok",
        });
      } else {
        await handleCitySelect(result);
      }
    };

    const removeCity = async (city) => {
      const filteredSelectedCities = selectedCities.filter((card) => card.city.id !== city.city.id);
      selectedCities.splice(0, selectedCities.length, ...filteredSelectedCities);
      if (!selectedCities.length) {
        await getIpInfo();
        console.log(selectedCities);
      }
      updateStorageDefaultList(selectedCities);
    };

    const formattedCard = (card) => {
      return { ...card, list: calculateAverageTemperature(card.list) };
    };

    const handleCitySelect = async (value) => {
      const cityName = value.name;
      const countryCode = value.sys.country;
      const currentCityWeather = await fetchByCityCountry(cityName, countryCode);
      selectedCities.push(formattedCard(currentCityWeather));
      updateStorageDefaultList(selectedCities);
    };

    // const toggleTheme = () => {
    //   state.isDark = !state.isDark;
    //   const theme = state.isDark ? "dark" : "light";
    //   document.documentElement.setAttribute("data-theme", theme);
    //   localStorage.setItem("theme", theme);
    // };

    // const changeLanguage = (lang) => {
    //   state.selectedLanguage = lang;
    //   localStorage.setItem("language", lang);

    // };

    provide("selectedCities", selectedCities);
    // addNewCity;

    provide("addNewCity", addNewCity);
    provide("removeCity", removeCity);
    // provide("addCity", toggleTheme);
    // provide("achangeLnguage", changeLanguage);

    return () => (slots.default ? slots.default() : null);
  },
});
</script>
