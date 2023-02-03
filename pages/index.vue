<template>
  <div id="mainPage">
    <div class="container">
      <landingPage v-if="!walletAddress"></landingPage>
      <appPage v-else></appPage>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import landingPage from "@/components/landingPage";
import appPage from "@/components/appPage";
import common from "@/config/common";

export default {
  components: {
    landingPage,
    appPage,
  },
  name: "mainPage",
  validate({ params, query, store, redirect }) {
    /***
     * 设置子页
     */
    if (params.sub) {
      if (common.SUBPAGE_OPTIONS[params.sub]) {
        store.commit("setCurrentAction", common.SUBPAGE_OPTIONS[params.sub]);
      } else if (common.WALLET_DETAILS_OPTIONS[params.sub]) {
        store.commit("setCurrentAction", 0);

        switch (params.sub) {
          case "transaction":
            store.commit("setWalletDetailsActionURL", "transaction");
            break;
          case "track":
            store.commit("setWalletDetailsActionURL", "track");
            break;
        }
      } else {
        return false;
      }
    } else {
      store.commit("setCurrentAction", 0);
    }
    return true;
  },
  data() {
    return {
      windowScreen: {
        //窗口
        width: 0,
        height: 0,
      },
      mobileWidth: 600, //移动端布局
      isMobile: window.innerWidth <= 600,
    };
  },
  watch: {
    walletAddress() {},
    walletNetworkId() {},
    theme: {
      handler(newvalue, oldValue) {
        this.setDarkThemeInBody(newvalue, oldValue);
      },
      immediate: true,
    },
  },
  computed: {
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },
    theme() {
      return this.$store.state?.theme;
    },
  },
  methods: {
    //获取窗口数据
    getWindowScreen: _.throttle(function () {
      this.windowScreen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      this.isMobile = this.windowScreen.width <= this.mobileWidth;
      this.$store.commit("setIsMobile", this.isMobile);
    }, 50),
    setDarkThemeInBody(newValue, oldValue = undefined) {
      const theme = `${newValue}-theme`;
      const html = document.documentElement;
      const body = document.body;
      if (oldValue !== undefined) {
        const oldTheme = `${oldValue}-theme`;
        html.classList.remove(oldTheme);
        body.classList.remove(oldTheme);
      }
      html.classList.add(theme);
      body.classList.add(theme);
    },
  },
  async mounted() {
    this.$store.commit("setIsMobile", this.isMobile);

    //监视窗口变化
    window.addEventListener("resize", this.getWindowScreen, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.getWindowScreen, false);
  },
};
</script>

<style lang="scss" scoped>
#mainPage {
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  background: #fafafa;

  .app-dark & {
    background: $darkBackgroundDeepColor;
  }

  .container {
    margin: 0 auto;
    width: 1440px;
  }
}

@media only screen and (max-width: $max-phone-width) {
  #mainPage {
    overflow: visible;
    .container {
      width: 100vw;
    }
  }
}
</style>
