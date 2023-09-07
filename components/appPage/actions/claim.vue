<template>
  <div id="claim">
    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0">
        <div class="claimBox">
          <div class="actionBody">
            <div class="actionTitle">Claim</div>
            <div class="actionDesc">
              Claim rewards from staking LINA and building ℓUSD
            </div>

            <div
              class="rewardsBox"
              :class="{
                rewardsBoxClosed: !feesAreClaimable,
              }"
            >
              <div class="box">
                <div class="titleMobile">Staking Rewards</div>
                <img v-if="feesAreClaimable" src="@/static/LINA_logo.svg" />
                <img v-else src="@/static/LINA_gray_logo.svg" />
                <div class="title">Staking Rewards</div>
                <div class="amount">
                  <span>{{ stakingRewards }}</span> LINA
                </div>
              </div>
              <div class="box">
                <div class="titleMobile">Exchange Rewards</div>
                <img v-if="feesAreClaimable" src="@/static/currency/lUSD.svg" />
                <img v-else src="@/static/LUSD_gray_logo.svg" />
                <div class="title">Exchange Rewards</div>
                <div class="amount">
                  <span>{{ tradingRewards }}</span> ℓUSD
                </div>
              </div>
            </div>

            <div class="infoBox">
              <div class="statusBox">
                <div class="title">
                  Reward Status
                  <Tooltip
                    class="globalInfoStyle"
                    max-width="275"
                    content="Reward can only be claimed when target ratio is reached."
                    placement="top"
                  >
                    <img
                      v-if="theme === 'light'"
                      src="@/static/new_info_white.svg"
                    />
                    <img v-else src="@/static/dark-theme/new_info_white.svg" />
                  </Tooltip>

                  <img
                    v-if="theme === 'light'"
                    class="showInfoMobile"
                    src="@/static/info_white.svg"
                    @click="showIntroductActionModal"
                  />
                  <img
                    v-else
                    class="showInfoMobile"
                    src="@/static/dark-theme/info_white.svg"
                    @click="showIntroductActionModal"
                  />
                </div>
                <div class="status" :class="{ open: feesAreClaimable }">
                  {{
                    feesAreClaimable ? "Open" : hasClaim ? "Claimed" : "Closed"
                  }}
                </div>
              </div>
              <div class="periodBox">
                <div class="title">Claim Period Ends</div>
                <div class="days">
                  <span>{{ closeIn }}</span>
                </div>
              </div>
              <gasEditor v-if="isBinanceNetwork"></gasEditor>
            </div>
          </div>

          <div
            v-if="!isEthereumNetwork"
            class="claimBtn"
            :class="{
              disabled: claimDisabled || isEthereumNetwork,
            }"
            @click="clickClaim"
          >
            CLAIM NOW
          </div>

          <div v-else class="claimBtn switchToBSC">
            Please switch to BSC network to claim your rewards
          </div>

          <Spin fix v-if="processing"></Spin>
        </div>
      </TabPane>
      <TabPane name="m1">
        <wating
          class="waitingBox"
          v-if="this.actionTabs == 'm1'"
          @etherscan="etherscan"
          @homepage="goHomePage"
        ></wating>
      </TabPane>
      <TabPane name="m2">
        <success
          class="successBox"
          @homepage="goHomePage"
          @close="setDefaultTab"
        ></success>
      </TabPane>
      <TabPane name="m3">
        <wrong
          class="wrongBox"
          @again="tryAgain"
          @close="setDefaultTab"
          @homepage="goHomePage"
        ></wrong>
      </TabPane>
    </Tabs>

    <Modal
      v-model="introductActionModal"
      :footer-hide="true"
      :closable="true"
      :transfer="false"
      :mask="true"
      class="introductActionModal"
    >
      <div class="title">Reward Status</div>
      <div class="context">
        Reward can only be claimed when target ratio is reached.
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from "lodash";
import { addSeconds, formatDistanceToNow } from "date-fns";
import { formatNumber } from "@/assets/linearLibrary/linearTools/format";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { storeDetailsData } from "@/assets/linearLibrary/linearTools/request";
import gasEditor from "@/components/gasEditor";
import {
  bufferGasLimit,
  DEFAULT_GAS_LIMIT,
  isBinanceNetwork,
  isEthDevNetwork,
  isEthereumNetwork,
  isMainnetNetwork,
  REWARD_API_BASES,
} from "@/assets/linearLibrary/linearTools/network";
import { BigNumber, utils } from "ethers";
import { BUILD_PROCESS_SETUP } from "@/assets/linearLibrary/linearTools/constants/process";

export default {
  name: "claim",
  components: {
    gasEditor,
  },
  data() {
    return {
      actionTabs: "m0", //子页(m0默认,m1等待,m2成功,m3错误)
      confirmTransactionStep: -1, //当前交易进度
      waitProcessArray: [], //等待交易进度组
      introductActionModal: false,

      closeIn: "", //多少天后可领取奖励
      feesAreClaimable: false, //是否可以领取奖励
      tradingRewards: 0, //交易所手续费奖励
      stakingRewards: 0, //通胀奖励
      processing: false, //加载状态
      confirmTransactionHash: "", //交易hash
      hasClaim: true, //有没有claim过
      pendingRewardEntries: undefined,
      currentRatioPercent: 0, //当前P ratio
    };
  },
  created() {
    !this.isEthDevNetwork && this.useGetFeeData(this.walletAddress);
  },
  watch: {
    walletAddress() {},
    walletNetworkName() {},
    walletNetworkId() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
  },
  computed: {
    isEthereumNetwork() {
      return isEthereumNetwork(this.walletNetworkId);
    },

    isBinanceNetwork() {
      return isBinanceNetwork(this.walletNetworkId);
    },

    isEthDevNetwork() {
      return isEthDevNetwork(this.walletNetworkId);
    },

    walletNetworkName() {
      return this.$store.state?.walletNetworkName;
    },

    walletAddress() {
      return this.$store.state?.wallet?.address;
    },

    //claim按钮禁止状态
    claimDisabled() {
      return (
        !this.feesAreClaimable ||
        this.processing ||
        (this.tradingRewards == 0 && this.stakingRewards == 0) ||
        this.currentRatioPercent < 400
      );
    },

    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },
    theme() {
      return this.$store.state?.theme;
    },
  },
  methods: {
    //点击 claim
    async clickClaim() {
      if (!this.claimDisabled) {
        this.processing = true;

        if (this.isEthereumNetwork) return;

        this.waitProcessArray = [];
        this.confirmTransactionStep = 0;

        this.waitProcessArray.push(BUILD_PROCESS_SETUP.CLAIM);

        const transactionSettings = {
          gasPrice: this.$store.state?.gasDetails?.price,
          gasLimit: DEFAULT_GAS_LIMIT.claim,
        };

        //获取gas评估
        transactionSettings.gasLimit = await this.getGasEstimate();

        try {
          this.actionTabs = "m1"; //进入等待页

          let {
            lnrJS: { LnRewardSystem },
          } = lnrJSConnector;

          const rewardEntry = this.pendingRewardEntries[0];
          // const signature = utils.splitSignature(
          //     rewardEntry.signatures[0].signature
          // );

          let transaction = await LnRewardSystem.claimReward(
            rewardEntry.periodId, // periodId
            BigNumber.from(rewardEntry.stakingReward), // stakingReward
            BigNumber.from(rewardEntry.feeReward), // feeReward
            rewardEntry.signatures.map((item) => item.signature),
            transactionSettings
          );

          if (transaction) {
            this.confirmTransactionHash = transaction.hash;

            // 发起右下角通知
            this.$pub.publish("notificationQueue", {
              hash: this.confirmTransactionHash,
              type: BUILD_PROCESS_SETUP.CLAIM,
              networkId: this.walletNetworkId,
              value: `Claiming ${this.confirmTransactionStep + 1} / ${
                this.waitProcessArray.length
              }`,
            });

            //等待结果返回
            let status = await lnrJSConnector.utils.waitForTransaction(
              transaction.hash
            );

            //判断成功还是错误子页
            this.actionTabs = status ? "m2" : "m3";

            //成功则更新数据
            status && _.delay(async () => await storeDetailsData(), 5000);

            this.confirmTransactionStep += 1;
          }
        } catch (e) {
          console.log(e);
          this.actionTabs = "m3"; //进入错误页
        } finally {
          this.processing = false;
        }
      }
    },

    //计算距离申领奖励开始的时间？
    getFeePeriodCountdown(recentFeePeriods, feePeriodDuration) {
      if (!recentFeePeriods) return;

      //feePeriodDuration = 21600;
      if (
        parseInt(feePeriodDuration.add(recentFeePeriods.startTime)) -
          _.now() / 1000 <=
        0
      )
        return "Now";

      let currentPeriodStart = null;
      if (recentFeePeriods && recentFeePeriods.startTime) {
        currentPeriodStart =
          formatNumber(recentFeePeriods.startTime) == "0"
            ? null
            : new Date(parseInt(recentFeePeriods.startTime * 1000));
      }

      const currentPeriodEnd =
        currentPeriodStart && feePeriodDuration
          ? addSeconds(currentPeriodStart, feePeriodDuration)
          : null;
      return currentPeriodEnd ? formatDistanceToNow(currentPeriodEnd) : "N/A";
    },

    async useGetFeeData(walletAddress) {
      try {
        this.processing = true;

        const {
          lnrJS: { LnRewardSystem, LnCollateralSystem, LnDebtSystem },
        } = lnrJSConnector;

        const apiUrl =
          REWARD_API_BASES[this.walletNetworkId] + "rewards/" + walletAddress;

        const [
          firstPeriodStartTimeRes,
          lastClaimPeriodIdRes,
          allRewardEntriesRes,

          totalCollateralInUsd,
          amountDebt,
        ] = await Promise.all([
          LnRewardSystem.firstPeriodStartTime(),
          LnRewardSystem.userLastClaimPeriodIds(walletAddress),
          fetch(apiUrl),

          //p ratio
          LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress),
          LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress),
        ]);

        //当前P Ratio
        this.currentRatioPercent =
          totalCollateralInUsd != 0 && amountDebt[0] != 0
            ? (totalCollateralInUsd / amountDebt[0]) * 100
            : 0;

        const firstPeriodStartTime = firstPeriodStartTimeRes.toNumber();
        const lastClaimPeriodId = lastClaimPeriodIdRes.toNumber();
        const allRewardEntries = await allRewardEntriesRes.json();

        const pendingRewardEntries = allRewardEntries.filter(
          (entry) => entry.periodId > lastClaimPeriodId
        );

        this.hasClaim = pendingRewardEntries.length === 0;
        this.feesAreClaimable = pendingRewardEntries.length > 0;
        this.pendingRewardEntries = pendingRewardEntries;

        if (pendingRewardEntries.length > 0) {
          this.closeIn = "Now";
          this.stakingRewards = formatNumber(
            pendingRewardEntries.reduce(
              (prev, curr) => prev.add(BigNumber.from(curr.stakingReward)),
              BigNumber.from(0)
            ) / 1e18
          );
          this.tradingRewards = formatNumber(
            pendingRewardEntries.reduce(
              (prev, curr) => prev.add(BigNumber.from(curr.feeReward)),
              BigNumber.from(0)
            ) / 1e18
          );
        } else {
          this.closeIn = "N/A";
          this.stakingRewards = 0;
          this.tradingRewards = 0;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.processing = false;
      }
    },

    //评估gas
    async getGasEstimate() {
      try {
        const {
          lnrJS: { LnRewardSystem },
        } = lnrJSConnector;

        const rewardEntry = this.pendingRewardEntries[0];
        // const signature = utils.splitSignature(
        //     rewardEntry.signatures[0].signature
        // );

        let gasEstimate = await LnRewardSystem.estimateGas.claimReward(
          rewardEntry.periodId, // periodId
          BigNumber.from(rewardEntry.stakingReward), // stakingReward
          BigNumber.from(rewardEntry.feeReward), // feeReward
          rewardEntry.signatures.map((item) => item.signature)
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        const errorMessage =
          (e && e.message) || "Error while getting gas estimate";
        console.log(errorMessage);

        return bufferGasLimit(DEFAULT_GAS_LIMIT.claim);
      }
    },

    showIntroductActionModal() {
      this.introductActionModal = true;
    },

    //到 etherscan 查看交易记录详情
    etherscan() {
      openBlockchainBrowser(this.confirmTransactionHash, this.walletNetworkId);
    },

    //交易状态页面回调方法 回到主页
    goHomePage() {
      this.$store.commit("setCurrentAction", 0);
      this.$router.push("/");
    },

    //回到默认状态
    setDefaultTab() {
      this.processing = false;
      this.actionTabs = "m0";
      this.confirmTransactionStep = 0;
      this.waitProcessArray = [];

      !this.isEthDevNetwork &&
        setTimeout(this.useGetFeeData(this.walletAddress), 5000);
    },

    //重试
    tryAgain() {
      this.actionTabs = "m0";
    },
  },
};
</script>

<style lang="scss">
#claim {
  .actionTabs {
    .ivu-tabs-bar {
      display: none;
    }

    .ivu-tabs-content {
      background: #fff;

      .ivu-tabs-tabpane {
        width: 786px;
        height: 840px !important;

        .claimBox,
        .waitingBox,
        .successBox,
        .failBox {
          width: 100%;
          height: 100%;
        }

        .claimBox {
          position: relative;

          .actionBody {
            padding: 64px 193px 0;

            .actionTitle {
              font-family: $HeadingsFontFamily;
              font-size: 32px;
              font-weight: 200;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.25;
              letter-spacing: normal;
              text-align: center;
              color: #5a575c;
            }

            .actionDesc {
              margin: 8px 0 76px 0;
              font-family: $BodyTextFontFamily;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.29;
              letter-spacing: normal;
              text-align: center;
              color: #99999a;
            }

            .rewardsBox {
              display: flex;
              justify-content: center;
              margin-bottom: 64px;

              .box {
                width: 188px;
                height: 300px;
                border-radius: 8px;
                background: rgba(#7eb5ff, 0.1);
                text-align: center;

                .titleMobile {
                  display: none;
                }

                img {
                  width: 56px;
                  margin: 74px 0 24px 0;
                }

                .title {
                  color: #5a575c;
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  text-align: center;
                }

                .amount {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #5a575c;
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.25;
                  letter-spacing: normal;

                  span {
                    color: #5a575c;
                    font-family: $BodyTextFontFamily;
                    font-size: 32px;
                    font-weight: bold;
                    margin-right: 6px;
                  }
                }

                &:nth-child(1) {
                  margin-right: 12px;
                }

                &:nth-child(2) {
                  margin-left: 12px;
                }
              }
            }

            .rewardsBoxClosed {
              .box {
                background: #f6f5f6;

                .title {
                  color: #99999a;
                }

                .amount {
                  color: #99999a;

                  span {
                    color: #99999a;
                  }
                }
              }
            }

            .infoBox {
              .statusBox,
              .periodBox {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 14px;

                .title {
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  color: #5a575c;

                  .globalInfoStyle {
                  }

                  .showInfoMobile {
                    display: none;
                  }
                }

                .status {
                  padding: 4px 16px;
                  text-align: center;
                  border-radius: 12px;
                  background: #f6f5f6;
                  font-family: $BodyTextFontFamily;
                  font-size: 12px;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #5a575c;
                }

                .open {
                  color: #1a38f8;
                  background: rgba($color: #7eb5ff, $alpha: 0.1);
                }

                .days {
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  color: #5a575c;
                }
              }
            }
          }

          .claimBtn {
            width: 100%;
            height: 80px;
            background: #1a38f8;
            position: absolute;
            bottom: 0px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            cursor: pointer;
            transition: $animete-time linear;
            font-family: $BodyTextFontFamily;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: 3px;
            text-align: center;

            &:hover {
              &:not(.disabled) {
                background-color: #7eb5ff;
              }
            }

            &.disabled {
              opacity: 0.1;
              cursor: not-allowed;
            }

            &.claimBtnActivited {
              opacity: unset;
            }

            &.switchToBSC {
              font-family: $BodyTextFontFamily;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              color: #1a38f8;
              cursor: not-allowed;
              background-color: #eff6ff;
              text-transform: none;
              &:hover {
                &:not(.disabled) {
                  background-color: #eff6ff;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #claim {
    min-height: 550px;

    .actionTabs {
      min-height: 550px;

      .ivu-tabs-bar {
        display: none;
      }

      .ivu-tabs-content {
        background: #fff;

        .ivu-tabs-tabpane {
          width: 100%;
          height: 88vh !important;
          min-height: 550px;

          .claimBox,
          .waitingBox,
          .successBox,
          .failBox {
            width: 100%;
            height: 100%;
            min-height: 550px;
          }

          .claimBox {
            position: relative;

            .actionBody {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 0;

              .actionTitle {
                display: none;
              }

              .actionDesc {
                display: none;
              }

              .rewardsBox {
                width: 74.4vw;
                height: 80vw;
                display: flex;
                justify-content: space-between;
                margin: 39px 0 24px;

                .box {
                  flex: 1;
                  width: unset;
                  height: unset;
                  border-radius: 8px;
                  background: rgba(#7eb5ff, 0.1);
                  text-align: center;

                  .titleMobile {
                    margin: 57px 0 39px;
                    display: block;
                    padding: 0 15px;
                    color: #99999a;
                    font-family: Gilroy-Bold;
                    font-size: 14px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: center;
                  }

                  img {
                    width: 56px;
                    margin: 0px 0 16px 0;
                  }

                  .title {
                    display: none;
                  }

                  .amount {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #99999a;
                    font-family: Gilroy-Regular;
                    font-size: 12px;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.25;
                    letter-spacing: normal;

                    span {
                      color: #99999a;
                      font-family: Gilroy-Bold;
                      font-size: 16px;
                      font-weight: bold;
                      margin-right: 0;
                    }
                  }

                  &:nth-child(1) {
                    margin-right: 8px;
                  }

                  &:nth-child(2) {
                    margin-left: 8px;
                  }
                }
              }

              .rewardsBoxClosed {
                .box {
                  background: #f6f5f6;

                  .title {
                    color: #99999a;
                  }

                  .amount {
                    color: #99999a;

                    span {
                      color: #99999a;
                    }
                  }
                }
              }

              .infoBox {
                .statusBox,
                .periodBox {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 14px;

                  .title {
                    display: flex;
                    font-family: $BodyTextFontFamily;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;

                    .globalInfoStyle {
                      display: none;
                    }

                    .showInfoMobile {
                      display: block;
                      margin-left: 4px;
                    }
                  }

                  .status {
                    padding: 0;
                    text-align: center;
                    border-radius: 12px;
                    background: unset;
                    font-family: $BodyTextFontFamily;
                    font-size: 12px;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.33;
                    letter-spacing: normal;
                    color: #5a575c;
                  }

                  .open {
                    color: #1a38f8;
                    background: rgba($color: #7eb5ff, $alpha: 0.1);
                  }

                  .days {
                    font-family: $BodyTextFontFamily;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;
                  }
                }
              }
            }

            .claimBtn {
              width: 100%;
              height: 12.8vw !important;
              background: #1a38f8;
              position: absolute;
              bottom: 0px;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              text-transform: uppercase;
              cursor: pointer;
              transition: $animete-time linear;
              font-family: $BodyTextFontFamily;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.33;
              letter-spacing: 3px;
              text-align: center;

              &:hover {
                &:not(.disabled) {
                  background-color: #7eb5ff;
                }
              }

              &.disabled {
                opacity: 0.1;
                cursor: not-allowed;
              }

              &.claimBtnActivited {
                opacity: unset;
              }
            }
          }
        }
      }
    }

    .introductActionModal {
      .ivu-modal-mask {
        z-index: 10000 !important;
      }

      .ivu-modal-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000 !important;

        .ivu-modal {
          width: 74.66vw !important;
          height: 36.8vw;
          top: 0 !important;

          .ivu-modal-content {
            height: 100%;

            .ivu-modal-body {
              height: 100%;
              padding: 24px;

              .title {
                font-family: $BodyTextFontFamily;
                font-size: 16px;
                margin-bottom: 9px;
              }

              .context {
                font-family: Gilroy;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
