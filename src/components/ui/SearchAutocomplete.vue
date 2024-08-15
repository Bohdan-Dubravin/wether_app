<template>
  <div class="autocomplete">
    <h1 class="autocomplete-label">Start searching by city name</h1>
    <div class="chip-container">
      <div class="chip" v-for="chip of chips" :key="chip.id">
        <h3 class="chip-title">{{ `${chip.name}, ${chip.sys.country}` }}</h3>
        <p class="clear-icon" @click="deleteChip(chip.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </p>
      </div>
      <input
        type="text"
        v-model="inputValue"
        @input="handleInput"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="setResult"
      />
    </div>
    <ul class="autocomplete-results" v-show="isOpen">
      <img
        v-if="isLoading"
        class="preloader"
        src="/assets/images/preloader.gif"
      />
      <li
        v-else
        v-for="(item, i) in itemsList"
        :key="i"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
        @click="setResult(item)"
      >
        {{ item.name }}, {{ item.sys.country }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchAutocomplete",
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    set: {
      type: Boolean,
      default: true,
    },
    chips: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      inputValue: "",
      itemsList: [],
      isOpen: false,
      arrowCounter: -1,
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
  watch: {
    items: function (value, oldValue) {
      this.itemsList = value;
      this.isOpen = true;
      this.isLoading = false;
    },
  },
  methods: {
    filterResults() {
      this.itemsList = this.items.filter(
        (item) =>
          item.name.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1
      );
    },
    handleInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.$emit("input", this.inputValue);
        this.isOpen = true;
      }, this.delayDuration);
      this.isLoading = true;
      this.filterResults();
      this.isOpen = true;
    },
    setResult(result) {
      ((this.set && this.chips.indexOf(result.name) === -1) || !this.set) &&
        this.$emit("add-chip", result);
      // this.chips.push(result);
      this.inputValue = ``;
      this.$emit("input", this.inputValue);
      this.$emit("value-updated", result);
      this.isOpen = false;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.arrowCounter = -1;
        this.isOpen = false;
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.itemsList.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    saveChip() {
      this.inputValue = this.itemsList[this.arrowCounter];
      this.arrowCounter = -1;
      this.isOpen = false;
      this.$emit("add-chip");
    },
    deleteChip(index) {
      this.$emit("delete-chip", index);
    },
  },
};
</script>

<style scoped lang="scss">
.autocomplete {
  position: relative;
  max-width: 400px;
  width: 100%;

  &-label {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 400;
    color: gray;
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
  background-color: rgba(75, 192, 192, 0.3);
  color: black;
}

.chip-container {
  max-width: 400px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 3px;
  min-height: 34px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;

  .chip {
    margin: 4px;
    background: rgba(48, 124, 124, 0.2);
    padding: 0 5px;
    border: 1px solid rgba(48, 124, 124, 0.9);
    border-radius: 3px;
    display: flex;
    align-items: center;
    line-height: 17px;
    font-size: 17px;
    color: rgba(48, 124, 124, 0.9);
  }
  input {
    flex: 1 1 auto;
    height: 39px;
    border: none;
    outline: none;
    padding: 4px;
    line-height: 22px;
    font-size: 19px;
  }

  .clear-icon {
    margin-left: 5px;
    font-weight: 700;
    color: rgb(58, 58, 58);
    cursor: pointer;

    &:hover {
      color: rgba(48, 124, 124, 0.9);
    }
  }
}
</style>
<style>
.preloader {
  max-width: 80px;
  display: block;
  margin: 0 auto;
}
</style>
