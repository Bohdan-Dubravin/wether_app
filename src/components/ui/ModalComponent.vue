<template>
  <transition name="fade">
    <div class="popup-modal" v-if="isVisible">
      <div class="window">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "ModalComponent",
  setup() {
    const isVisible = ref(false);

    const open = () => {
      isVisible.value = true;
    };

    const close = () => {
      isVisible.value = false;
    };

    return {
      isVisible,
      open,
      close,
    };
  },
});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.popup-modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  z-index: 1;
}

.window {
  background: #fff;
  border-radius: 5px;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

[data-theme="dark"] {
  .window {
    background-color: #192a3b;
    border: 1px solid #666;
  }
}
</style>
