<template>
  <div class="autocomplete">
    <h1 class="autocomplete-label">Type city name to search</h1>
    <input type="text" class="autocomplete__input" v-model="inputValue" @input="handleInput" ref="inputRef" />

    <ul class="autocomplete-results" v-show="isOpen">
      <div v-if="isLoading">
        <Loader :visible="isLoading" />
      </div>
      <div><p v-if="!itemsList?.length && !isLoading">No results</p></div>
      <li v-for="(item, i) in itemsList" :key="i" class="autocomplete-result" @click="addCity(item)">
        {{ item.name }}, {{ item.sys.country }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, inject } from "vue";
import Loader from "../ui/Loader.vue";
import { searchCities } from "../../api/weatherApi";

export default {
  name: "SearchAutocomplete",
  components: { Loader },
  setup() {
    const addNewCity = inject("addNewCity");
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
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        fetchCities(inputValue.value);
        isOpen.value = true;
      }, delayDuration);
      isLoading.value = true;
    };

    const addCity = async (result) => {
      await addNewCity(result);
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
        isOpen.value = true;
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
.autocomplete {
  position: relative;
  max-width: 400px;
  width: fit-content;
  min-width: 500px;
  margin: 0 auto;

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
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
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
