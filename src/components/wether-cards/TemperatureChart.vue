<template>
  <h2 class="chart__title">
    Weather forecast for {{ cardSelected?.city.name }},
    {{ cardSelected?.city.country }}
  </h2>
  <div class="chart">
    <canvas ref="weatherChart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, defineComponent } from "vue";
import Loader from "../ui/Loader.vue";
import { searchCities } from "../../api/weatherApi";

export default defineComponent({
  name: "SearchAutocomplete",
  components: { Loader },
  setup(_, { emit }) {
    const inputValue = ref("");
    const itemsList = ref([]);
    const isOpen = ref(false);
    const isLoading = ref(false);
    const searchTimeout = ref(null);
    const delayDuration = ref(1000);
    const inputRef = ref(null);

    const fetchCities = async (input) => {
      if (!input.trim()) return;

      try {
        const response = await searchCities(input);
        itemsList.value = response?.filter((item) => item.name.toLowerCase().indexOf(input.toLowerCase()) > -1);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const handleInput = () => {
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        fetchCities(inputValue.value);
        isOpen.value = true;
      }, delayDuration.value);
      isLoading.value = true;
      isOpen.value = true;
    };

    const addCity = (result) => {
      emit("addCity", result);
      isOpen.value = false;
      inputValue.value = "";
      itemsList.value = [];
    };

    const handleClickOutside = (event) => {
      if (!inputRef.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    const openSearch = () => {
      inputValue.value = "";
      inputRef.value.focus();
      inputRef.value.setSelectionRange(0, 0);
      isOpen.value = true;
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      inputValue,
      itemsList,
      isOpen,
      isLoading,
      delayDuration,
      inputRef,
      handleInput,
      addCity,
      openSearch,
    };
  },
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
