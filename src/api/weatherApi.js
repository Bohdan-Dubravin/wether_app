import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const IP_API_KEY = import.meta.env.VITE_IP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function searchCities(query) {
  try {
    const response = await axios.get(`${BASE_URL}/find`, {
      params: {
        q: query,
        type: "like",
        sort: "population",
        cnt: 10,
        appid: API_KEY,
        units: "metric",
      },
    });

    return response.data.list;
  } catch (error) {
    console.log(`Failed to fetch cities ${error.message}`);
  }
}

export async function fetchCurrentWeather(cityName, countryCode) {
  try {
    const response = await axios.get(`${BASE_URL}/weather?q=${cityName},${countryCode}&units=metric&appid=${API_KEY}`);
    console.log("fetchCurrentWeather", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
}

export async function fetchByCityCountry(cityName, countryCode) {
  try {
    const response = await axios.get(`${BASE_URL}/forecast?q=${cityName},${countryCode}&units=metric&appid=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
}

export async function fetchGeolocationData() {
  try {
    const ipApiUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${IP_API_KEY}`;
    const response = await axios.get(ipApiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
  }
}
