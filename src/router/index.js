import { createRouter, createWebHistory } from "vue-router";
import Page from "../pages/Page.vue";

const routes = [
  {
    path: "/",
    component: Page,
    name: "home",
    key: "home",
  },
  {
    path: "/favorites",
    component: Page,
    name: "favorites",
    key: "favorites",
    props: () => ({
      favoritesPage: true,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
