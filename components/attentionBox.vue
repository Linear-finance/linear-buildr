<template>
  <div id="attentionBoxId">
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
          v-if="currentRatioStatus != 0 && !isMobile"
          class="icon"
          :src="
            currentRatioStatus == 1
              ? require('@/static/info_orange.svg')
              : currentRatioStatus == 2
              ? require('@/static/error.svg')
              : require('@/static/close_blue.svg')
          "
          alt="icon"
        />
        <div class="content">
          <img
            v-if="currentRatioStatus != 0 && isMobile"
            class="icon"
            :src="
              currentRatioStatus == 1
                ? require('@/static/info_orange.svg')
                : currentRatioStatus == 2
                ? require('@/static/error.svg')
                : require('@/static/close_blue.svg')
            "
            alt="icon"
          />
          <div class="title">
            <template v-if="currentRatioStatus == 1">
              <div class="attentionTitle">Attention required</div>
              <img
                :src="
                  theme == 'light'
                    ? require(`@/static/${assetInfo.img}`)
                    : require(`@/static/${assetInfo.darkimg}`)
                "
                alt="currency"
                class="titleIcon"
              />
              <div class="assetTitle">
                {{ assetInfo.key }}
              </div>
            </template>
            <template v-if="currentRatioStatus == 2">
              <div class="attentionTitle">Urgent: Action required</div>
              <img
                :src="
                  theme == 'light'
                    ? require(`@/static/${assetInfo.img}`)
                    : require(`@/static/${assetInfo.darkimg}`)
                "
                alt="currency"
                class="titleIcon"
              />
              <div class="assetTitle">
                {{ assetInfo.key }}
              </div>
            </template>
            <template v-if="currentRatioStatus == 3">
              <div class="attentionTitle">Account Liquidated</div>
              <img
                :src="
                  theme == 'light'
                    ? require(`@/static/${assetInfo.img}`)
                    : require(`@/static/${assetInfo.darkimg}`)
                "
                alt="currency"
                class="titleIcon"
              />
              <div class="assetTitle">
                {{ assetInfo.key }}
              </div>
            </template>
          </div>
          <div class="context">
            <template v-if="currentRatioStatus == 1">
              Your P-ratio is below the target ratio. To prevent being
              liquidated, please either
              <span v-if="needBuyLINA"
                >buy and stake
                {{
                  formatNumber(needLINANum) + " " + assetInfo.name.toUpperCase()
                }} </span
              ><span v-else
                >stake
                {{
                  formatNumber(needLINANum) + " " + assetInfo.name.toUpperCase()
                }}</span
              >
              or
              <span v-if="needBuylUSD"
                >buy and burn {{ formatNumber(needlUSDNum) }} ℓUSD</span
              ><span v-else>burn {{ formatNumber(needlUSDNum) }} ℓUSD</span>
              to raise up to target ratio to be able to claim rewards.
            </template>
            <template v-if="currentRatioStatus == 2">
              Your P-ratio has reached the minimum maintainence level. Please
              <span v-if="needBuyLINA"
                >buy and stake
                {{
                  formatNumber(needLINANum) + " " + assetInfo.name.toUpperCase()
                }}</span
              ><span v-else
                >stake
                {{
                  formatNumber(needLINANum) + " " + assetInfo.name.toUpperCase()
                }}
              </span>
              or
              <span v-if="needBuylUSD"
                >buy and burn {{ formatNumber(needlUSDNum) }} ℓUSD</span
              ><span v-else>burn {{ formatNumber(needlUSDNum) }} ℓUSD</span>
              to raise up to target ratio.
            </template>
            <template v-if="currentRatioStatus == 3">
              Your P-raio has fallen below the minimum required level for more
              than 3 days, your Assets has been liquidated. Please view in the
              transaction history for more information.
            </template>
          </div>
          <div class="btnBox">
            <div
              class="btn"
              v-if="needBuyLINA && currentRatioStatus != 3"
              @click="actionLink(1)"
            >
              Buy {{ assetInfo.key }} →
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
          @click="colseAttention()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { lnr } from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";
import { LIQUIDATION_NETWORKS } from "@/assets/linearLibrary/linearTools/network";
import { BigNumber } from "ethers";
import { getPriceRates } from "@/assets/linearLibrary/linearTools/request";
import {
  formatEtherToNumber,
  formatNumber,
  getAssetObjectInfo,
} from "@/assets/linearLibrary/linearTools/format";
import { bnMul, bnDiv, n2bnForAsset } from "@/common/bnCalc";
import { LINA } from "~/assets/linearLibrary/linearTools/constants/currency";

export default {
  name: "homePage",
  props: {
    assetInfo: {
      key: {
        type: String,
        default: "",
      },
      contractKey: {
        type: String,
        default: "",
      },
      img: {
        type: String,
        default: "",
      },
      buyLink: {
        type: String,
        default: "",
      },
      currentRatioStatus: {
        type: Number,
        default: 0,
      },
    },
    assetImg: {
      type: String,
      default: "",
    },
  },
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
        targetRatio: 500,
        currentRatio: 0,
        LINA: LINA,
      },
    };
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
    theme() {
      return this.$store.state.theme;
    },
  },
  mounted() {
    this.checkLiquidation();
  },
  methods: {
    async checkLiquidation() {
      try {
        this.currentRatioStatus = 0;
        if (LIQUIDATION_NETWORKS[this.walletNetworkId] !== undefined) {
          const {
            lnrJS: { LnRewardLocker, lUSD },
            multiCollateral,
            utils,
          } = lnrJSConnector;
          const LINABytes = utils.formatBytes32String(
            this.assetInfo.contractKey
          );

          const LinearFinance =
            multiCollateral[this.assetInfo.key].LinearFinance;
          const LnCollateralSystemAddress =
            multiCollateral[this.assetInfo.key].LnCollateralSystem.address;
          const LnCollateralSystem =
            multiCollateral[this.assetInfo.key].LnCollateralSystem;
          const LnDebtSystem = multiCollateral[this.assetInfo.key].LnDebtSystem;
          const results = await Promise.all([
            LinearFinance.balanceOf(this.walletAddress), //ATH余额
            LnCollateralSystem.userCollateralData(
              this.walletAddress,
              LINABytes
            ), //staked LINA
            LnRewardLocker.balanceOf(this.walletAddress), //lock LINA
            LnDebtSystem.GetUserDebtBalanceInUsd(this.walletAddress), //总债务
            LnCollateralSystem.GetUserTotalCollateralInUsd(this.walletAddress), //个人全部抵押物兑lUSD,用于计算pratio
            lUSD.balanceOf(this.walletAddress), //lUSD余额
          ]);

          const amountDebt = formatEtherToNumber(
            await LnDebtSystem.GetUserDebtBalanceInUsd(this.walletAddress)
          );
          const totalCollateralInUsd = formatEtherToNumber(
            await LnCollateralSystem.GetUserTotalCollateralInUsd(
              this.walletAddress
            )
          );

          let currentRatioPercent = BigNumber.from("0");

          if (results[4].gt("0") && results[3][0].gt("0")) {
            currentRatioPercent = formatEtherToNumber(
              bnMul(
                bnDiv(results[4], results[3][0]),
                n2bnForAsset("100", this.assetInfo.key)
              ),
              getAssetObjectInfo(this.assetInfo.key).decimal
            );
          }

          const [
            avaliableLINA,
            stakedLina,
            lockLina,
            amountDebtUnformatted,
            totalCollateralInUsdUnformatted,
            amountlUSD,
          ] = results.map((item) =>
            formatEtherToNumber(
              item,
              getAssetObjectInfo(this.assetInfo.key).decimal
            )
          );
          const priceRates = await getPriceRates([
            this.assetInfo.contractKey,
            "lUSD",
          ]);

          this.walletData.LINA2USD =
            priceRates[this.assetInfo.contractKey] / priceRates.lUSD;
          this.walletData.avaliableLINA = avaliableLINA + stakedLina + lockLina;
          this.walletData.staked = stakedLina;
          if (this.assetInfo.key == LINA) {
            this.walletData.lock = lockLina;
          } else {
            this.walletData.lock = 0;
          }

          this.walletData.debt = amountDebt[0];
          this.walletData.amountlUSD = amountlUSD;
          this.walletData.currentRatio = currentRatioPercent;

          let liquidationStatus = await lnr.userPositionMarked({
            account: this.walletAddress,
          });

          const matchingLiquidationStatus = liquidationStatus.filter(
            (el) => el.collateralCurrency === this.assetInfo.contractKey
          );
          if (
            matchingLiquidationStatus &&
            matchingLiquidationStatus.length > 0 &&
            matchingLiquidationStatus[0].state &&
            matchingLiquidationStatus[0].collateralCurrency ==
              this.assetInfo.contractKey
          ) {
            //已标记
            this.targetRatioCal();
            this.currentRatioStatus = 2;
          } else if (
            this.multiCollateralValuesRatios &&
            this.multiCollateralValuesRatios[this.assetInfo.key] > 0 &&
            this.multiCollateralValuesRatios[this.assetInfo.key] <
              getAssetObjectInfo(this.assetInfo.key).targetRatio * 100
          ) {
            this.targetRatioCal();
            this.currentRatioStatus = 1;
          } else {
            //pratio为0，检查最近一天有无爆仓
            let liquidatedStatus = await lnr.positionLiquidated({
              account: this.walletAddress,
            });

            const matchingLiquidationStatus = liquidatedStatus.filter(
              (el) => el.collateralCurrency === this.assetInfo.contractKey
            );

            let currentTimstamp = Math.round(new Date() / 1000);

            if (
              matchingLiquidationStatus &&
              matchingLiquidationStatus.length > 0 &&
              matchingLiquidationStatus[0].collateralCurrency ==
                this.assetInfo.contractKey
            ) {
              let liquidatedTime =
                currentTimstamp - matchingLiquidationStatus[0].timestamp / 1000;

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
      //计算达到target需要补stake多少ath
      let needStakeWhenTargetRatio =
        (getAssetObjectInfo(this.assetInfo.key).targetRatio *
          this.walletData.debt) /
          this.walletData.LINA2USD -
        this.walletData.lock;

      this.needLINANum = needStakeWhenTargetRatio - this.walletData.staked;
      if (this.needLINANum < 0) this.needLINANum = 0;
      if (this.needLINANum > this.walletData.avaliableLINA)
        this.needBuyLINA = true; //可用ath数量不足

      //计算达到target需要burn多少lusd
      let canBuildlUSDWhenTargetRatio =
        ((this.walletData.staked + this.walletData.lock) *
          this.walletData.LINA2USD) /
        getAssetObjectInfo(this.assetInfo.key).targetRatio;

      this.needlUSDNum = this.walletData.debt - canBuildlUSDWhenTargetRatio;
      if (this.needlUSDNum < 0) this.needlUSDNum = 0;
      if (this.needlUSDNum > this.walletData.amountlUSD)
        this.needBuylUSD = true; //可用lusd数量不足
    },
    actionLink(value) {
      switch (value) {
        case 1:
          window.open(this.assetInfo.buyLink);
          break;
        case 2:
          this.$store.commit("setCurrentAction", 1);
          this.$router.push("/build");
          break;
        case 3:
          window.open(
            "https://app.stellaswap.com/exchange/swap?outputCurrency=0xcbabee0658725b5b21e1512244734a5d5c6b51d6"
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
#attentionBoxId {
  .attentionBox {
    width: 600px;
    position: relative;
    // transform: translateX(-300px);
    display: flex;
    border-radius: 16px;
    background-color: white;
    box-shadow: 0px 2px 12px 0px #e5e5e5;

    .app-dark & {
      background-color: #050d20;
      box-shadow: 0px 2px 12px 0px #050d20;
    }

    .colorBlock {
      width: 20px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .container {
      width: 95%;
      display: flex;
      padding: 0 24px 16px 24px;

      img {
        margin-top: 14px;
      }

      .icon {
        width: 24px;
        height: 24px;
      }

      .content {
        margin-left: 8px;
        width: 499px;

        .icon {
          display: flex;
        }

        .title {
          font-family: Gilroy-Bold;
          text-align: left;
          margin-bottom: 4px;
          font-style: normal;
          font-weight: 700;
          color: #5a575c;

          img {
            margin-top: 14px;
          }

          .app-dark & {
            color: #e5e5e5;
          }

          .attentionTitle {
            font-size: 16px;
            line-height: 24px;
          }

          .assetTitle {
            font-size: 14px;

            line-height: 20px; /* 142.857% */
          }

          .attentionTitle,
          .titleIcon,
          .assetTitle {
            display: inline-block;
          }

          .attentionTitle {
            padding-right: 5px;
          }

          .attentionTitle {
            border-right: #e5e5e5 solid 1px;
            padding-right: 15px;
          }

          .titleIcon {
            width: 16px;
            margin: 5px 5px 0px 5px;
          }
        }

        .context {
          color: #99999a;
          font-family: Gilroy-Regular;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 16px;
          text-align: left;
          margin: 0 0 4px;

          .app-dark & {
            color: #e5e5e5;
          }
        }

        .btnBox {
          display: flex;
          color: #a4cbff;
          font-family: Gilroy;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          line-height: 16px;
          letter-spacing: 1.5px;
          text-transform: uppercase;

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
        width: 8px;
        background-color: #f2c94c;
      }

      .btnBox {
        color: #f08b0b;
      }
    }

    &.urgent {
      .colorBlock {
        width: 8px;
        background-color: #df434c;
      }

      .btnBox {
        color: #df434c;
      }
    }

    &.liquidated {
      .colorBlock {
        width: 8px;
        background-color: #1a38f8;
      }

      .btnBox {
        color: $darkFontColorSecondary;
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #attentionBoxId {
    width: 100%;

    .attentionBox {
      width: 90vw;
      -webkit-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
    }
  }
}
</style>
