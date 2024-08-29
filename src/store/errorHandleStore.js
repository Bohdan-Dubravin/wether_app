import { defineStore } from "pinia";
import { ref } from "vue";

const useHandleErrorStore = defineStore("errorHandle", () => {
  const isAlertVisible = ref(false);
  const alertText = ref([]);

  let alertTimeout = null;

  const showAlert = (text) => {
    alertText.value = text;
    isAlertVisible.value = true;

    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }

    alertTimeout = setTimeout(() => {
      isAlertVisible.value = false;
      alertText.value = "";
    }, 5000);
  };

  return {
    showAlert,
    alertText,
    isAlertVisible,
  };
});

export default useHandleErrorStore;
