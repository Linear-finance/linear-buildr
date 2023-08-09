<template>
  <div id="appPage">
    <actions></actions>
    <walletDetails></walletDetails>
    <unlockSchedule v-show="isUnlockScheduleShow"></unlockSchedule>
    <Modal
      v-model="hasUnfreeze"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="false"
      scrollable
      fullscreen
      class-name="vertical-center-modal"
    >
      您有swap未完成,是否继续swap
      <div @click.stop="cancelSwap">取消</div>
      <div @click.stop="jumoToSwap">继续</div>
      <div @click.stop="ignoreSwap">忽略</div>
    </Modal>
  </div>
</template>

<script>
import walletDetails from "@/components/appPage/walletDetails";
import actions from "@/components/appPage/actions";
import unlockSchedule from "@/components/popup/unlockSchedule";

export default {
  name: "appPage",
  components: {
    walletDetails,
    actions,
    unlockSchedule,
  },
  data() {
    return {
      hasUnfreeze: false,
    };
  },
  watch: {
    isMobile() {},
    walletAddress() {},
    walletNetworkId() {},
  },
  computed: {
    isMobile() {
      return this.$store.state?.isMobile;
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },
    isUnlockScheduleShow() {
      return this.$store.state?.isUnlockScheduleShow;
    },
  },
  mounted() {
    if (this.isMobile) {
      const unfreezeDatas = { ...this.$store.state?.swapUnfreezeDatas };

      //有数据且,钱包地址一致,
      if (
        Object.keys(unfreezeDatas).length &&
        unfreezeDatas.sourceWalletAddress == this.walletAddress &&
        unfreezeDatas.targetNetworkId == this.walletNetworkId
      ) {
        this.hasUnfreeze = true;
      }
    }
  },
  methods: {
    jumoToSwap() {
      this.$store.commit("setCurrentAction", 5);
      this.$router.push("/swap");
      this.$store.commit("setSwapUnfreezeContinue", true);
      this.hasUnfreeze = false;
    },

    cancelSwap() {
      this.hasUnfreeze = false;
    },

    ignoreSwap() {
      this.$store.commit("setSwapUnfreezeDatas", {});
    },
  },
};
</script>

<style lang="scss">
#appPage {
  display: flex;
  padding: 0 120px 64px;
}

@media only screen and (max-width: $max-phone-width) {
  #appPage {
    display: flex;
    padding: 0 16px 16px 16px;
  }
}
</style>
