import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FavoritesView from "../views/FavoritesView.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
    name: "home",
    props: (route) => ({
      period: route.params.period,
      togglePeriod: route.params.togglePeriod,
    }),
  },
  {
    path: "/favorites",
    component: FavoritesView,
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
