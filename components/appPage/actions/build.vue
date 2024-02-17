<template>
  <div id="build">
    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0">
        <div class="buildBox">
          <div class="actionBodyWeb">
            <div class="actionTitle">Build</div>
            <div class="actionDesc">
              <template v-if="isEthereumNetwork">
                Earn rewards by staking LINA and building ℓUSD. You will need a
                Binance Chain wallet for the transaction &nbsp;<span
                  class="step"
                  @click="jumpToStep"
                  >STEP<img src="@/static/arrow_right.svg"
                /></span>
              </template>
              <template v-else>
                Build ℓUSD and earn staking rewards by staking supported
                on-chain assets.
              </template>
            </div>
            <muticollateralSelector
              :selectedCollateral="selectedCollateral"
              :setSelectedCollateral="setSelectedCollateral"
            />
            <div class="actionRate" v-if="isBinanceNetwork">
              {{
                selectedCollateral == undefined
                  ? "-"
                  : "1 " + selectedCollateral.name
              }}
              =
              {{
                selectedCollateral !== undefined
                  ? formatNumberFromBigNumber(buildData.LINA2USDBN, 4)
                  : "-"
              }}
              ℓUSD
            </div>

            <div
              class="actionInputItem"
              :class="{
                error: errors.stakeMsg,
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
                    Stake
                    {{
                      selectedCollateral !== undefined
                        ? selectedCollateral.name
                        : ""
                    }}
                  </div>
                  <div
                    v-if="selectedCollateral !== undefined"
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 0,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click.stop="clickBuy"
                  >
                    buy
                    {{ this.selectedCollateral.name }}

                    <img
                      @mouseover="arrow_icon = true"
                      @mouseleave="arrow_icon = false"
                      :src="arrow_icon ? arrow_hover : arrow_default"
                    />
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput0"
                    type="text"
                    v-model="inputData.stake"
                    placeholder="0"
                    :min="0"
                    :max="100000000000"
                    @on-change="changeStakeAmount"
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
                  opacity: errors.stakeMsg ? '1' : '0',
                }"
              >
                {{ errors.stakeMsg }}
              </div>
            </div>
            <div
              class="actionInputItem"
              :class="{
                error: errors.buildAmount,
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
                  <div class="itemTypeTitle">
                    Build ℓUSD
                    <Tooltip
                      max-width="305"
                      placement="top"
                      class="tip globalInfoStyle"
                      content="Amount of ℓUSD built may vary due to block times and price fluctuations in pledge tokens."
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
                      active: activeItemBtn == 1,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click.stop="clickMaxBuildAmount"
                  >
                    MAX
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput1"
                    type="text"
                    :min="0"
                    :max="100000000000"
                    v-model="inputData.amount"
                    @on-change="changeBuildAmount"
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
              @click="changeFocusItem(2)"
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
                    @click.stop="clickTargetRatio"
                  >
                    TARGET RATIO
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput2"
                    type="text"
                    :min="0"
                    :max="100000000000"
                    v-model="inputData.ratio"
                    @on-change="changeRatio"
                    @on-focus="inputFocus(2)"
                    @on-blur="inputBlur(2)"
                    placeholder="0"
                    :formatter="(value) => formatterInput(value, 0)"
                    :disabled="this.selectedCollateral == undefined"
                  />
                  <!-- :max="buildData.maxPRatio" -->
                  <!-- <div class="unit">%</div> -->
                </div>
                <!-- <div class="avaliable">Current : 99.73</div> -->
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

            <gasEditorSwap
              v-if="isEthereumNetwork"
              :simple="true"
            ></gasEditorSwap>
            <gasEditor v-else-if="!isMobile"></gasEditor>
          </div>

          <div class="actionBodyMobile">
            <div
              class="errMsg"
              :style="{
                display:
                  errors.stakeMsg || errors.ratioMsg || errors.amountMsg
                    ? 'flex'
                    : 'none',
              }"
            >
              <img src="@/static/error.svg" />
              {{ errors.stakeMsg }}
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
                selectedCollateral !== undefined
                  ? formatNumberFromBigNumber(buildData.LINA2USDBN, 4)
                  : "-"
              }}
              ℓUSD
            </div>
            <div
              class="actionInputItem"
              :class="{
                error: errors.stakeMsg,
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
                    Stake
                    {{
                      selectedCollateral !== undefined
                        ? selectedCollateral.name
                        : ""
                    }}
                  </div>
                  <div
                    v-if="selectedCollateral !== undefined"
                    class="itemTypeBtn"
                    :class="{
                      active: activeItemBtn == 3,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click.stop="clickBuy"
                  >
                    buy {{ this.selectedCollateral.name }}
                    <img
                      @mouseover="arrow_icon = true"
                      @mouseleave="arrow_icon = false"
                      :src="arrow_icon ? arrow_hover : arrow_default"
                    />
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput3"
                    type="text"
                    v-model="inputData.stake"
                    placeholder="0"
                    :min="0"
                    :max="100000000000"
                    @on-change="changeStakeAmount"
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
                  opacity: errors.stakeMsg ? '1' : '0',
                }"
              >
                {{ errors.stakeMsg }}
              </div> -->
            </div>

            <div
              class="actionInputItem"
              :class="{
                error: errors.buildAmount,
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
                  <div class="itemTypeTitle">
                    Build ℓUSD
                    <Tooltip
                      max-width="305"
                      placement="top"
                      class="tip globalInfoStyle"
                      content="Amount of ℓUSD built may vary due to block times and price fluctuations in pledge tokens."
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
                      active: activeItemBtn == 4,
                      selectedAsset: selectedCollateral !== undefined,
                    }"
                    @click.stop="clickMaxBuildAmount"
                  >
                    MAX
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput4"
                    type="text"
                    :min="0"
                    :max="100000000000"
                    v-model="inputData.amount"
                    @on-change="changeBuildAmount"
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
                    @click.stop="clickTargetRatio"
                  >
                    TARGET RATIO
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <div class="inputRect">
                  <InputNumber
                    class="input"
                    ref="itemInput5"
                    type="text"
                    :min="0"
                    :max="100000000000"
                    v-model="inputData.ratio"
                    @on-change="changeRatio"
                    @on-focus="inputFocus(5)"
                    @on-blur="inputBlur(5)"
                    placeholder="0"
                    :formatter="(value) => formatterInput(value, 0)"
                    :disabled="this.selectedCollateral == undefined"
                  />
                  <!-- :max="buildData.maxPRatio" -->
                  <!-- <div class="unit">%</div> -->
                </div>
                <!-- <div class="avaliable">Current : 99.73</div> -->
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

            <gasEditorSwap
              v-if="isEthereumNetwork && isMobile"
              :simple="true"
            ></gasEditorSwap>
            <gasEditor v-else-if="isMobile"></gasEditor>
          </div>

          <div
            class="buildBtn"
            :class="{ disabled: buildDisabled }"
            @click="clickBuild"
          >
            BUILD NOW
          </div>

          <Spin fix v-if="processing"></Spin>
        </div>
      </TabPane>
      <TabPane name="m1">
        <watingEnhance
          class="waitingBox"
          v-if="actionTabs == 'm1' && !isEthereumNetworkFunc(sourceNetworkId)"
          :currentStep="confirmTransactionStep"
          :currentHash="confirmTransactionHash"
          :currentNetworkId="confirmTransactionNetworkId"
          :currentConfirm="confirmTransactionStatus"
          :currentErrMsg="transactionErrMsg"
          :setupArray="waitProcessArray"
          :shouldApprove="shouldApprove"
          @tryAgain="waitProcessFlow"
          @close="setDefaultTab"
        ></watingEnhance>

        <watingEnhanceSwapNew
          :amount="floor(inputData.stake, DECIMAL_PRECISION)"
          :swapType="1"
          v-if="actionTabs == 'm1' && isEthereumNetworkFunc(sourceNetworkId)"
          @close="setDefaultTab"
        >
        </watingEnhanceSwapNew>
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
      <div class="title">Build ℓUSD</div>
      <div class="context">
        Amount of ℓUSD built may vary due to block times and price fluctuations
        in pledge tokens.
      </div>
    </Modal>

    <linkModal :visible="showPopup" @toggle="showPopup = $event"></linkModal>
  </div>
</template>

<script>
import _ from "lodash";
import gasEditor from "@/components/gasEditor";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import {
  getPriceRates,
  // getPriceRatesFromApi,
  getBuildRatio,
} from "@/assets/linearLibrary/linearTools/request";
import muticollateralSelector from "../../selector/muticollateralSelector.vue";
import {
  findParents,
  removeClass,
  addClass,
  formatterInput,
  // toNonExponential,
  // openBuyLINA,
} from "@/common/utils";

import {
  formatByStoreCollateral,
  formatEtherToNumber,
  formatNumber,
  formatNumberFromBigNumber,
  getAssetObjectInfo,
  parseUnitAndReformat,
  replaceWaitProcessString,
  roundCryptoValueString,
} from "@/assets/linearLibrary/linearTools/format";

import {
  bufferGasLimit,
  DEFAULT_GAS_LIMIT,
  isBinanceNetwork,
  isEthDevNetwork,
  isEthereumNetwork,
} from "@/assets/linearLibrary/linearTools/network";

import {
  bnAdd,
  bnSub,
  bnMul,
  bnDiv,
  n2bn,
  bn2n,
  n2bnForAsset,
  bn2nForAsset,
} from "@/common/bnCalc";

import { BigNumber, utils } from "ethers";

import {
  BUILD_PROCESS_SETUP,
  DECIMAL_PRECISION,
} from "@/assets/linearLibrary/linearTools/constants/process";

import watingEnhanceSwapNew from "@/components/transferStatus/watingEnhanceSwapNew";
import gasEditorSwap from "@/components/gasEditorSwap";
import linkModal from "~/components/linkModal.vue";
import { LINA } from "~/assets/linearLibrary/linearTools/constants/currency";

export default {
  name: "build",
  data() {
    return {
      arrow_default: require("@/static/arrow_right_baby_blue.svg"),
      arrow_hover: require("@/static/arrow_right.svg"),
      utils, // ethers工具包
      DECIMAL_PRECISION,
      formatNumber, //千分格式化
      formatNumberFromBigNumber, //大数格千分格式化
      formatEtherToNumber,
      floor: _.floor, //向下取值
      // toNonExponential, //科学计数法转正常显示 Conversion of scientific counting method to digital text
      actionTabs: "m0", //子页(m0默认,m1执行) Subpages(m0 default, m1 waiting)
      LINA: LINA,
      activeItemBtn: -1, //当前激活按钮 0,1,2 Start with -1
      arrow_icon: false,
      confirmTransactionStep: -1, //当前交易进度
      confirmTransactionStatus: false, //当前交易确认状态
      confirmTransactionNetworkId: "", //当前交易确认网络id
      confirmTransactionHash: "", //当前交易hash
      transactionErrMsg: "", //交易错误信息
      processing: false, // 处理状态, 防止重复点击
      shouldApprove: false, //需要approve

      waitProcessArray: [], //等待交易进度组
      waitProcessFlow: Function, //flow闭包函数

      toleranceDifference: 0.01, //build容错差值

      introductActionModal: false,

      //输入框展示数据
      inputData: {
        stake: null,
        amount: null,
        ratio: 0,
      },

      //真实操作数据
      actionData: {
        stake: n2bn("0"),
        amount: n2bn("0"),
        needApprove: n2bn("0"),
        ratio: 0,
      },

      errors: {
        stakeMsg: "",
        amountMsg: "",
        ratioMsg: "",
      },

      buildData: {
        LINA: 0,
        LINA2USD: 0,
        staked: 0,
        lock: 0,
        debt: 0,
        targetRatio: 350,
        currentRatio: 0,
      },

      formatterInput,

      chainChangeFromSubscribe: "",

      isEthereumNetworkFunc: isEthereumNetwork,
      sourceNetworkId: "",
      showPopup: false,
      selectedCollateral: undefined,
    };
  },
  components: {
    gasEditor,
    gasEditorSwap,
    watingEnhanceSwapNew,
    linkModal,
    muticollateralSelector,
  },
  watch: {
    walletAddress() {},
    errorHandle() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    isMobile() {},
    selectedCollateral() {
      this.getBuildData();
    },
  },
  computed: {
    //build按钮禁止状态
    //Disable build button
    buildDisabled() {
      return (
        (_.lte(this.inputData.stake, 0) && _.lte(this.inputData.amount, 0)) ||
        this.errors.stakeMsg ||
        this.errors.amountMsg ||
        this.errors.ratioMsg ||
        this.processing ||
        (this.isEthereumNetwork && _.lt(this.inputData.stake, 1))
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
    multiCollateralAsset() {
      return this.$store.state?.multiCollateral;
    },
  },
  created() {
    this.sourceNetworkId = this.walletNetworkId;

    //监听链切换
    this.chainChangeFromSubscribe = this.$pub.subscribe(
      "onWalletChainChange",
      async () => {
        if (this.actionTabs == "m0") {
          this.sourceNetworkId = this.walletNetworkId;
          this.inputData = {
            stake: null,
            amount: null,
            ratio: 0,
          };
          this.actionData = {
            stake: n2bn("0"),
            amount: n2bn("0"),
            needApprove: n2bn("0"),
            ratio: 0,
          };
          await this.getBuildData();
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
    toggleModal() {
      this.showPopup = !this.showPopup;
    },
    //跳转到设置
    jumpToStep() {
      this.$store.commit("setSetupModal", true);
    },

    /**
     * 调整stake最小数为1,小于为0
     */
    adjustMinStake() {
      const minCollateral = getAssetObjectInfo(
        this.selectedCollateral.key
      ).minCollateral;
      if (
        this.inputData.stake < minCollateral ||
        this.actionData.stake.lt(n2bnForAsset(minCollateral))
      ) {
        this.$nextTick(() => {
          this.inputData.stake = 0;
          this.actionData.stake = n2bn("0");
        });
      }
    },

    /**
     * 获取数据
     */
    async getBuildData() {
      try {
        this.processing = true;
        const walletAddress = this.walletAddress;

        if (walletAddress === undefined) return;
        if (this.selectedCollateral === undefined) return;

        const {
          lnrJS: { LnRewardLocker },
          utils,
        } = lnrJSConnector;
        const LnDebtSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnDebtSystem;
        const LnCollateralSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnCollateralSystem;
        const LinearFinance =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LinearFinance;

        if (this.isEthDevNetwork) {
          const avaliableLINA = await LinearFinance.balanceOf(walletAddress);

          this.buildData.LINA = _.floor(
            formatByStoreCollateral(avaliableLINA),
            DECIMAL_PRECISION
          );

          this.buildData.LINABN = avaliableLINA;
        } else {
          const LINABytes = utils.formatBytes32String(
            this.selectedCollateral.contractKey
          );
          //取合约地址
          const LnCollateralSystemAddress = LnCollateralSystem.address;

          const results = await Promise.all([
            LinearFinance.balanceOf(walletAddress), //collateral 余额
            LnCollateralSystem.userCollateralData(walletAddress, LINABytes), //staked collateral
            LnRewardLocker.balanceOf(walletAddress), //lock collateral
            LinearFinance.allowance(walletAddress, LnCollateralSystemAddress), //已 approved 的 collateral 额度
            LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress), //总债务
            // getBuildRatio(), //目标抵押率
            LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress), //个人全部抵押物兑lUSD,用于计算pratio
          ]);

          const [
            avaliableLINA,
            stakedLina,
            lockLina,
            approvedLina,
            amountDebtUnformat,
            totalCollateralInUsd,
          ] = results.map(formatByStoreCollateral);

          const amountDebt = formatEtherToNumber(
            await LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress)
          );
          let currentRatioPercent = n2bn("0");
          const buildRatio = await getBuildRatio(this.selectedCollateral.key);

          if (results[5].gt("0") && results[4][0].gt("0")) {
            currentRatioPercent = bnMul(
              bnDiv(results[5], results[4][0]),
              n2bn("100")
            );
          }

          const targetRatioPercent =
            this.selectedCollateral.key == LINA
              ? 100 / formatEtherToNumber(buildRatio)
              : 100 * buildRatio;
          const priceRateKey = this.selectedCollateral.contractKey;
          const priceRates = await getPriceRates([priceRateKey, "lUSD"]);
          const LINAPrice = priceRates[priceRateKey] / priceRates.lUSD;
          const LINAPriceBN = bnDiv(priceRates[priceRateKey], priceRates.lUSD);

          this.buildData.LINA = _.floor(avaliableLINA, DECIMAL_PRECISION);
          this.buildData.LINABN = results[0];

          this.buildData.LINA2USD = _.floor(LINAPrice, DECIMAL_PRECISION);
          this.buildData.LINA2USDBN = LINAPriceBN;

          this.buildData.staked = _.floor(stakedLina, DECIMAL_PRECISION);
          this.buildData.stakedBN = results[1];

          this.buildData.lock = _.floor(lockLina, DECIMAL_PRECISION);
          if (this.selectedCollateral.key == LINA) {
            this.buildData.lockBN = results[2];
          } else {
            this.buildData.lockBN = n2bnForAsset("0");
          }

          this.buildData.approvedBN = results[3];

          this.buildData.debt = _.floor(amountDebt[0], DECIMAL_PRECISION);
          this.buildData.debtBN = results[4][0];

          this.buildData.targetRatio = targetRatioPercent;
          this.buildData.currentRatio =
            formatByStoreCollateral(currentRatioPercent);
          this.buildData.currentRatioBN = currentRatioPercent;

          //获取当前抵押率
          this.inputData.ratio = this.buildData.currentRatio;
          this.inputData.stake = null;
          this.inputData.amount = null;
          this.errors.stakeMsg = "";
          this.errors.amountMsg = "";
          this.errors.ratioMsg = "";
        }
      } catch (e) {
        console.log(e, "getBuildData err");
      } finally {
        this.processing = false;
      }
    },

    //点击最大ℓUSD
    clickMaxBuildAmount() {
      try {
        this.resetErrorsMsg();
        this.resetInputData();

        this.activeItemBtn = 1;

        if (this.isEthDevNetwork) {
          this.inputData.stake = this.buildData.LINA;
        } else {
          let allCanBuildLUSDAfterStakeAll = n2bn("0");

          //抵押所有lina后能生成多少lUSD
          allCanBuildLUSDAfterStakeAll = bnDiv(
            bnMul(
              n2bn(
                formatByStoreCollateral(
                  bnAdd(
                    bnAdd(
                      parseUnitAndReformat(this.buildData.LINABN),
                      parseUnitAndReformat(this.buildData.stakedBN),
                      parseUnitAndReformat(this.buildData.lockBN)
                    ),
                    parseUnitAndReformat(this.buildData.lockBN)
                  )
                )
              ),
              parseUnitAndReformat(this.buildData.LINA2USDBN, false)
            ),
            n2bnForAsset((this.buildData.targetRatio / 100).toString())
          );

          //可以生成的lUSD小于等于债务
          if (allCanBuildLUSDAfterStakeAll.lte(this.buildData.debtBN)) {
            this.errors.amountMsg = `You don't have enough amount of ${this.selectedCollateral.name}.`;
            return;
          }

          //需要approve
          if (
            this.buildData.LINABN.gt(n2bn("0")) &&
            this.buildData.LINABN.gt(this.buildData.approvedBN)
          ) {
            this.actionData.needApprove = n2bn("10000000000");
          }

          this.inputData.stake = formatByStoreCollateral(this.buildData.LINABN);
          this.inputData.amount = formatEtherToNumber(
            bnSub(allCanBuildLUSDAfterStakeAll, this.buildData.debtBN)
          );
          const selectedAssetRatio = this.selectedCollateral.targetRatio * 100;
          this.inputData.ratio = selectedAssetRatio;
          this.actionData.stake = n2bnForAsset(
            roundCryptoValueString(
              this.inputData.stake.toString(),
              this.selectedCollateral.key
            ),
            this.selectedCollateral.key
          );
          this.actionData.amount = bnSub(
            allCanBuildLUSDAfterStakeAll,
            this.buildData.debtBN
          );
          this.actionData.ratio = n2bn(selectedAssetRatio.toString());

          this.adjustMinStake();
        }
      } catch (error) {
        console.log(error, "clickMaxBuildAmount error");
      }
    },

    //点击target
    //点击target
    clickTargetRatio() {
      try {
        this.resetErrorsMsg();
        this.resetInputData();

        this.activeItemBtn = 2;

        if (this.isEthDevNetwork) {
          this.inputData.stake = this.buildData.LINA;
        } else {
          if (this.buildData.debtBN.eq(n2bn("0"))) {
            this.errors.ratioMsg = "You don't have build ℓUSD.";
            return;
          }
          if (
            this.buildData.currentRatioBN.gt(
              n2bnForAsset(this.buildData.targetRatio.toString())
            )
          ) {
            //抵押率大于目标抵押率，只build，不计算stake
            let stakeAndLockToLUSD = bnDiv(
              bnMul(
                bnAdd(
                  parseUnitAndReformat(this.buildData.stakedBN),
                  parseUnitAndReformat(this.buildData.lockBN)
                ),
                parseUnitAndReformat(this.buildData.LINA2USDBN, false)
              ),
              n2bnForAsset((this.buildData.targetRatio / 100).toString())
            );
            this.inputData.stake = 0;
            this.inputData.amount =
              _.floor(
                formatByStoreCollateral(
                  bnSub(stakeAndLockToLUSD, this.buildData.debtBN)
                ),
                DECIMAL_PRECISION
              ) - this.toleranceDifference; //增加容错
            const selectedAssetRatio =
              this.selectedCollateral.targetRatio * 100;
            this.inputData.ratio = selectedAssetRatio;
            this.actionData.stake = n2bn("0");
            this.actionData.amount = bnSub(
              bnSub(stakeAndLockToLUSD, this.buildData.debtBN),
              n2bnForAsset(this.toleranceDifference.toString())
            ); //增加容错
            this.actionData.ratio = n2bn(selectedAssetRatio.toString());
          } else if (
            this.buildData.currentRatioBN.lt(
              n2bnForAsset(this.buildData.targetRatio.toString())
            )
          ) {
            //抵押率小于目标抵押率，只stake，不计算build
            //当抵押率等于目标抵押率时，需要stake的lina数量
            let needStakeWhenTargetRatio = bnSub(
              bnDiv(
                bnMul(
                  n2bnForAsset((this.buildData.targetRatio / 100).toString()),
                  parseUnitAndReformat(this.buildData.debtBN, false)
                ),
                parseUnitAndReformat(this.buildData.LINA2USDBN, false)
              ),
              parseUnitAndReformat(this.buildData.lockBN)
            );

            //需要补充抵押的lina数量
            let newStakeAmount = bnSub(
              parseUnitAndReformat(needStakeWhenTargetRatio, false),
              parseUnitAndReformat(this.buildData.stakedBN)
            );

            //可用lina数量不足
            if (
              parseUnitAndReformat(newStakeAmount, false).gt(
                parseUnitAndReformat(this.buildData.LINABN)
              )
            ) {
              this.errors.ratioMsg = `You don't have enough amount of ${this.selectedCollateral.name}.`;
              return;
            }

            //需要approve
            if (newStakeAmount.gt(this.buildData.approvedBN)) {
              this.actionData.needApprove = n2bn("10000000000");
            }

            const selectedAssetRatio =
              this.selectedCollateral.targetRatio * 100;

            this.inputData.stake = formatEtherToNumber(newStakeAmount);
            this.inputData.amount = 0;
            this.inputData.ratio = selectedAssetRatio;

            this.actionData.stake = newStakeAmount;
            this.actionData.amount = n2bn("0");
            this.actionData.ratio = n2bn(selectedAssetRatio.toString());
          }

          this.adjustMinStake();
          //抵押率刚好则不动
        }
      } catch (error) {
        console.log(error, "clickTargetRatio error");
      }
    },

    //stakeAmount改变事件
    changeStakeAmount(stakeAmount) {
      try {
        this.resetErrorsMsg();
        // this.resetInputData();

        if (!stakeAmount) {
          this.errors.stakeMsg = `You can't stake the amount of ${this.selectedCollateral.name}.`;
          return;
        }

        if (n2bn(stakeAmount.toString()).gt(this.buildData.LINABN)) {
          this.errors.stakeMsg = `You don't have enough amount of ${this.selectedCollateral.name}.`;
          return;
        }

        if (!this.isEthDevNetwork) {
          //抵押输入的lina时能生成的最大lusd

          let canBuildMaxAfterStake = bnDiv(
            bnMul(
              bnAdd(
                bnAdd(
                  parseUnitAndReformat(this.buildData.stakedBN),
                  parseUnitAndReformat(this.buildData.lockBN)
                ),
                n2bnForAsset(stakeAmount.toString())
              ),
              parseUnitAndReformat(this.buildData.LINA2USDBN, false)
            ),
            n2bnForAsset((this.buildData.targetRatio / 100).toString())
          );

          let canBuildAfterStake = bnSub(
            canBuildMaxAfterStake,
            this.buildData.debtBN
          );

          if (canBuildAfterStake.lt(n2bn("0"))) {
            this.inputData.amount = 0;
            this.actionData.amount = n2bn("0");
          } else {
            this.inputData.amount = formatEtherToNumber(canBuildAfterStake);
            this.actionData.amount = canBuildAfterStake;
          }

          //需要approve
          if (n2bn(stakeAmount.toString()).gt(this.buildData.approvedBN)) {
            this.actionData.needApprove = n2bn("10000000000");
          }

          this.inputData.stake = stakeAmount;
          this.actionData.stake = n2bnForAsset(
            stakeAmount.toString(),
            this.selectedCollateral.key
          );

          this.adjustMinStake();
          this.actionData.ratio = bnMul(
            bnDiv(
              n2bn(
                bnMul(
                  canBuildMaxAfterStake,
                  n2bnForAsset(this.buildData.targetRatio / 100)
                )
              ),
              n2bn(bnAdd(this.actionData.amount, this.buildData.debtBN))
            ),
            n2bnForAsset("100")
          );

          this.inputData.ratio = formatEtherToNumber(this.actionData.ratio);
        }
      } catch (error) {
        console.log(error, "stake change error");
        this.errors.stakeMsg = "Invalid number";
      }
    },

    changeBuildAmount(buildAmount) {
      try {
        this.resetErrorsMsg();
        // this.resetInputData();

        if (!this.isEthDevNetwork) {
          if (!buildAmount) {
            this.errors.amountMsg = "You can't build the amount of ℓUSD.";
            return;
          }

          this.inputData.ratio = this.buildData.targetRatio;

          //抵押所有lina后能build最大lusd
          let canBuildMaxAfterStakeAll = bnDiv(
            bnMul(
              bnAdd(
                bnAdd(
                  parseUnitAndReformat(this.buildData.stakedBN),
                  parseUnitAndReformat(this.buildData.lockBN)
                ),
                parseUnitAndReformat(this.buildData.LINABN)
              ),
              parseUnitAndReformat(this.buildData.LINA2USDBN, false)
            ),
            n2bnForAsset((this.buildData.targetRatio / 100).toString())
          );

          //抵押所有lina后能build最大lusd - debt = 还能build多少
          let canBuildAfterStakeAll = bnSub(
            canBuildMaxAfterStakeAll,
            this.buildData.debtBN
          );

          //抵押所有lina也无法生成lusd
          if (canBuildAfterStakeAll.lt(n2bn("0"))) {
            canBuildAfterStakeAll = n2bn("0");
          }

          //输入lusd超过最大可build数量
          if (n2bnForAsset(buildAmount).gt(canBuildAfterStakeAll)) {
            this.errors.amountMsg = `You don't have enough amount of ${this.selectedCollateral.name}.`;
            return;
          }

          let nowCanBuildMax = bnDiv(
            bnMul(
              bnAdd(
                parseUnitAndReformat(this.buildData.stakedBN),
                parseUnitAndReformat(this.buildData.lockBN)
              ),
              parseUnitAndReformat(this.buildData.LINA2USDBN, false)
            ),
            n2bnForAsset((this.buildData.targetRatio / 100).toString())
          );

          let nowCanBuild = bnSub(nowCanBuildMax, this.buildData.debtBN);

          //输入lusd大于现在直接可以build的数量
          if (n2bnForAsset(buildAmount.toString()).gt(nowCanBuild)) {
            let needStakeAmount = bnDiv(
              bnMul(
                bnSub(n2bnForAsset(buildAmount.toString()), nowCanBuild),
                n2bnForAsset((this.buildData.targetRatio / 100).toString())
              ),
              parseUnitAndReformat(this.buildData.LINA2USDBN, false)
            );

            this.inputData.stake = formatEtherToNumber(needStakeAmount);
            this.actionData.stake = n2bnForAsset(
              roundCryptoValueString(
                bn2nForAsset(needStakeAmount).toString(),
                this.selectedCollateral.key
              ),
              this.selectedCollateral.key
            );

            //需要approve
            if (
              needStakeAmount.gt(n2bn("0")) &&
              needStakeAmount.gt(this.buildData.approvedBN)
            ) {
              this.actionData.needApprove = n2bn("10000000000");
            }

            // this.actionData.ratio = bnMul(
            //     bnDiv(
            //         bnMul(
            //             bnAdd(
            //                 bnAdd(
            //                     this.buildData.stakedBN,
            //                     this.buildData.lockBN
            //                 ),
            //                 needStakeAmount
            //             ),
            //             this.buildData.LINA2USDBN
            //         ),
            //         bnAdd(
            //             this.buildData.debtBN,
            //             n2bn(buildAmount.toString())
            //         )
            //     ),
            //     n2bn("100".toString())
            // );
          } else {
            // this.actionData.ratio = bnMul(
            //     bnDiv(
            //         bnMul(
            //             bnAdd(
            //                 this.buildData.stakedBN,
            //                 this.buildData.lockBN
            //             ),
            //             this.buildData.LINA2USDBN
            //         ),
            //         bnAdd(
            //             this.buildData.debtBN,
            //             n2bn(buildAmount.toString())
            //         )
            //     ),
            //     n2bn("100".toString())
            // );
          }

          // this.inputData.ratio = formatEtherToNumber(
          //     this.actionData.ratio
          // );

          this.inputData.amount = buildAmount;
          this.actionData.amount = n2bnForAsset(buildAmount.toString());

          this.adjustMinStake();
        }
      } catch (error) {
        console.log(error, "build change error");
        this.errors.amountMsg = "Invalid number";
      }
    },

    displayAssetKey(name) {
      return getAssetObjectInfo(name).key;
    },

    //ratio改变事件
    changeRatio(ratioAmount) {
      try {
        this.resetErrorsMsg();
        // this.resetInputData();

        if (!ratioAmount) return;

        if (!this.isEthDevNetwork) {
          if (this.buildData.debtBN.eq("0")) {
            this.errors.ratioMsg = "There is no debt.";
            return;
          }

          if (ratioAmount == 0) {
            this.inputData.stake = 0;
            this.inputData.amount = 0;
            this.inputData.ratio = ratioAmount;
            this.errors.ratioMsg = "The P-Ratio cant be below target ratio.";
            return;
          } else if (ratioAmount == this.buildData.currentRatio) {
            //ratioAmount 等于 targetRatio，不需要操作
            this.inputData.stake = 0;
            this.inputData.amount = 0;
            this.inputData.ratio = ratioAmount;
            return;
          } else if (
            (this.buildData.targetRatio > this.buildData.currentRatio &&
              ratioAmount < this.buildData.currentRatio) ||
            (this.buildData.targetRatio < this.buildData.currentRatio &&
              ratioAmount < this.buildData.targetRatio)
          ) {
            //ratioAmount 不允许小于 targetRatio 与 currentRatio 之间较小那个
            this.inputData.stake = 0;
            this.inputData.amount = 0;
            this.inputData.ratio = ratioAmount;
            this.errors.ratioMsg = "The P-Ratio is too low.";
            return;
          }

          let maxRatioAfterStakeMax = n2bn("0");

          maxRatioAfterStakeMax = bnMul(
            bnDiv(
              bnMul(
                bnAdd(
                  bnAdd(
                    parseUnitAndReformat(this.buildData.stakedBN),
                    parseUnitAndReformat(this.buildData.lockBN)
                  ),
                  parseUnitAndReformat(this.buildData.LINABN)
                ),
                parseUnitAndReformat(this.buildData.LINA2USDBN, false)
              ),
              parseUnitAndReformat(this.buildData.debtBN, false)
            ),
            n2bn("100")
          );

          //大于最大可上调的pratio
          if (
            !maxRatioAfterStakeMax.eq("0") &&
            n2bn(ratioAmount.toString()).gt(maxRatioAfterStakeMax)
          ) {
            this.errors.ratioMsg = `The P-Ratio can't be larger than your staking amount of ${this.selectedCollateral.name}.`;
            return;
          }

          if (ratioAmount > this.buildData.currentRatio) {
            //上调抵押率，计算stake lina，lusd不动
            //计算达成ratioAmount时，需要再stake多少lina
            let stakeWhenRaisePratio = bnSub(
              bnDiv(
                bnMul(
                  n2bnForAsset((ratioAmount / 100).toString()),
                  parseUnitAndReformat(this.buildData.debtBN, false)
                ),
                parseUnitAndReformat(this.buildData.LINA2USDBN, false)
              ),
              parseUnitAndReformat(this.buildData.lockBN)
            );

            let needStake = bnSub(
              parseUnitAndReformat(stakeWhenRaisePratio, false),
              parseUnitAndReformat(this.buildData.stakedBN)
            );

            //需要approve
            if (
              needStake.gt(n2bn("0")) &&
              needStake.gt(this.buildData.approvedBN)
            ) {
              this.actionData.needApprove = n2bn("10000000000");
            }

            this.inputData.stake = formatEtherToNumber(needStake);
            this.actionData.stake = n2bnForAsset(
              roundCryptoValueString(
                bn2nForAsset(needStake, this.selectedCollateral.key).toString(),
                this.selectedCollateral.key
              ),
              this.selectedCollateral.key
            );

            this.inputData.amount = 0;
            this.actionData.amount = n2bn("0");

            this.inputData.ratio = ratioAmount;
            this.actionData.ratio = n2bn(ratioAmount.toString());
          } else if (
            ratioAmount < this.buildData.currentRatio &&
            ratioAmount >= this.buildData.targetRatio
          ) {
            //下调抵押率，计算lusd，stake lina不动
            //下调抵押率至ratioAmount需要生成多少债务
            let debtWhenFallPratio = bnDiv(
              bnMul(
                bnAdd(
                  parseUnitAndReformat(this.buildData.stakedBN),
                  parseUnitAndReformat(this.buildData.lockBN)
                ),
                parseUnitAndReformat(this.buildData.LINA2USDBN, false)
              ),
              n2bnForAsset((ratioAmount / 100).toString())
            );

            //下调抵押率至ratioAmount需要build多少lusd
            let needBuildAmount = bnSub(
              debtWhenFallPratio,
              this.buildData.debtBN
            );

            this.inputData.stake = 0;
            this.actionData.stake = n2bn("0");

            this.inputData.amount = formatEtherToNumber(needBuildAmount);
            this.actionData.amount = needBuildAmount;

            this.inputData.ratio = ratioAmount;
            this.actionData.ratio = n2bnForAsset(ratioAmount.toString());
          }

          this.adjustMinStake();
        }
      } catch (error) {
        console.log(error, "ratio change error");
        this.errors.ratioMsg = "Invalid number";
      }
    },

    /**
     * 点击build
     */
    async clickBuild() {
      const minCollateral = getAssetObjectInfo(
        this.selectedCollateral.key
      ).minCollateral;

      try {
        if (!this.buildDisabled) {
          if (this.isEthereumNetwork) {
            this.actionTabs = "m1"; //进入swap流程
          } else if (this.isBinanceNetwork) {
            this.processing = true;

            //清空之前数据
            this.waitProcessArray = [];

            if (this.actionData.needApprove.gt("0")) {
              this.shouldApprove = true;
            }

            if (
              this.actionData.stake.gte(n2bnForAsset(minCollateral)) &&
              this.actionData.amount.gte(n2bn("0.01"))
            ) {
              //合并进度
              if (
                BUILD_PROCESS_SETUP.STAKING_BUILD.includes("[REPLACE_CURRENCY]")
              ) {
                BUILD_PROCESS_SETUP.STAKING_BUILD = _.replace(
                  BUILD_PROCESS_SETUP.STAKING_BUILD,
                  "[REPLACE_CURRENCY]",
                  this.selectedCollateral.name
                );
              } else {
                BUILD_PROCESS_SETUP.STAKING_BUILD = replaceWaitProcessString(
                  BUILD_PROCESS_SETUP.STAKING_BUILD,
                  this.selectedCollateral.name
                );
              }

              this.waitProcessArray.push(BUILD_PROCESS_SETUP.STAKING_BUILD);
            } else {
              //单步进度

              if (this.actionData.stake.gte(n2bnForAsset(minCollateral))) {
                if (
                  BUILD_PROCESS_SETUP.STAKING.includes("[REPLACE_CURRENCY]")
                ) {
                  BUILD_PROCESS_SETUP.STAKING = _.replace(
                    BUILD_PROCESS_SETUP.STAKING,
                    "[REPLACE_CURRENCY]",
                    this.selectedCollateral.name
                  );
                } else {
                  BUILD_PROCESS_SETUP.STAKING = replaceWaitProcessString(
                    BUILD_PROCESS_SETUP.STAKING,
                    this.selectedCollateral.name
                  );
                }
                this.waitProcessArray.push(BUILD_PROCESS_SETUP.STAKING);
              }

              if (this.actionData.amount.gte(n2bn("0.01"))) {
                this.waitProcessArray.push(BUILD_PROCESS_SETUP.BUILD);
              }
            }

            this.confirmTransactionStep = 0;
            this.actionTabs = "m1"; //进入等待页

            this.waitProcessFlow = this.startFlow();

            //开始逻辑流处理函数
            await this.waitProcessFlow();
          }
        }
      } catch (error) {
        this.transactionErrMsg = "Something went wrong, please try again.";
      } finally {
        this.processing = false;
      }
    },

    //开始逻辑流(闭包,可复用)
    startFlow() {
      return async () => {
        try {
          this.transactionErrMsg = "";

          if (this.shouldApprove) {
            await this.startApproveContract(n2bn(Number.MAX_SAFE_INTEGER));
          }

          if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            BUILD_PROCESS_SETUP.STAKING_BUILD
          ) {
            await this.startStakingAndBuildMaxContract({
              stakeAmountLINA: this.actionData.stake,
              buildAmountlUSD: this.actionData.amount,
            });
          } else if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            BUILD_PROCESS_SETUP.STAKING
          ) {
            await this.startStakingContract(this.actionData.stake);
          } else if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            BUILD_PROCESS_SETUP.BUILD
          ) {
            await this.startBuildContract(this.actionData.amount);
          }
        } catch (error) {
          //自定义错误
          if (
            _.has(error, "code") &&
            [6100001, 6100002, 6100003, 6100004].includes(error.code)
          ) {
            this.transactionErrMsg = error.message;
          } else {
            console.log(error, "startFlow error");
            //通用错误
            this.transactionErrMsg = "Something went wrong, please try again.";
          }
        }
      };
    },

    //开始Approve合约调用
    async startApproveContract(approveAmountLINA) {
      this.confirmTransactionStatus = false;

      const { utils } = lnrJSConnector;
      const LnCollateralSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnCollateralSystem;
      const LinearFinance =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LinearFinance;

      //取合约地址
      const LnCollateralSystemAddress = LnCollateralSystem.address;

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: this.gasLimit,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit = await this.getGasEstimateFromApprove(
        LnCollateralSystemAddress,
        approveAmountLINA
      );

      let transaction = await LinearFinance.approve(
        LnCollateralSystemAddress,
        approveAmountLINA,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        const amountStepNum = this.shouldApprove
          ? this.waitProcessArray.length + 1
          : this.waitProcessArray.length;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.APPROVE,
          networkId: this.walletNetworkId,
          value: `Building 1 / ${amountStepNum}`,
        });
        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100001,
            message:
              "Something went wrong while gaining approval from the contract, please try again.",
          };
        }

        this.shouldApprove = false;
      }
    },

    //开始抵押和build合约调用
    async startStakingAndBuildMaxContract(
      { stakeAmountLINA, buildAmountlUSD } = {
        stakeAmountLINA: n2bn("0"),
        buildAmountlUSD: n2bn("0"),
      }
    ) {
      this.confirmTransactionStatus = false;
      this.confirmTransactionNetworkId = this.walletNetworkId;

      //多抵押一点,防止build失败
      let tempStakeAmount = n2bnForAsset(
        roundCryptoValueString(
          bn2nForAsset(stakeAmountLINA, this.selectedCollateral.key).toString(),
          this.selectedCollateral.key
        ),
        this.selectedCollateral.key
      );
      const minCollateral = getAssetObjectInfo(
        this.selectedCollateral.key
      ).minCollateral;

      //小于等于最大数
      if (tempStakeAmount.lte(this.buildData.LINABN)) {
        stakeAmountLINA = tempStakeAmount;
      }

      //合约需要大于1
      if (stakeAmountLINA.eq(n2bnForAsset(minCollateral))) {
        stakeAmountLINA = bnAdd(stakeAmountLINA, n2bn("0.000000000000000001"));
      }

      if (buildAmountlUSD.gt(n2bn("0.01"))) {
        buildAmountlUSD = n2bnForAsset(_.floor(bn2n(buildAmountlUSD), 4));
      }

      const { utils } = lnrJSConnector;
      const LnCollateralSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnCollateralSystem;

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: this.gasLimit,
      };

      transactionSettings.gasLimit =
        await this.getGasEstimateFromStakingAndBuildMax(
          stakeAmountLINA,
          buildAmountlUSD
        );
      let transaction = await LnCollateralSystem.stakeAndBuildMax(
        utils.formatBytes32String(this.selectedCollateral.contractKey),
        stakeAmountLINA,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        const currentStepNum =
          this.confirmTransactionStep + (this.shouldApprove ? 2 : 1);
        const amountStepNum =
          this.waitProcessArray.length + (this.shouldApprove ? 1 : 0);

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.BUILD,
          networkId: this.walletNetworkId,
          value: `Building ${currentStepNum} / ${amountStepNum}`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100003,
            message:
              "Something went wrong while building your ℓUSD, please try again.",
          };
        }

        this.confirmTransactionStep += 1;
      }
    },

    //开始抵押合约调用
    async startStakingContract(stakeAmountLINA) {
      this.confirmTransactionStatus = false;

      //多抵押一点,防止build失败
      let tempStakeAmount = n2bnForAsset(
        roundCryptoValueString(
          bn2nForAsset(stakeAmountLINA, this.selectedCollateral.key).toString(),
          this.selectedCollateral.key
        ),
        this.selectedCollateral.key
      );

      //小于等于最大数
      if (tempStakeAmount.lte(this.buildData.LINABN)) {
        stakeAmountLINA = tempStakeAmount;
      }

      //合约需要大于1
      if (stakeAmountLINA.eq(n2bn("1"))) {
        stakeAmountLINA = bnAdd(stakeAmountLINA, n2bn("0.000000000000000001"));
      }

      const { utils } = lnrJSConnector;
      const LnCollateralSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnCollateralSystem;

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: this.gasLimit,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit = await this.getGasEstimateFromStaking(
        stakeAmountLINA
      );

      let transaction = await LnCollateralSystem.Collateral(
        utils.formatBytes32String(this.selectedCollateral.contractKey),
        stakeAmountLINA,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.STAKING,
          networkId: this.walletNetworkId,
          value: `Building ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100002,
            message:
              "Something went wrong while staking your asset, please try again.",
          };
        }

        this.confirmTransactionStep += 1;
      }
    },

    //开始Build合约调用
    async startBuildContract(buildAmountlUSD) {
      this.confirmTransactionStatus = false;

      buildAmountlUSD = n2bn(_.floor(bn2n(buildAmountlUSD), 4));

      const { utils } = lnrJSConnector;
      const LnBuildBurnSystem =
        lnrJSConnector.multiCollateral[this.selectedCollateral.key]
          .LnBuildBurnSystem;

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: this.gasLimit,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit = await this.getGasEstimateFromBuild(
        buildAmountlUSD
      );

      let transaction = await LnBuildBurnSystem.BuildAsset(
        buildAmountlUSD,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.BUILD,
          networkId: this.walletNetworkId,
          value: `Building ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100003,
            message:
              "Something went wrong while building your ℓUSD, please try again.",
          };
        }

        this.confirmTransactionStep += 1;
      }
    },

    //评估Approve的gas
    async getGasEstimateFromApprove(contractAddress, approveAmountLINA) {
      try {
        const { utils } = lnrJSConnector;
        const LinearFinance =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LinearFinance;

        if (
          approveAmountLINA.isZero() ||
          approveAmountLINA.lt("0") //小于等于0
        ) {
          throw new Error("invalid approveAmountLINA");
        }

        let gasEstimate = await LinearFinance.estimateGas.approve(
          contractAddress,
          approveAmountLINA
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.approve);
      }
    },

    //评估StakingAndBuild的gas
    async getGasEstimateFromStakingAndBuildMax(
      stakeAmountLINA,
      buildAmountlUSD
    ) {
      try {
        const { utils } = lnrJSConnector;
        const LnCollateralSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnCollateralSystem;

        if (
          stakeAmountLINA.lte("0") &&
          buildAmountlUSD.lte("0") //小于等于0
        ) {
          throw new Error("invalid input");
        }
        let gasEstimate = await LnCollateralSystem.estimateGas.stakeAndBuildMax(
          utils.formatBytes32String(this.selectedCollateral.contractKey),
          stakeAmountLINA
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        console.log(e, "getGasEstimateFromStakingAndBuildMax");
        return bufferGasLimit(DEFAULT_GAS_LIMIT.staking);
      }
    },

    //评估Staking的gas
    async getGasEstimateFromStaking(stakeAmountLINA) {
      try {
        const { utils } = lnrJSConnector;
        const LnCollateralSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnCollateralSystem;

        if (
          stakeAmountLINA.isZero() ||
          stakeAmountLINA.lt("0") //小于等于0
        ) {
          throw new Error("invalid stakeAmountLINA");
        }

        let gasEstimate = await LnCollateralSystem.estimateGas.Collateral(
          utils.formatBytes32String(this.selectedCollateral.contractKey),
          stakeAmountLINA
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.staking);
      }
    },

    //评估Build的gas
    async getGasEstimateFromBuild(buildAmountlUSD) {
      try {
        const LnBuildBurnSystem =
          lnrJSConnector.multiCollateral[this.selectedCollateral.key]
            .LnBuildBurnSystem;

        if (
          buildAmountlUSD <= 0 //小于等于0
        ) {
          throw new Error("invalid buildAmountlUSD");
        }

        let gasEstimate = await LnBuildBurnSystem.estimateGas.BuildAsset(
          buildAmountlUSD
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.build);
      }
    },

    //重置输入框状态
    resetInputData() {
      //输入框展示数据
      this.inputData = {
        stake: null,
        amount: null,
        ratio: 0,
      };

      //真实操作数据
      this.actionData = {
        stake: n2bn("0"),
        amount: n2bn("0"),
        needApprove: n2bn("0"),
        ratio: n2bn("0"),
      };
    },

    //重置错误信息
    resetErrorsMsg() {
      this.errors = {
        stakeMsg: "",
        amountMsg: "",
        ratioMsg: "",
      };
    },

    //改变激活元素
    //Select item here
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
    //Select different inputbox
    inputBlur(index) {
      this.$nextTick(() => {
        let currentElement = this.$refs["itemInput" + index].$el;
        let parentElement = findParents(currentElement, "actionInputItem");
        removeClass(parentElement, "active");
      });
    },

    //点击购买
    clickBuy() {
      if (this.selectedCollateral.key == LINA) {
        this.toggleModal();
        this.activeItemBtn = 0;
      } else {
        window.open(this.selectedCollateral.buyLink);
        this.activeItemBtn = 0;
      }
    },

    showIntroductActionModal() {
      this.introductActionModal = true;
    },

    //回到默认状态
    //Back to default page
    setDefaultTab() {
      this.activeItemBtn = -1;
      this.actionTabs = "m0";

      this.waitProcessArray = [];
      this.confirmTransactionStep = 0;
      this.getBuildData();

      this.sourceNetworkId = this.walletNetworkId;

      this.resetInputData();
    },

    //重试
    //Retry page
    tryAgain() {
      this.setDefaultTab();
    },
    setSelectedCollateral(item) {
      this.selectedCollateral = item;
    },
  },
};
</script>

<style lang="scss">
#build {
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
        background: white;

        .buildBox,
        .waitingBox,
        .successBox,
        .wrongBox {
          width: 100%;
          height: 100%;
        }

        .buildBox {
          position: relative;

          .actionBodyWeb {
            padding: 64px 193px 0;
            display: flex;
            flex-direction: column;
            align-items: center;

            .actionTitle {
              font-family: $HeadingsFontFamily;
              font-size: 32px;
              font-weight: 200;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.25;
              letter-spacing: normal;
              text-align: center;
              color: #101a28;
            }

            .actionDesc {
              margin-top: 8px;
              font-family: $BodyTextFontFamily;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.29;
              letter-spacing: normal;
              text-align: center;
              color: #475a75;
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
              padding: 4px 16px;
              border-radius: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
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

                  img {
                    width: 100%;
                    height: 100%;
                  }
                  .app-dark & {
                    background: none;
                  }
                }

                .itemType {
                  .itemTypeTitle {
                    display: flex;
                    align-items: center;
                    font-family: Gilroy-bold;
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

                  .app-dark & {
                    .itemTypeBtn {
                      color: #3c3a3e;
                    }
                  }

                  .itemTypeBtn {
                    transition: $animete-time linear;
                    cursor: pointer;
                    display: flex;
                    text-transform: uppercase;
                    font-family: Gilroy-bold;
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
                      font-family: Gilroy-bold;
                      font-size: 32px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.25;
                      letter-spacing: normal;
                      color: #5a575c;

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

            #gasEditor,
            #gasEditorSwap {
              margin-top: 20px;
            }
          }

          .actionBodyMobile {
            display: none;
          }

          .buildBtn {
            width: 100%;
            position: absolute;
            bottom: 0px;
            height: 80px;
            line-height: 80px;
            cursor: pointer;
            background: #1a38f8;
            text-transform: uppercase;
            transition: $animete-time linear;

            font-family: Gilroy-Bold;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 80px;
            letter-spacing: 3px;
            text-align: center;
            color: #ffffff;

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
}

@media only screen and (max-width: $max-phone-width) {
  #build {
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

          .buildBox,
          .waitingBox,
          .successBox,
          .wrongBox {
            width: 100%;
            height: 88vh !important;
            min-height: 550px;
            display: flex;
            justify-content: center;
          }

          .buildBox {
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
                font-size: 12px;
                color: #df434c;

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
                border-radius: 8px;
                border: solid 1px #deddde;
                margin-bottom: 12px;
                padding: 15px 15px 10px;
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

                    img {
                      width: 100%;
                      height: 100%;
                    }
                    .app-dark & {
                      background: none;
                    }
                  }

                  .itemType {
                    .itemTypeTitle {
                      display: flex;
                      align-items: center;
                      font-family: Gilroy-bold;
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
                      font-family: Gilroy-bold;
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
                        font-family: Gilroy-bold;
                        font-size: 32px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.25;
                        letter-spacing: normal;
                        color: #5a575c;

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

            .buildBtn {
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
