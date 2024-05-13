<template>
  <div :class="[`app-${$store.state.theme}`]">
    <SetupModal />
    <nuxt />
  </div>
</template>

<script>
import SetupModal from "@/components/setupModal";
import _ from "lodash";
import {
  isBinanceNetwork,
  SUPPORTED_WALLETS,
  getMetamaskNetwork,
  SUPPORTED_NETWORKS,
} from "@/assets/linearLibrary/linearTools/network";
import { selectedWallet } from "@/assets/linearLibrary/linearTools/lnrJSConnector";
export default {
  components: {
    SetupModal,
  },
  methods: {
    openNetWorkModal() {
      if (this.walletAddress === "") {
        return;
      }
      this.displayNetWorkModal = true;
    },
    closeModel() {
      this.displayNetWorkModal = false;
    },
    async checkNetwork() {
      let network = await getMetamaskNetwork();
      const { name, networkId } = network;
      return SUPPORTED_NETWORKS[networkId] != undefined;
    },
    async connectWallet() {
      try {
        if (!this.isSupportNetwork) return;

        let status = await selectedWallet(SUPPORTED_WALLETS.METAMASK);
      } catch (e) {
        console.log(e, "connectWallet");
      }
    },
    async disconnectWallet() {
      this.displayNetWorkModal = false;
      this.$store.commit("setWalletAddress", "");
      this.$store.commit("setAutoConnect", false);
      location.reload();
    },
    closeTooltipModle() {
      this.$store.commit("setIsShowTooltipModle", false);
    },
    showTooltipModle() {
      this.$store.commit("setIsShowTooltipModle", true);
    },
    //改变选中菜单
    changeAction(action) {
      this.closeTooltipModle();
      action != this.currentAction &&
        this.$store.commit("setCurrentAction", action);

      //不刷新改变路由
      this.$router.push(action);
    },
    getWindowScreen: _.throttle(function () {
      this.windowScreen = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      this.isMobile = this.windowScreen.width <= this.mobileWidth;
      this.$store.commit("setIsMobile", this.isMobile);
    }, 50),
  },
  async mounted() {
    try {
      console.log(this.$store.state?.walletConnect);
      console.log(this.$store.state?.autoConnect);
      if (
        !this.$store.state?.walletConnectStatus &&
        this.$store.state?.autoConnect
      ) {
        console.log("running");
        if (this.$store.state?.walletType == SUPPORTED_WALLETS.METAMASK) {
          const status = await this.checkNetwork();
          if (status) {
            selectedWallet(SUPPORTED_WALLETS.METAMASK);
          } else {
            try {
              await addEthereumChain(56);
            } catch (error) {
              this.$store.commit("setSetupModal", true);
            }
          }
          return;
        } else if (
          this.$store.state?.walletType == SUPPORTED_WALLETS.WALLET_CONNECT
        ) {
          selectedWallet(SUPPORTED_WALLETS.WALLET_CONNECT);
          return;
        }
        this.$store.commit("setIsWalletOpen", true);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style></style>
