import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchByCityCountry, fetchGeolocationData } from "../api/weatherApi";
import calculateAverageTemperature from "../utils/calculateAverageTemperature";
import useHandleErrorStore from "./errorHandleStore";

const useWeatherCardsStore = defineStore("weatherCards", () => {
  const favoriteCities = ref(JSON.parse(localStorage.getItem("favorites")) || []);
  const selectedCities = ref([]);
  const showAlertStore = useHandleErrorStore();

  const updateStorageFavoriteCities = () => {
    localStorage.setItem("favorites", JSON.stringify(favoriteCities.value));
  };

  const formattedCard = (card) => {
    return { ...card, list: calculateAverageTemperature(card.list) };
  };

  const addNewCity = async (result) => {
    if (selectedCities.value.some((item) => item.city.id === result.id)) {
      showAlertStore.showAlert("The weather card already exists.");
    } else if (selectedCities.value.length >= 5) {
      showAlertStore.showAlert("Maximum number of the cards is 5. Remove any of them to add another one.");
    } else {
      await handleCitySelect(result);
    }
    return { show: false };
  };

  const handleCitySelect = async (value) => {
    const cityName = value.name;
    const countryCode = value.sys.country;
    const currentCityWeather = await fetchByCityCountry(cityName, countryCode);
    selectedCities.value.push(formattedCard(currentCityWeather));
  };

  const removeCity = async (city) => {
    const filteredSelectedCities = selectedCities.value.filter((card) => card.city.id !== city.city.id);
    selectedCities.value.splice(0, selectedCities.value.length, ...filteredSelectedCities);
    if (!selectedCities.value.length) {
      await fetchGeolocationData();
    }
  };

  const toggleFavoriteCities = (card) => {
    if (favoriteCities.value.some((item) => item.city.id === card.city.id)) {
      const filteredFavoriteCities = favoriteCities.value.filter((item) => item.city.id !== card.city.id);
      favoriteCities.value.splice(0, favoriteCities.value.length, ...filteredFavoriteCities);
      updateStorageFavoriteCities();
    } else if (favoriteCities.value.length < 5) {
      favoriteCities.value.push(card);
      updateStorageFavoriteCities();
    }
  };

  return {
    favoriteCities,
    selectedCities,
    addNewCity,
    removeCity,
    toggleFavoriteCities,
  };
});

export default useWeatherCardsStore;
