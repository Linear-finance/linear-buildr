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
                .
              </template>
              <template v-else>
                Build ℓUSD and earn staking rewards by staking LINA.
              </template>
            </div>
            <div class="actionRate" v-if="isBinanceNetwork">
              1 LINA =
              {{ formatNumberFromBigNumber(buildData.LINA2USDBN, 4) }}
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
                  <img v-if="theme === 'light'" src="@/static/LINA_logo.svg" />
                  <img v-else src="@/static/dark-theme/LINA_logo.svg" />
                </div>
                <div class="itemType">
                  <div class="itemTypeTitle">Stake LINA</div>
                  <div
                    class="itemTypeBtn"
                    :class="{ active: activeItemBtn == 0 }"
                    @click.stop="toggleModal"
                  >
                    buy lina
                    <img src="@/static/arrow_right.svg" />
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
                    :min="1"
                    :max="100000000000"
                    @on-change="changeStakeAmount"
                    @on-focus="inputFocus(0)"
                    @on-blur="inputBlur(0)"
                    :formatter="formatterInput"
                  />
                  <!-- :formatter="
                                            value =>
                                                floor(
                                                    toNonExponential(value),
                                                    DECIMAL_PRECISION
                                                )
                                        " -->
                  <!-- :max="formatEtherToNumber(buildData.maxAvaliableLINA)" -->
                  <!-- <div class="unit">lina</div> -->
                </div>
                <!-- <div class="avaliable">Avaliable : 1,000</div> -->
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
                    :class="{ active: activeItemBtn == 1 }"
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
                  />

                  <!-- :formatter=" value => floor(
                                        toNonExponential(value), DECIMAL_PRECISION )
                                    " -->
                  <!-- :max="formatEtherToNumber(buildData.maxAvaliablelUSD)" -->
                  <!-- <div class="unit">ℓUSD</div> -->
                </div>
                <!-- <div class="avaliable">Avaliable : 1,000</div> -->
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
                    :class="{ active: activeItemBtn == 2 }"
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
                    :max="100000000000"
                    v-model="inputData.ratio"
                    @on-change="changeRatio"
                    @on-focus="inputFocus(2)"
                    @on-blur="inputBlur(2)"
                    placeholder="0"
                    :formatter="(value) => formatterInput(value, 0)"
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
            </div>

            <div class="actionRate">
              1 LINA =
              {{ formatNumberFromBigNumber(buildData.LINA2USDBN, 4) }}
              ℓUSD
            </div>

            <div class="inputGroupBox">
              <div
                class="actionInputItem"
                :class="{
                  error: errors.stakeMsg || errors.amountMsg,
                }"
              >
                <img
                  v-if="theme === 'light'"
                  class="showInfo"
                  src="@/static/info_white.svg"
                  @click="showIntroductActionModal"
                />
                <img
                  v-else
                  class="showInfo"
                  src="@/static/dark-theme/info_white.svg"
                  @click="showIntroductActionModal"
                />

                <div class="box">
                  <div class="itemType">
                    <img
                      v-if="theme === 'light'"
                      src="@/static/LINA_logo.svg"
                    />
                    <img v-else src="@/static/dark-theme/LINA_logo.svg" />
                    <div class="itemTypeTitle">Stake LINA</div>
                    <InputNumber
                      class="input"
                      ref="itemInput3"
                      type="text"
                      v-model="inputData.stake"
                      placeholder="0"
                      :max="100000000000"
                      @on-change="changeStakeAmount"
                      @on-focus="inputFocus(3)"
                      @on-blur="inputBlur(3)"
                      :formatter="formatterInput"
                    />
                  </div>

                  <div class="itemType">
                    <img
                      v-if="theme === 'light'"
                      src="@/static/currency/lUSD.svg"
                    />
                    <img v-else src="@/static/dark-theme/currency/lUSD.svg" />
                    <div class="itemTypeTitle">Build ℓUSD</div>
                    <InputNumber
                      class="input"
                      ref="itemInput4"
                      type="text"
                      :max="100000000000"
                      v-model="inputData.amount"
                      @on-change="changeBuildAmount"
                      @on-focus="inputFocus(4)"
                      @on-blur="inputBlur(4)"
                      placeholder="0"
                      :formatter="formatterInput"
                    />
                  </div>
                </div>

                <div
                  class="itemTypeBtn"
                  :class="{ active: activeItemBtn == 1 }"
                  @click.stop="clickMaxBuildAmount"
                >
                  Max
                </div>
              </div>
            </div>

            <div
              class="actionInputItem"
              :class="{
                error: errors.ratioMsg,
              }"
              @click="changeFocusItem(5)"
            >
              <div class="ratioInputBox">
                <div class="box">
                  <div class="itemTypeTitle">P Ratio</div>
                  <InputNumber
                    class="input"
                    ref="itemInput5"
                    type="text"
                    :max="100000000000"
                    v-model="inputData.ratio"
                    @on-change="changeRatio"
                    @on-focus="inputFocus(5)"
                    @on-blur="inputBlur(5)"
                    placeholder="0"
                    :formatter="(value) => formatterInput(value, 0)"
                  />
                </div>

                <div
                  class="itemTypeBtn"
                  :class="{ active: activeItemBtn == 2 }"
                  @click.stop="clickTargetRatio"
                >
                  Target ratio
                </div>
              </div>
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
        ></watingEnhanceSwapNew>
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
import { openBuyLINA, toNonExponential } from "@/common/utils";

import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import {
  storeDetailsData,
  getPriceRates,
  // getPriceRatesFromApi,
  getBuildRatio,
} from "@/assets/linearLibrary/linearTools/request";
import { DECIMAL_LENGTH } from "@/assets/linearLibrary/linearTools/constants/flow";

import {
  findParents,
  removeClass,
  addClass,
  formatterInput,
} from "@/common/utils";

import {
  formatEtherToNumber,
  formatNumber,
  formatNumberFromBigNumber,
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
  bnAdd2N,
  bnSub2N,
  bnMul2N,
  bnDiv2N,
  MAX_DECIMAL_LENGTH,
  n2bn,
  bn2n,
} from "@/common/bnCalc";

import { BigNumber, utils } from "ethers";

import {
  BUILD_PROCESS_SETUP,
  DECIMAL_PRECISION,
} from "@/assets/linearLibrary/linearTools/constants/process";

import watingEnhanceSwapNew from "@/components/transferStatus/watingEnhanceSwapNew";
import gasEditorSwap from "@/components/gasEditorSwap";
import linkModal from "~/components/linkModal.vue";

export default {
  name: "build",
  data() {
    return {
      utils, // ethers工具包
      DECIMAL_PRECISION,
      formatNumber, //千分格式化
      formatNumberFromBigNumber, //大数格千分格式化
      formatEtherToNumber,
      floor: _.floor, //向下取值
      toNonExponential, //科学计数法转正常显示 Conversion of scientific counting method to digital text
      actionTabs: "m0", //子页(m0默认,m1执行) Subpages(m0 default, m1 waiting)

      activeItemBtn: -1, //当前激活按钮 0,1,2 Start with -1

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
    };
  },
  components: {
    gasEditor,
    gasEditorSwap,
    watingEnhanceSwapNew,
    linkModal,
  },
  watch: {
    walletAddress() {},
    errorHandle() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    isMobile() {},
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
  },
  created() {
    this.getBuildData(this.walletAddress);

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
          await this.getBuildData(this.walletAddress);
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
      if (this.inputData.stake < 1 || this.actionData.stake.lt(n2bn("1"))) {
        this.$nextTick(() => {
          this.inputData.stake = 0;
          this.actionData.stake = n2bn("0");
        });
      }
    },

    /**
     * 获取数据
     */
    async getBuildData(walletAddress) {
      try {
        this.processing = true;

        const {
          lnrJS: {
            LinearFinance,
            LnCollateralSystem,
            LnRewardLocker,
            LnDebtSystem,
          },
          utils,
        } = lnrJSConnector;

        if (this.isEthDevNetwork) {
          const avaliableLINA = await LinearFinance.balanceOf(walletAddress); //LINA余额

          this.buildData.LINA = _.floor(
            formatEtherToNumber(avaliableLINA),
            DECIMAL_PRECISION
          );

          this.buildData.LINABN = avaliableLINA;
        } else {
          const LINABytes = utils.formatBytes32String("LINA");
          //取合约地址
          const LnCollateralSystemAddress = LnCollateralSystem.address;

          const results = await Promise.all([
            LinearFinance.balanceOf(walletAddress), //LINA余额
            LnCollateralSystem.userCollateralData(walletAddress, LINABytes), //staked lina
            LnRewardLocker.balanceOf(walletAddress), //lock lina
            LinearFinance.allowance(walletAddress, LnCollateralSystemAddress), //已 approved 的 lina 额度
            LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress), //总债务
            getBuildRatio(), //目标抵押率
            LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress), //个人全部抵押物兑lUSD,用于计算pratio
          ]);

          const [
            avaliableLINA,
            stakedLina,
            lockLina,
            approvedLina,
            amountDebt,
            buildRatio,
            totalCollateralInUsd,
          ] = results.map(formatEtherToNumber);

          let currentRatioPercent = n2bn("0");

          if (results[6].gt("0") && results[4][0].gt("0")) {
            currentRatioPercent = bnMul(
              bnDiv(results[6], results[4][0]),
              n2bn("100")
            );
          }

          const targetRatioPercent = 100 / buildRatio; //目标抵押率

          const priceRates = await getPriceRates(["LINA", "lUSD"]);
          // const priceRates = await getPriceRatesFromApi(["LINA", "lUSD"]);

          const LINAPrice = priceRates.LINA / priceRates.lUSD;
          const LINAPriceBN = bnDiv(priceRates.LINA, priceRates.lUSD);

          this.buildData.LINA = _.floor(avaliableLINA, DECIMAL_PRECISION);
          this.buildData.LINABN = results[0];

          this.buildData.LINA2USD = _.floor(LINAPrice, DECIMAL_PRECISION);
          this.buildData.LINA2USDBN = LINAPriceBN;

          this.buildData.staked = _.floor(stakedLina, DECIMAL_PRECISION);
          this.buildData.stakedBN = results[1];

          this.buildData.lock = _.floor(lockLina, DECIMAL_PRECISION);
          this.buildData.lockBN = results[2];

          this.buildData.approvedBN = results[3];

          this.buildData.debt = _.floor(amountDebt[0], DECIMAL_PRECISION);
          this.buildData.debtBN = results[4][0];

          this.buildData.targetRatio = targetRatioPercent;
          this.buildData.currentRatio =
            formatEtherToNumber(currentRatioPercent);
          this.buildData.currentRatioBN = currentRatioPercent;

          //获取当前抵押率
          this.inputData.ratio = this.buildData.currentRatio;
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
              bnAdd(
                bnAdd(this.buildData.LINABN, this.buildData.stakedBN),
                this.buildData.lockBN
              ),
              this.buildData.LINA2USDBN
            ),
            n2bn((this.buildData.targetRatio / 100).toString())
          );

          //可以生成的lUSD小于等于债务
          if (allCanBuildLUSDAfterStakeAll.lte(this.buildData.debtBN)) {
            this.errors.amountMsg = "You don't have enough amount of LINA.";
            return;
          }

          //需要approve
          if (
            this.buildData.LINABN.gt(n2bn("0")) &&
            this.buildData.LINABN.gt(this.buildData.approvedBN)
          ) {
            this.actionData.needApprove = n2bn("10000000000");
          }

          this.inputData.stake = formatEtherToNumber(this.buildData.LINABN);
          this.inputData.amount = formatEtherToNumber(
            bnSub(allCanBuildLUSDAfterStakeAll, this.buildData.debtBN)
          );
          this.inputData.ratio = 350;

          this.actionData.stake = this.buildData.LINABN;
          this.actionData.amount = bnSub(
            allCanBuildLUSDAfterStakeAll,
            this.buildData.debtBN
          );
          this.actionData.ratio = n2bn("350");

          this.adjustMinStake();
        }
      } catch (error) {
        console.log(error, "clickMaxBuildAmount error");
      }
    },

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
              n2bn(this.buildData.targetRatio.toString())
            )
          ) {
            //抵押率大于目标抵押率，只build，不计算stake
            let stakeAndLockToLUSD = bnDiv(
              bnMul(
                bnAdd(this.buildData.stakedBN, this.buildData.lockBN),
                this.buildData.LINA2USDBN
              ),
              n2bn((this.buildData.targetRatio / 100).toString())
            );

            this.inputData.stake = 0;
            this.inputData.amount =
              _.floor(
                formatEtherToNumber(
                  bnSub(stakeAndLockToLUSD, this.buildData.debtBN)
                ),
                DECIMAL_PRECISION
              ) - this.toleranceDifference; //增加容错
            this.inputData.ratio = 350;

            this.actionData.stake = n2bn("0");
            this.actionData.amount = bnSub(
              bnSub(stakeAndLockToLUSD, this.buildData.debtBN),
              n2bn(this.toleranceDifference.toString())
            ); //增加容错

            // console.log(this.actionData.amount,'this.actionData.amount ');
            this.actionData.ratio = n2bn("350");
          } else if (
            this.buildData.currentRatioBN.lt(
              n2bn(this.buildData.targetRatio.toString())
            )
          ) {
            //抵押率小于目标抵押率，只stake，不计算build
            //当抵押率等于目标抵押率时，需要stake的lina数量
            let needStakeWhenTargetRatio = bnSub(
              bnDiv(
                bnMul(
                  n2bn((this.buildData.targetRatio / 100).toString()),
                  this.buildData.debtBN
                ),
                this.buildData.LINA2USDBN
              ),
              this.buildData.lockBN
            );

            //需要补充抵押的lina数量
            let newStakeAmount = bnSub(
              needStakeWhenTargetRatio,
              this.buildData.stakedBN
            );

            //可用lina数量不足
            if (newStakeAmount.gt(this.buildData.LINABN)) {
              this.errors.ratioMsg = "You don't have enough amount of LINA.";
              return;
            }

            //需要approve
            if (newStakeAmount.gt(this.buildData.approvedBN)) {
              this.actionData.needApprove = n2bn("10000000000");
            }

            this.inputData.stake = formatEtherToNumber(newStakeAmount);
            this.inputData.amount = 0;
            this.inputData.ratio = 350;

            this.actionData.stake = newStakeAmount;
            this.actionData.amount = n2bn("0");
            this.actionData.ratio = n2bn("350");
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
          this.errors.stakeMsg = "You can't stake the amount of LINA.";
          return;
        }

        if (n2bn(stakeAmount.toString()).gt(this.buildData.LINABN)) {
          this.errors.stakeMsg = "You don't have enough amount of LINA.";
          return;
        }

        if (!this.isEthDevNetwork) {
          //抵押输入的lina时能生成的最大lusd
          let canBuildMaxAfterStake = bnDiv(
            bnMul(
              bnAdd(
                bnAdd(this.buildData.stakedBN, this.buildData.lockBN),
                n2bn(stakeAmount.toString())
              ),
              this.buildData.LINA2USDBN
            ),
            n2bn((this.buildData.targetRatio / 100).toString())
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
          this.actionData.stake = n2bn(stakeAmount.toString());

          this.adjustMinStake();

          this.actionData.ratio = bnMul(
            bnDiv(
              bnMul(
                canBuildMaxAfterStake,
                n2bn(this.buildData.targetRatio / 100)
              ),
              bnAdd(this.actionData.amount, this.buildData.debtBN)
            ),
            n2bn("100")
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
                bnAdd(this.buildData.stakedBN, this.buildData.lockBN),
                this.buildData.LINABN
              ),
              this.buildData.LINA2USDBN
            ),
            n2bn((this.buildData.targetRatio / 100).toString())
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
          if (n2bn(buildAmount.toString()).gt(canBuildAfterStakeAll)) {
            this.errors.amountMsg = "You don't have enough amount of LINA.";
            return;
          }

          let nowCanBuildMax = bnDiv(
            bnMul(
              bnAdd(this.buildData.stakedBN, this.buildData.lockBN),
              this.buildData.LINA2USDBN
            ),
            n2bn((this.buildData.targetRatio / 100).toString())
          );

          let nowCanBuild = bnSub(nowCanBuildMax, this.buildData.debtBN);

          //输入lusd大于现在直接可以build的数量
          if (n2bn(buildAmount.toString()).gt(nowCanBuild)) {
            let needStakeAmount = bnDiv(
              bnMul(
                bnSub(n2bn(buildAmount.toString()), nowCanBuild),
                n2bn((this.buildData.targetRatio / 100).toString())
              ),
              this.buildData.LINA2USDBN
            );

            this.inputData.stake = formatEtherToNumber(needStakeAmount);
            this.actionData.stake = needStakeAmount;

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
          this.actionData.amount = n2bn(buildAmount.toString());

          this.adjustMinStake();
        }
      } catch (error) {
        console.log(error, "build change error");
        this.errors.amountMsg = "Invalid number";
      }
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
                  bnAdd(this.buildData.stakedBN, this.buildData.lockBN),
                  this.buildData.LINABN
                ),
                this.buildData.LINA2USDBN
              ),
              this.buildData.debtBN
            ),
            n2bn("100")
          );

          //大于最大可上调的pratio
          if (
            !maxRatioAfterStakeMax.eq("0") &&
            n2bn(ratioAmount.toString()).gt(maxRatioAfterStakeMax)
          ) {
            this.errors.ratioMsg =
              "The P-Ratio can't be larger than your staking amount of LINA.";
            return;
          }

          if (ratioAmount > this.buildData.currentRatio) {
            //上调抵押率，计算stake lina，lusd不动
            //计算达成ratioAmount时，需要再stake多少lina
            let stakeWhenRaisePratio = bnSub(
              bnDiv(
                bnMul(
                  n2bn((ratioAmount / 100).toString()),
                  this.buildData.debtBN
                ),
                this.buildData.LINA2USDBN
              ),
              this.buildData.lockBN
            );

            let needStake = bnSub(
              stakeWhenRaisePratio,
              this.buildData.stakedBN
            );

            //需要approve
            if (
              needStake.gt(n2bn("0")) &&
              needStake.gt(this.buildData.approvedBN)
            ) {
              this.actionData.needApprove = n2bn("10000000000");
            }

            this.inputData.stake = formatEtherToNumber(needStake);
            this.actionData.stake = needStake;

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
                bnAdd(this.buildData.stakedBN, this.buildData.lockBN),
                this.buildData.LINA2USDBN
              ),
              n2bn((ratioAmount / 100).toString())
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
            this.actionData.ratio = n2bn(ratioAmount.toString());
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
              this.actionData.stake.gte(n2bn("1")) &&
              this.actionData.amount.gte(n2bn("0.01"))
            ) {
              //合并进度
              this.waitProcessArray.push(BUILD_PROCESS_SETUP.STAKING_BUILD);
            } else {
              //单步进度
              if (this.actionData.stake.gte(n2bn("1"))) {
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

      const {
        lnrJS: { LnCollateralSystem, LinearFinance },
        utils,
      } = lnrJSConnector;

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
      let tempStakeAmount = n2bn(_.ceil(bn2n(stakeAmountLINA), 2));

      //小于等于最大数
      if (tempStakeAmount.lte(this.buildData.LINABN)) {
        stakeAmountLINA = tempStakeAmount;
      }

      //合约需要大于1
      if (stakeAmountLINA.eq(n2bn("1"))) {
        stakeAmountLINA = bnAdd(stakeAmountLINA, n2bn("0.000000000000000001"));
      }

      if (buildAmountlUSD.gt(n2bn("0.01"))) {
        buildAmountlUSD = n2bn(_.floor(bn2n(buildAmountlUSD), 2));
      }

      const {
        lnrJS: { LnCollateralSystem },
        utils,
      } = lnrJSConnector;

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
        utils.formatBytes32String("LINA"),
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
      let tempStakeAmount = n2bn(_.ceil(bn2n(stakeAmountLINA), 2));

      //小于等于最大数
      if (tempStakeAmount.lte(this.buildData.LINABN)) {
        stakeAmountLINA = tempStakeAmount;
      }

      //合约需要大于1
      if (stakeAmountLINA.eq(n2bn("1"))) {
        stakeAmountLINA = bnAdd(stakeAmountLINA, n2bn("0.000000000000000001"));
      }

      const {
        lnrJS: { LnCollateralSystem },
        utils,
      } = lnrJSConnector;

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: this.gasLimit,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit = await this.getGasEstimateFromStaking(
        stakeAmountLINA
      );

      let transaction = await LnCollateralSystem.Collateral(
        utils.formatBytes32String("LINA"),
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

      buildAmountlUSD = n2bn(_.floor(bn2n(buildAmountlUSD), 2));

      const {
        lnrJS: { LnBuildBurnSystem },
        utils,
      } = lnrJSConnector;

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
        const {
          utils,
          lnrJS: { LinearFinance },
        } = lnrJSConnector;

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
        const {
          lnrJS: { LnCollateralSystem },
          utils,
        } = lnrJSConnector;

        if (
          stakeAmountLINA.lte("0") &&
          buildAmountlUSD.lte("0") //小于等于0
        ) {
          throw new Error("invalid input");
        }

        let gasEstimate = await LnCollateralSystem.estimateGas.stakeAndBuildMax(
          utils.formatBytes32String("LINA"),
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
        const {
          lnrJS: { LnCollateralSystem },
          utils,
        } = lnrJSConnector;

        if (
          stakeAmountLINA.isZero() ||
          stakeAmountLINA.lt("0") //小于等于0
        ) {
          throw new Error("invalid stakeAmountLINA");
        }

        let gasEstimate = await LnCollateralSystem.estimateGas.Collateral(
          utils.formatBytes32String("LINA"),
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
        const {
          lnrJS: { LnBuildBurnSystem },
          utils,
        } = lnrJSConnector;

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
      openBuyLINA();
      this.activeItemBtn = 0;
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
      this.getBuildData(this.walletAddress);

      this.sourceNetworkId = this.walletNetworkId;

      this.resetInputData();
    },

    //重试
    //Retry page
    tryAgain() {
      this.setDefaultTab();
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
              font-family: Gilroy-bold;
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
              padding: 39px 24px;
              display: flex;
              justify-content: space-between;
              width: 100%;
              transition: $animete-time linear;
              position: relative;

              &:hover,
              &.active {
                border-color: white;
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
                    opacity: 0.2;
                    text-transform: uppercase;
                    font-family: Gilroy-bold;
                    font-size: 12px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.33;
                    letter-spacing: 1.5px;
                    text-align: center;
                    color: #1a38f8;

                    img {
                      margin-left: 6px;
                    }

                    &:hover {
                      &:not(.default) {
                        opacity: 1;
                      }
                    }

                    &.active {
                      opacity: 1;
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
              opacity: 0.1;
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
                  margin-right: 16px;
                }
              }

              .actionRate {
                width: 74.4vw;
                margin: 32px 0 28px;
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

              .inputGroupBox {
                width: 74.4vw;

                .actionInputItem {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  border-radius: 8px;
                  border: solid 1px #e5e5e5;

                  .showInfo {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                  }

                  .box {
                    display: flex;

                    .itemType {
                      height: 42.5vw;
                      display: flex;
                      justify-content: center;
                      flex-direction: column;
                      align-items: center;

                      img {
                        width: 40px;
                      }

                      .itemTypeTitle {
                        margin: 16px 0 0;
                        font-family: Gilroy;
                        font-size: 12px;
                        font-weight: 500;
                        text-align: center;
                        color: #99999a;
                      }

                      .input {
                        width: 100%;
                        height: 24px;
                        border: none;
                        box-shadow: none;

                        .ivu-input-number-handler-wrap {
                          display: none;
                        }

                        .ivu-input-number-input {
                          text-align: center;
                          font-family: Gilroy-Bold;
                          font-size: 16px;
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
                    }
                  }

                  .itemTypeBtn {
                    height: 32px;
                    width: 100%;
                    text-transform: uppercase;
                    border-top: solid 1px #e5e5e5;
                    font-family: Gilroy;
                    text-align: center;
                    font-size: 10px;
                    line-height: 32px;
                    font-weight: bold;
                    color: #1a38f8;
                  }
                }
              }

              .actionInputItem {
                margin-bottom: 24px;
                border-radius: 8px;
                border: solid 1px #deddde;
                transition: $animete-time linear;

                &.active {
                  border-color: white;
                  box-shadow: 0px 2px 12px #deddde;
                }

                .ratioInputBox {
                  width: 74.4vw;
                  position: relative;

                  .box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 16px;
                    height: 21.6vw;

                    .itemTypeTitle {
                      font-family: Gilroy;
                      font-size: 12px;
                      font-weight: 500;
                      text-align: center;
                      color: #99999a;
                    }

                    .input {
                      width: 53.33vw;
                      height: 32px;
                      border: none;
                      box-shadow: none;
                      padding: 0;

                      .ivu-input-number-handler-wrap {
                        display: none;
                      }

                      .ivu-input-number-input {
                        text-align: right;
                        font-family: Gilroy-Bold;
                        font-size: 16px;
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
                  }

                  .itemTypeBtn {
                    height: 32px;
                    width: 100%;
                    position: relative;
                    bottom: 0;
                    border-top: solid 1px #e5e5e5;
                    text-transform: uppercase;
                    font-family: Gilroy;
                    text-align: center;
                    font-size: 10px;
                    line-height: 32px;
                    font-weight: bold;
                    color: #1a38f8;
                  }
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
                opacity: 0.1;
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
