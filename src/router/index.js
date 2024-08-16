import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import FavoritesPage from "../pages/FavoritesPage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
    name: "home",
    props: (route) => ({
      period: route.params.period,
      togglePeriod: route.params.togglePeriod,
    }),
  },
  {
    path: "/favorites",
    component: FavoritesPage,
    name: "favorites",
    props: (route) => ({
      period: route.params.period,
      togglePeriod: route.params.togglePeriod,
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
