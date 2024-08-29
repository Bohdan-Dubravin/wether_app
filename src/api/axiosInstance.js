import axios from "axios";
import useHandleErrorStore from "../store/errorHandleStore";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const $axios = axios.create({
  baseURL: BASE_URL,
});

$axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const store = useHandleErrorStore();

    store.showAlert(error?.message);

    console.log(error);
  }
);

export default $axios;
