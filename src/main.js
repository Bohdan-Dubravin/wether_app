import { createApp } from "vue";
import "./scss/reset.scss";
import "./scss/main.scss";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import ua from "./locales/ua.json";

const savedLanguage = localStorage.getItem("language") || "en";
const i18n = createI18n({
  locale: savedLanguage,
  fallbackLocale: "en",
  messages: {
    en,
    ua,
  },
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount("#app");
