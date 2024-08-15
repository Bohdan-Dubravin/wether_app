import { createApp } from "vue";
import "./scss/reset.scss";
import "./scss/main.scss";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
