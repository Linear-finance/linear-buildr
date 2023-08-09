<template>
  <div id="burn">
    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0">
        <div class="burnBox">
          <div class="actionBodyWeb">
            <div class="actionTitle">Burn</div>
            <div class="actionDesc">
              <template v-if="isEthereumNetwork">
                Burn ℓUSD to unlock staked LINA. You can perform this on Binance
                Smart Chain network. &nbsp;<span
                  class="step"
                  @click="jumpToStep"
                  >STEP<img src="@/static/arrow_right.svg"
                /></span>
                .
              </template>
              <template v-else>
                Burn ℓUSD to unlock your staked assets
              </template>
            </div>
            <muticollateralSelector
              :selectedCollateral="selectedCollateral"
              :setSelectedCollateral="setSelectedCollateral"
            />
            <div class="actionRate" v-if="isBinanceNetwork">
              {{
                selectedCollateral !== undefined
                  ? "1 " + selectedCollateral.name
                  : "-"
              }}
              =
              {{
                selectedCollateral !== undefined
                  ? formatNumberFromBigNumber(burnData.LINA2USDBN, 4)
                  : "-"
              }}
              ℓUSD
            </div>
            <div
              class="actionInputItem"
              :class="{
                error: errors.unStakeMsg,
              }"
              @click="changeFocusItem(0)"
            >
              <div class="itemLeft">
                <div class="itemIcon">
                  <img
                    v-if="this.selectedCollateral == undefined"
                    :src="
                      theme == 'light'
                        ? require('@/static/LINA_logo.svg')
                        : require('@/static/LINA_logo_dark.svg')
                    "
                  />
                  <img
                    v-else-if="theme == 'dark'"
                    :src="require(`@/static/${selectedCollateral.darkimg}`)"
                  />
                  <img
                    v-else
                    :src="require(`@/static/${selectedCollateral.img}`)"
                  />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">
                    Unstake
                    {{
                      selectedCollateral !== undefined
                        ? selectedCollateral.name
                        : ""
                    }}
                    <Tooltip
                      max-width="305"
                      placement="top"
                      class="tip globalInfoStyle"
                      content="Amount of Assets unstaked may vary due to block times and price fluctuations in pledge tokens."
                      offset="0 4"
                    >
                      <img
                        v-if="theme === 'light'"
                        src="@/static/info_white.svg"
                      />
                      <img v-else src="@/static/dark-theme/info_white.svg" />
                    </Tooltip>
                  </div>
                  <div
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 0,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    v-if="isMobile"
                    @click="clickUnstakeMax"
                  >
                    Max
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput0"
                    :min="0"
                    :max="100000000000"
                    type="text"
                    v-model="inputData.unStake"
                    placeholder="0"
                    @on-change="changeUnStake"
                    @on-focus="inputFocus(0)"
                    @on-blur="inputBlur(0)"
                    :formatter="formatterInput"
                    :disabled="this.selectedCollateral == undefined"
                  />
                </div>
              </div>

              <div
                class="itemErrMsg"
                :style="{
                  opacity: errors.unStakeMsg ? '1' : '0',
                }"
              >
                {{ errors.unStakeMsg }}
              </div>
            </div>
            <div
              class="actionInputItem"
              :class="{
                error: errors.amountMsg,
              }"
              @click="changeFocusItem(1)"
            >
              <div class="itemLeft">
                <div class="itemIcon">
                  <img
                    v-if="theme === 'light'"
                    src="@/static/currency/lUSD.svg"
                  />
                  <img v-else src="@/static/dark-theme/currency/lUSD.svg" />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">Burn</div>
                  <div
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 1,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click="clickBurnMax"
                  >
                    Max
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput1"
                    :min="0"
                    :max="100000000000"
                    type="text"
                    v-model="inputData.amount"
                    @on-change="changeAmount"
                    @on-focus="inputFocus(1)"
                    @on-blur="inputBlur(1)"
                    placeholder="0"
                    :formatter="formatterInput"
                    :disabled="this.selectedCollateral == undefined"
                  />
                </div>
              </div>
              <div
                class="itemErrMsg"
                :style="{
                  opacity: errors.amountMsg ? '1' : '0',
                }"
              >
                {{ errors.amountMsg }}
              </div>
            </div>
            <div
              class="actionInputItem"
              :class="{
                error: errors.ratioMsg,
              }"
            >
              <div class="itemLeft">
                <div class="itemIcon">
                  <img v-if="theme === 'light'" src="@/static/percentage.svg" />
                  <img v-else src="@/static/dark-theme/percentage.svg" />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">P Ratio</div>
                  <div
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 2,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click="clickTargetRatio"
                  >
                    Target ratio
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput2"
                    :min="0"
                    :max="100000000000"
                    type="text"
                    v-model="inputData.ratio"
                    @on-change="changeRatio"
                    @on-focus="inputFocus(2)"
                    @on-blur="inputBlur(2)"
                    :placeholder="inputData.ratio == 0 ? '0' : 'N/A'"
                    :formatter="(value) => formatterInput(value, 0)"
                    :disabled="this.selectedCollateral == undefined"
                  />
                </div>
              </div>
              <div
                class="itemErrMsg"
                :style="{
                  opacity: errors.ratioMsg ? '1' : '0',
                }"
              >
                {{ errors.ratioMsg }}
              </div>
            </div>

            <gasEditor v-if="!isMobile && isBinanceNetwork"></gasEditor>
          </div>

          <div
            class="actionBodyMobile"
            :class="{
              allowScroll:
                errors.unStakeMsg || errors.ratioMsg || errors.amountMsg,
            }"
          >
            <div
              class="errMsg"
              :style="{
                display:
                  errors.unStakeMsg || errors.ratioMsg || errors.amountMsg
                    ? 'flex'
                    : 'none',
              }"
            >
              <img src="@/static/error.svg" />
              {{ errors.unStakeMsg }}
              {{ errors.ratioMsg }}
              {{ errors.amountMsg }}
              <img
                @click="closeErrorMobile"
                class="closeIcon"
                src="@/static/close_icon.svg"
              />
            </div>
            <muticollateralSelector
              :selectedCollateral="selectedCollateral"
              :setSelectedCollateral="setSelectedCollateral"
            />
            <div class="actionRate">
              {{
                selectedCollateral == undefined
                  ? "-"
                  : "1 " + selectedCollateral.name
              }}
              =
              {{
                selectedCollateral == undefined
                  ? "-"
                  : formatNumberFromBigNumber(burnData.LINA2USDBN, 4)
              }}
              ℓUSD
            </div>

            <div
              class="actionInputItem"
              :class="{
                error: errors.unStakeMsg,
              }"
              @click="changeFocusItem(3)"
            >
              <div class="itemLeft">
                <div class="itemIcon">
                  <img
                    v-if="this.selectedCollateral == undefined"
                    :src="
                      theme == 'light'
                        ? require('@/static/LINA_logo.svg')
                        : require('@/static/LINA_logo_dark.svg')
                    "
                  />
                  <img
                    v-else-if="theme == 'dark'"
                    :src="require(`@/static/${selectedCollateral.darkimg}`)"
                  />
                  <img
                    v-else
                    :src="require(`@/static/${selectedCollateral.img}`)"
                  />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">
                    Unstake
                    {{
                      selectedCollateral !== undefined
                        ? selectedCollateral.name
                        : ""
                    }}
                    <Tooltip
                      max-width="305"
                      placement="top"
                      class="tip globalInfoStyle"
                      content="Amount of Assets unstaked may vary due to block times and price fluctuations in pledge tokens."
                      offset="0 4"
                    >
                      <img
                        v-if="theme === 'light'"
                        src="@/static/info_white.svg"
                      />
                      <img v-else src="@/static/dark-theme/info_white.svg" />
                    </Tooltip>
                  </div>
                  <div
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 3,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    v-if="isMobile"
                    @click="clickUnstakeMax"
                  >
                    Max
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput3"
                    :min="0"
                    :max="100000000000"
                    type="text"
                    v-model="inputData.unStake"
                    placeholder="0"
                    @on-change="changeUnStake"
                    @on-focus="inputFocus(3)"
                    @on-blur="inputBlur(3)"
                    :formatter="formatterInput"
                    :disabled="this.selectedCollateral == undefined"
                  />
                </div>
              </div>

              <!-- <div
                class="itemErrMsg"
                :style="{
                  opacity: errors.unStakeMsg ? '1' : '0',
                }"
              >
                {{ errors.unStakeMsg }}
              </div> -->
            </div>

            <div
              class="actionInputItem"
              :class="{
                error: errors.amountMsg,
              }"
              @click="changeFocusItem(4)"
            >
              <div class="itemLeft">
                <div class="itemIcon">
                  <img
                    v-if="theme === 'light'"
                    src="@/static/currency/lUSD.svg"
                  />
                  <img v-else src="@/static/dark-theme/currency/lUSD.svg" />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">Burn</div>
                  <div
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 4,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click="clickBurnMax"
                  >
                    Max
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput4"
                    :min="0"
                    :max="100000000000"
                    type="text"
                    v-model="inputData.amount"
                    @on-change="changeAmount"
                    @on-focus="inputFocus(4)"
                    @on-blur="inputBlur(4)"
                    placeholder="0"
                    :formatter="formatterInput"
                    :disabled="this.selectedCollateral == undefined"
                  />
                </div>
              </div>
              <!-- <div
                class="itemErrMsg"
                :style="{
                  opacity: errors.amountMsg ? '1' : '0',
                }"
              >
                {{ errors.amountMsg }}
              </div> -->
            </div>

            <div
              class="actionInputItem"
              :class="{
                error: errors.ratioMsg,
              }"
              @click="changeFocusItem(5)"
            >
              <div class="itemLeft">
                <div class="itemIcon">
                  <img v-if="theme === 'light'" src="@/static/percentage.svg" />
                  <img v-else src="@/static/dark-theme/percentage.svg" />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">P Ratio</div>
                  <div
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 5,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click="clickTargetRatio"
                  >
                    Target ratio
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput5"
                    :min="0"
                    :max="100000000000"
                    type="text"
                    v-model="inputData.ratio"
                    @on-change="changeRatio"
                    @on-focus="inputFocus(5)"
                    @on-blur="inputBlur(5)"
                    :placeholder="inputData.ratio == 0 ? '0' : 'N/A'"
                    :formatter="(value) => formatterInput(value, 0)"
                    :disabled="this.selectedCollateral == undefined"
                  />
                </div>
              </div>
              <!-- <div
                class="itemErrMsg"
                :style="{
                  opacity: errors.ratioMsg ? '1' : '0',
                }"
              >
                {{ errors.ratioMsg }}
              </div> -->
            </div>

            <gasEditor v-if="isMobile && isBinanceNetwork"></gasEditor>
          </div>

          <div
            v-if="isBinanceNetwork"
            class="burnBtn"
            :class="{ disabled: burnDisabled }"
            @click="clickBurn"
          >
            BURN NOW
          </div>

          <div v-else class="burnBtn switchToBSC">
            Please switch to BSC network to burn your ℓ<span>USD</span>
          </div>

          <Spin fix v-if="processing"></Spin>
        </div>
      </TabPane>
      <TabPane name="m1">
        <watingEnhance
          class="waitingBox"
          v-if="this.actionTabs == 'm1' && isBinanceNetwork"
          :currentStep="confirmTransactionStep"
          :currentHash="confirmTransactionHash"
          :currentNetworkId="confirmTransactionNetworkId"
          :currentConfirm="confirmTransactionStatus"
          :currentErrMsg="transactionErrMsg"
          :setupArray="waitProcessArray"
          @tryAgain="waitTryAgain"
          @close="setDefaultTab"
        ></watingEnhance>
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
      <div class="title">Unstake Assets</div>
      <div class="context">
        Amount of Assets unstaked may vary due to block times and price
        fluctuations in pledge tokens.
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from "lodash";
import gasEditor from "@/components/gasEditor";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";

import {
  findParents,
  removeClass,
  addClass,
  formatterInput,
} from "@/common/utils";

import {
  bufferGasLimit,
  DEFAULT_GAS_LIMIT,
  isBinanceNetwork,
  isEthereumNetwork,
} from "@/assets/linearLibrary/linearTools/network";

import {
  formatByStoreCollateral,
  formatEtherToNumber,
  formatNumber,
  getAssetObjectInfo,
  parseUnitAndReformat,
  formatNumberFromBigNumber,
  replaceWaitProcessString,
} from "@/assets/linearLibrary/linearTools/format";

import { BigNumber, utils } from "ethers";

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
  n2bnForAsset,
} from "@/common/bnCalc";

import {
  storeDetailsData,
  getPriceRates,
  // getPriceRatesFromApi,
  getBuildRatio,
} from "@/assets/linearLibrary/linearTools/request";
import muticollateralSelector from "../../selector/muticollateralSelector.vue";

import {
  BUILD_PROCESS_SETUP,
  DECIMAL_PRECISION,
} from "@/assets/linearLibrary/linearTools/constants/process";
import { LINA } from "~/assets/linearLibrary/linearTools/constants/currency";

export default {
  name: "burn",
  data() {
    return {
      DECIMAL_PRECISION,
      formatNumberFromBigNumber,
      formatEtherToNumber,
      floor: _.floor, //向下取整
      actionTabs: "m0", //子页(m0默认,m1等待,m2成功,m3错误) Subpages(m0 default, m1 waiting)
      processing: false, //burn按钮防抖

      activeItemBtn: -1, //当前激活按钮 0 unstack max, 1 burn max

      confirmTransactionStep: -1, //当前交易进度
      confirmTransactionStatus: false, //当前交易确认状态
      confirmTransactionNetworkId: "", //当前交易确认网络id
      confirmTransactionHash: "", //当前交易hash
      transactionErrMsg: "", //交易错误信息
      waitProcessArray: [], //等待交易进度组
      waitProcessFlow: Function, //flow闭包函数

      introductActionModal: false,

      //输入框展示数据
      inputData: {
        unStake: null,
        amount: null,
        ratio: 0,
      },

      //真实操作数据
      actionDatas: {
        unStake: n2bn("0"),
        amount: n2bn("0"),
        ratio: 0,
      },

      errors: {
        unStakeMsg: "",
        amountMsg: "",
        ratioMsg: "",
      },

      burnData: {
        LINA: 0,
        LINA2USD: 0,
        staked: 0,
        lock: 0,
        lUSD: 0,
        debt: 0,
        targetRatio: 400,
        currentRatio: 0,
      },

      formatterInput,
      chainChangeFromSubscribe: "",
      selectedCollateral: undefined,
    };
  },
  components: {
    gasEditor,
    muticollateralSelector,
  },

  watch: {
    walletAddress() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    isMobile() {},
    selectedCollateral() {
      this.getBurnData();
    },
  },
  computed: {
    //burn按钮禁止状态
    burnDisabled() {
      return (
        (_.lte(this.inputData.unStake, 0) && _.lte(this.inputData.amount, 0)) ||
        this.errors.unStakeMsg ||
        this.errors.amountMsg ||
        this.errors.ratioMsg ||
        this.processing ||
        (!this.burnData.staked && !this.burnData.lock)
      );
    },

    walletAddress() {
      return this.$store.state?.wallet?.address;
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

    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },

    isMobile() {
      return this.$store.state?.isMobile;
    },
    theme() {
      return this.$store.state.theme;
    },
  },
  async created() {
    this.isBinanceNetwork && this.getBurnData(this.walletAddress);

    //监听链切换
    this.chainChangeFromSubscribe = this.$pub.subscribe(
      "onWalletChainChange",
      async () => {
        if (this.actionTabs == "m0") {
          await this.getBurnData(this.walletAddress);
        }
      }
    );
  },
  destroyed() {
    if (this.chainChangeFromSubscribe) {
      this.$pub.unsubscribe(this.chainChangeFromSubscribe);
      this.chainChangeFromSubscribe = "";
    }
  },
  methods: {
    closeErrorMobile() {
      this.errors.stakeMsg = "";
      this.errors.amountMsg = "";
      this.errors.ratioMsg = "";
    },
    //获取数据
    async getBurnData(walletAddress) {
      try {
        this.processing = true;

        this.processing = true;
        const walletAddress = this.walletAddress;

        if (walletAddress === undefined) return;
        if (this.selectedCollateral === undefined) return;

        const {
          lnrJS: { lUSD, LnRewardLocker },
          utils,
        } = lnrJSConnector;

        const LnDebtSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnDebtSystem;
        const LnCollateralSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnCollateralSystem;
        const LINABytes = utils.formatBytes32String(
          this.selectedCollateral.contractKey
        );
        const LinearFinance =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LinearFinance;

        const results = await Promise.all([
          LnCollateralSystem.userCollateralData(walletAddress, LINABytes), //ATH抵押数量
          LnRewardLocker.balanceOf(walletAddress),
          lUSD.balanceOf(walletAddress), //lUSD余额
          LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress),
          getBuildRatio(this.selectedCollateral.key), //目标抵押率
          LinearFinance.balanceOf(walletAddress), //Collateral余额
          LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress), //总债务
        ]);

        const [
          stakingLina,
          lockLina,
          amountlUSDForColl,
          totalCollateralInUsd,
          buildRatioForCurrentPercent,
          avaliableLINA,
          amountDebtUnformat,
        ] = results.map(formatByStoreCollateral);

        const amountDebt = formatEtherToNumber(
          await LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress)
        );

        const amountlUSD = formatEtherToNumber(
          await lUSD.balanceOf(walletAddress)
        );

        let currentRatioPercent = n2bn("0");
        const buildRatio = await getBuildRatio(this.selectedCollateral.key);

        if (results[3].gt("0") && results[6][0].gt("0")) {
          currentRatioPercent = bnMul(
            bnDiv(results[3], results[6][0]),
            n2bn("100")
          );
        }

        const targetRatioPercent =
          this.selectedCollateral.key == LINA
            ? 100 / formatEtherToNumber(buildRatio)
            : 100 * buildRatio;

        const priceRateKey = this.selectedCollateral.contractKey;
        const priceRates = await getPriceRates([priceRateKey, "lUSD"]);
        // const priceRates = await getPriceRatesFromApi(["LINA", "lUSD"]);

        const LINAPrice = priceRates[priceRateKey] / priceRates.lUSD;
        const LINAPriceBN = bnDiv(priceRates[priceRateKey], priceRates.lUSD);

        this.burnData.LINA = _.floor(avaliableLINA, 4);
        this.burnData.LINABN = results[5];

        this.burnData.LINA2USD = _.floor(LINAPrice, 4);
        this.burnData.LINA2USDBN = LINAPriceBN;

        this.burnData.staked = _.floor(stakingLina, 4);
        this.burnData.stakedBN = results[0];

        this.burnData.lock = _.floor(lockLina, 4);

        if (this.selectedCollateral.key == LINA) {
          this.burnData.lockBN = results[1];
        } else {
          this.burnData.lockBN = n2bnForAsset("0");
        }

        this.burnData.lUSD = _.floor(amountlUSD, 4);
        this.burnData.lUSDBN = results[2];

        this.burnData.debt = _.floor(amountDebt[0], 4);
        this.burnData.debtBN = results[6][0];

        this.burnData.targetRatio = targetRatioPercent;
        this.burnData.currentRatio =
          formatByStoreCollateral(currentRatioPercent);
        this.burnData.currentRatioBN = currentRatioPercent;

        //获取当前抵押率
        this.inputData.ratio = this.burnData.currentRatio;
        this.inputData.unstake = null;
        this.inputData.amount = null;
        this.errors.unStakeMsg = "";
        this.errors.amountMsg = "";
        this.errors.ratioMsg = "";
      } catch (e) {
        console.log(e, "getBurnData err");
      } finally {
        this.processing = false;
      }
    },

    //点击 burn
    async clickBurn() {
      const minCollateral = getAssetObjectInfo(
        this.selectedCollateral.key
      ).minCollateral;

      if (!this.burnDisabled) {
        try {
          if (this.isEthereumNetwork) {
            return;
            // this.actionTabs = "m1"; //进入swap流程
          } else if (this.isBinanceNetwork) {
            this.processing = true;

            //清空之前数据
            this.waitProcessArray = [];

            if (
              this.actionDatas.amount.gte(n2bn(minCollateral)) &&
              this.actionDatas.unStake.gte(n2bn("0.01"))
            ) {
              if (
                BUILD_PROCESS_SETUP.BURN_UNSTAKING.includes(
                  "[REPLACE_CURRENCY]"
                )
              ) {
                BUILD_PROCESS_SETUP.BURN_UNSTAKING = _.replace(
                  BUILD_PROCESS_SETUP.BURN_UNSTAKING,
                  "[REPLACE_CURRENCY]",
                  this.selectedCollateral.name
                );
              } else {
                BUILD_PROCESS_SETUP.BURN_UNSTAKING = replaceWaitProcessString(
                  BUILD_PROCESS_SETUP.BURN_UNSTAKING,
                  this.selectedCollateral.name
                );
              }
              this.waitProcessArray.push(BUILD_PROCESS_SETUP.BURN_UNSTAKING);
            } else {
              if (this.actionDatas.amount.gte(n2bn("0.01"))) {
                //需要先burn

                this.waitProcessArray.push(BUILD_PROCESS_SETUP.BURN);
              }

              if (this.actionDatas.unStake.gte(n2bn("0.01"))) {
                if (
                  BUILD_PROCESS_SETUP.UNSTAKING.includes("[REPLACE_CURRENCY]")
                ) {
                  BUILD_PROCESS_SETUP.UNSTAKING = _.replace(
                    BUILD_PROCESS_SETUP.UNSTAKING,
                    "[REPLACE_CURRENCY]",
                    this.selectedCollateral.name
                  );
                } else {
                  BUILD_PROCESS_SETUP.UNSTAKING = replaceWaitProcessString(
                    BUILD_PROCESS_SETUP.UNSTAKING,
                    this.selectedCollateral.name
                  );
                }
                this.waitProcessArray.push(BUILD_PROCESS_SETUP.UNSTAKING);
              }
            }
            this.confirmTransactionStep = 0;
            this.actionTabs = "m1"; //进入等待页

            this.waitProcessFlow = this.startFlow();

            //开始逻辑流处理函数
            await this.waitProcessFlow();
          }
        } catch (e) {
          this.transactionErrMsg = "Something went wrong, please try again.";
        } finally {
          this.processing = false;
        }
      }

      this.processing = false;
    },

    //开始逻辑流
    startFlow() {
      return async () => {
        try {
          this.transactionErrMsg = "";

          if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            BUILD_PROCESS_SETUP.BURN_UNSTAKING
          ) {
            await this.burnAndUnstakeMax({
              burnAmount: this.actionDatas.amount,
              unstakeAmount: this.actionDatas.unStake,
            });
          } else if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            BUILD_PROCESS_SETUP.BURN
          ) {
            await this.burn(this.actionDatas.amount);
          } else if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            BUILD_PROCESS_SETUP.UNSTAKING
          ) {
            await this.unstake(this.actionDatas.unStake);
          }
        } catch (error) {
          console.log(error, "startFlow");
          //自定义错误
          if (_.has(error, "code") && [6100004, 6100005].includes(error.code)) {
            this.transactionErrMsg = error.message;
          } else {
            //通用错误
            this.transactionErrMsg = "Something went wrong, please try again.";
          }
        }
      };
    },

    //burn
    async burnAndUnstakeMax(
      { burnAmount, unstakeAmount } = {
        burnAmount: n2bn("0"),
        unstakeAmount: n2bn("0"),
      }
    ) {
      this.confirmTransactionStatus = false;
      this.confirmTransactionNetworkId = this.walletNetworkId;

      //burn多一点点,防止unstake出错
      let tempBurnAmount = n2bnForAsset(_.ceil(bn2n(burnAmount), 2));
      if (tempBurnAmount.lte(this.burnData.lUSDBN)) {
        burnAmount = tempBurnAmount;
      }
      //unstake少一点,防止出错
      unstakeAmount = n2bnForAsset(_.floor(bn2n(unstakeAmount), 4));

      const { utils } = lnrJSConnector;

      const LnCollateralSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnCollateralSystem;
      const burnGasLimit = await this.getBurnAndUnstakeGasEstimateMax(
        burnAmount,
        unstakeAmount
      );
      let transaction = await LnCollateralSystem.burnAndUnstakeMax(
        burnAmount,
        utils.formatBytes32String(this.selectedCollateral.contractKey),
        {
          gasPrice: this.$store.state?.gasDetails?.price,
          gasLimit: burnGasLimit,
        }
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.BURN,
          networkId: this.walletNetworkId,
          value: `Burn ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100004,
            message: "Something went wrong while burn ℓUSD, please try again.",
          };
        }

        //成功后累加当前进度
        this.confirmTransactionStep += 1;
      }
    },

    //burn
    async burn(burnAmount) {
      this.confirmTransactionStatus = false;
      this.confirmTransactionNetworkId = this.walletNetworkId;

      let tempBurnAmount = n2bnForAsset(_.ceil(bn2n(burnAmount), 2));
      if (tempBurnAmount.lte(this.burnData.lUSDBN)) {
        burnAmount = tempBurnAmount;
      }

      const { utils } = lnrJSConnector;
      const LnBuildBurnSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnBuildBurnSystem;
      const burnGasLimit = await this.getBurnGasEstimate(burnAmount);

      let transaction = await LnBuildBurnSystem.BurnAsset(burnAmount, {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: burnGasLimit,
      });

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.BURN,
          networkId: this.walletNetworkId,
          value: `Burn ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100004,
            message: "Something went wrong while burn ℓUSD, please try again.",
          };
        }

        //成功后累加当前进度
        this.confirmTransactionStep += 1;
      }
    },

    //unstake
    async unstake(unstakeAmount) {
      this.confirmTransactionStatus = false;
      this.confirmTransactionNetworkId = this.walletNetworkId;

      //unstake少一点,防止出错
      unstakeAmount = n2bn(_.floor(bn2n(unstakeAmount), 4));

      unstakeAmount = n2bn(_.floor(bn2n(unstakeAmount), 4));

      const { utils } = lnrJSConnector;
      const unstakeGasLimit = await this.getUnstakeGasEstimate(unstakeAmount);

      const LnCollateralSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnCollateralSystem;

      let transaction = await LnCollateralSystem.Redeem(
        utils.formatBytes32String(this.selectedCollateral.contractKey),
        unstakeAmount,
        {
          gasPrice: this.$store.state?.gasDetails?.price,
          gasLimit: unstakeGasLimit,
        }
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.UNSTAKING,
          networkId: this.walletNetworkId,
          value: `Burn ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });

        //等待交易结果返回
        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100005,
            message:
              "Something went wrong while unstaking your asset, please try again.",
          };
        }

        //成功后累加当前进度
        this.confirmTransactionStep += 1;
      }
    },

    //评估 二合一 gas
    async getBurnAndUnstakeGasEstimateMax(burnAmount, unstakeAmount) {
      try {
        const { utils } = lnrJSConnector;
        const LnCollateralSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnCollateralSystem;

        if (
          burnAmount.lte("0") &&
          unstakeAmount.lte("0") //小于等于0
        ) {
          throw new Error("invalid input");
        }
        let gasEstimate =
          await LnCollateralSystem.estimateGas.burnAndUnstakeMax(
            burnAmount,
            utils.formatBytes32String(this.selectedCollateral.contractKey)
          );
        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.burn);
      }
    },

    //评估 burn gas
    async getBurnGasEstimate(burnAmount) {
      try {
        const LnBuildBurnSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnBuildBurnSystem;
        let gasEstimate = await LnBuildBurnSystem.estimateGas.BurnAsset(
          burnAmount
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.burn);
      }
    },

    //评估 unstake gas
    async getUnstakeGasEstimate(unstakeAmount) {
      try {
        const { utils } = lnrJSConnector;
        const LnCollateralSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnCollateralSystem;

        let gasEstimate = await LnCollateralSystem.estimateGas.Redeem(
          utils.formatBytes32String(this.selectedCollateral.contractKey),
          unstakeAmount
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        console.log(e);
        return bufferGasLimit(DEFAULT_GAS_LIMIT.unstake);
      }
    },

    async waitTryAgain() {
      await this.waitProcessFlow();
    },

    //重置错误信息
    resetErrorsMsg() {
      this.errors = {
        unStakeMsg: "",
        amountMsg: "",
        ratioMsg: "",
      };
    },

    //重置输入框状态
    resetInputData() {
      //输入框展示数据
      this.inputData = {
        unStake: null,
        amount: null,
        ratio: 0,
      };

      //真实操作数据
      this.actionDatas = {
        unStake: n2bn("0"),
        amount: n2bn("0"),
        ratio: 0,
      };
    },

    //改变激活元素
    changeFocusItem(index) {
      // this.activeItem = index;
      this.$nextTick(() => {
        this.$refs["itemInput" + index].$el.querySelector("input").focus();
      });
    },

    //获取焦点
    //Choose current inputbox
    inputFocus(index) {
      this.$nextTick(() => {
        let currentElement = this.$refs["itemInput" + index].$el;
        let parentElement = findParents(currentElement, "actionInputItem");
        addClass(parentElement, "active");
      });
    },

    //失去焦点
    inputBlur(index) {
      this.$nextTick(() => {
        let currentElement = this.$refs["itemInput" + index].$el;
        let parentElement = findParents(currentElement, "actionInputItem");
        removeClass(parentElement, "active");
      });
    },

    test() {
      let overStaked = bnMul(
        this.burnData.stakedBN,
        bnDiv(
          bnSub(
            this.burnData.currentRatioBN,
            n2bn(this.burnData.targetRatio.toString())
          ),
          this.burnData.currentRatioBN
        )
      );
    },

    //点击 Unstake Max 取回本金，不够lUSD就报错
    clickUnstakeMax() {
      try {
        this.activeItemBtn = 0;

        if (this.isBinanceNetwork) {
          this.unstakeMax = true;
          this.resetErrorsMsg();
          this.resetInputData();

          if (this.burnData.stakedBN.eq("0")) {
            this.errors.unStakeMsg = ` There is no ${this.selectedCollateral.name} staked on the contract.`;
            return;
          }

          if (this.burnData.lockBN.eq("0")) {
            //没有lock lina
            if (this.burnData.lUSDBN.eq("0") && this.burnData.debtBN.gt("0")) {
              this.errors.unStakeMsg = "You don't have enough amount of ℓUSD.";
              return;
            }

            if (this.burnData.lUSDBN.gte(this.burnData.debtBN)) {
              //lUSD大于债务
              //lUSD足够还清债务则销毁债务数量的lUSD则可取回所有LINA
              this.inputData.unStake = formatEtherToNumber(
                this.burnData.stakedBN
              );
              this.inputData.amount = formatEtherToNumber(this.burnData.debtBN);
              this.inputData.ratio = null;

              this.actionDatas.unStake = this.burnData.stakedBN;
              this.actionDatas.amount = this.burnData.debtBN;
              this.actionDatas.ratio = null;
            } else {
              //lUSD不足还清债务则报错
              this.errors.unStakeMsg = "You don't have enough amount of ℓUSD.";
            }
          } else {
            //有lock lina
            //计算当前价格的lock lina能生成多少lusd
            let lockLINAToLUSDBN = this.burnData.lockBN.mul(
              this.burnData.LINA2USDBN
            );

            let lockLINAToBuildLUSDBN = this.burnData.lockBN
              .mul(this.burnData.LINA2USDBN)
              .div(n2bnForAsset((this.burnData.targetRatio / 100).toString()));
            if (this.burnData.debtBN.lte(lockLINAToBuildLUSDBN)) {
              //债务 <= lockLINAToLUSDBN 时，则可以直接解锁所有stake lina

              this.inputData.unStake = formatEtherToNumber(
                this.burnData.stakedBN
              );

              this.inputData.amount = formatEtherToNumber(this.burnData.debtBN);

              this.actionDatas.unStake = this.burnData.stakedBN;

              this.actionDatas.amount = this.burnData.debtBN;

              if (this.burnData.debtBN.eq("0")) {
                //没有债务
                this.inputData.ratio = 0;
                this.actionDatas.ratio = n2bn(0);
              } else {
                //有债务
                this.inputData.ratio = formatByStoreCollateral(
                  bnDiv(lockLINAToLUSDBN, this.burnData.debtBN)
                );
                this.actionDatas.ratio = bnDiv(
                  lockLINAToLUSDBN,
                  this.burnData.debtBN
                );
              }
            } else {
              let stakeDebt = this.burnData.debtBN.sub(lockLINAToBuildLUSDBN); //取回所有stake所需还的债务

              if (this.burnData.lUSDBN.gte(stakeDebt)) {
                //lUSD足够还清债务则销毁债务数量的lUSD则可取回所有LINA
                this.inputData.unStake = formatEtherToNumber(
                  this.burnData.stakedBN
                );
                this.inputData.amount = formatEtherToNumber(stakeDebt);
                this.inputData.ratio =
                  formatEtherToNumber(
                    lockLINAToLUSDBN.div(lockLINAToBuildLUSDBN)
                  ) * 100;

                this.actionDatas.unStake = this.burnData.stakedBN;
                this.actionDatas.amount = stakeDebt;
                this.actionDatas.ratio = bnDiv(
                  lockLINAToLUSDBN,
                  lockLINAToBuildLUSDBN
                );
              } else {
                //lUSD不足还清债务则报错
                this.errors.unStakeMsg =
                  "You don't have enough amount of ℓUSD.";
              }
            }
          }
        }
      } catch (error) {}
    },

    //点击 Burn Max 销毁lUSD，取回能取回的最大本金
    clickBurnMax() {
      try {
        this.activeItemBtn = 1;

        if (this.isBinanceNetwork) {
          this.resetErrorsMsg();
          this.resetInputData();

          if (this.burnData.stakedBN.eq("0") && this.burnData.lockBN.eq("0")) {
            this.errors.unStakeMsg = ` There is no ${this.selectedCollateral.name} staked on the contract.`;
            return;
          }

          if (this.burnData.lUSDBN.eq("0")) {
            this.errors.amountMsg = "You don't have enough amount of ℓUSD.";
            return;
          }

          if (this.burnData.lUSDBN.gte(this.burnData.debtBN)) {
            //lUSD >= debt
            this.inputData.unStake = formatByStoreCollateral(
              this.burnData.stakedBN
            );
            this.inputData.amount = formatEtherToNumber(this.burnData.debtBN);
            this.inputData.ratio = null;

            this.actionDatas.unStake = n2bnForAsset(
              formatByStoreCollateral(this.burnData.stakedBN)
            );
            this.actionDatas.amount = this.burnData.debtBN;
            this.actionDatas.ratio = null;
          } else {
            //lUSD < debt
            this.inputData.amount = formatEtherToNumber(this.burnData.lUSDBN);
            this.actionDatas.amount = this.burnData.lUSDBN;

            let ratioAfterBurn = n2bnForAsset("0");

            //lUSD不足还清所有债务，则计算销毁所有lUSD后的抵押率，大于目标则解锁大于部分，小于等于则不解锁LINA
            ratioAfterBurn = bnMul(
              bnDiv(
                bnMul(
                  bnAdd(
                    parseUnitAndReformat(this.burnData.stakedBN),
                    parseUnitAndReformat(this.burnData.lockBN)
                  ),
                  // this.burnData.LINA2USDBN
                  parseUnitAndReformat(this.burnData.LINA2USDBN, false)
                ),
                bnSub(
                  parseUnitAndReformat(this.burnData.debtBN),
                  parseUnitAndReformat(this.burnData.lUSDBN)
                )
              ),
              n2bnForAsset("100")
            );

            if (ratioAfterBurn.gt(n2bn(this.burnData.targetRatio.toString()))) {
              //销毁后大于 target ratio
              let allCanUnstakeAfterBurn = bnMul(
                n2bnForAsset(
                  formatByStoreCollateral(
                    bnAdd(this.burnData.stakedBN, this.burnData.lockBN)
                  )
                ),
                bnDiv(
                  bnSub(
                    ratioAfterBurn,
                    n2bnForAsset(this.burnData.targetRatio.toString())
                  ),
                  ratioAfterBurn
                )
              );

              if (allCanUnstakeAfterBurn.lte(this.burnData.stakedBN)) {
                // <= stake
                this.inputData.unStake = formatEtherToNumber(
                  allCanUnstakeAfterBurn
                );
                this.actionDatas.unStake = allCanUnstakeAfterBurn;
              } else {
                // > stake
                this.inputData.unStake = formatEtherToNumber(
                  this.burnData.stakedBN
                );
                this.actionDatas.unStake = this.burnData.stakedBN;
              }
            } else {
              //销毁后小于等于 target ratio
              this.inputData.unStake = 0;
              this.actionDatas.unStake = n2bnForAsset("0");
            }
            // let pratioAfterBurnAndStake = bnMul(
            //                                 bnDiv(
            //                                     bnMul(
            //                                         bnSub(
            //                                             bnAdd(
            //                                                 this.burnData.stakedBN,
            //                                                 this.burnData.lockBN
            //                                             ),
            //                                             this.actionDatas.unStake
            //                                         ),
            //                                         this.burnData.LINA2USDBN
            //                                     ),
            //                                     bnSub(
            //                                         this.burnData.debtBN,
            //                                         this.burnData.lUSDBN
            //                                     )
            //                                 ),
            //                                 n2bn('100')
            //                             );

            // this.inputData.ratio = formatEtherToNumber(pratioAfterBurnAndStake);
            // this.actionDatas.ratio = pratioAfterBurnAndStake;

            this.inputData.ratio = this.burnData.targetRatio;
            this.actionDatas.ratio = n2bnForAsset(
              this.burnData.targetRatio.toString()
            );
          }
        }
      } catch (error) {}
    },

    //点击target
    clickTargetRatio() {
      try {
        this.activeItemBtn = 2;

        if (this.isBinanceNetwork) {
          this.resetErrorsMsg();
          this.resetInputData();

          //没有债务
          if (this.burnData.debtBN.eq("0")) {
            this.errors.ratioMsg = "There is no debt.";
            return;
          }

          if (
            this.burnData.currentRatioBN.gt(
              n2bn(this.burnData.targetRatio.toString())
            )
          ) {
            //下调抵押率，当前抵押率大于目标抵押率，销毁LINA到抵押率刚好
            let needUnstake = bnMul(
              bnAdd(
                parseUnitAndReformat(this.burnData.stakedBN),
                parseUnitAndReformat(this.burnData.lockBN)
              ),
              bnDiv(
                bnSub(
                  parseUnitAndReformat(this.burnData.currentRatioBN),
                  n2bnForAsset(this.burnData.targetRatio.toString())
                ),
                parseUnitAndReformat(this.burnData.currentRatioBN)
              )
            );

            if (
              parseUnitAndReformat(needUnstake, false).lte(
                parseUnitAndReformat(this.burnData.stakedBN)
              )
            ) {
              // <= stake
              this.inputData.unStake = formatEtherToNumber(needUnstake);
              this.actionDatas.unStake = needUnstake;
            } else {
              // > stake
              this.inputData.unStake = formatEtherToNumber(
                this.burnData.stakedBN
              );
              this.actionDatas.unStake = this.burnData.stakedBN;
            }
            this.inputData.amount = formatEtherToNumber(0);
            this.inputData.ratio = this.burnData.targetRatio;

            this.actionDatas.amount = n2bn("0");
            this.actionDatas.ratio = this.burnData.targetRatio;
          } else if (
            this.burnData.currentRatioBN.lt(
              n2bn(this.burnData.targetRatio.toString())
            )
          ) {
            //上调抵押率，看当前抵押率上调到目标抵押率需要还多少债务，如果lUSD余额大于等于要还的则销毁，低于则报错
            let retainlUSD = n2bn("0"),
              burnlUSD = n2bn("0"); //上调抵押率需要保留/销毁多少lUSD

            retainlUSD = bnDiv(
              bnMul(
                bnAdd(
                  parseUnitAndReformat(this.burnData.stakedBN),
                  parseUnitAndReformat(this.burnData.lockBN)
                ),
                parseUnitAndReformat(this.burnData.LINA2USDBN, false)
              ),
              n2bnForAsset((this.burnData.targetRatio / 100).toString())
            );

            burnlUSD = bnSub(this.burnData.debtBN, retainlUSD);

            if (this.burnData.lUSDBN.lt(burnlUSD)) {
              this.errors.ratioMsg = "You don't have enough amount of ℓUSD.";
            }

            this.inputData.unStake = 0;
            this.inputData.amount = formatEtherToNumber(burnlUSD);
            this.inputData.ratio = this.burnData.targetRatio;

            this.actionDatas.unStake = n2bn("0");
            this.actionDatas.amount = burnlUSD;
            this.actionDatas.ratio = n2bnForAsset(
              this.burnData.targetRatio.toString()
            );
          } else {
            //抵押率刚好则不动
            this.inputData.unStake = 0;
            this.inputData.amount = 0;
            this.inputData.ratio = this.burnData.currentRatio;
          }
        }
      } catch (error) {}
    },

    //输入要解锁LINA数量
    changeUnStake(unstakedAmount) {
      try {
        if (this.isBinanceNetwork) {
          this.resetErrorsMsg();
          if (this.burnData.stakedBN.eq("0")) {
            this.errors.unStakeMsg = ` There is no ${this.selectedCollateral.name} staked on the contract.`;
            return;
          }

          if (!unstakedAmount) {
            this.errors.unStakeMsg =
              this.errors.unStakeMsg = `You can't unstake the amount of ${this.selectedCollateral.name} above.`;
            return;
          } else {
            this.errors.unStakeMsg = "";
          }

          //一个LINA都解锁不了
          if (n2bn(unstakedAmount.toString()).gt(this.burnData.stakedBN)) {
            this.inputData.unStake = unstakedAmount;
            this.errors.unStakeMsg = `You can't unstake the amount of ${this.selectedCollateral.name} above.`;
            return;
          }

          //一个LINA都解锁不了
          if (
            this.burnData.lUSDBN.eq("0") &&
            this.burnData.currentRatioBN.lte(
              n2bn(this.burnData.targetRatio.toString())
            ) &&
            this.burnData.currentRatioBN.gt(n2bn("0"))
          ) {
            this.inputData.unStake = unstakedAmount;
            this.errors.unStakeMsg = "You don't have enough amount of ℓUSD.";
            return;
          }

          //没有债务直接解锁
          if (this.burnData.debtBN.eq("0")) {
            this.inputData.unStake = unstakedAmount;
            this.actionDatas.unStake = n2bn(unstakedAmount.toString());

            return;
          }

          //当前价格的lock lina能生成多少lusd
          let lockLINAToBuildLUSDBN = bnDiv(
            bnMul(
              parseUnitAndReformat(this.burnData.lockBN),
              parseUnitAndReformat(this.burnData.LINA2USDBN, false)
            ),
            n2bnForAsset((this.burnData.targetRatio / 100).toString())
          );
          //取回所有stake所需还的债务
          let stakeDebt = bnSub(this.burnData.debtBN, lockLINAToBuildLUSDBN);

          let allCanUnstakeAfterBurn = n2bn("0");

          //判断输入的值是否超过能解锁的最大LINA
          //够lUSD还债，则可以解锁所有LINA
          if (this.burnData.lUSDBN.gte(stakeDebt)) {
            allCanUnstakeAfterBurn = this.burnData.stakedBN;
          } else {
            //lUSD不足还清所有债务，则计算销毁所有lUSD后的抵押率，大于目标则解锁大于部分，小于等于则不解锁LINA
            let ratioAfterBurn = bnMul(
              bnDiv(
                bnMul(
                  parseUnitAndReformat(
                    bnAdd(
                      parseUnitAndReformat(this.burnData.stakedBN),
                      parseUnitAndReformat(this.burnData.lockBN)
                    )
                  ),
                  // this.burnData.LINA2USDBN
                  parseUnitAndReformat(this.burnData.LINA2USDBN, false)
                ),
                bnSub(
                  parseUnitAndReformat(this.burnData.debtBN),
                  parseUnitAndReformat(this.burnData.lUSDBN)
                )
              ),
              n2bnForAsset("100")
            );

            //销毁所有lUSD后抵押率不超过目标抵押率，则不能解锁LINA
            if (
              ratioAfterBurn.lte(n2bn(this.burnData.targetRatio.toString()))
            ) {
              this.inputData.unStake = unstakedAmount;
              this.errors.unStakeMsg = "You don't have enough amount of ℓUSD.";
              return;
            }

            //用销毁所有lUSD后超额的抵押率算
            allCanUnstakeAfterBurn = bnMul(
              bnAdd(
                parseUnitAndReformat(this.burnData.stakedBN),
                parseUnitAndReformat(this.burnData.lockBN)
              ),
              bnDiv(
                bnSub(
                  ratioAfterBurn,
                  n2bnForAsset(this.burnData.targetRatio.toString())
                ),
                ratioAfterBurn
              )
            );
          }

          if (n2bn(unstakedAmount.toString()).gt(allCanUnstakeAfterBurn)) {
            this.inputData.unStake = unstakedAmount;
            this.errors.unStakeMsg = "You don't have enough amount of ℓUSD.";
            return;
          }

          let overStaked = bnMul(
            parseUnitAndReformat(
              bnAdd(
                parseUnitAndReformat(this.burnData.stakedBN),
                parseUnitAndReformat(this.burnData.lockBN)
              )
            ),
            bnDiv(
              bnSub(
                this.burnData.currentRatioBN,
                n2bnForAsset(this.burnData.targetRatio.toString())
              ),
              this.burnData.currentRatioBN
            )
          );
          if (overStaked.lt("0")) {
            overStaked = n2bn("0");
          }

          let needFixRatio = n2bn("0");

          //需要先修复抵押率
          if (
            this.burnData.currentRatioBN.lt(
              n2bn(this.burnData.targetRatio.toString())
            )
          ) {
            let retainlUSD = bnDiv(
              bnMul(
                parseUnitAndReformat(
                  bnAdd(this.burnData.stakedBN, this.burnData.lockBN)
                ),
                // this.burnData.LINA2USDBN
                parseUnitAndReformat(this.burnData.LINA2USDBN, false)
              ),
              n2bnForAsset((this.burnData.targetRatio / 100).toString())
            );

            needFixRatio = bnSub(this.burnData.debtBN, retainlUSD);
          }

          let needBurnAmount = n2bn("0");

          if (n2bn(unstakedAmount.toString()).gt(overStaked)) {
            needBurnAmount = bnDiv(
              bnMul(
                parseUnitAndReformat(
                  bnSub(n2bn(unstakedAmount.toString()), overStaked)
                ),
                // this.burnData.LINA2USDBN
                parseUnitAndReformat(this.burnData.LINA2USDBN, false)
              ),
              n2bnForAsset((this.burnData.targetRatio / 100).toString())
            );
          }

          this.inputData.unStake = unstakedAmount;
          this.actionDatas.unStake = n2bnForAsset(unstakedAmount.toString());
          this.inputData.amount = formatEtherToNumber(
            bnAdd(needBurnAmount, needFixRatio)
          );
          this.actionDatas.amount = bnAdd(needBurnAmount, needFixRatio);

          if (n2bn(unstakedAmount.toString()).eq(this.burnData.stakedBN)) {
            this.inputData.ratio = null;
            this.actionDatas.ratio = n2bn("0");
          } else {
            let ratioAfterAction = bnMul(
              bnDiv(
                bnMul(
                  bnSub(
                    bnAdd(
                      parseUnitAndReformat(this.burnData.stakedBN),
                      parseUnitAndReformat(this.burnData.lockBN)
                    ),
                    this.actionDatas.unStake
                  ),
                  parseUnitAndReformat(this.burnData.LINA2USDBN, false)
                ),
                bnSub(this.burnData.debtBN, this.actionDatas.amount)
              ),
              n2bnForAsset("100")
            );

            //修复除不尽的显示错误
            const targetRatio =
              getAssetObjectInfo(this.selectedCollateral.key).targetRatio * 100;
            //修复除不尽的显示错误
            if (ratioAfterAction.lt(n2bnForAsset(targetRatio))) {
              ratioAfterAction = n2bnForAsset(targetRatio);
            }

            this.inputData.ratio = formatEtherToNumber(ratioAfterAction);
            this.actionDatas.ratio = ratioAfterAction;

            //this.inputData.ratio = this.burnData.targetRatio;
            //this.actionDatas.ratio = n2bn(this.burnData.targetRatio.toString());
          }
        }
      } catch (error) {
        console.error(error);
        this.errors.unStakeMsg = "Invalid number";
      }
    },

    //输入要销毁lUSD数量
    changeAmount(burnAmount) {
      try {
        if (this.isBinanceNetwork) {
          this.resetErrorsMsg();
          // this.resetInputData();

          if (!burnAmount || this.burnData.lUSDBN.eq("0")) {
            this.errors.amountMsg = "You can't burn the amount of ℓUSD.";
            return;
          }

          if (this.burnData.debtBN.eq("0")) {
            this.errors.amountMsg = "There is no debt.";
            return;
          }

          if (n2bnForAsset(burnAmount.toString()).gt(this.burnData.debtBN)) {
            this.inputData.amount = burnAmount;
            this.errors.amountMsg =
              "The amount of ℓUSD is larger than your debt.";
            // this.inputData.ratio = null;
            return;
          }

          if (n2bnForAsset(burnAmount.toString()).gt(this.burnData.lUSDBN)) {
            this.inputData.amount = burnAmount;
            this.errors.amountMsg = "You don't have enough amount of ℓUSD.";
            this.inputData.ratio = null;
            return;
          }

          let ratioAfterBurnInputAmount = n2bn("0");
          // below code added for if input amount is same as debt
          if (n2bnForAsset(burnAmount.toString()).eq(this.burnData.debtBN)) {
            ratioAfterBurnInputAmount = null;
            this.inputData.ratio = null;
            this.actionDatas.ratio = null;
            this.inputData.unStake = formatByStoreCollateral(
              this.burnData.stakedBN
            );
            this.actionDatas.unStake = n2bnForAsset(
              formatByStoreCollateral(this.burnData.stakedBN)
            );
            this.actionDatas.amount = this.burnData.debtBN;
            this.inputData.amount = formatEtherToNumber(this.burnData.debtBN);
            return;
          } else {
            ratioAfterBurnInputAmount = bnMul(
              bnDiv(
                bnMul(
                  bnAdd(
                    parseUnitAndReformat(this.burnData.stakedBN),
                    parseUnitAndReformat(this.burnData.lockBN)
                  ),
                  parseUnitAndReformat(this.burnData.LINA2USDBN, false)
                ),
                bnSub(this.burnData.debtBN, n2bnForAsset(burnAmount.toString()))
              ),
              n2bnForAsset("100")
            );
          }
          ////用输入的lUSD销毁后超额的抵押率算，不超过目标抵押率，则不能解锁LINA
          if (
            ratioAfterBurnInputAmount.lte(
              n2bnForAsset(this.burnData.targetRatio.toString())
            )
          ) {
            this.inputData.unStake = 0;
            this.inputData.amount = burnAmount;
            this.inputData.ratio = formatEtherToNumber(
              ratioAfterBurnInputAmount
            );

            this.actionDatas.unStake = n2bn("0");
            this.actionDatas.amount = n2bnForAsset(burnAmount.toString());
            this.actionDatas.ratio = ratioAfterBurnInputAmount;
            return;
          }

          //用输入的lUSD销毁后超额的抵押率算
          let allCanUnstakedLINAAfterBurn = bnMul(
            bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
            bnDiv(
              bnSub(
                ratioAfterBurnInputAmount,
                n2bnForAsset(this.burnData.targetRatio.toString())
              ),
              ratioAfterBurnInputAmount
            )
          );

          if (allCanUnstakedLINAAfterBurn.gt(this.burnData.stakedBN)) {
            allCanUnstakedLINAAfterBurn = this.burnData.stakedBN;
          }

          this.inputData.unStake = formatByStoreCollateral(
            allCanUnstakedLINAAfterBurn
          );
          this.actionDatas.unStake = allCanUnstakedLINAAfterBurn;
          this.inputData.amount = burnAmount;
          this.actionDatas.amount = n2bnForAsset(burnAmount.toString());

          this.inputData.ratio = this.burnData.targetRatio;
          this.actionDatas.ratio = n2bnForAsset(
            this.burnData.targetRatio.toString()
          );
        }
      } catch (error) {
        console.error(error);
        this.errors.amountMsg = "Invalid number";
      }
    },

    //输入想调成的抵押率
    changeRatio(ratioAmount) {
      try {
        //防止输入小数位引起的报错
        if (!ratioAmount || ratioAmount.countDecimals() > 0) {
          return;
        }

        if (this.isBinanceNetwork) {
          this.resetErrorsMsg();
          // this.resetInputData();

          if (this.burnData.debtBN.eq("0")) {
            this.errors.ratioMsg = "There is no debt.";
            return;
          }

          if (ratioAmount == 0) {
            // this.inputData.unStake = 0;
            // this.inputData.amount = 0;
            this.inputData.ratio = ratioAmount;
            this.errors.ratioMsg = "The P-Ratio cant be below target ratio.";
            return;
          } else if (ratioAmount == this.burnData.currentRatio) {
            //ratioAmount 等于 targetRatio，不需要操作
            // this.inputData.unStake = 0;
            // this.inputData.amount = 0;
            this.inputData.ratio = ratioAmount;
            return;
          } else if (
            (this.burnData.targetRatio > this.burnData.currentRatio &&
              ratioAmount < this.burnData.currentRatio) ||
            (this.burnData.targetRatio < this.burnData.currentRatio &&
              ratioAmount < this.burnData.targetRatio)
          ) {
            //ratioAmount 不允许小于 targetRatio 与 currentRatio 之间较小那个
            this.inputData.unStake = 0;
            this.inputData.amount = 0;
            this.inputData.ratio = ratioAmount;
            this.errors.ratioMsg = "The P-Ratio is too low.";
            return;
          }

          let maxRatioAfterBurnMax = n2bn("0");

          if (this.burnData.lUSDBN.lt(this.burnData.debtBN)) {
            maxRatioAfterBurnMax = bnMul(
              bnDiv(
                bnMul(
                  bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                  this.burnData.LINA2USDBN
                ),
                bnSub(this.burnData.debtBN, this.burnData.lUSDBN)
              ),
              n2bn("100")
            );
          }

          if (
            !maxRatioAfterBurnMax.eq("0") &&
            n2bn(ratioAmount.toString()).gt(maxRatioAfterBurnMax)
          ) {
            this.errors.ratioMsg = `The P-Ratio can't be larger than your staking amount of ${this.selectedCollateral.name}.`;
            return;
          }

          if (ratioAmount > this.burnData.currentRatio) {
            //上调抵押率，计算lUSD，LINA为0，调整抵押率最大为无限大，也就是销毁所有lUSD
            //计算达成 ratioAmount 时，抵押的LINA价值多少lUSD
            let retainlUSD = bnDiv(
              bnMul(
                bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                this.burnData.LINA2USDBN
              ),
              n2bn((ratioAmount / 100).toString())
            );
            let burnlUSD = bnSub(this.burnData.debtBN, retainlUSD); //债务 - 抵押的LINA价值多少lUSD = 需要销毁的lUSD

            this.inputData.unStake = 0;
            this.actionDatas.unStake = n2bn("0");

            this.inputData.amount = formatEtherToNumber(burnlUSD);
            this.actionDatas.amount = burnlUSD;

            this.inputData.ratio = ratioAmount;
            this.actionDatas.ratio = n2bn(ratioAmount.toString());
          } else if (
            ratioAmount < this.burnData.currentRatio &&
            ratioAmount >= this.burnData.targetRatio
          ) {
            if (
              this.burnData.lockBN.gt("0") &&
              this.burnData.stakedBN.eq("0")
            ) {
              this.errors.ratioMsg = "Please reduce the P-Ratio through build.";
              return;
            }

            //有lock lina时，在burn页面，抵押率最低只能调整到取回超额的stake lina
            if (
              this.burnData.lockBN.gt("0") &&
              this.burnData.stakedBN.gt("0")
            ) {
              let overStaked = bnMul(
                n2bn(
                  formatByStoreCollateral(
                    bnAdd(this.burnData.stakedBN, this.burnData.lockBN)
                  )
                ),
                bnDiv(
                  bnSub(
                    this.burnData.currentRatioBN,
                    n2bn(this.burnData.targetRatio.toString())
                  ),
                  this.burnData.currentRatioBN
                )
              );

              if (overStaked.gt(this.burnData.stakedBN)) {
                overStaked = this.burnData.stakedBN;
              }

              let pratioMinAfterUnstake = bnDiv(
                bnMul(
                  bnSub(
                    n2bn(
                      formatByStoreCollateral(
                        bnAdd(this.burnData.stakedBN, this.burnData.lockBN)
                      )
                    ),
                    overStaked
                  ),
                  this.burnData.LINA2USDBN
                ),
                this.burnData.currentRatioBN
              );

              if (
                utils
                  .parseEther(ratioAmount.toString())
                  .lt(pratioMinAfterUnstake)
              ) {
                this.inputData.unStake = 0;
                this.inputData.amount = 0;
                this.inputData.ratio = ratioAmount;
                this.errors.ratioMsg = "Can not set this P-Ratio.";
                return;
              }
            }

            //下调抵押率，lUSD为0，计算LINA
            //计算达成 ratioAmount 时，需要抵押多少LINA
            let retainStake = bnDiv(
              bnMul(n2bn((ratioAmount / 100).toString()), this.burnData.debtBN),
              this.burnData.LINA2USDBN
            );

            //已抵押的LINA - 需要抵押多少LINA = 达成 ratioAmount 需要解锁的LINA
            let unStake = bnSub(
              bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
              retainStake
            );

            this.inputData.unStake = formatByStoreCollateral(unStake);
            this.actionDatas.unStake = unStake;

            this.inputData.amount = 0;
            this.actionDatas.amount = n2bn("0");

            this.inputData.ratio = ratioAmount;
            this.actionDatas.ratio = n2bn(ratioAmount.toString());
          }
        }
      } catch (error) {
        console.error(error);
        this.errors.ratioMsg = "Invalid number";
      }
    },

    showIntroductActionModal() {
      this.introductActionModal = true;
    },

    etherscan() {
      //模拟跳到错误页
      this.actionTabs = "m3";
    },

    //回到默认状态
    setDefaultTab() {
      this.actionTabs = "m0";
      this.activeItemBtn = -1;

      this.isBinanceNetwork && this.getBurnData(this.walletAddress);

      this.resetInputData();
    },

    //重试
    tryAgain() {
      this.actionTabs = "m0";
    },
    setSelectedCollateral(item) {
      this.selectedCollateral = item;
    },

    //跳转到设置
    jumpToStep() {
      this.$store.commit("setSetupModal", true);
    },
  },
};
</script>

<style lang="scss">
#burn {
  .actionTabs {
    border-radius: 16px;
    box-shadow: 0px 2px 6px #deddde;

    .app-dark & {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .ivu-tabs-bar {
      display: none;
    }

    .ivu-tabs-content {
      background: #fff;

      .ivu-tabs-tabpane {
        width: 786px;
        height: 840px !important;

        .burnBox,
        .waitingBox,
        .successBox,
        .wrongBox {
          width: 100%;
          height: 100%;
        }

        .burnBox {
          position: relative;

          .actionBodyWeb {
            padding: 64px 193px 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            .actionTitle {
              font-family: Gilroy-Bold;
              font-size: 32px;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.25;
              letter-spacing: normal;
              text-align: center;
              color: #5a575c;
            }

            .actionDesc {
              margin-top: 8px;
              font-family: Gilroy-Regular;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.29;
              letter-spacing: normal;
              text-align: center;
              color: #99999a;
              margin-bottom: 40px;

              .step {
                text-transform: uppercase;
                font-family: Gilroy-Bold;
                font-weight: bold;
                line-height: 1.6;
                letter-spacing: 1.25px;
                color: #1a38f8;
                cursor: pointer;
              }
            }

            .actionRate {
              margin: 0 0 16px;
              border-radius: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 4px 16px;
              font-family: Gilroy-Medium;
              font-size: 12px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.33;
              letter-spacing: normal;
              text-align: center;
              width: 100%;
              background-color: rgba(#7eb5ff, 0.1);
              color: #1a38f8;
            }

            .actionInputItem {
              margin-bottom: 24px;
              border-radius: 8px;
              border: solid 1px #deddde;
              padding: 33px 24px;
              display: flex;
              justify-content: space-between;
              width: 100%;
              transition: $animete-time linear;
              position: relative;
              height: 88px;

              &:hover,
              &.active {
                border-color: #1a38f8 !important;
                box-shadow: 0px 2px 12px #deddde;
              }

              .itemLeft {
                display: flex;
                margin-right: 16px;
                align-items: center;

                .itemIcon {
                  margin-right: 16px;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
                  background: #ffffff;
                  .app-dark & {
                    background: none;
                  }

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .itemType {
                  .itemTypeTitle {
                    font-family: Gilroy-Bold;
                    font-size: 16px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;

                    .tip {
                      margin-left: 8px;

                      img {
                        margin-top: -3px;
                      }
                    }
                  }

                  .itemTypeBtn {
                    transition: $animete-time linear;
                    cursor: pointer;
                    display: flex;
                    text-transform: uppercase;
                    font-family: Gilroy-Bold;
                    font-size: 12px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.33;
                    letter-spacing: 1.5px;
                    text-align: center;
                    color: #e5e5e5;

                    .app-dark & {
                      color: #3c3a3e !important;
                    }

                    &.selectedAsset {
                      color: #a4cbff !important;
                      &:hover {
                        &:not(.default) {
                          color: #1a38f8 !important;
                        }
                      }
                    }

                    img {
                      margin-left: 6px;
                    }

                    &:hover {
                      &:not(.default) {
                      }
                    }

                    &.active {
                    }

                    &.default {
                      cursor: default;
                    }
                  }
                }
              }

              .itemRight {
                flex: 1;
                display: flex;

                .inputRect {
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;

                  .ivu-input-number-input[disabled],
                  .ivu-input-number-disabled {
                    background-color: #fff !important;
                    cursor: not-allowed;
                  }

                  // margin-bottom: 8px;
                  .input {
                    width: 100%;
                    border: none;
                    box-shadow: none;

                    .ivu-input-number-handler-wrap {
                      display: none;
                    }

                    .ivu-input-number-input {
                      text-align: right;
                      font-family: Gilroy-Bold;
                      font-size: 32px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.25;
                      letter-spacing: normal;

                      &::placeholder {
                        color: #99999a;
                      }
                    }
                  }

                  .unit {
                    color: #5a575c;
                    font-family: Gilroy-Regular;
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 24px;
                    text-transform: uppercase;
                  }
                }

                .avaliable {
                  color: #c6c4c7;
                  font-family: Gilroy;
                  font-size: 12px;
                  font-weight: 500;
                  line-height: 16px;
                  text-align: right;
                }
              }

              .itemErrMsg {
                transition: opacity $animete-time linear;
                position: absolute;
                left: 0;
                bottom: -20px;
                height: 16px;
                color: #df434c;
                font-family: Gilroy;
                font-size: 10px;
                font-weight: 700;
                line-height: 16px;
                text-transform: uppercase;
                letter-spacing: 1.25px;
              }

              &.error {
                border-color: #df434c;
              }
            }

            #gasEditor {
              margin-top: 20px;
            }
          }

          .actionBodyMobile {
            display: none;
          }

          .burnBtn {
            width: 100%;
            position: absolute;
            bottom: 0px;
            height: 80px;
            cursor: pointer;
            background: #1a38f8;
            color: #ffffff;
            text-transform: uppercase;
            transition: $animete-time linear;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Gilroy-Bold;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: 3px;
            text-align: center;

            &:hover {
              &:not(.disabled) {
                background-color: #7eb5ff;
              }
            }

            &.disabled {
              cursor: not-allowed;
            }

            &.switchToBSC {
              font-family: Gilroy-Bold;
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
  #burn {
    border-radius: 16px;
    box-shadow: 0px 2px 6px #deddde;
    min-height: 550px;

    .app-dark & {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .actionTabs {
      border-radius: 16px;
      box-shadow: 0px 2px 6px #deddde;
      min-height: 550px;
      .app-dark & {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }

      .ivu-tabs-bar {
        display: none;
      }

      .ivu-tabs-content {
        background: #fff;

        .ivu-tabs-tabpane {
          width: 100%;
          height: 88vh !important;
          min-height: 550px;
          background: #fff;

          .burnBox,
          .waitingBox,
          .successBox,
          .wrongBox {
            width: 100%;
            height: 100%;
            min-height: 550px;
            display: flex;
            justify-content: center;
          }

          .burnBox {
            position: relative;

            .actionBodyWeb {
              display: none;
            }

            .actionBodyMobile {
              display: flex;
              flex-direction: column;
              align-items: center;

              .errMsg {
                align-items: center;
                height: 14.6vw;
                width: 74.4vw;
                padding: 12px 16px;
                margin-top: 24px;
                border-radius: 8px;
                background-color: rgba(223, 67, 76, 0.05);
                color: #df434c;
                line-break: auto;
                word-break: break-word;

                img {
                  margin-right: 8px;
                }

                .closeIcon {
                  position: absolute;
                  right: 10%;
                  cursor: pointer;
                  margin-bottom: 20px;
                }
              }

              .actionRate {
                width: 74.4vw;
                margin: 10px 0 15px;
                border-radius: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 4px 16px;
                text-align: center;
                font-family: Gilroy-Medium;
                font-size: 12px;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.33;
                letter-spacing: normal;
                text-align: center;
                background-color: rgba(#7eb5ff, 0.1);
                color: #1a38f8;
              }

              .actionInputItem {
                margin-bottom: 12px;
                padding: 15px 15px 10px;
                border-radius: 8px;
                border: solid 1px #deddde;
                padding: 33px 24px;
                display: flex;
                justify-content: space-between;
                width: 90%;
                transition: $animete-time linear;
                position: relative;
                height: 88px;

                &:hover,
                &.active {
                  border-color: #1a38f8 !important;
                  box-shadow: 0px 2px 12px #deddde;
                }

                .itemLeft {
                  display: flex;
                  margin-right: 16px;
                  align-items: center;

                  .itemIcon {
                    margin-right: 16px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    background: #ffffff;
                    .app-dark & {
                      background: none;
                    }

                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }

                  .itemType {
                    .itemTypeTitle {
                      font-family: Gilroy-Bold;
                      font-size: 16px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.5;
                      letter-spacing: normal;
                      color: #5a575c;

                      .tip {
                        margin-left: 8px;

                        img {
                          margin-top: -3px;
                        }
                      }
                    }

                    .itemTypeBtn {
                      transition: $animete-time linear;
                      cursor: pointer;
                      display: flex;
                      text-transform: uppercase;
                      font-family: Gilroy-Bold;
                      font-size: 12px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.33;
                      letter-spacing: 1.5px;
                      text-align: center;
                      color: #e5e5e5;

                      .app-dark & {
                        color: #3c3a3e !important;
                      }

                      &.selectedAsset {
                        color: #a4cbff !important;
                        &:hover {
                          &:not(.default) {
                            color: #1a38f8 !important;
                          }
                        }
                      }
                      img {
                        margin-left: 6px;
                      }

                      &:hover {
                        &:not(.default) {
                        }
                      }

                      &.active {
                      }

                      &.default {
                        cursor: default;
                      }
                    }
                  }
                }

                .itemRight {
                  flex: 1;
                  display: flex;

                  .inputRect {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;

                    .ivu-input-number-input[disabled],
                    .ivu-input-number-disabled {
                      background-color: #fff !important;
                      cursor: not-allowed;

                      .app-dark & {
                        background-color: transparent !important;
                      }
                    }

                    // margin-bottom: 8px;
                    .input {
                      width: 100%;
                      border: none;
                      box-shadow: none;

                      .ivu-input-number-handler-wrap {
                        display: none;
                      }

                      .ivu-input-number-input {
                        text-align: right;
                        font-family: Gilroy-Bold;
                        font-size: 32px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.25;
                        letter-spacing: normal;

                        &::placeholder {
                          color: #99999a;
                        }
                      }
                    }

                    .unit {
                      color: #5a575c;
                      font-family: Gilroy-Regular;
                      font-size: 16px;
                      font-weight: 400;
                      line-height: 24px;
                      text-transform: uppercase;
                    }
                  }

                  .avaliable {
                    color: #c6c4c7;
                    font-family: Gilroy;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 16px;
                    text-align: right;
                  }
                }

                .itemErrMsg {
                  transition: opacity $animete-time linear;
                  position: absolute;
                  left: 0;
                  bottom: -20px;
                  height: 16px;
                  color: #df434c;
                  font-family: Gilroy;
                  font-size: 10px;
                  font-weight: 700;
                  line-height: 16px;
                  text-transform: uppercase;
                  letter-spacing: 1.25px;
                }

                &.error {
                  border-color: #df434c;
                }
              }
            }

            .burnBtn {
              width: 100%;
              position: absolute;
              bottom: 0px;
              height: 12.8vw !important;
              cursor: pointer;
              background: #1a38f8;
              color: #ffffff;
              text-transform: uppercase;
              transition: $animete-time linear;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Gilroy-Bold;
              font-size: 16px;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              letter-spacing: 3px;
              text-align: center;

              &:hover {
                &:not(.disabled) {
                  background-color: #7eb5ff;
                }
              }

              &.disabled {
                cursor: not-allowed;
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
                font-family: Gilroy-Bold;
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
