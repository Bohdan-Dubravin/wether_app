<template>
  <div class="alert" v-if="visible">
    {{ text }}
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Error alert",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Text,
      default: "Something went wrong",
    },
  },
});
</script>

<style scoped>
.alert {
  position: fixed;
  top: 16px;
  z-index: 12;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;

  background-color: #d75050;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
}
</style>
