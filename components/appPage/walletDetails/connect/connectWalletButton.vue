<template>
  <div id="connect-btn" @click="openWallet()">
    {{ isMobile ? "CONNECT" : "CONNECT WALLET" }}
    <Wallet />
  </div>
</template>

<script>
import Wallet from "./wallet";
import {
  SUPPORTED_NETWORKS,
  getMetamaskNetwork,
} from "@/assets/linearLibrary/linearTools/network";

export default {
  name: "ConnectWalletButton",
  components: {
    Wallet,
  },
  data() {
    return {
      isWalletModalOpen: false,
    };
  },
  watch: {
    isMobile: {
      handler(mobile) {
        if (mobile === true) {
          this.variant = "mobile";
        } else {
          this.variant = "desktop";
        }
      },
      immediate: true,
    },
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
  },
  mounted() {},
  methods: {
    async checkNetwork() {
      let network = await getMetamaskNetwork();
      const { name, networkId } = network;
      return SUPPORTED_NETWORKS[networkId] != undefined;
    },
    closeWallet() {
      this.isWalletModalOpen = false;
    },
    openWallet() {
      this.$store.commit("setIsWalletOpen", true);
    },
  },
};
</script>

<style lang="scss" scoped>
#connect-btn {
  min-width: 100px;
  margin-right: 8px;
  margin-left: 8px;
  padding-left: 10px;
  padding-right: 10px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a38f8;
  font-size: 12px;
  font-family: $BodyTextFontFamily;
  text-align: center;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: #ffffff;
  cursor: pointer;
  letter-spacing: 2px;
}
</style>
