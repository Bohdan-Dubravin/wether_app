<template>
  <modal-component ref="popupRef">
    <h2 style="margin-top: 0">{{ title }}</h2>
    <p class="dialogue__message">{{ message }}</p>
    <div class="btns">
      <button class="button cancel-btn" @click="cancel">
        {{ cancelButton }}
      </button>
      <button v-if="showsubmitButtonText" class="button ok-btn" @click="confirm">
        {{ submitButtonText }}
      </button>
    </div>
  </modal-component>
</template>

<script>
import { ref } from "vue";
import ModalComponent from "./ModalComponent.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "ConfirmDialogue",
  components: { ModalComponent },
  props: {
    showsubmitButtonText: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { t } = useI18n({ useScope: "global" });
    const title = ref(undefined);
    const message = ref(undefined);
    const submitButtonText = ref(undefined);
    const cancelButton = ref(t("cancel"));
    let resolvePromise = null;
    let rejectPromise = null;
    const popupRef = ref(null);

    const show = (opts = {}) => {
      title.value = opts.title;
      message.value = opts.message;
      submitButtonText.value = opts.submitButtonText;
      if (opts.cancelButton) {
        cancelButton.value = opts.cancelButton;
      }
      popupRef.value.open();
      return new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });
    };

    const confirm = () => {
      popupRef.value.close();
      if (resolvePromise) resolvePromise(true);
    };

    const cancel = () => {
      popupRef.value.close();
      if (resolvePromise) resolvePromise(false);
    };

    return {
      title,
      message,
      submitButtonText,
      cancelButton,
      popupRef,
      show,
      confirm,
      cancel,
    };
  },
};
</script>

<style scoped lang="scss">
.dialogue {
  &__message {
    margin: 20px auto 50px;
    max-width: 80%;
    text-align: center;
    font-size: 20px;
    line-height: 27px;

    @include onMobile {
      max-width: 90%;
    }
  }
}
.btns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.button {
  padding: 10px 15px;
  font-size: 16px;
  text-transform: uppercase;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.ok-btn {
  color: red;
  background-color: rgba(255, 99, 132, 0.2);
  color: rgba(255, 99, 132, 1);
  border: 2px solid rgba(255, 99, 132, 1);
}

.cancel-btn {
  background-color: #d5ddea;
  color: #356690;
  border: 2px solid #0e76c5;
}
</style>
