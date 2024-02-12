<template>
  <div id="transfer">
    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0">
        <div class="transferBox">
          <div class="transferMain">
            <div class="text">
              <div class="title">Transfer</div>
              <div class="descript">
                Transfer different currencies to specified wallet address
              </div>
            </div>
            <div
              class="from actionInputItem"
              :class="{
                error: transactionErrMsg,
                showDropdown,
              }"
            >
              <div class="iconBox">
                <div class="icon">
                  <img :src="currentSelectCurrency.img" />
                </div>
              </div>
              <div class="midle">
                <div class="p_1">
                  {{ currentSelectCurrency.name }}
                </div>
                <span
                  class="p_2"
                  :class="{ active: activeItemBtn == 0 }"
                  @click="clickMaxAmount"
                >
                  MAX
                </span>
              </div>
              <div
                class="arrow"
                @click.stop="showDropdownFun"
                :class="{ showDropdown }"
                @mouseenter="dropdownHover = true"
                @mouseleave="dropdownHover = false"
              >
                <img
                  v-show="showDropdown || dropdownHover"
                  src="@/static/arrow.svg"
                />
                <img
                  v-show="!showDropdown && !dropdownHover"
                  src="@/static/arrow_gray.svg"
                />
              </div>
              <div class="value">
                <div class="price">
                  <div class="number">
                    <div class="inputRect">
                      <InputNumber
                        class="input"
                        ref="itemInput0"
                        element-id="transfer_number_input"
                        :min="0"
                        :max="currentSelectCurrency.balance"
                        type="text"
                        v-model="transferNumber"
                        placeholder="0"
                        @on-change="changeAmount"
                        @on-focus="inputFocus(0)"
                        @on-blur="inputBlur(0)"
                        :formatter="formatterInput"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="dropdown" v-if="showDropdown">
                <div
                  class="dropdownItem"
                  v-for="(item, index) in currencyList"
                  @click="selectCurrencyFun(index)"
                  :key="index"
                  :class="{
                    activity: index == selected,
                  }"
                >
                  <div class="iconBox">
                    <div class="icon">
                      <img :src="item.img" />
                    </div>
                  </div>
                  <div class="midle">
                    <div class="p_1">
                      {{
                        currencies.hasOwnProperty(item.name)
                          ? currencies[item.name].name
                          : item.name
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="someWrong"
              :style="{
                opacity: transactionErrMsg ? '1' : '0',
              }"
            >
              {{ transactionErrMsg }}
            </div>

            <div
              class="to actionInputItem"
              :class="{
                error: walletError && this.transferToAddress != '',
              }"
            >
              <div class="li_1">
                <div class="iconBox">
                  <div class="icon">
                    <img v-if="theme === 'light'" src="@/static/wallet.svg" />
                    <img v-else src="@/static/dark-theme/wallet.svg" />
                  </div>
                </div>
                <div class="midle">
                  <div class="p_1">
                    From
                    <span>{{ walletAddressEllipsis }}</span>
                    to
                  </div>
                </div>
              </div>
              <div class="li_2">
                <Input
                  type="text"
                  ref="itemInput1"
                  v-model="transferToAddress"
                  @on-focus="inputFocus(1)"
                  @on-blur="inputBlur(1)"
                  placeholder="Please enter the wallet address …"
                />
              </div>
            </div>
            <div
              class="someWrong"
              v-if="walletError && this.transferToAddress != ''"
            >
              Please input a valid address.
            </div>

            <gasEditor v-if="!isMobile"></gasEditor>
          </div>

          <div class="transferMainMobile">
            <div
              class="errMsg"
              :style="{
                display:
                  transactionErrMsg ||
                  (walletError && this.transferToAddress != '')
                    ? 'flex'
                    : 'none',
              }"
            >
              <img src="@/static/error.svg" />
              <div v-if="transactionErrMsg">
                {{ transactionErrMsg }}
              </div>
              <div v-else>Please input a valid address.</div>
            </div>
            <div
              class="from actionInputItem"
              :class="{
                error: transactionErrMsg,
                showDropdown,
              }"
            >
              <div class="iconBox">
                <div class="icon">
                  <img :src="currentSelectCurrency.img" />
                </div>
              </div>

              <div class="dropBox">
                <div class="tokenName">
                  {{ currentSelectCurrency.name }}
                </div>
                <div
                  class="arrow"
                  @click.stop="showDropdownFun"
                  :class="{ showDropdown }"
                  @mouseenter="dropdownHover = true"
                  @mouseleave="dropdownHover = false"
                >
                  <img
                    v-show="showDropdown || dropdownHover"
                    src="@/static/arrow.svg"
                  />
                  <img
                    v-show="!showDropdown && !dropdownHover"
                    src="@/static/arrow_gray.svg"
                  />
                </div>
              </div>

              <div class="currentBalance">
                <div
                  v-if="
                    currentSelectCurrency.name == 'ETH' ||
                    currentSelectCurrency.name == 'BNB'
                  "
                >
                  Avaliable:
                  {{ currentSelectCurrency.balance }}
                  {{ currentSelectCurrency.name }}
                </div>
                <div v-else>
                  Avaliable:
                  {{ currentSelectCurrency.balance }}
                  {{ currentSelectCurrency.name }}
                </div>
              </div>

              <div class="amountInputBox">
                <div class="box">
                  Amount
                  <InputNumber
                    class="input"
                    ref="itemInput2"
                    element-id="transfer_number_input"
                    :min="0"
                    :max="currentSelectCurrency.balance"
                    type="text"
                    v-model="transferNumber"
                    placeholder="2"
                    @on-change="changeAmount"
                    @on-focus="inputFocus(2)"
                    @on-blur="inputBlur(2)"
                    :formatter="formatterInput"
                  />
                </div>

                <span
                  class="maxBtn"
                  :class="{ active: activeItemBtn == 0 }"
                  @click="clickMaxAmount"
                >
                  MAX
                </span>
              </div>

              <div class="dropdown" v-if="showDropdown">
                <div
                  class="dropdownItem"
                  v-for="(item, index) in currencyList"
                  @click="selectCurrencyFun(index)"
                  :key="index"
                  :class="{
                    activity: index == selected,
                  }"
                >
                  <div class="iconBox">
                    <div class="icon">
                      <img :src="item.img" />
                    </div>
                  </div>
                  <div class="midle">
                    <div class="p_1">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="to actionInputItem"
              :class="{
                error: walletError && this.transferToAddress != '',
              }"
            >
              To Wallet
              <Input
                type="text"
                ref="itemInput3"
                v-model="transferToAddress"
                @on-focus="inputFocus(3)"
                @on-blur="inputBlur(3)"
                placeholder="Please enter the wallet address …"
              />
            </div>

            <gasEditor v-if="isMobile"></gasEditor>
          </div>

          <div
            class="transferBtn"
            :class="{ disabled: transferDisabled || walletError }"
            @click="clickTransfer"
          >
            TRANSFER NOW
          </div>

          <Spin fix v-if="processing"></Spin>
        </div>
      </TabPane>
      <TabPane name="m1">
        <div class="waitingBox">
          <watingEnhance
            class="waitingBox"
            v-if="actionTabs == 'm1'"
            :currentStep="confirmTransactionStep"
            :currentHash="confirmTransactionHash"
            :currentNetworkId="confirmTransactionNetworkId"
            :currentConfirm="confirmTransactionStatus"
            :currentErrMsg="transactionErrMsg"
            :setupArray="waitProcessArray"
            @tryAgain="waitProcessFlow"
            @close="setDefaultTab"
          ></watingEnhance>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {
  openBlockchainBrowser,
  findParents,
  removeClass,
  addClass,
  formatterInput,
} from "@/common/utils";

import _ from "lodash";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import {
  getLiquids,
  storeDetailsData,
} from "@/assets/linearLibrary/linearTools/request";
import gasEditor from "@/components/gasEditor";
import {
  bufferGasLimit,
  DEFAULT_GAS_LIMIT,
  isBinanceNetwork,
  isEthereumNetwork,
} from "@/assets/linearLibrary/linearTools/network";
import currencies from "@/common/currency";

import {
  abbreviateAddress,
  formatNumber,
} from "@/assets/linearLibrary/linearTools/format";
import { bn2n, n2bn } from "@/common/bnCalc";
import { BUILD_PROCESS_SETUP } from "@/assets/linearLibrary/linearTools/constants/process";

export default {
  name: "transfer",
  data() {
    return {
      formatterInput,
      currencies,
      actionTabs: "m0", //子页(m0默认,m1等待)
      showDropdown: false,
      selected: 0,
      processing: false, //交易按钮防抖
      transferNumber: null,
      transferToAddress: "",
      ethGasLimit: 0,

      activeItemBtn: -1, //当前激活按钮 0transfer

      dropdownHover: false,

      confirmTransactionStatus: true,
      confirmTransactionStep: -1,
      confirmTransactionHash: "",
      confirmTransactionNetworkId: "",
      transactionErrMsg: "",
      waitProcessArray: [],
      waitProcessFlow: Function,
      BUILD_PROCESS_SETUP: { ...BUILD_PROCESS_SETUP },

      currencyList: [
        {
          name: "LINA",
          key: "LINA",
          img:
            this.theme === "light"
              ? require("@/static/NEW_LINA_logo.svg")
              : require("@/static/dark-theme/NEW_LINA_logo.svg"),
          balance: 0,
        },
      ],
    };
  },
  watch: {
    walletAddress() {},
    walletAddressEllipsis() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    isMobile() {},
    transferDisabled() {},
    walletError() {},
    currentSelectCurrency() {},
    canSendEthAmount() {},
    theme() {
      this.initLiquidsList();
    },
  },
  computed: {
    //transfer按钮禁止状态
    transferDisabled() {
      return (
        _.lte(this.transferNumber, 0) ||
        this.processing ||
        !this.transferToAddress
      );
    },
    walletError() {
      if (/^0x[a-fA-F0-9]{40}$/.test(this.transferToAddress)) {
        return false;
      }
      return true;
    },
    walletAddressEllipsis() {
      return abbreviateAddress(this.$store.state?.wallet?.address);
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    currentSelectCurrency() {
      return this.currencyList[this.selected];
    },

    canSendEthAmount() {
      return (
        this.currentSelectCurrency.balance -
        lnrJSConnector.utils.formatEther(
          this.$store.state?.gasDetails?.price.toString()
        ) *
          this.ethGasLimit
      );
    },

    isEthereumNetwork() {
      return isEthereumNetwork(this.walletNetworkId);
    },

    isBinanceNetwork() {
      return isBinanceNetwork(this.walletNetworkId);
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
    await this.initLiquidsList();

    const currency = this.isEthereumNetwork
      ? "ETH"
      : this.isBinanceNetwork
      ? "BNB"
      : "BNB";
    //获取ETH gas limit评估
    let ethGasLimit = await this.getGasEstimate(
      currency,
      "1",
      this.walletAddress
    );

    this.ethGasLimit = ethGasLimit;
  },
  components: {
    gasEditor,
  },
  mounted() {
    document.documentElement.addEventListener("click", () => {
      this.showDropdown = false;
    });
  },
  methods: {
    async selectCurrencyFun(index) {
      this.transactionErrMsg = "";
      this.selected = index;
      this.transferNumber = null;
      this.activeItemBtn = -1;
    },

    //初始化liquids列表
    async initLiquidsList() {
      this.processing = true;
      const [linaBalance, walletBalance, liquids] = await Promise.all([
        lnrJSConnector.lnrJS.LinearFinance.balanceOf(this.walletAddress),
        lnrJSConnector.provider.getBalance(this.walletAddress),
        getLiquids(this.walletAddress),
      ]);

      let liquidsList = liquids.liquidsList.map((item) => {
        const key = item.name;
        return {
          name: currencies[key].name,
          key,
          balance: _.floor(item.balance, 4),
          img: item.img,
        };
      });

      this.currencyList = [
        {
          name: "LINA",
          key: "LINA",
          img:
            this.theme === "light"
              ? require("@/static/LINA_logo.svg")
              : require("@/static/dark-theme/LINA_logo.svg"),
          balance: _.floor(bn2n(linaBalance), 4),
        },
        {
          name: this.isEthereumNetwork ? "ETH" : "BNB",
          key: this.isEthereumNetwork ? "ETH" : "BNB",
          img: require(`@/static/${
            this.theme === "light" ? "" : "dark-theme/"
          }${this.isEthereumNetwork ? "ETH_logo" : "currency/BNBl"}.svg`),
          balance: _.floor(bn2n(walletBalance), 4),
        },
        ...liquidsList,
      ];

      let index = _.findIndex(this.currencyList, [
        "key",
        this.currentSelectCurrency.key,
      ]);

      this.selected = index != -1 ? index : 0;

      this.processing = false;
    },

    async setDefaultTab() {
      this.activeItemBtn = -1;
      this.actionTabs = "m0";

      this.waitProcessArray = [];
      this.confirmTransactionStep = -1;
      this.transferNumber = null;
      this.transactionErrMsg = "";
      await this.initLiquidsList();
    },

    async clickTransfer() {
      try {
        if (this.transferDisabled) return;
        this.processing = true;
        this.confirmTransactionStatus = false;
        this.waitProcessArray = [];

        let sendAmount = this.transferNumber,
          selectedAssetMaxValue = this.currentSelectCurrency.balance;

        //替换货币名称
        this.BUILD_PROCESS_SETUP.TRANSFER = _.replace(
          BUILD_PROCESS_SETUP.TRANSFER,
          "[REPLACE_CURRENCY]",
          this.currentSelectCurrency.name == "LINA"
            ? "LINA"
            : this.currentSelectCurrency.name
        );

        if (
          Number(selectedAssetMaxValue) > 0 &&
          Number(selectedAssetMaxValue) >= Number(sendAmount)
        ) {
          this.waitProcessArray.push(
            this.BUILD_PROCESS_SETUP.TRANSFER +
              (this.isEthereumNetwork ? "ETH" : "BSC")
          );

          this.confirmTransactionStep = 0;
          this.actionTabs = "m1"; //进入等待页

          this.waitProcessFlow = this.startFlow();

          //开始逻辑流处理函数
          await this.waitProcessFlow();
        }
      } catch (error) {
        console.log(error, "clickTransfer");
        this.transactionErrMsg = "Something went wrong, please try again.";
      } finally {
        this.processing = false;
      }
    },

    startFlow() {
      return async () => {
        try {
          this.transactionErrMsg = "";

          if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            this.BUILD_PROCESS_SETUP.TRANSFER +
              (this.isEthereumNetwork ? "ETH" : "BSC")
          ) {
            await this.onSend(n2bn(this.transferNumber));
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

    async onSend(sendAmount) {
      let selectedAssetKind = this.currentSelectCurrency.key,
        recieveAddress = this.transferToAddress;

      this.confirmTransactionNetworkId = this.walletNetworkId;

      //获取gas评估
      const gasLimit = await this.getGasEstimate(
        selectedAssetKind,
        bn2n(sendAmount),
        recieveAddress
      );

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: gasLimit,
      };

      let transaction = await this.sendTransaction(
        selectedAssetKind,
        sendAmount,
        recieveAddress,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: "Transfer",
          networkId: this.walletNetworkId,
          value: `${formatNumber(
            lnrJSConnector.utils.formatEther(sendAmount)
          )} ${this.currentSelectCurrency.name}`,
        });

        //等待结果返回
        let status = await lnrJSConnector.utils.waitForTransaction(
          transaction.hash
        );

        this.confirmTransactionStep += 1;
      }
    },

    //发起链上交易
    sendTransaction(currency, amount, destination, settings) {
      if (!currency) return null;
      if (currency === "LINA") {
        let LnProxy = lnrJSConnector.lnrJS.LinearFinance;
        return LnProxy.transfer(destination, amount, settings);
      } else if (["ETH", "BNB"].includes(currency)) {
        return lnrJSConnector.signer.sendTransaction({
          value: amount,
          to: destination,
          ...settings,
        });
      } else {
        return lnrJSConnector.lnrJS[currency].transfer(
          destination,
          amount,
          settings
        );
      }
    },

    //评估gas
    async getGasEstimate(currency, amount, destination) {
      try {
        if (!currency || !amount || !destination) return;
        if (amount > this.selectedAssetMaxValue)
          //大于最大余额
          throw new Error("input.error.balanceTooLow");
        if (!Number(amount)) throw new Error("input.error.invalidAmount");

        let gasEstimate;

        const amountBN = n2bn(amount);

        if (currency === "LINA") {
          let LnProxy = lnrJSConnector.lnrJS.LinearFinance;
          // if (this.isEthereumNetwork) {
          //     LnProxy = lnrJSConnector.lnrJS.LnProxyERC20;
          // } else if (this.isBinanceNetwork) {
          //     LnProxy = lnrJSConnector.lnrJS.LnProxyBEP20;
          // }
          gasEstimate = await LnProxy.estimateGas.transfer(
            destination,
            amountBN
          );
        } else if (["ETH", "BNB"].includes(currency)) {
          if (amount === this.selectedAssetMaxValue) {
            //不能转全部eth,需要留手续费
            throw new Error("input.error.balanceTooLow");
          }
          gasEstimate = await lnrJSConnector.signer.estimateGas({
            data: amountBN,
            to: destination,
          });
        } else {
          gasEstimate = await lnrJSConnector.lnrJS[
            currency
          ].estimateGas.transfer(destination, amountBN);
        }

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        console.log(e);
        return bufferGasLimit(DEFAULT_GAS_LIMIT.exchange);
      }
    },

    showDropdownFun() {
      setTimeout(() => {
        this.showDropdown = !this.showDropdown;
      }, 1);
    },

    //点击最大
    async clickMaxAmount() {
      this.activeItemBtn = 0;
      if (["ETH", "BNB"].includes(this.currentSelectCurrency.name)) {
        if (this.canSendEthAmount <= 0) {
          this.transferNumber = this.currencyList[this.selected].balance;
          this.transactionErrMsg = `You don\`t have enought balance of ${this.currentSelectCurrency.name}.`;
          return;
        }

        this.transactionErrMsg = "";
        this.transferNumber = this.canSendEthAmount;
      } else {
        this.transferNumber = this.currentSelectCurrency.balance;
      }
    },

    changeAmount(amount) {
      if (
        ["ETH", "BNB"].includes(this.currentSelectCurrency.name) &&
        amount > this.canSendEthAmount
      ) {
        this.transactionErrMsg = `You don\`t have enought balance of ${this.currentSelectCurrency.name}.`;
      } else {
        this.transactionErrMsg = "";
      }
    },

    //获取焦点
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
  },
};
</script>

<style lang="scss">
#transfer {
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

        .transferBox,
        .waitingBox,
        .successBox,
        .failBox {
          width: 100%;
          height: 100%;
        }

        .transferBox {
          position: relative;

          .transferMain {
            height: 100%;
            padding: 64px 193px 0;
            display: flex;
            flex-direction: column;

            .text {
              .title {
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
              .descript {
                margin-top: 8px;
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
              text-align: center;
            }
            .from,
            .to {
              width: 400px;
              height: 120px;
              border-radius: 8px;
              border: 1px solid #deddde;
              // transition: $animete-time linear;
              box-shadow: 0 0 0 #deddde;

              &:hover,
              &.active {
                box-shadow: 0 2px 12px #deddde;
                border-color: white;
              }
            }
            .from {
              margin-top: 116px;
              display: flex;
              position: relative;
              align-items: center;
              padding: 40px 24px;

              &.error {
                border-color: #df434c;
              }

              > .iconBox {
                margin-right: 16px;
                .icon {
                  text-align: center;
                  width: 40px;
                  height: 40px;
                  line-height: 40px;
                  border-radius: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #fff;
                  .app-dark & {
                    background: none;
                  }

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
              > .midle {
                flex: 1;
                flex-direction: column;
                > div {
                  width: 100%;
                }
                .p_1 {
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  color: #5a575c;
                }
                .p_2 {
                  color: #1a38f8;
                  opacity: 0.2;
                  cursor: pointer;
                  transition: $animete-time linear;
                  font-family: $BodyTextFontFamily;
                  font-size: 12px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: 1.5px;
                  color: #1a38f8;
                  align-self: flex-start;

                  &:hover {
                    opacity: 1;
                  }

                  &.active {
                    opacity: 1;
                  }
                }
              }
              > .arrow {
                width: 24px;
                height: 24px;
                cursor: pointer;
                transition: $animete-time linear;

                img {
                  width: 100%;
                  height: 100%;
                }

                &.showDropdown {
                  transform: rotate(180deg);
                }
              }
              > .value {
                width: 220px;
                flex-direction: column;
                padding-right: 15px;
                .price {
                  width: 100%;
                  display: flex;
                  .number {
                    flex: 1;
                    color: #c6c4c7;
                    font-family: Gilroy;
                    font-size: 32px;
                    text-align: right;

                    .inputRect {
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                      .input {
                        width: 100%;
                        border: none;
                        box-shadow: none;

                        .ivu-input-number-handler-wrap {
                          display: none;
                        }

                        .ivu-input-number-input {
                          text-align: right;
                          color: #5a575c;
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
                    }
                  }
                  .unit {
                    width: 40px;
                    color: #5a575c;
                    font-family: "PingFangHK-Regular";
                    font-size: 16px;
                    text-align: right;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }
                .avaliable {
                  color: #c6c4c7;
                  font-family: Gilroy;
                  font-size: 12px;
                  width: 100%;
                  text-align: right;
                }
              }

              &.showDropdown {
                border: solid 1px #1a38f8;
                box-shadow: 0 2px 12px 0 rgba(26, 56, 248, 0.25);
              }

              .dropdown {
                position: absolute;
                left: 0;
                top: calc(100% + 4px);
                width: 400px;
                max-height: 230px;
                overflow-y: auto;
                background: #fff;
                box-shadow: 0 2px 12px 0 #deddde;
                z-index: 1;
                border-radius: 8px;
                border: 1px solid #deddde;
                transition: box-shadow $animete-time linear;
                display: flex;
                flex-direction: column;
                padding: 8px 0;

                .dropdownItem {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  padding: 16px 24px;

                  .iconBox {
                    .icon {
                      margin-right: 16px;
                      width: 40px;
                      height: 40px;
                      img {
                        width: 100%;
                        height: 100%;
                      }
                    }
                  }
                  .midle {
                    flex: 1;
                    font-family: $BodyTextFontFamily;
                    font-size: 16px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;
                  }

                  &:hover {
                    .midle {
                      color: #1a38f8;
                    }
                  }

                  &.activity {
                    background: rgba(#7eb5ff, 0.1);

                    .midle {
                      color: #1a38f8;
                    }
                  }
                }
              }
            }
            .to {
              margin-top: 24px;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-bottom: 24px;
              &.error {
                border-color: #df434c;
              }
              .li_1 {
                display: flex;
                align-items: center;
                justify-content: center;
                .iconBox {
                  margin-right: 16px;
                  .icon {
                    width: 40px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 100%;
                    background-color: #fff;
                    .app-dark & {
                      background: none;
                    }

                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
                .midle {
                  flex: 1;
                  flex-direction: column;
                  > div {
                    width: 100%;
                  }
                  .p_1 {
                    font-family: Gilroy-Bold;
                    font-size: 16px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;
                    span {
                      padding: 5px 16px;
                      color: #c6c4c7;
                      margin: 0 8px;
                      border-radius: 12px;
                      background-color: #f6f5f6;
                      font-family: Gilroy-Medium;
                      font-size: 12px;
                      font-weight: 500;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.33;
                      letter-spacing: normal;
                      color: #99999a;
                      .app-dark & {
                        color: #313131;
                        height: 16px;
                        background-color: #f6f5f6 !important;
                      }
                    }
                  }
                }
              }
              .li_2 {
                line-height: 1;
                .ivu-input-wrapper {
                  input {
                    border: none;
                    box-shadow: none;
                    outline: none;
                    color: #5a575c;
                    font-family: $BodyTextFontFamily;
                    font-size: 14px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    letter-spacing: normal;
                    padding: 0;
                    height: unset;
                    line-height: 1;

                    &::placeholder {
                      color: #99999a;
                    }
                  }
                }
              }
            }
            .someWrong {
              color: #df434c;
              font-family: Gilroy;
              font-weight: 700;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1.25px;
            }
          }

          .transferMainMobile {
            display: none;
          }

          .transferBtn {
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
            letter-spacing: 3px;
            cursor: pointer;
            transition: $animete-time linear;
            font-family: $BodyTextFontFamily;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;

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
  #transfer {
    min-height: 550px;

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

          .transferBox,
          .waitingBox,
          .successBox,
          .failBox {
            width: 100%;
            height: 100%;
            min-height: 550px;
            display: flex;
            justify-content: center;
            -webkit-justify-content: center;
          }

          .transferBox {
            position: relative;

            .transferMain {
              display: none;
            }

            .transferMainMobile {
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

              .from {
                position: relative;
                height: 67.2vw;
                width: 74.4vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                border: solid 1px #e5e5e5;
                border-radius: 8px;
                margin: 32px 0 16px;

                .iconBox {
                  margin: 24px 0 16px;

                  img {
                    width: 64px;
                  }
                }

                .dropBox {
                  display: flex;
                  align-items: center;

                  .tokenName {
                    font-family: $BodyTextFontFamily;
                    font-size: 24px;
                    text-align: center;
                    color: #5a575c;
                  }
                  .arrow {
                    height: 20px;
                    width: 20px;
                    margin-left: 8px;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }

                .currentBalance {
                  font-family: Gilroy;
                  font-size: 12px;
                  font-weight: 500;
                  color: #99999a;
                }

                .amountInputBox {
                  width: 100%;
                  height: 75px;
                  display: flex;
                  position: absolute;
                  align-items: center;
                  justify-content: space-around;
                  bottom: 0;
                  border-top: solid 1px #e5e5e5;
                  padding: 0 16px;

                  .box {
                    display: flex;
                    flex-direction: column;
                    font-family: Gilroy;
                    font-size: 12px;
                    color: #99999a;

                    .input {
                      width: 60%;
                      border: none;
                      box-shadow: none;

                      .ivu-input-number-handler-wrap {
                        display: none;
                      }

                      .ivu-input-number-input {
                        text-align: left;
                        color: #99999a;
                        font-family: $BodyTextFontFamily;
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

                  .maxBtn {
                    width: 74px;
                    height: 44px;
                    border-radius: 8px;
                    background-color: rgba(126, 181, 255, 0.1);
                    text-align: center;
                    line-height: 44px;
                    font-family: $BodyTextFontFamily;
                    font-size: 10px;
                    font-weight: bold;
                    color: #1a38f8;
                  }
                }

                .dropdown {
                  position: absolute;
                  left: 0;
                  top: calc(100% + 2px);
                  width: 74.4vw;
                  background: #fff;
                  box-shadow: 0 2px 12px 0 #deddde;
                  z-index: 1;
                  border-radius: 8px;
                  border: 1px solid #deddde;
                  transition: box-shadow $animete-time linear;
                  display: flex;
                  flex-direction: column;
                  padding: 8px 0;

                  .dropdownItem {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;

                    .iconBox {
                      margin: 8px;

                      .icon {
                        margin-right: 16px;
                        width: 40px;
                        height: 40px;
                        img {
                          width: 100%;
                          height: 100%;
                        }
                      }
                    }
                    .midle {
                      flex: 1;
                      font-family: $BodyTextFontFamily;
                      font-size: 16px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.5;
                      letter-spacing: normal;
                      color: #5a575c;
                    }

                    &:hover {
                      .midle {
                        color: #1a38f8;
                      }
                    }

                    &.activity {
                      background: rgba(#7eb5ff, 0.1);

                      .midle {
                        color: #1a38f8;
                      }
                    }
                  }
                }
              }

              .to {
                height: 26.6vw;
                width: 74.4vw;
                display: flex;
                padding: 0 16px;
                flex-direction: column;
                justify-content: center;
                border: solid 1px #e5e5e5;
                border-radius: 8px;
                font-family: $BodyTextFontFamily;
                font-size: 12px;
                color: #99999a;
                margin-bottom: 16px;

                input {
                  width: 100%;
                  border: none;
                  box-shadow: none;
                  outline: none;
                  color: #5a575c;
                  font-family: $BodyTextFontFamily;
                  font-size: 14px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  letter-spacing: normal;
                  padding: 0;
                  height: unset;
                  line-height: 1;

                  &::placeholder {
                    color: #99999a;
                  }
                }
              }

              .from,
              .to {
                &:hover,
                &.active {
                  border-color: white;
                  box-shadow: 0px 2px 12px #deddde;
                }

                &.error {
                  border-color: #df434c;
                }
              }
            }

            .transferBtn {
              height: 12.8vw !important;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
