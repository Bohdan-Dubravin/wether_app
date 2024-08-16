<template>
  <div class="autocomplete">
    <h1 class="autocomplete-label">Type city name to search</h1>
    <input type="text" class="autocomplete__input" v-model="inputValue" @input="handleInput" ref="input" />

    <ul class="autocomplete-results" v-show="isOpen">
      <div v-if="isLoading">
        <Loader :visible="isLoading" />
      </div>
      <div><p v-if="!itemsList?.length && !isLoading">No results</p></div>
      <li v-for="(item, i) in itemsList" :key="i" class="autocomplete-result" @click="addCity(item)">
        <!-- :class="{ 'is-active': i === arrowCounter }" -->
        {{ item.name }}, {{ item.sys.country }}
      </li>
    </ul>
  </div>
</template>

<script>
import Loader from "../ui/Loader.vue";
import { searchCities } from "../../api/weatherApi";
export default {
  name: "SearchAutocomplete",
  components: { Loader },
  data() {
    return {
      inputValue: "",
      itemsList: [],
      isOpen: false,
      isLoading: false,
      searchTimeout: null,
      delayDuration: 1000,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    async fetchCities(inputValue) {
      if (!inputValue.trim()) return;

      try {
        const response = await searchCities(inputValue);
        this.itemsList = response?.filter(
          (item) => item.name.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    },
    handleInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchCities(this.inputValue);
        this.isOpen = true;
      }, this.delayDuration);
      this.isLoading = true;
      this.isOpen = true;
    },
    addCity(result) {
      this.$emit("addCity", result);
      this.isOpen = false;
      this.inputValue = "";
      this.itemsList = [];
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },

    openSearch() {
      const input = this.$refs.input;
      this.inputValue = "";
      input.focus();
      input.setSelectionRange(0, 0);
      this.isOpen = true;
    },
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
