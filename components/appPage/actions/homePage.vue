<template>
  <div id="homePage">
    <div class="alertStacking" v-if="multiCollateralValuesRatios">
      <div
        v-for="(item, index) in collateralAssets"
        :key="index"
        class="alertContainer"
      >
        <attentionBox :assetInfo="item" assetImg="any" />
      </div>
    </div>
    <div class="title">Welcome to Buildr</div>
    <div class="context">
      Supported on-chain assets are staked in our collateral pool to build ℓUSD.
      The collateral pool enables infinite liquidity and no slippage.
    </div>
    <div class="actionsBox">
      <div class="boxItem" :class="{ isMobile }" @click.stop="toggleModal">
        <div class="imgBox">
          <img v-if="theme === 'light'" src="@/static/LINA_logo.svg" />
          <img v-else src="@/static/dark-theme/LINA_logo.svg" />
        </div>
        <div class="boxContext">
          Buy LINA <br />
          on other platform
        </div>
        <div class="btn" :class="{ isMobile }" @click.stop="toggleModal">
          BUY LINA
          <Icon type="ios-arrow-round-forward" />
        </div>
      </div>
      <div
        class="boxItem"
        :class="{ isMobile }"
        @click="isMobile && btnClick(2)"
      >
        <div class="imgBox">
          <img v-if="theme === 'light'" src="@/static/currency/lUSD.svg" />
          <img v-else src="@/static/dark-theme/currency/lUSD.svg" />
        </div>
        <div class="boxContext">
          Stake LINA <br />
          Build ℓUSD
        </div>
        <div
          class="btn"
          :class="{ isMobile }"
          @click="!isMobile && btnClick(2)"
        >
          Build ℓUSD
        </div>
      </div>
    </div>

    <linkModal :visible="showPopup" @toggle="showPopup = $event"></linkModal>
  </div>
</template>

<script>
import { openBuyLINA } from "@/common/utils";
import linkModal from "@/components/linkModal.vue";
import _ from "lodash";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { lnr } from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";

import { LIQUIDATION_NETWORKS } from "@/assets/linearLibrary/linearTools/network";

import { BigNumber, utils } from "ethers";

import { getPriceRates } from "@/assets/linearLibrary/linearTools/request";
import attentionBox from "@/components/attentionBox.vue";
import { collateralAssets } from "~/assets/linearLibrary/linearTools/collateralAssets";
import {
  formatEtherToNumber,
  formatNumber,
  formatNumberFromBigNumber,
} from "@/assets/linearLibrary/linearTools/format";

import {
  bnAdd,
  bnSub,
  bnMul,
  bnDiv,
  bnAdd2N,
  bnSub2N,
  bnMul2N,
  bnDiv2N,
  MAX_DECIMAL_LENGTH,
  n2bn,
  bn2n,
} from "@/common/bnCalc";

export default {
  name: "homePage",
  data() {
    return {
      formatNumber,
      collateralAssets: collateralAssets,
      showPopup: false,
    };
  },
  components: {
    attentionBox,
    linkModal,
  },
  watch: {
    isMobile() {},
    walletAddress() {},
    multiCollateralValuesRatios() {},
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
    theme() {
      return this.$store.state.theme;
    },
    multiCollateralValuesRatios() {
      return this.$store.state?.multiCollateralValues.currentRatio;
    },
  },
  created() {
    //订阅钱包账户改变事件
    this.$pub.subscribe("onWalletAccountChange", (msg, params) => {
      this.walletStatusChange();
    });
    //订阅链改变事件
    this.$pub.subscribe("onWalletChainChange", (msg, params) => {
      this.walletStatusChange();
    });
  },
  methods: {
    toggleModal() {
      this.showPopup = true;
    },
    btnClick(type) {
      if (type == 1) {
        openBuyLINA();
      } else {
        this.$store.commit("setCurrentAction", 1);
        this.$router.push("/build");
      }
    },
  },
};
</script>

<style lang="scss">
#homePage {
  width: 786px;
  height: 840px !important;
  background: #fff;
  text-align: center;
  padding: 200px 193px 207px;
  position: relative;

  .alertStacking {
    position: absolute;
    top: 10px;
    z-index: 2;
    margin: 10px 0;
    left: 50%;
    .alertContainer {
      padding: 4px;
    }
  }

  .app-dark & {
    background: $darkBackgroundColor;
  }

  .title {
    font-family: Gilroy-bold;
    font-size: 32px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    color: #5a575c;

    .app-dark & {
      color: $darkFontColor;
    }
  }

  .context {
    font-family: Gilroy-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: #99999a;

    margin: 9px 0 48px;

    .app-dark & {
      color: $darkFontColor;
    }
  }

  .actionsBox {
    display: flex;
    justify-content: space-between;

    .boxItem {
      position: relative;
      width: 188px;
      height: 300px;
      transition: $animete-time linear;
      padding: 56px 0 0;
      border-radius: 8px;
      border: solid 1px #e5e5e5;
      display: flex;
      flex-direction: column;
      align-items: center;

      .app-dark & {
        border-color: $darkBorderColor;
      }

      .imgBox {
        width: 80px;
        height: 80px;
        margin-bottom: 16px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .boxContext {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        text-align: center;
        color: #5a575c;
        font-family: Gilroy-Regular;
        cursor: default;

        .app-dark & {
          color: $darkFontColorLight;
        }
      }

      &:hover {
        box-shadow: 0 2px 12px 0 #e5e5e5;

        .app-dark & {
          box-shadow: 0 2px 12px 0 $darkBorderColor;
        }
      }
    }

    .btn {
      width: 100%;
      height: 48px;
      position: absolute;
      bottom: 0px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      background: #1a38f8;
      text-transform: uppercase;
      cursor: pointer;
      transition: $animete-time linear;
      font-family: Gilroy-bold;
      font-size: 16px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: 2px;
      text-align: center;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;

      .ivu-icon {
        font-size: 27px;
        margin-left: 12px;
        font-weight: bold;
      }

      &:not(.isMobile) {
        &:hover {
          background-color: #7eb5ff;
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #homePage {
    width: 100%;
    height: 88vh !important;
    background: #fff;
    text-align: center;
    padding: 163px 0 0 0;
    overflow-y: auto;
    overflow-x: hidden;

    .alertStacking {
      left: 50%;
    }

    .title {
      font-family: Gilroy-Bold;
      font-size: 24px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      color: #5a575c;

      .app-dark & {
        color: $darkFontColor;
      }
    }

    .context {
      font-family: Gilroy;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      color: #99999a;

      margin: 9px 60px;

      .app-dark & {
        color: $darkFontColor;
      }
    }

    .actionsBox {
      display: flex;
      justify-content: space-between;
      position: absolute;
      left: 0;
      bottom: 6.39999999984vw;
      padding: 0 6.39999999984vw;
      width: 100%;

      .boxItem {
        position: relative;
        width: 132px;
        height: 148px;
        transition: $animete-time linear;
        padding: 40px 0;
        border-radius: 7px;
        border: solid 1px #deddde;
        display: flex;
        flex-direction: column;
        align-items: center;

        .imgBox {
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .boxContext {
          display: none;
        }

        &:hover {
          box-shadow: 0 2px 12px 0 #e5e5e5;

          .app-dark & {
            box-shadow: 0 2px 12px 0 $darkBackgroundDeepColor;
          }
        }
        .app-dark & {
          &.isMobile {
            background: transparent !important;
          }
        }
      }

      .btn {
        width: 100%;
        height: 16px;
        position: relative;
        background: #fff;
        text-transform: uppercase;
        cursor: pointer;
        transition: $animete-time linear;
        font-family: Gilroy-Bold;
        font-size: 12px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 16px;
        letter-spacing: 1.5px;
        text-align: center;
        color: #1a38f8;
        &:nth-child(1) {
          padding-left: 10px;
        }
        .ivu-icon {
          font-size: 27px;
          margin-left: 0px;
          font-weight: bold;
        }
        &.isMobile {
          .app-dark & {
            background: none !important;
            color: $darkButtonColor !important;
            .ivu-icon {
              color: $darkButtonColor !important;
            }
          }
        }
      }
    }
  }
}
</style>
