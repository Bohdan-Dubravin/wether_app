import { defineStore } from "pinia";
import { ref } from "vue";

const useHandleErrorStore = defineStore("errorHandle", () => {
  const showAlert = ref(false);
  const alertText = ref([]);

  const toggleShowAlert = (value, text) => {
    if (value) {
      alertText.value = text;
      showAlert.value = true;
    } else {
      showAlert.value = false;
      alertText.value = "";
    }
  };

  return {
    showAlert,
    alertText,
    toggleShowAlert,
  };
});

export default useHandleErrorStore;
