<template>
  <div id="swap" :class="{ isMobile }">
    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0">
        <div class="swapBox">
          <div class="actionBody">
            <template v-if="!isMobile">
              <div class="actionTitle">Bridge</div>
              <div class="actionDesc">
                You can select the type of liquids and enter the amount you want
                to swap to the other chain.
              </div>
            </template>

            <div
              v-if="isMobile"
              v-show="errors.amountMsg"
              class="someWrongMobile"
            >
              <img class="errIcon" src="@/static/error.svg" />
              <div class="errMessage">
                {{ errors.amountMsg }}
              </div>
            </div>

            <div
              class="swapInputBox"
              :class="{
                error: errors.amountMsg,
                hovered: currencyDropDown,
              }"
            >
              <div class="iconBox">
                <img class="icon" :src="currency.img" />
                <Poptip
                  class="name"
                  placement="bottom"
                  :width="isMobile ? 280 : 400"
                  offset="0px 24px"
                  v-model="currencyDropDown"
                >
                  {{ currency.name }}
                  <dropdownArrowSvg :selected="currencyDropDown" />
                  <div slot="content">
                    <div
                      :class="{
                        selected: index == selectCurrencyIndex,
                      }"
                      class="currencyItem"
                      v-for="(item, index) in currencies"
                      :key="index"
                      @click="changeSelectCurrencyIndex(index)"
                    >
                      <img class="itemIcon" :src="item.img" />
                      <div class="itemName">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </Poptip>
                <div>
                  <!-- {{ currency.name }} -->

                  <!-- <Dropdown trigger="click">
                                        {{ currency.name }}
                                        <Icon type="ios-arrow-down"></Icon>
                                        <DropdownMenu slot="list">
                                            <DropdownItem
                                                v-for="(item,
                                                index) in currencies"
                                                :key="index"
                                                >{{ item.name }}</DropdownItem
                                            >
                                        </DropdownMenu>
                                    </Dropdown> -->
                </div>

                <div v-if="isMobile" class="avaliable">
                  Available:
                  {{ formatNumber(currency.balance, 4) }}
                  {{ currency.name }}
                </div>
              </div>

              <div class="divider"></div>

              <!-- <div v-if="currencySelectModal" class="currencySelectModal">
                                    123444
                            </div> -->

              <div class="inputBox" @click="inputFocus(0)">
                <template v-if="isMobile">
                  <div class="label">
                    <div class="amount">Amount</div>
                    <InputNumber
                      class="input"
                      ref="itemInput0"
                      element-id="transfer_number_input"
                      :min="currency.frozenBalance"
                      :max="floor(currency.totalBalance, 4)"
                      type="text"
                      v-model="swapNumber"
                      placeholder="0"
                      @on-focus="inputFocus(0)"
                      @on-blur="inputBlur(0)"
                      :formatter="(value) => formatterInput(value, 4)"
                    />
                  </div>

                  <span
                    class="max"
                    :class="{
                      active: activeItemBtn == 0,
                    }"
                    @click="clickMaxAmount"
                  >
                    MAX
                  </span>
                </template>
                <template v-else>
                  <div class="label">
                    <div class="amount">Amount</div>
                    <span
                      class="max"
                      :class="{
                        active: activeItemBtn == 0,
                      }"
                      @click="clickMaxAmount"
                    >
                      MAX
                    </span>
                  </div>
                  <InputNumber
                    class="input"
                    ref="itemInput0"
                    element-id="transfer_number_input"
                    :min="currency.frozenBalance"
                    :max="floor(currency.totalBalance, 4)"
                    type="text"
                    v-model="swapNumber"
                    placeholder="0"
                    @on-focus="inputFocus(0)"
                    @on-blur="inputBlur(0)"
                    :formatter="(value) => formatterInput(value, 4)"
                  />
                </template>
              </div>
            </div>

            <div v-if="!isMobile" class="someWrong" v-show="errors.amountMsg">
              {{ errors.amountMsg }}
            </div>
            <gasEditorSwap v-if="walletAddress"></gasEditorSwap>
            <!-- v-if="actionTabs == 'm0'" -->
          </div>

          <div
            v-if="!this.walletAddress"
            class="swapBtn noWallet"
            @click.stop="toggleModal"
          >
            BUY LINA
          </div>
          <div
            v-else
            class="swapBtn"
            :class="{
              disabled: swapDisabled,
            }"
            @click="clickSwap"
          >
            SWAP <template v-if="!isMobile">NOW</template>
          </div>

          <Spin fix v-if="processing"></Spin>
        </div>
      </TabPane>
      <TabPane name="m1">
        <watingEnhanceSwapNew
          :amount="diffSwapNumber"
          v-if="actionTabs == 'm1'"
          :currency="frozenTokens !== undefined ? frozenTokens : currency.key"
          @close="close"
        ></watingEnhanceSwapNew>
      </TabPane>
    </Tabs>
    <linkModal :visible="showPopup" @toggle="showPopup = $event"></linkModal>
  </div>
</template>

<script>
import _ from "lodash";
import gasEditorSwap from "@/components/gasEditorSwap";
import watingEnhanceSwapNew from "@/components/transferStatus/watingEnhanceSwapNew";
import dropdownArrowSvg from "@/components/svg/dropdownArrow";

import {
  formatterInput,
  setCursorRange,
  findParents,
  removeClass,
  addClass,
} from "@/common/utils";
import {
  bufferGasLimit,
  DEFAULT_GAS_LIMIT,
  getOtherNetworks,
  isBinanceNetwork,
  isEthereumNetwork,
  SUPPORTED_WALLETS,
} from "@/assets/linearLibrary/linearTools/network";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { bn2n, bnSub, bnSub2N, n2bn } from "@/common/bnCalc";
import { lnr } from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";
import {
  formatEtherToNumber,
  formatNumber,
} from "@/assets/linearLibrary/linearTools/format";
import { getLiquids } from "@/assets/linearLibrary/linearTools/request";
import currenciesList from "@/common/currency";

export default {
  name: "swap",
  components: {
    gasEditorSwap,
    watingEnhanceSwapNew,
    dropdownArrowSvg,
  },
  data() {
    return {
      formatterInput,
      setCursorRange,
      actionTabs: "m0", //子页(m0输入页,m1交易页)
      swapNumber: null,

      activeItemBtn: -1,

      processing: false, // 处理状态, 防止重复点击

      floor: _.floor,

      errors: { amountMsg: "" },

      chainChangeTokenFromUnfreeze: "", //解冻切换钱包事件监听id
      chainChangeTokenFromSubscribe: "", //切换钱包事件监听id
      walletChangeTokenFromSubscribe: "", //切换钱包地址时间监听id

      formatNumber,

      currencyDropDown: false,

      selectCurrencyIndex: 0,
      selectCurrencyKey: "LINA",
      showPopup: false,
      currencies: [],

      frozenTokens: undefined,
    };
  },
  watch: {
    walletAddress() {
      this.initData();
    },
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    walletType() {},
    isMobile() {},
    diffSwapNumber() {},
    currency() {},
    theme() {
      this.initData();
    },
  },
  computed: {
    isEthereumNetwork() {
      return isEthereumNetwork(this.walletNetworkId);
    },

    isBinanceNetwork() {
      return isBinanceNetwork(this.walletNetworkId);
    },

    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },

    walletAddress() {
      return this.$store.state?.wallet?.address;
    },

    swapDisabled() {
      return !this.swapNumber || this.processing;
    },

    walletType() {
      return this.$store.state?.walletType;
    },

    isMobile() {
      return this.$store.state?.isMobile;
    },

    diffSwapNumber() {
      return _.floor(this.swapNumber - this.currency?.frozenBalance, 4);
    },

    currency() {
      console.log(this.currencies[this.selectCurrencyIndex]?.balance);
      return this.currencies[this.selectCurrencyIndex];
    },
    theme() {
      return this.$store.state.theme;
    },
  },
  async created() {
    await this.initData();
    await this.getPendingProcess();
    //监听链切换
    this.chainChangeTokenFromSubscribe = this.$pub.subscribe(
      "onWalletChainChange",
      async () => {
        if (this.actionTabs == "m0") {
          await this.initData();
        }
      }
    );

    this.walletChangeTokenFromSubscribe = this.$pub.subscribe(
      "onWalletAccountChange",
      async () => {
        if (this.actionTabs == "m0") {
          await this.initData();
        }
      }
    );
  },
  destroyed() {
    //清除事件,防止重复
    if (this.chainChangeTokenFromUnfreeze != "") {
      this.$pub.unsubscribe(this.chainChangeTokenFromUnfreeze);
    }

    if (this.chainChangeTokenFromSubscribe != "") {
      this.$pub.unsubscribe(this.chainChangeTokenFromSubscribe);
    }

    if (this.walletChangeTokenFromSubscribe != "") {
      this.$pub.unsubscribe(this.walletChangeTokenFromSubscribe);
    }
  },

  methods: {
    //设置初始列表
    async initCurrencies() {
      let linaBalance = 0;
      if (this.walletAddress) {
        linaBalance = await lnrJSConnector.lnrJS.LinearFinance.balanceOf(
          this.walletAddress
        );
      }

      this.currencies = [
        {
          name: "LINA",
          key: "LINA",
          img:
            this.theme === "light"
              ? require("@/static/NEW_LINA_logo.svg")
              : require("@/static/dark-theme/NEW_LINA_logo.svg"),
          balance: _.floor(bn2n(linaBalance), 4),
          frozenBalance: 0,
          totalBalance: _.floor(bn2n(linaBalance), 4),
        },
      ];
      this.selectCurrencyIndex = 0;
    },

    async initData() {
      try {
        this.currencyDropDown = false;
        await this.initLiquidsList();
        await this.filterCurrencies();
      } catch (error) {
        console.log(error);
        this.initCurrencies();
        this.selectCurrencyKey = "LINA";
        this.processing = false;
      }
    },

    //初始化liquids列表
    async initLiquidsList() {
      this.processing = true;
      this.initCurrencies();
      const [linaBalance, liquids] = await Promise.all([
        lnrJSConnector.lnrJS.LinearFinance.balanceOf(this.walletAddress),
        getLiquids(this.walletAddress, true),
      ]);

      let liquidsList = liquids.liquidsList.map((item) => {
        const key = item.name;
        return {
          name: currenciesList[key].name,
          key,
          balance: _.floor(item.balance, 4),
          img: item.img,
          frozenBalance: 0,
          totalBalance: 0,
        };
      });
      this.currencies[0].balance = _.floor(bn2n(linaBalance), 4);
      this.currencies = [...this.currencies, ...liquidsList];
    },

    //充值当前index
    resetCurrencyIndex() {
      let index = _.findIndex(this.currencies, ["key", this.selectCurrencyKey]);
      this.selectCurrencyIndex = index != -1 ? index : 0;
      this.selectCurrencyKey = index != -1 ? this.currency.key : "LINA";
    },

    //过滤无余额的token
    async filterCurrencies() {
      //获取其他网络id
      let otherNetworkId = getOtherNetworks(this.walletNetworkId);

      let keyMap = this.currencies.map((item) => item.key);

      //获取冻结数据
      let [currentArray, otherArray] = await Promise.all([
        lnr.userSwapAssetsCount({
          account: this.walletAddress,
          sourceKeyInArr: keyMap,
          networkId: this.walletNetworkId,
        }),
        lnr.userSwapAssetsCount({
          account: this.walletAddress,
          sourceKeyInArr: keyMap,
          networkId: otherNetworkId,
        }),
      ]);

      let currencies = this.currencies.filter((item) => {
        //查找数据
        let current = currentArray.find(
          (currency) => item.key == currency.source
        );
        let other = otherArray.find((currency) => item.key == currency.source);

        //计算可以解冻的数量
        let currentFreeZeTokens = n2bn("0"),
          otherUnFreeZeTokens = n2bn("0");

        current && (currentFreeZeTokens = current.freeZeTokens);
        other && (otherUnFreeZeTokens = other.UnFreeZeTokens);

        let frozenBalance = bnSub(currentFreeZeTokens, otherUnFreeZeTokens);
        item.frozenBalance = frozenBalance.gt(n2bn("0"))
          ? _.floor(formatEtherToNumber(frozenBalance), 4)
          : null;

        //总额
        item.totalBalance = item.balance + item.frozenBalance;

        return item.key == "LINA" || item.totalBalance > 0;
      });

      this.currencies = [...currencies];

      this.resetCurrencyIndex();

      this.swapNumber = this.currency.frozenBalance;

      this.processing = false;
    },

    //获取冻结余额
    async getCurrencyBalance() {
      try {
        this.processing = true;

        //获取其他网络id
        let otherNetworkId = getOtherNetworks(this.walletNetworkId);

        let contract;
        if (this.currency.key == "LINA") {
          contract = lnrJSConnector.lnrJS.LinearFinance;
        } else {
          contract = lnrJSConnector.lnrJS[this.currency.key];
        }

        //获取当前和其他网络冻结数据
        const [current, other, balance] = await Promise.all([
          lnr.userSwapAssetsCount({
            account: this.walletAddress,
            source: this.currency.key,
            networkId: this.walletNetworkId,
          }),
          lnr.userSwapAssetsCount({
            account: this.walletAddress,
            source: this.currency.key,
            networkId: otherNetworkId,
          }),
          contract.balanceOf(this.walletAddress),
        ]);

        let currentFreeZeTokens = n2bn("0"),
          otherUnFreeZeTokens = n2bn("0");
        current.length && (currentFreeZeTokens = current[0].freeZeTokens);
        other.length && (otherUnFreeZeTokens = other[0].UnFreeZeTokens);

        //计算可以解冻的数量
        const frozenBalance = bnSub(currentFreeZeTokens, otherUnFreeZeTokens);

        this.currency.frozenBalance = this.swapNumber = frozenBalance.gt(
          n2bn("0")
        )
          ? _.floor(formatEtherToNumber(frozenBalance), 4)
          : null;
        this.currency.balance = bn2n(balance, 18);
      } catch (error) {
        this.swapNumber = null;
        console.log(error, "getCurrencyBalance error");
      } finally {
        this.processing = false;
      }
    },

    async clickSwap() {
      try {
        if (!this.swapDisabled) {
          this.processing = true;

          this.actionTabs = "m1"; //进入swap页
        }
      } catch (error) {
        console.log(error, "clickSwap error");
      } finally {
        this.processing = false;
      }
    },

    async changeSelectCurrencyIndex(index) {
      this.selectCurrencyIndex = index;
      this.selectCurrencyKey = this.currency.key;
      this.currencyDropDown = false;
      this.activeItemBtn = -1;
      this.swapNumber = null;
      await this.getCurrencyBalance();
    },

    //点击最大
    clickMaxAmount() {
      this.activeItemBtn = 0;
      this.swapNumber = _.floor(this.currency.balance, 4);
      var el = document.getElementById("transfer_number_input");
      this.setCursorRange(el, 0, 0);
    },

    //获取焦点
    inputFocus(index) {
      this.$nextTick(() => {
        let currentElement = this.$refs["itemInput" + index].$el;
        let parentElement = findParents(currentElement, "swapInputBox");
        addClass(parentElement, "active");
      });
    },

    //失去焦点
    inputBlur(index) {
      this.$nextTick(() => {
        let currentElement = this.$refs["itemInput" + index].$el;
        let parentElement = findParents(currentElement, "swapInputBox");
        removeClass(parentElement, "active");
      });
    },

    toggleModal() {
      this.showPopup = !this.showPopup;
    },

    async close() {
      this.actionTabs = "m0";
      await this.initData();
    },

    async getPendingProcess() {
      //获取存取数据
      let [sourceArray, targetArray] = await Promise.all([
        lnr.freeZe({
          depositor: this.walletAddress,
          recipient: this.walletAddress,
          networkId: this.walletNetworkId,
        }),
        lnr.unfreeze({
          depositor: this.walletAddress,
          recipient: this.walletAddress,
          networkId: getOtherNetworks(this.walletNetworkId),
        }),
      ]);
      //取不同存储记录
      const diffArray = _.xorBy(sourceArray, targetArray, "depositId");
      if (diffArray.length) {
        if (diffArray[0].srcChainId === this.walletNetworkId) {
          this.$store.commit("setSwapUnfreezeContinue", true);
          this.frozenTokens = diffArray[0].source;
          this.actionTabs = "m1";
        } else {
          this.initData();
        }
      }
    },
  },
};
</script>

<style lang="scss">
#swap {
  .actionTabs {
    .ivu-tabs-bar {
      display: none;
    }

    .ivu-tabs-content {
      background: #fff;

      .ivu-tabs-tabpane {
        width: 786px;
        height: 840px !important;

        .swapBox,
        .waitingBox,
        .successBox,
        .failBox {
          width: 100%;
          height: 100%;
        }

        .swapBox {
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
              margin: 8px 55px 84px;
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

            .swapInputBox {
              width: 400px;
              border-radius: 8px;
              border: 1px solid #deddde;
              // transition: $animete-time linear;
              box-shadow: 0 0 0 #deddde;
              margin-top: 64px;
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
              margin-bottom: 24px;

              &:hover,
              &.active {
                box-shadow: 0 2px 12px #deddde;
                border-color: white;
              }
              &.error {
                border-color: #df434c;
              }

              .iconBox {
                display: flex;
                flex-direction: column;
                align-items: center;
                .icon {
                  margin: 24px 0 16px;
                  width: 64px;
                  height: 64px;
                  border-radius: 100%;
                  margin img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .name {
                  font-family: $BodyTextFontFamily;
                  text-align: center;
                  font-size: 24px;
                  line-height: 32px;
                  letter-spacing: 0;
                  cursor: pointer;

                  .ivu-poptip-rel {
                    display: flex;
                    align-items: center;

                    #dropdownArrowSvg {
                      margin-left: 8px;
                    }
                  }

                  .ivu-poptip-arrow {
                    display: none;
                  }

                  .ivu-poptip-popper {
                    &[x-placement^="bottom"] {
                      padding-top: 0px;
                      padding-bottom: 0px;
                      margin-top: 10px;
                    }
                  }

                  .ivu-poptip-body {
                    padding: 0;

                    .ivu-poptip-body-content {
                      max-height: 300px;
                      .currencyItem {
                        display: flex;
                        align-items: center;
                        padding: 16px 24px;
                        &:first-child {
                          border-top-left-radius: 4px;
                          border-top-right-radius: 4px;
                        }
                        &:last-child {
                          border-bottom-left-radius: 4px;
                          border-bottom-right-radius: 4px;
                        }

                        .itemIcon {
                          width: 40px;
                          height: 40px;
                          margin-right: 17px;
                        }

                        .itemName {
                          font-family: $BodyTextFontFamily;
                          font-size: 16px;
                          font-weight: bold;
                          font-stretch: normal;
                          font-style: normal;
                          line-height: 1.5;
                          letter-spacing: normal;
                          color: #5a575c;
                        }

                        &.selected {
                          background-color: rgba(#7eb5ff, 0.1);

                          .itemName {
                            color: #1a38f8;
                          }
                        }

                        &:hover {
                          &:not(.selected) {
                            background-color: rgba(#7eb5ff, 0.1);
                            .itemName {
                              color: #1a38f8;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              .divider {
                margin-top: 24px;
                width: 100%;
                height: 1px;
                background-color: #e5e5e5;
              }

              .inputBox {
                display: flex;
                padding: 24px;
                width: 100%;
                align-items: center;

                .label {
                  .amount {
                    font-family: $BodyTextFontFamily;
                    font-size: 16px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;
                  }

                  .max {
                    font-family: $BodyTextFontFamily;
                    font-size: 12px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.33;
                    letter-spacing: 1.5px;
                    text-align: center;
                    color: #1a38f8;
                    opacity: 0.2;
                    cursor: pointer;

                    &:hover {
                      opacity: 1;
                    }

                    &.active {
                      opacity: 1;
                    }
                  }
                }

                .input {
                  flex: 1;
                  border: none;
                  box-shadow: none;

                  .ivu-input-number-handler-wrap {
                    display: none;
                  }

                  .ivu-input-number-input {
                    text-align: right;
                    font-family: $BodyTextFontFamily;
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
              }
              .app-dark & {
                background: #050d20;
                border: none;
                &:hover,
                &.hovered,
                &.active {
                  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.5) !important;
                }
                &.active,
                &.hovered {
                  border: 1px solid #3851f0 !important;
                }
                &.hovered {
                  .iconBox {
                    .ivu-poptip-popper {
                      box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.5) !important;
                      .ivu-poptip-body-content {
                        .currencyItem {
                          .itemName {
                            color: #ffffff !important;
                          }
                          &.selected {
                            .itemName {
                              color: #1a38f8 !important;
                            }
                          }

                          &:hover {
                            &:not(.selected) {
                              .itemName {
                                color: #1a38f8 !important;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  .divider {
                    height: 0px;
                  }
                  .inputBox {
                    display: none;
                  }
                }
                .inputBox {
                  .input {
                    .ivu-input-number-input::placeholder {
                      color: #bababa !important;
                    }
                  }
                  .max {
                    opacity: 1;
                    background: none !important;
                    color: $BodyTextFontFamily !important;
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
            }

            #gasEditor {
              margin-top: 24px;
            }
          }

          .swapBtn {
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
            line-height: 32px;

            &:hover {
              &:not(.disabled) {
                background-color: #7eb5ff;
              }
            }

            &.disabled {
              opacity: 0.1;
              cursor: not-allowed;
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
            }

            &.swapBtnActivited {
              opacity: unset;
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #swap {
    height: 100%;
    .actionTabs {
      height: 100%;
      .ivu-tabs-content {
        height: 100%;
        .ivu-tabs-tabpane {
          width: 100%;
          height: 100% !important;
          min-height: 516px;
          .swapBox {
            padding-top: 24px;
            .actionBody {
              height: calc(100% - 48px);
              overflow-y: auto;
              padding: 20px 22px 44px;
              margin: 0 10px;

              .someWrongMobile {
                border-radius: 8px;
                background-color: rgba(#df434c, 0.05);
                padding: 12px 16px;
                display: flex;
                align-items: center;
                margin-bottom: 16px;
                margin-top: -20px;

                .errIcon {
                  margin-right: 12px;
                  width: 24px;
                  height: 24px;
                }

                .errMessage {
                  font-family: $BodyTextFontFamily;
                  font-size: 12px;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #df434c;
                }
              }

              .swapInputBox {
                width: 100%;
                margin-top: 0;
                margin-bottom: 16px;

                .iconBox {
                  .icon {
                    height: 48px;
                    width: 48px;
                    margin: 20px 0 12px;
                  }
                  .name {
                    margin-bottom: 12px;
                  }
                  .avaliable {
                    font-family: $BodyTextFontFamily;
                    font-size: 12px;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.33;
                    letter-spacing: normal;
                    text-align: center;
                    color: #99999a;
                  }
                  .name {
                    .ivu-poptip-popper {
                      &[x-placement^="bottom"] {
                        margin-top: 24px;
                      }
                    }
                  }
                }

                .inputBox {
                  padding: 16px;

                  .label {
                    flex: 1;
                    .amount {
                      font-family: $BodyTextFontFamily;
                      font-size: 12px;
                      font-weight: 500;
                      line-height: 1.33;
                      color: #99999a;
                    }
                    .input {
                      width: 100%;
                      .ivu-input-number-input {
                        padding: 0;
                        text-align: left;
                        font-size: 16px;
                        line-height: 1.5;
                      }
                    }
                  }

                  .max {
                    margin-left: 16px;
                    border-radius: 8px;
                    border: solid 1px #3851f0;
                    padding: 14px 24px;
                    font-family: Gilroy-Bold;
                    font-size: 10px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.6;
                    letter-spacing: 1.25px;
                    text-align: center;
                    color: #1a38f8;
                    .app-dark & {
                      background: #050d20;
                    }
                  }
                }
                .divider {
                  margin-top: 10px;
                }
              }
            }
            .swapBtn {
              height: 48px;
              font-size: 14px;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: 2px;
              padding-left: 5px;
              padding-right: 5px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
