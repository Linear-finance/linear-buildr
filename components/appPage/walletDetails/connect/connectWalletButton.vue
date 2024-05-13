<template>
  <div id="connect-btn" @click="openWallet()">
    CONNECT WALLET
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
  watch: {},
  computed: {},
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
  width: 300px;
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
