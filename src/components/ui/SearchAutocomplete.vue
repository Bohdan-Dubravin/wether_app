<template>
  <div class="autocomplete">
    <h1 class="autocomplete-label">{{ $t("typeToSearch") }}</h1>
    <input type="text" class="autocomplete__input" v-model="inputValue" @input="handleInput" ref="inputRef" />

    <ul
      :class="{ 'loading-autocomplete': isLoading || !itemsList?.length }"
      class="autocomplete-results"
      v-show="isOpen"
    >
      <div v-if="isLoading">
        <Loader :visible="isLoading" />
      </div>
      <p v-else-if="!itemsList?.length && !isLoading">No results</p>
      <li v-else v-for="(item, i) in itemsList" :key="i" class="autocomplete-result" @click="addCity(item)">
        {{ item.name }} / {{ item.sys.country }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import Loader from "../ui/Loader.vue";
import { searchCities } from "../../api/weatherApi";
import useWeatherCardsStore from "../../store/weatherCardsStore";

export default {
  name: "SearchAutocomplete",
  components: { Loader },
  setup() {
    const weatherStore = useWeatherCardsStore();
    const inputValue = ref("");
    const itemsList = ref([]);
    const isOpen = ref(false);
    const isLoading = ref(false);
    const searchTimeout = ref(null);
    const delayDuration = 1000;
    const inputRef = ref(null);

    const fetchCities = async (value) => {
      if (!value.trim()) return;

      try {
        const response = await searchCities(value);
        itemsList.value = response?.filter((item) => item.name.toLowerCase().includes(inputValue.value.toLowerCase()));
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleInput = () => {
      isOpen.value = true;
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        fetchCities(inputValue.value);
        isOpen.value = true;
      }, delayDuration);
      isLoading.value = true;
    };

    const addCity = async (result) => {
      console.log(itemsList.value);
      await weatherStore.addNewCity(result);
      isOpen.value = false;
      inputValue.value = "";
      itemsList.value = [];
    };

    const handleClickOutside = (event) => {
      if (inputRef.value && !inputRef.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    const openSearch = () => {
      if (inputRef.value) {
        inputValue.value = "";
        inputRef.value.focus();
        inputRef.value.setSelectionRange(0, 0);
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      inputValue,
      itemsList,
      isOpen,
      isLoading,
      handleInput,
      addCity,
      openSearch,
      inputRef,
    };
  },
};
</script>

<style scoped lang="scss">
.loading-autocomplete {
  display: flex;
  align-items: center;
  justify-content: center;
}
.autocomplete {
  position: relative;
  max-width: 500px;
  width: fit-content;
  width: 100%;
  margin: 16px auto;
  z-index: 10;

  &-label {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 400;
    color: gray;
  }
  &__input {
    min-width: 500px;
    outline: transparent;
    border: 1px solid #517dcf;
    padding: 10px 5px;
    border-radius: 6px;
    font-size: 18px;
  }
}

.autocomplete-results {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  padding: 10px 0;
  top: 70px;
  margin: 0;
  border: 1px solid #bbbbbb;
  border-radius: 6px;
  background-color: #fff;
  max-height: 180px;
  height: fit-content;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 5px 5px 5px 7px;
  font-size: 17px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: rgba(75, 112, 192, 0.3);
  color: black;
}
</style>
