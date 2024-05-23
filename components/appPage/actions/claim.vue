<template>
  <div id="claim">
    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0">
        <div class="claimBox">
          <div class="actionBody">
            <div class="actionTitle">Claim</div>
            <div class="actionDesc">
              Claim rewards from staking your assets and building ℓUSD
            </div>

            <div class="rewardsBox">
              <div
                class="box"
                :class="{ stakedAssetBox: staticStakingRewards.length > 0 }"
              >
                <div class="titleMobile">Staking Rewards</div>
                <div class="title">Staking Rewards</div>
                <div class="rewardsContainer">
                  <div class="rewardsContainerLeft">
                    <img
                      v-if="feesAreClaimable || totalStakingRewards != 0"
                      src="@/static/LINA_logo.svg"
                    />
                    <img v-else src="@/static/LINA_gray_logo.svg" />
                    <div
                      class="amount"
                      :class="{
                        disabledRewards: !(
                          feesAreClaimable || totalStakingRewards != 0
                        ),
                      }"
                    >
                      LINA
                      <img
                        v-if="isMobile"
                        class="showInfoMobile"
                        src="@/static/info_grey.svg"
                        @click="showModal(1)"
                      />
                      <Tooltip
                        v-else-if="!isMobile"
                        max-width="275"
                        placement="top"
                        class="globalInfoStyle"
                        content="To claim your full reward allocation, make sure all staked assets are above target P-ratio."
                      >
                        <img
                          v-if="theme === 'light'"
                          src="@/static/info_grey.svg"
                        />
                        <img v-else src="@/static/dark-theme/info_white.svg" />
                      </Tooltip>
                    </div>
                  </div>
                  <div
                    class="rewardsContainerLeft value"
                    :class="{
                      disabledRewards: !(
                        feesAreClaimable || totalStakingRewards != 0
                      ),
                    }"
                  >
                    {{ claimableReward
                    }}<span class="">/{{ totalStakingRewards }}</span>
                  </div>
                </div>
                <div
                  class="multiCollateralContainer"
                  v-if="staticStakingRewards.length > 0"
                >
                  <div class="stakedAssetContainer">
                    <div>Staked Asset</div>
                    <div>Reward</div>
                  </div>
                  <div
                    class="assetsTable"
                    :class="{ assetLocked: !item.available }"
                    v-for="(item, index) in staticStakingRewards"
                    :key="index"
                  >
                    <div>{{ item.asset }}</div>
                    <div>{{ item.stakingReward }}</div>
                  </div>
                </div>
              </div>
              <div
                class="box"
                :class="{
                  exchangeAssetBox: totalTradingRewards != 0,
                }"
              >
                <div class="titleMobile">Exchange Rewards</div>
                <div class="title">Exchange Rewards</div>
                <div class="rewardsContainer">
                  <div class="rewardsContainerLeft">
                    <img
                      v-if="feesAreClaimable || totalTradingRewards != 0"
                      src="@/static/currency/lUSD.svg"
                    />
                    <img v-else src="@/static/LUSD_gray_logo.svg" />
                    <div
                      class="amount"
                      :class="{
                        disabledRewards: !(
                          feesAreClaimable || totalStakingRewards != 0
                        ),
                      }"
                    >
                      ℓUSD
                      <img
                        v-if="isMobile"
                        class="showInfoMobile"
                        src="@/static/info_grey.svg"
                        @click="showModal(2)"
                      />
                      <Tooltip
                        v-else-if="!isMobile"
                        placement="top"
                        class="tip globalInfoStyle"
                        content="Exchange rewards are only distributed to debt built with $LINA."
                        offset="0 4"
                      >
                        <img
                          v-if="theme === 'light'"
                          src="@/static/info_grey.svg"
                        />
                        <img v-else src="@/static/dark-theme/info_white.svg" />
                      </Tooltip>
                    </div>
                  </div>
                  <div
                    class="rewardsContainerLeft"
                    :class="{
                      assetLocked:
                        (multiCollateralValuesRatios &&
                          multiCollateralValuesRatios.LINA < 400) ||
                        !(feesAreClaimable || totalStakingRewards != 0),
                    }"
                  >
                    {{ totalTradingRewards }}
                  </div>
                </div>
              </div>
            </div>

            <div class="infoBox">
              <div class="statusBox">
                <div class="title">Reward Status</div>
                <div class="status" :class="{ open: feesAreClaimable }">
                  {{
                    feesAreClaimable ? "OPEN" : hasClaim ? "CLAIMED" : "CLOSED"
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
            v-if="!this.walletAddress"
            class="claimBtn noWallet"
            @click.stop="toggleModal"
          >
            Buy Lina to get started!
          </div>
          <div
            v-else-if="!isEthereumNetwork"
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
      v-model="modalPopup"
      :footer-hide="true"
      :closable="true"
      :transfer="false"
      :mask="true"
      class="introductActionModal"
    >
      <div class="title">Reward Status</div>
      <div class="context">
        {{ this.modalText }}
      </div>
    </Modal>
    <linkModal :visible="showPopup" @toggle="showPopup = $event"></linkModal>
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
import { collateralAssets } from "~/assets/linearLibrary/linearTools/collateralAssets";
import { lnr } from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";

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
      modalPopup: false,
      closeIn: "", //多少天后可领取奖励
      feesAreClaimable: false, //是否可以领取奖励
      claimableReward: 0, // claimable staking reward cal by total staking rewards minus reward from collateral lower than target ratio
      totalTradingRewards: 0, //交易所手续费奖励
      totalStakingRewards: 0, //通胀奖励
      staticStakingRewards: [],
      processing: false, //加载状态
      confirmTransactionHash: "", //交易hash
      hasClaim: false, //有没有claim过
      claimableRewardEntries: undefined,
      modalText: "",
      showPopup: false,
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
    multiCollateralValuesRatios() {},
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
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
        this.claimableReward < 0
      );
    },
    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },
    theme() {
      return this.$store.state?.theme;
    },
    multiCollateralValuesRatios() {
      return this.$store.state?.multiCollateralValues.currentRatio;
    },
  },
  methods: {
    showModal(textNumber) {
      this.modalPopup = true;
      switch (textNumber) {
        case 1:
          this.modalText =
            "Exchange rewards are only distributed to debt built with $LINA.";
          break;
        case 2:
          this.modalText =
            "Exchange rewards are only distributed to debt built with $LINA.";
          break;
        case 3:
          this.modalText =
            "Reward can only be claimed when target ratio is reached.";
      }
    },
    toggleModal() {
      this.showPopup = !this.showPopup;
    },
    //点击 claim
    async clickClaim() {
      if (!this.claimDisabled) {
        this.processing = true;

        if (this.isEthereumNetwork) return;

        this.waitProcessArray = [];
        this.confirmTransactionStep = 0;

        this.waitProcessArray.push(BUILD_PROCESS_SETUP.CLAIM);

        try {
          this.actionTabs = "m1"; //进入等待页
          const transactionArray = await this.claimMulticollateralRewards();
          if (transactionArray.length === 0) {
            this.actionTabs = "m3"; //进入错误页
            return;
          }
          const result = await Promise.all(transactionArray);

          //等待结果返回, if one claiming tx fail, we direct user to fail page
          let status = result.indexOf(false) === -1;
          //判断成功还是错误子页
          this.actionTabs = status ? "m2" : "m3";
          //成功则更新数据
          //成功则更新数据
          status && _.delay(async () => await storeDetailsData(), 5000);

          this.confirmTransactionStep += 1;
        } catch (e) {
          console.log(e);
          this.actionTabs = "m3"; //进入错误页
        } finally {
          this.processing = false;
        }
      }
    },
    async claimMulticollateralRewards() {
      let transactionArray = [];
      const generateTransactions = async () => {
        const transactionSettings = {
          gasPrice: this.$store.state?.gasDetails?.price,
          gasLimit: DEFAULT_GAS_LIMIT.claim,
        };
        let { multiCollateral } = lnrJSConnector;
        for (let i = 0; i < this.claimableRewardEntries.length; i++) {
          try {
            const entry = this.claimableRewardEntries[i];
            const collateral = collateralAssets.find(
              (collateral) => collateral.contractKey == entry.collateralCurrency
            );
            const multiCollateralRewardSystemContract =
              multiCollateral[collateral.key].LnRewardSystem;
            transactionSettings.gasLimit = await this.getGasEstimate(
              entry,
              multiCollateralRewardSystemContract
            );
            let transaction =
              await multiCollateralRewardSystemContract.claimReward(
                entry.periodId, // periodId
                BigNumber.from(entry.stakingReward), // stakingReward
                BigNumber.from(entry.feeReward), // feeReward
                entry.signatures.map((signer) => signer.signature),
                transactionSettings
              );
            if (transaction) {
              transactionArray.push(
                lnrJSConnector.utils.waitForTransaction(transaction.hash)
              );
              // 发起右下角通知;
              this.$pub.publish("notificationQueue", {
                hash: transaction.hash,
                type: BUILD_PROCESS_SETUP.CLAIM,
                networkId: this.walletNetworkId,
                value: `Claiming ${collateral.name} ${
                  this.confirmTransactionStep + 1
                } / ${this.waitProcessArray.length}`,
              });
            }
          } catch {
            (err) => console.log(err);
          }
        }
      };
      await generateTransactions();
      return transactionArray;
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

        this.staticStakingRewards = [];
        const { multiCollateral } = lnrJSConnector;

        const apiUrl =
          REWARD_API_BASES[this.walletNetworkId] + "rewards/" + walletAddress;

        const [
          currentPeriodIdRes,
          lastClaimPeriodIdRes,
          claimWindowPeriodCountRes,
          allRewardEntriesRes,
        ] = await Promise.all([
          multiCollateral["LINA"].LnRewardSystem.getCurrentPeriodId(),
          multiCollateral["LINA"].LnRewardSystem.userLastClaimPeriodIds(
            walletAddress
          ),
          multiCollateral["LINA"].LnRewardSystem.claimWindowPeriodCount(),
          fetch(apiUrl),
        ]);

        const currentPeriodId = currentPeriodIdRes.toNumber();
        const lastClaimPeriodId = lastClaimPeriodIdRes.toNumber();
        const claimWindowPeriodCount = claimWindowPeriodCountRes.toNumber();
        const allRewardEntries = await allRewardEntriesRes.json();
        const minClaimPeriod =
          currentPeriodId < claimWindowPeriodCount
            ? 1
            : currentPeriodId - claimWindowPeriodCount;
        const claimedRewards = await lnr.feesClaimed({
          account: this.walletAddress,
          networkId: this.walletNetworkId,
          minPeriodId: minClaimPeriod,
        });
        const pendingRewardEntries = [];
        allRewardEntries.map((entry) => {
          // entry must between claimable period
          if (
            entry.periodId >= minClaimPeriod &&
            entry.periodId < currentPeriodId
          ) {
            if (
              claimedRewards === undefined ||
              !claimedRewards.some(
                (x) =>
                  x.periodId === entry.periodId &&
                  (x.collateralCurrency === entry.collateralCurrency ||
                    (x.collateralCurrency == "BNB" &&
                      entry.collateralCurrency == "WBNB"))
              )
            ) {
              pendingRewardEntries.push(entry);
            }
          }
        });
        if (lastClaimPeriodId >= minClaimPeriod) {
          this.hasClaim = true;
        }

        const {
          tempStakingReward,
          tempTradingReward,
          tempClaimableReward,
          claimableRewardEntries,
        } = await this.calCollateralRewards(
          pendingRewardEntries,
          this.walletAddress
        );
        this.totalStakingRewards = formatNumber(tempStakingReward / 1e18);
        this.totalTradingRewards = formatNumber(tempTradingReward / 1e18);
        this.claimableReward = formatNumber(tempClaimableReward / 1e18);
        this.claimableRewardEntries = claimableRewardEntries;
        if (tempStakingReward > 0) {
          this.closeIn = "Now";
          if (tempClaimableReward > 0) {
            this.feesAreClaimable = true;
          }
        } else {
          this.closeIn = "N/A";
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.processing = false;
      }
    },
    async calCollateralRewards(pendingRewardEntries, walletAddress) {
      let tempStakingReward = BigNumber.from(0);
      let tempTradingReward = BigNumber.from(0);
      let tempClaimableReward = BigNumber.from(0);
      let claimableRewardEntries = [];
      const { multiCollateral } = lnrJSConnector;
      const waitCalCollateralRewards = async () => {
        for (let i = 0; i < collateralAssets.length; i++) {
          const collateralAsset = collateralAssets[i];
          const collateralPendingEntries = pendingRewardEntries.filter(
            (entry) => entry.collateralCurrency === collateralAsset.contractKey
          );
          if (collateralPendingEntries.length > 0) {
            const [totalCollateralInUsd, amountDebt] = await Promise.all([
              multiCollateral[
                collateralAsset.key
              ].LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress),
              multiCollateral[
                collateralAsset.key
              ].LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress),
            ]);

            //当前P Ratio
            let currentRatioPercent =
              totalCollateralInUsd != 0 && amountDebt[0] != 0
                ? totalCollateralInUsd.mul(100).div(amountDebt[0])
                : BigNumber.from(0);

            const stakingReward = collateralPendingEntries.reduce(
              (prev, curr) => prev.add(BigNumber.from(curr.stakingReward)),
              BigNumber.from(0)
            );

            const tradingRewards = collateralPendingEntries.reduce(
              (prev, curr) => prev.add(BigNumber.from(curr.feeReward)),
              BigNumber.from(0)
            );
            const isClaimable = currentRatioPercent.gte(
              BigNumber.from(collateralAsset.targetRatio * 100)
            );
            if (isClaimable) {
              claimableRewardEntries = claimableRewardEntries.concat(
                collateralPendingEntries
              );
            }
            tempStakingReward = tempStakingReward.add(stakingReward);
            tempTradingReward = tempTradingReward.add(tradingRewards);
            if (isClaimable) {
              tempClaimableReward = tempClaimableReward.add(stakingReward);
            }

            this.staticStakingRewards.push({
              asset: collateralAsset.branch
                ? collateralAsset.name + collateralAsset.branch
                : collateralAsset.name,
              stakingReward: formatNumber(stakingReward / 1e18),
              tradingRewards: formatNumber(tradingRewards / 1e18),
              available: isClaimable,
            });
          }
        }
      };
      await waitCalCollateralRewards();
      return {
        tempStakingReward,
        tempTradingReward,
        tempClaimableReward,
        claimableRewardEntries,
      };
    },

    //评估gas
    async getGasEstimate(entry, contract) {
      try {
        let gasEstimate = await contract.estimateGas.claimReward(
          entry.periodId, // periodId
          BigNumber.from(entry.stakingReward), // stakingReward
          BigNumber.from(entry.feeReward), // feeReward
          entry.signatures.map((signer) => signer.signature)
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        const errorMessage =
          (e && e.message) || "Error while getting gas estimate";
        console.log(errorMessage);

        return bufferGasLimit(DEFAULT_GAS_LIMIT.claim);
      }
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
              margin: 8px 0 40px 0;
            }

            .rewardsBox {
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-bottom: 64px;
              margin-bottom: 40px;

              .box {
                width: 400px;
                min-height: 120px;
                height: auto;
                border-radius: 8px;
                background: $darkFontColorLight;

                .app-dark & {
                  background: #23376a !important;
                }

                .titleMobile {
                  display: none;
                }

                img {
                  width: 40px;
                }

                .title {
                  color: #5a575c;
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 32px;
                  /* 133.333% */
                  text-align: left;
                  margin: 20px 20px 10px;

                  .app-dark & {
                    color: #e5e5e5;
                  }
                }

                .rewardsContainer {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin: 0px 20px;

                  .rewardsContainerLeft {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    &.value {
                      display: flex;
                      flex-wrap: wrap;
                      text-align: right;
                      justify-content: end;
                      max-width: 200px;
                    }

                    &.assetLocked {
                      color: #bababa;

                      .app-dark & {
                        color: #5a575c;
                      }
                    }

                    &.disabledRewards {
                      .assetLocked {
                        color: #99999a;

                        .app-dark & {
                          color: #5a575c;
                        }
                      }
                    }
                  }
                }

                .multiCollateralContainer {
                  color: #5a575c;
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.25;
                  letter-spacing: normal;
                  margin: 0 10px;

                  .rewardsContainerLeft {
                    display: flex;
                    align-items: center;
                    /* Align Items Vertically */
                    justify-content: space-between;
                  }
                }

                .multiCollateralContainer {
                  font-family: Gilroy;
                  margin-bottom: 16px;
                  margin-top: 12px;
                  margin-left: 20px;
                  margin-right: 20px;
                  .stakedAssetContainer {
                    font-weight: bold;
                  }
                  .assetsTable,
                  .stakedAssetContainer {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 5px;
                    color: #5a575c;
                    font-family: $BodyTextFontFamily;
                    font-size: 16px;
                  }
                }

                .rewardsContainerLeft,
                .amount {
                  color: #5a575c;
                  font-family: Gilroy-Bold;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 24px;
                  line-height: 32px;

                  .app-dark & {
                    color: #e5e5e5;
                  }

                  &.disabledRewards {
                    color: #99999a !important;
                    .app-dark & {
                      color: #5a575c !important;
                    }
                  }

                  .globalInfoStyle {
                    img {
                      margin: 0 10px 5px 0;
                    }
                  }
                }

                .amount {
                  padding-left: 10px;
                }

                &:nth-child(1) {
                  margin-bottom: 20px;
                }
              }

              .stakedAssetBox {
                height: auto;
                background-color: #f2f7ff !important;

                .app-dark & {
                  background-color: #050d20 !important;
                }
              }

              .exchangeAssetBox {
                background-color: #f2f7ff !important;

                .app-dark & {
                  background-color: #050d20 !important;
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
                  color: #99999a;

                  .app-dark & {
                    color: #99999a !important;
                  }
                }

                .status {
                  text-align: center;
                  background: #f6f5f6;
                  border-radius: 12px;
                  font-family: $BodyTextFontFamily;
                  font-size: 12px;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #99999a;
                  padding: 5px;
                }

                .open {
                  color: #4e66ff !important;
                }

                .days {
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  color: #99999a;
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
                background-color: $darkFontColorLight;
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

            &.noWallet {
              font-family: $BodyTextFontFamily;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
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
    min-height: 600px;

    .actionTabs {
      min-height: 600px;

      .ivu-tabs-bar {
        display: none;
      }

      .ivu-tabs-content {
        background: #fff;

        .ivu-tabs-tabpane {
          width: 100%;
          height: 100% !important;
          min-height: 600px;

          .claimBox,
          .waitingBox,
          .successBox,
          .failBox {
            width: 100%;
            height: 100%;
            min-height: 600px;
          }

          .claimBox {
            position: relative;

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
              font-family: Gilroy-Bold;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.33;
              letter-spacing: 3px;
              text-align: center;

              &:hover {
                &:not(.disabled) {
                  background-color: $darkFontColorLight;
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

            .actionBody {
              margin-top: 25px;
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
                width: 80vw;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin: 20px;

                .box {
                  width: unset;
                  border-radius: 8px;
                  text-align: center;
                  padding-bottom: 15px;
                  height: auto;

                  .titleMobile {
                    display: block;
                    padding: 15px;
                    color: #5a575c;
                    font-family: Gilroy-Bold;
                    font-size: 24px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: left;

                    .app-dark & {
                      color: #e5e5e5;
                    }
                  }

                  .rewardsContainer {
                    .rewardsContainerLeft {
                      &.value {
                        display: flex;
                        flex-wrap: wrap;
                        text-align: right;
                        justify-content: end;
                      }
                    }
                  }

                  img {
                    width: 24px;
                  }

                  .title {
                    display: none;
                  }

                  .amount {
                    display: flex;

                    .showInfoMobile {
                      display: block;
                      margin: 4px;
                      height: 20px;
                    }

                    .globalInfoStyle {
                      img {
                        margin: 0 5px;
                      }
                    }
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
                  font-size: 14px !important;
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
</style>
