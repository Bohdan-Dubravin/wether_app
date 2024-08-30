<template>
  <div v-if="cardSelected">
    <h2 class="chart__title">
      {{ $t("Weather forecast for") }} {{ cardSelected?.city.name }},
      {{ cardSelected?.city.country }}
    </h2>
    <div class="chart">
      <canvas ref="weatherChart" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from "vue";
import Chart from "chart.js/auto";
import { fetchByCityCountry } from "../../../api/weatherApi";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  cardSelected: {
    type: Object,
    default: null,
  },
  weekData: {
    type: Array,
    default: () => [],
  },
  period: {
    type: String,
    default: "Day",
  },
});

const chart = ref(null);
const chartData = ref([]);
const weatherChart = ref(null);

const fetchDayDataAndCreateChart = async () => {
  if (props.cardSelected) {
    await fetchChartData(props.cardSelected);
    await nextTick();
    createDayChart();
  }
};

const createDayChart = () => {
  if (weatherChart.value) {
    const ctx = weatherChart.value.getContext("2d");
    if (ctx) {
      const labels = filterDayData.value.map((entry) => entry.dt_txt);
      const temperatures = filterDayData.value.map((entry) => entry.main.temp);
      chart.value = new Chart(ctx, chartConfig(labels, temperatures));
    }
  }
};

const createWeekChart = async () => {
  const data = props.weekData.filter((card) => card.city.id === props.cardSelected.city.id);

  if (weatherChart.value) {
    const ctx = weatherChart.value.getContext("2d");
    if (ctx) {
      const labels = data[0].list.map((entry) => entry.date);
      const temperatures = data[0].list.map((entry) => entry.averageTemperature);
      chart.value = new Chart(ctx, chartConfig(labels, temperatures));
    }
  }
};

const fetchChartData = async (city) => {
  if (city) {
    const cityName = city.city.name;
    const countryCode = city.city.country;
    const data = await fetchByCityCountry(cityName, countryCode);
    chartData.value = data.list;
  }
};

const chartConfig = (labels, temperatures) => ({
  type: "bar",
  data: {
    labels,
    datasets: [
      {
        label: "degrees Celcius",
        data: temperatures,
        backgroundColor: ["rgba(48, 81, 124, 0.7)"],
        borderColor: ["rgba(48, 81, 124, 0.9)"],
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    maxHeight: 700,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const handleWatchedVariables = async () => {
  try {
    if (chart.value) {
      chart.value.destroy();
      if (weatherChart.value) {
        props.period === "Day" ? fetchDayDataAndCreateChart() : createWeekChart();
      }
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};

const filterDayData = computed(() => {
  const currentDate = new Date().toISOString().slice(0, 10);
  return chartData.value.filter((entry) => entry.dt_txt.includes(currentDate));
});

onMounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
  props.period === "Day" ? fetchDayDataAndCreateChart() : createWeekChart();
});

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});

watch(() => [props.cardSelected, props.period], handleWatchedVariables, { immediate: true });

const router = useRouter();

router.beforeEach((to, from, next) => {
  if (chart.value) {
    chart.value.destroy();
  }
  next();
});
</script>
<style scoped lang="scss">
.chart {
  max-width: 700px;
  &__title {
    font-weight: 300;
    font-size: 24px;
    margin: 60px 0 20px;
  }
}
</style>
