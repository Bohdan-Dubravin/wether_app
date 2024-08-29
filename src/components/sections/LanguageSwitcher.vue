<template>
  <div class="custom-select">
    <div @click="toggleDropdown" class="selected-option">
      {{ getSelectedLanguage }}
      <span class="arrow">{{ isOpen ? "▲" : "▼" }}</span>
    </div>
    <ul v-if="isOpen" class="dropdown">
      <li
        v-for="(language, key) in languages"
        :key="key"
        @click="selectLanguage(key)"
        :class="{ selected: key === selectedLanguage }"
      >
        {{ language }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from "vue";

export default defineComponent({
  name: "LanguageSwitcher",
  data() {
    return {
      isOpen: false,
      selectedLanguage: this.$i18n.locale,
      languages: {
        en: "English",
        ua: "Українська",
      },
    };
  },
  computed: {
    getSelectedLanguage() {
      return this.languages[this.selectedLanguage];
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectLanguage(lang) {
      this.selectedLanguage = lang;
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang);
      this.isOpen = false;
    },
  },
});
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 150px;
  z-index: 11;
  font-family: Arial, sans-serif;
}

.selected-option {
  background-color: #f0f0f0;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover,
.dropdown li.selected {
  background-color: #e6e6e6;
}

.arrow {
  font-size: 12px;
}
</style>
