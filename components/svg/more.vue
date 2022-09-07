<template>
  <span id="expandMore" @mouseenter="hover = 1" @mouseleave="hover = 0">
    <transition-group name="img-fade">
      <img
        key="1"
        v-show="!hover && theme === 'light'"
        src="@/static/more.svg"
      />
      <img
        key="2"
        v-show="!hover && theme === 'dark'"
        src="@/static/more_dark.svg"
      />
      <img key="3" v-show="hover" src="@/static/more_hover.svg" />
    </transition-group>
  </span>
</template>

<script>
export default {
  name: "expandMore",
  data() {
    return { hover: 0 };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
};
</script>

<style lang="scss" scoped>
.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity $animete-time;
}

.img-fade-enter,
.img-fade-leave-to {
  opacity: 0;
}
#expandMore {
  width: 18px;
  height: 18px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  img {
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translateZ(0);
  }
}
</style>
