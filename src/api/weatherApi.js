import $axios from "./axiosInstance";

const API_KEY = import.meta.env.VITE_API_KEY;
const IP_API_KEY = import.meta.env.VITE_IP_API_KEY;

export async function searchCities(query) {
  const response = await $axios.get(`/find`, {
    params: {
      q: query,
      type: "like",
      sort: "population",
      cnt: 10,
      appid: API_KEY,
      units: "metric",
    },
  });

  if (response) {
    return response.data.list;
  }
}

export async function fetchCurrentWeather(cityName, countryCode) {
  const response = await $axios.get(`/weather?q=${cityName},${countryCode}&units=metric&appid=${API_KEY}`);

  if (response) {
    return response.data;
  }
}

export async function fetchByCityCountry(cityName, countryCode) {
  const response = await $axios.get(`/forecast?q=${cityName},${countryCode}&units=metric&appid=${API_KEY}`);
  if (response) {
    return response.data;
  }
}

export async function fetchGeolocationData() {
  const ipApiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${IP_API_KEY}`;
  const response = await $axios.get(ipApiUrl);
  if (response) {
    return response.data;
  }
}
