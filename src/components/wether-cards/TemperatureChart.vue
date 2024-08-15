<template>
  <h2 class="chart__title">
    Weather forecast for {{ cardSelected.city.name }},
    {{ cardSelected.city.country }}
  </h2>
  <div class="chart">
    <canvas ref="weatherChart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { fetchByCityCountry } from "../../api/weatherApi";

export default {
  name: "TemperatureChart",
  props: {
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
  },
  data() {
    return {
      chart: null,
      chartData: [],
    };
  },
  mounted() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.period === "Day") {
      this.fetchDayDataAndCreateChart();
    } else {
      this.createWeekChart();
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  watch: {
    cardSelected: {
      handler: "handleWatchedVariables",
      immediate: true,
    },
    period: {
      handler: "handleWatchedVariables",
      immediate: true,
    },
  },
  methods: {
    async fetchDayDataAndCreateChart() {
      if (this.cardSelected) {
        await this.fetchChartData(this.cardSelected);
        this.createDayChart();
      }
    },
    async createDayChart() {
      if (this.$refs.weatherChart) {
        const ctx = this.$refs.weatherChart.getContext("2d");
        const labels = this.filterDayData.map((entry) => entry.dt_txt);
        const temperatures = this.filterDayData.map((entry) => entry.main.temp);
        this.chart = new Chart(ctx, this.chartConfig(labels, temperatures));
      }
    },
    async createWeekChart() {
      const data = await this.weekData.filter((card) => card.city.id === this.cardSelected.city.id);
      const ctx = this.$refs.weatherChart?.getContext("2d");
      const labels = data[0].list.map((entry) => entry.date);
      const temperatures = data[0].list.map((entry) => entry.averageTemperature);
      this.chart = new Chart(ctx, this.chartConfig(labels, temperatures));
    },
    destroyChart() {
      if (this.chart != null) {
        this.chart.destroy();
      }
    },

    async fetchChartData(city) {
      if (city) {
        const cityName = city.city.name;
        const countryCode = city.city.country;
        const data = await fetchByCityCountry(cityName, countryCode);
        this.chartData = data.list;
      }
    },
    chartConfig(labels, temperatures) {
      return {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "degrees Celcius",
              data: temperatures,
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
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
      };
    },
    async handleWatchedVariables() {
      try {
        if (this.chart) {
          await this.chart.destroy();
          if (this.$refs.weatherChart) {
            this.period === "Day" ? this.fetchDayDataAndCreateChart() : this.createWeekChart();
          }
        }
      } catch (error) {
        console.log("An error occurred:", error);
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.chart) {
      this.chart.destroy;
      next();
    }
  },
  computed: {
    filterDayData() {
      const currentDate = new Date().toISOString().slice(0, 10);
      const filteredData = this.chartData.filter((entry) => entry.dt_txt.includes(currentDate));
      return filteredData;
    },
  },
};
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
