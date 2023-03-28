<template>
  <div id="homePage">
    <div
      class="attentionBox"
      :class="{
        attention: currentRatioStatus == 1,
        urgent: currentRatioStatus == 2,
        liquidated: currentRatioStatus == 3,
      }"
      v-if="currentRatioStatus != 0"
    >
      <div class="colorBlock"></div>
      <div class="container">
        <img
          class="icon"
          src="@/static/info_orange.svg"
          alt=""
          app-
          v-if="currentRatioStatus == 1"
        />
        <img
          class="icon"
          src="@/static/error.svg"
          alt=""
          v-if="currentRatioStatus == 2"
        />
        <img
          class="icon"
          src="@/static/close_blue.svg"
          alt=""
          v-if="currentRatioStatus == 3"
        />
        <div class="content">
          <div class="title">
            <template v-if="currentRatioStatus == 1"
              >Attention required</template
            >
            <template v-if="currentRatioStatus == 2"
              >Urgent: Action required</template
            >
            <template v-if="currentRatioStatus == 3"
              >Accout Liquidated</template
            >
          </div>
          <div class="context">
            <template v-if="currentRatioStatus == 1">
              Your P-ratio is below the target ratio. To prevent being
              liquidated, please either
              <span v-if="needBuyLINA"
                >buy and stake {{ formatNumber(needLINANum) }} LINA</span
              ><span v-else>stake {{ formatNumber(needLINANum) }} LINA</span> or
              <span v-if="needBuylUSD"
                >buy and burn {{ formatNumber(needlUSDNum) }} ℓUSD</span
              ><span v-else>burn {{ formatNumber(needlUSDNum) }} ℓUSD</span> to
              raise up to target ratio to be able to claim rewards.
            </template>
            <template v-if="currentRatioStatus == 2">
              Your P-ratio has reached the minimum maintainence level. Please
              <span v-if="needBuyLINA"
                >buy and stake {{ formatNumber(needLINANum) }} LINA</span
              ><span v-else>stake {{ formatNumber(needLINANum) }} LINA</span> or
              <span v-if="needBuylUSD"
                >buy and burn {{ formatNumber(needlUSDNum) }} ℓUSD</span
              ><span v-else>burn {{ formatNumber(needlUSDNum) }} ℓUSD</span> to
              raise up to target ratio.
            </template>
            <template v-if="currentRatioStatus == 3">
              Your P-raio has fallen below the minimum required level for more
              than 3 days, your LINA has been liquidated. Please view in the
              transaction history for more information.
            </template>
          </div>
          <div class="btnBox">
            <div
              class="btn"
              v-if="needBuyLINA && currentRatioStatus != 3"
              @click.stop="toggleModal"
            >
              Buy LINA →
            </div>
            <div
              class="btn"
              v-if="!needBuyLINA && currentRatioStatus != 3"
              @click="actionLink(2)"
            >
              Stake now →
            </div>
            <div
              class="btn"
              v-if="needBuylUSD && currentRatioStatus != 3"
              @click="actionLink(3)"
            >
              Buy ℓUSD →
            </div>
            <div
              class="btn"
              v-if="!needBuylUSD && currentRatioStatus != 3"
              @click="actionLink(4)"
            >
              Burn now →
            </div>
            <div
              class="btn"
              v-if="currentRatioStatus == 3"
              @click="actionLink(5)"
            >
              View Details →
            </div>
          </div>
        </div>
        <img
          class="close"
          src="@/static/icon-cancel.svg"
          alt=""
          @click="colseAttention"
        />
      </div>
    </div>
    <div class="title">Welcome to Buildr</div>
    <div class="context">
      Our native token LINA is staked in our collateral pool to build ℓUSD. The
      collateral pool enables infinite liquidity and no slippage.
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
  components: { linkModal },
  data() {
    return {
      formatNumber,
      currentRatioStatus: 0, //0正常 1低于500警告 2低于200清算窗口 3爆仓
      needBuyLINA: false,
      needLINANum: 0,
      needBuylUSD: false,
      needlUSDNum: 0,
      walletData: {
        avaliableLINA: 0,
        LINA2USD: 0,
        staked: 0,
        lock: 0,
        amountlUSD: 0,
        debt: 0,
        targetRatio: 400,
        currentRatio: 0,
      },
      showPopup: false,
    };
  },
  watch: {
    isMobile() {},
    walletAddress() {},
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
  mounted() {
    this.checkLiquidation();
  },
  methods: {
    toggleModal() {
      this.showPopup = true;
    },
    async checkLiquidation() {
      try {
        this.currentRatioStatus = 0;

        //如果是bsc main/bsc(私链)则检查liquidation buildr一定时链接了钱包才能进到homepage，所以无需检查是否有钱包连接
        if (LIQUIDATION_NETWORKS[this.walletNetworkId] !== undefined) {
          const {
            lnrJS: {
              LinearFinance,
              LnCollateralSystem,
              LnRewardLocker,
              LnDebtSystem,
              lUSD,
            },
            utils,
          } = lnrJSConnector;

          const LINABytes = utils.formatBytes32String("LINA");

          //取合约地址
          const LnCollateralSystemAddress = LnCollateralSystem.address;

          const results = await Promise.all([
            LinearFinance.balanceOf(this.walletAddress), //LINA余额
            LnCollateralSystem.userCollateralData(
              this.walletAddress,
              LINABytes
            ), //staked lina
            LnRewardLocker.balanceOf(this.walletAddress), //lock lina
            LnDebtSystem.GetUserDebtBalanceInUsd(this.walletAddress), //总债务
            LnCollateralSystem.GetUserTotalCollateralInUsd(this.walletAddress), //个人全部抵押物兑lUSD,用于计算pratio
            lUSD.balanceOf(this.walletAddress), //lUSD余额
          ]);

          let currentRatioPercent = BigNumber.from("0");

          if (results[4].gt("0") && results[3][0].gt("0")) {
            currentRatioPercent = formatEtherToNumber(
              bnMul(bnDiv(results[4], results[3][0]), n2bn("100"))
            );
          }

          const [
            avaliableLINA,
            stakedLina,
            lockLina,
            amountDebt,
            totalCollateralInUsd, //个人全部抵押物兑lUSD,用于计算pratio
            amountlUSD,
          ] = results.map(formatEtherToNumber);

          const priceRates = await getPriceRates(["LINA", "lUSD"]);

          this.walletData.LINA2USD = priceRates.LINA / priceRates.lUSD;

          this.walletData.avaliableLINA = avaliableLINA + stakedLina + lockLina;
          this.walletData.staked = stakedLina;
          this.walletData.lock = lockLina;
          this.walletData.debt = amountDebt[0];
          this.walletData.amountlUSD = amountlUSD;
          this.walletData.currentRatio = currentRatioPercent;

          let liquidationStatus = await lnr.userPositionMarked({
            account: this.walletAddress,
          });

          if (liquidationStatus.length > 0 && liquidationStatus[0].state) {
            //已标记
            this.targetRatioCal();
            this.currentRatioStatus = 2;
          } else if (
            this.walletData.currentRatio > 0 &&
            this.walletData.currentRatio < 400
          ) {
            //警告
            this.targetRatioCal();
            this.currentRatioStatus = 1;
          } else {
            //pratio为0，检查最近一天有无爆仓
            let liquidatedStatus = await lnr.positionLiquidated({
              account: this.walletAddress,
            });
            let currentTimstamp = Math.round(new Date() / 1000);

            if (liquidatedStatus.length > 0) {
              let liquidatedTime =
                currentTimstamp - liquidatedStatus[0].timestamp / 1000;

              if (liquidatedTime < 86400) {
                this.currentRatioStatus = 3;
              }
            }
          }
        }
      } catch (e) {
        console.log(e, "home page check liquidation err");
      }
    },
    colseAttention() {
      this.currentRatioStatus = 0;
    },
    targetRatioCal() {
      //计算达到target需要补stake多少lina
      let needStakeWhenTargetRatio =
        (4 * this.walletData.debt) / this.walletData.LINA2USD -
        this.walletData.lock;

      this.needLINANum = needStakeWhenTargetRatio - this.walletData.staked;
      if (this.needLINANum < 0) this.needLINANum = 0;
      if (this.needLINANum > this.walletData.avaliableLINA)
        this.needBuyLINA = true; //可用lina数量不足

      //计算达到target需要burn多少lusd
      let canBuildlUSDWhenTargetRatio =
        ((this.walletData.staked + this.walletData.lock) *
          this.walletData.LINA2USD) /
        4;

      this.needlUSDNum = this.walletData.debt - canBuildlUSDWhenTargetRatio;
      if (this.needlUSDNum < 0) this.needlUSDNum = 0;
      if (this.needlUSDNum > this.walletData.amountlUSD)
        this.needBuylUSD = true; //可用lusd数量不足
    },
    btnClick(type) {
      if (type == 1) {
        openBuyLINA();
      } else {
        this.$store.commit("setCurrentAction", 1);
        this.$router.push("/build");
      }
    },
    actionLink(value) {
      switch (value) {
        case 1:
          window.open(
            "https://pancakeswap.finance/swap?outputCurrency=0x762539b45a1dcce3d36d080f74d1aed37844b878"
          );
          break;
        case 2:
          this.$store.commit("setCurrentAction", 1);
          this.$router.push("/build");
          break;
        case 3:
          window.open(
            "https://pancakeswap.finance/swap?outputCurrency=0x23e8a70534308a4aaf76fb8c32ec13d17a3bd89e"
          );
          break;
        case 4:
          this.$store.commit("setCurrentAction", 2);
          this.$router.push("/burn");
          break;
        case 5:
          this.$pub.publish("transactionModalChange", true);
          break;
      }
    },
    walletStatusChange() {
      this.checkLiquidation();
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

  .app-dark & {
    background: $darkBackgroundColor;
  }

  .attentionBox {
    width: 600px;
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-300px);
    display: flex;
    border-radius: 16px;
    box-shadow: 0 2px 6px 0 #deddde;

    .colorBlock {
      width: 20px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .container {
      width: 100%;
      display: flex;
      padding: 16px;

      .icon {
        width: 24px;
        height: 24px;
      }

      .content {
        margin-left: 8px;
        width: 499px;

        .title {
          font-family: Gilroy-Bold;
          font-size: 14px;
          line-height: 24px;
          color: #5a575c;
          text-align: left;
          margin-bottom: 4px;

          .app-dark & {
            color: $darkFontColor;
          }
        }

        .context {
          font-family: Gilroy;
          font-size: 12px;
          color: #99999a;
          text-align: left;
          margin: 0 0 4px;

          .app-dark & {
            color: $darkFontColor;
          }

          span {
            font-family: Gilroy-Bold;
          }
        }

        .btnBox {
          display: flex;
          font-family: Gilroy-Bold;
          font-size: 10px;
          letter-spacing: 1.25px;

          .btn {
            margin-right: 24px;
            cursor: pointer;
          }
        }
      }

      .close {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }

    &.attention {
      .colorBlock {
        background-color: #f08b0b;
      }

      .btnBox {
        color: #f08b0b;
      }
    }
    &.urgent {
      .colorBlock {
        background-color: #df434c;
      }

      .btnBox {
        color: #df434c;
      }
    }
    &.liquidated {
      .colorBlock {
        background-color: #1a38f8;
      }

      .btnBox {
        color: #1a38f8;
      }
    }
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
