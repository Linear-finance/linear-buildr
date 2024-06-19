<template>
  <span @click="handleClick" class="text-button">{{ text }}</span>
</template>

<script>
export default {
  name: "TextButton",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.text-button {
  color: blue; /* Change to any color you prefer */
  cursor: pointer;
  text-decoration: underline; /* Makes it look more like a link */
}
.text-button:hover {
  color: darkblue; /* Change to any hover color you prefer */
}
</style>
