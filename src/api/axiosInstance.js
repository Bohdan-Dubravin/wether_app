import axios from "axios";
import { useYourStore } from "../stores/yourStore"; // Import your Pinia store

const api = axios.create({
  baseURL: "https://api.example.com",
  // Other Axios config options if needed
});

// Intercept responses to handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return the response if successful
    return response;
  },
  async (error) => {
    // Access your Pinia store
    const store = useYourStore();

    if (error.response && error.response.status === 401) {
      // Call a method from the store, for example, logging out
      await store.logout(); // Replace with your method
    }

    // Optionally, you can throw the error again to let the calling function handle it
    return Promise.reject(error);
  }
);

export default api;
