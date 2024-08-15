<template>
  <modal-component ref="popup">
    <h2 style="margin-top: 0">{{ title }}</h2>
    <p class="dialogue__message">{{ message }}</p>
    <div class="btns">
      <button class="button cancel-btn" @click="_cancel">
        {{ cancelButton }}
      </button>
      <button v-if="showOkButton" class="button ok-btn" @click="_confirm">
        {{ okButton }}
      </button>
    </div>
  </modal-component>
</template>

<script>
import ModalComponent from "./ModalComponent.vue";

export default {
  name: "ConfirmDialogue",

  components: { ModalComponent },
  props: {
    showOkButton: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    title: undefined,
    message: undefined,
    okButton: undefined,
    cancelButton: "Go Back",
    resolvePromise: undefined,
    rejectPromise: undefined,
  }),

  methods: {
    show(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.okButton = opts.okButton;
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton;
      }
      this.$refs.popup.open();
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },

    _confirm() {
      this.$refs.popup.close();
      this.resolvePromise(true);
    },

    _cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
    },
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
  background-color: #d5eae7;
  color: #35907f;
  border: 2px solid #0ec5a4;
}
</style>
