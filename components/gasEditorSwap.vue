<template>
  <div id="gasEditorSwap">
    <div class="simple" v-if="simple">
      <div class="source">
        <div class="editInfo">
          <template v-if="isEthereumNetwork">ETH </template>
          <template v-else>BSC </template>
          network fee

          <span class="editBtn" @click.stop="sourceGasEditorModal = true">
            <img src="@/static/edit_pencil.svg" />

            <template v-if="!isMobile">EDIT</template>
          </span>
        </div>

        <div class="editFee">{{ sourcePrice }} Gwei</div>
      </div>

      <div class="target">
        <div class="editInfo">
          <template v-if="isEthereumNetwork">BSC </template>
          <template v-else>ETH </template> network fee

          <span class="editBtn" @click.stop="targetGasEditorModal = true">
            <img src="@/static/edit_pencil.svg" />
            <template v-if="!isMobile">EDIT</template>
          </span>
        </div>

        <div class="editFee">{{ targetPrice }} Gwei</div>
      </div>
    </div>

    <div class="normal" v-else>
      <div class="source">
        <div class="editInfo">
          <template v-if="isEthereumNetwork">
            <img class="editLogo" src="@/static/ETH.svg" />
            <div class="editNetwork">
              <template v-if="isMobile">ETH Network</template>
              <template v-else>Ethereum Network</template>
            </div>
          </template>
          <template v-if="isBinanceNetwork">
            <img class="editLogo" src="@/static/binance.svg" />
            <div class="editNetwork">
              <template v-if="isMobile">BSC Network</template>
              <template v-else> Binance Smart Chain</template>
            </div>
          </template>

          <div class="editFee">
            <template v-if="!isMobile">Network</template>
            Fee : {{ sourcePrice }} Gwei
            <img
              class="editBtn"
              @click="sourceGasEditorModal = true"
              src="@/static/edit_pencil.svg"
            />
          </div>
        </div>
      </div>

      <div class="arrow">
        <img
          v-if="theme === 'light'"
          src="@/static/transferProgress/arrow_right.svg"
        />
        <img
          v-else
          src="@/static/dark-theme/transferProgress/arrow_right.svg"
        />
      </div>

      <div class="target">
        <div class="editInfo">
          <template v-if="isEthereumNetwork">
            <img class="editLogo" src="@/static/binance.svg" />
            <div class="editNetwork">
              <template v-if="isMobile">BSC Network</template>
              <template v-else> Binance Smart Chain</template>
            </div>
          </template>
          <template v-if="isBinanceNetwork">
            <img class="editLogo" src="@/static/ETH.svg" />
            <div class="editNetwork">
              <template v-if="isMobile">ETH Network</template>
              <template v-else>Ethereum Network</template>
            </div>
          </template>

          <div class="editFee">
            <template v-if="!isMobile">Network</template> Fee :
            {{ targetPrice }} Gwei
            <img
              class="editBtn"
              @click="targetGasEditorModal = true"
              src="@/static/edit_pencil.svg"
            />
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-model="sourceGasEditorModal"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="false"
      scrollable
      fullscreen
      class-name="vertical-center-modal"
      class="gasEditorSwapModal"
      @on-visible-change="sourceGasEditorModalChange"
    >
      <div class="closeBtn" @click="sourceGasEditorModal = false">
        <img v-if="isMobile" src="@/static/icon-cancel.svg" />
        <closeSvg v-else></closeSvg>
      </div>

      <div class="content">
        <div class="contentTitle">
          <template v-if="isMobile">Edit Gas Fee</template>
          <template v-else>Edit</template>
        </div>
        <div class="contentDesc">
          Adjust the gas price (GWEI) below to set the transaction speed by
          recommended ones or entering manually
        </div>

        <div class="selections">
          <div
            class="selectionItem"
            @click="sourceSelectedTypeChange(NETWORK_SPEEDS_TO_KEY.SLOW)"
            :class="{
              active: sourceSelectedType == NETWORK_SPEEDS_TO_KEY.SLOW,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.SLOW | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ sourceNetworkSpeeds.SLOW.price }}
            </div>

            <div class="itemTime">{{ sourceNetworkSpeeds.SLOW.time }} mins</div>
          </div>

          <div
            class="selectionItem"
            @click="sourceSelectedTypeChange(NETWORK_SPEEDS_TO_KEY.MEDIUM)"
            :class="{
              active: sourceSelectedType == NETWORK_SPEEDS_TO_KEY.MEDIUM,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.MEDIUM | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ sourceNetworkSpeeds.MEDIUM.price }}
            </div>

            <div class="itemTime">
              {{ sourceNetworkSpeeds.MEDIUM.time }} mins
            </div>
          </div>

          <div
            class="selectionItem"
            @click="sourceSelectedTypeChange(NETWORK_SPEEDS_TO_KEY.FAST)"
            :class="{
              active: sourceSelectedType == NETWORK_SPEEDS_TO_KEY.FAST,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.FAST | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ sourceNetworkSpeeds.FAST.price }}
            </div>

            <div class="itemTime">{{ sourceNetworkSpeeds.FAST.time }} mins</div>
          </div>
        </div>

        <div
          class="custom"
          :class="{
            active: sourceSelectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM,
          }"
          @click="sourceCustomPriceFocus"
        >
          <div class="leftRect">
            <div class="icon" v-if="!isMobile">
              <img v-if="isEthereumNetwork" src="@/static/ETH.svg" />
              <img v-else src="@/static/bnb.svg" />
            </div>

            <div class="desc">
              <div class="descTop">
                <template v-if="isMobile">Customize</template>
                <template v-else>
                  <template v-if="isEthereumNetwork">
                    Ethereum Network Fee
                  </template>
                  <template v-if="isBinanceNetwork">
                    Binance Smart Chain Fee
                  </template>
                </template>
              </div>
              <div class="unit">
                <template v-if="isMobile">
                  <template v-if="isEthereumNetwork">
                    Etherum network fee (GWEI)
                  </template>
                  <template v-if="isBinanceNetwork">
                    BSC network fee (GWEI)
                  </template>
                </template>
                <template v-else>GWEI</template>
              </div>
            </div>
          </div>

          <InputNumber
            class="rightNum"
            ref="source"
            :min="0"
            :max="10000"
            v-model="sourceCustomPrice"
            placeholder="0"
            :formatter="(value) => `${parseInt(value)}`"
          ></InputNumber>
        </div>

        <Spin size="large" fix v-if="speedLoading"></Spin>
      </div>

      <div
        class="confirm"
        :class="{ disabled: sourceDisabledConfirmBtn }"
        @click="confirmGas(CONFIRM_TYPE.SOURCE)"
      >
        CONFIRM
      </div>
    </Modal>

    <Modal
      v-model="targetGasEditorModal"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="false"
      scrollable
      fullscreen
      class-name="vertical-center-modal"
      class="gasEditorSwapModal"
      @on-visible-change="targetGasEditorModalChange"
    >
      <div class="closeBtn" @click="targetGasEditorModal = false">
        <img v-if="isMobile" src="@/static/icon-cancel.svg" />
        <closeSvg v-else></closeSvg>
      </div>

      <div class="content">
        <div class="contentTitle">
          <template v-if="isMobile">Edit Gas Fee</template>
          <template v-else>Edit</template>
        </div>
        <div class="contentDesc">
          Adjust the gas price (GWEI) below to set the transaction speed by
          recommended ones or entering manually
        </div>

        <div class="selections">
          <div
            class="selectionItem"
            @click="targetSelectedTypeChange(NETWORK_SPEEDS_TO_KEY.SLOW)"
            :class="{
              active: targetSelectedType == NETWORK_SPEEDS_TO_KEY.SLOW,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.SLOW | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ targetNetworkSpeeds.SLOW.price }}
            </div>

            <div class="itemTime">{{ targetNetworkSpeeds.SLOW.time }} mins</div>
          </div>

          <div
            class="selectionItem"
            @click="targetSelectedTypeChange(NETWORK_SPEEDS_TO_KEY.MEDIUM)"
            :class="{
              active: targetSelectedType == NETWORK_SPEEDS_TO_KEY.MEDIUM,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.MEDIUM | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ targetNetworkSpeeds.MEDIUM.price }}
            </div>

            <div class="itemTime">
              {{ targetNetworkSpeeds.MEDIUM.time }} mins
            </div>
          </div>

          <div
            class="selectionItem"
            @click="targetSelectedTypeChange(NETWORK_SPEEDS_TO_KEY.FAST)"
            :class="{
              active: targetSelectedType == NETWORK_SPEEDS_TO_KEY.FAST,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.FAST | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ targetNetworkSpeeds.FAST.price }}
            </div>

            <div class="itemTime">{{ targetNetworkSpeeds.FAST.time }} mins</div>
          </div>
        </div>

        <div
          class="custom"
          :class="{
            active: targetSelectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM,
          }"
          @click="targetCustomPriceFocus"
        >
          <div class="leftRect">
            <div class="icon" v-if="!isMobile">
              <img v-if="isEthereumNetwork" src="@/static/bnb.svg" />
              <img v-else src="@/static/ETH.svg" />
            </div>

            <div class="desc">
              <div class="descTop">
                <template v-if="isMobile">Customize</template>
                <template v-else>
                  <template v-if="isEthereumNetwork">
                    Binance Smart Chain Fee
                  </template>
                  <template v-if="isBinanceNetwork">
                    Ethereum Network Fee
                  </template>
                </template>
              </div>
              <div class="unit">
                <template v-if="isMobile">
                  <template v-if="isEthereumNetwork">
                    BSC network fee (GWEI)
                  </template>
                  <template v-if="isBinanceNetwork">
                    Etherum network fee (GWEI)
                  </template>
                </template>
                <template v-else>GWEI</template>
              </div>
            </div>
          </div>

          <InputNumber
            class="rightNum"
            ref="target"
            :min="0"
            :max="10000"
            v-model="targetCustomPrice"
            placeholder="0"
            :formatter="(value) => `${parseInt(value)}`"
          ></InputNumber>
        </div>

        <Spin size="large" fix v-if="speedLoading"></Spin>
      </div>

      <div
        class="confirm"
        :class="{ disabled: targetDisabledConfirmBtn }"
        @click="confirmGas(CONFIRM_TYPE.TARGET)"
      >
        CONFIRM
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from "lodash";
import closeSvg from "@/components/svg/close";

import {
  getNetworkSpeeds,
  formatGasPrice,
  unFormatGasPrice,
  isEthereumNetwork,
  isBinanceNetwork,
  SUPPORTED_NETWORKS_MAP,
  getOtherNetworks,
} from "@/assets/linearLibrary/linearTools/network";
import { NETWORK_SPEEDS_TO_KEY } from "@/assets/linearLibrary/linearTools/constants/network";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { Logger } from "ethers/lib/utils";

export default {
  props: {
    simple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sourcePrice: unFormatGasPrice(this.$store.state?.sourceGasDetails?.price), //当前选中的gas
      targetPrice: unFormatGasPrice(this.$store.state?.targetGasDetails?.price), //当前选中的gas BSC
      sourceGasEditorModal: false, //设置弹窗
      targetGasEditorModal: false, //设置弹窗
      sourceSelectedType: this.$store.state?.sourceGasDetails?.type, //当前选择类型
      targetSelectedType: this.$store.state?.targetGasDetails?.type, //当前选择类型 BSC
      sourceNetworkSpeeds: { SLOW: {}, MEDIUM: {}, FAST: {} }, //网络速度
      targetNetworkSpeeds: { SLOW: {}, MEDIUM: {}, FAST: {} }, //网络速度
      speedLoading: false, //加载状态
      sourceCustomPrice: null, //自定义的gas
      targetCustomPrice: null, //自定义的gas
      NETWORK_SPEEDS_TO_KEY, //速度类型
      CONFIRM_TYPE: {
        SOURCE: "source",
        TARGET: "target",
      },
      chainChangeTokenFromSubscribe: null,

      // isEthereumNetworkFunc: isEthereumNetwork,
      // isBinanceNetworkFunc: isBinanceNetwork,
    };
  },
  filters: {
    capitalize(val) {
      if (_.isNull(val)) {
        return;
      } else {
        return _.capitalize(val);
      }
    },
  },
  components: {
    closeSvg,
  },
  async created() {
    let sourceStatus = this.$store.state?.sourceGasDetails.status;
    let targetStatus = this.$store.state?.targetGasDetails.status;

    //初始化当前数据
    if (sourceStatus == -1 && targetStatus == -1) {
      //获取数据
      await this.getNetworkSpeeds({
        sourceNetwork: true,
        targetNetwork: true,
      });
      this.setSourceGasDetails(this.sourcePrice, this.sourceSelectedType);
      this.setTargetGasDetails(this.targetPrice, this.targetSelectedType);
    } else {
      this.checkGasDetails();
    }

    this.chainChangeTokenFromSubscribe = this.$pub.subscribe(
      "onWalletChainChange",
      async () => {
        //当前和上一次不是相同网络时,交换gas
        this.checkGasDetails();
      }
    );
  },

  destroyed() {
    //清除事件,防止重复
    if (this.chainChangeTokenFromSubscribe) {
      this.$pub.unsubscribe(this.chainChangeTokenFromSubscribe);
      this.chainChangeTokenFromSubscribe = "";
    }
  },
  watch: {
    selectedSourceTypeChangeListener() {},
    selectedTargetTypeChangeListener() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    isMobile() {},
    sourceGasNetworkId() {},
  },

  computed: {
    //监听选择类型改变
    selectedSourceTypeChangeListener() {
      if (this.sourceSelectedType != "CUSTOM") {
        this.sourceCustomPrice = null;
      }
      return;
    },
    //监听选择类型改变
    selectedTargetTypeChangeListener() {
      if (this.targetSelectedType != "CUSTOM") {
        this.targetCustomPrice = null;
      }
      return;
    },

    sourceDisabledConfirmBtn() {
      return (
        this.sourceSelectedType == "CUSTOM" && _.lte(this.sourceCustomPrice, 0)
      );
    },

    targetDisabledConfirmBtn() {
      return (
        this.targetSelectedType == "CUSTOM" && _.lte(this.targetCustomPrice, 0)
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

    sourceGasNetworkId() {
      return this.$store.state?.sourceGasDetails?.networkId;
    },
    theme() {
      return this.$store.state.theme;
    },
  },

  methods: {
    checkGasDetails() {
      if (
        (isEthereumNetwork(this.walletNetworkId) &&
          !isEthereumNetwork(this.sourceGasNetworkId)) ||
        (isBinanceNetwork(this.walletNetworkId) &&
          !isBinanceNetwork(this.sourceGasNetworkId))
      ) {
        this.reverseGas();
      }
    },

    //交换gas数据
    reverseGas() {
      let sourceGasDetails = { ...this.$store.state?.sourceGasDetails },
        targetGasDetails = { ...this.$store.state?.targetGasDetails };

      this.sourceSelectedType = targetGasDetails.type;
      this.targetSelectedType = sourceGasDetails.type;
      this.sourcePrice = unFormatGasPrice(targetGasDetails.price);
      this.targetPrice = unFormatGasPrice(sourceGasDetails.price);

      if (this.sourceSelectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM) {
        this.sourceCustomPrice = this.sourcePrice;
      }

      if (this.targetSelectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM) {
        this.targetCustomPrice = this.targetPrice;
      }

      const tempSpeeds = { ...this.sourceNetworkSpeeds };
      this.sourceNetworkSpeeds = { ...this.targetNetworkSpeeds };
      this.targetNetworkSpeeds = { ...tempSpeeds };

      this.$store.commit("setSourceGasDetails", targetGasDetails);
      this.$store.commit("setTargetGasDetails", sourceGasDetails);
    },

    //获取网络速度
    async getNetworkSpeeds({
      sourceNetwork = false,
      targetNetwork = false,
    } = {}) {
      try {
        this.speedLoading = true;
        let sourceNetworkId = this.walletNetworkId,
          targetNetworkId;

        targetNetwork &&
          (targetNetworkId = getOtherNetworks(this.walletNetworkId));

        if (sourceNetwork) {
          await getNetworkSpeeds(sourceNetworkId)
            .then((res) => {
              this.sourceNetworkSpeeds = res;
              this.sourceSelectedType =
                this.$store.state.sourceGasDetails?.type;
              //判断赋值
              if (this.sourceSelectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM) {
                this.sourcePrice = this.sourceCustomPrice = unFormatGasPrice(
                  this.$store.state.sourceGasDetails?.price
                );
              } else {
                this.sourcePrice =
                  this.sourceNetworkSpeeds[this.sourceSelectedType].price;
              }
            })
            .finally(() => {
              this.speedLoading = false;
            });
        }
        if (targetNetwork) {
          await getNetworkSpeeds(targetNetworkId)
            .then((res) => {
              this.targetNetworkSpeeds = res;
              this.targetSelectedType =
                this.$store.state.targetGasDetails?.type;
              //判断赋值
              if (this.targetSelectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM) {
                this.targetPrice = this.targetCustomPrice = unFormatGasPrice(
                  this.$store.state.targetGasDetails?.price
                );
              } else {
                this.targetPrice =
                  this.targetNetworkSpeeds[this.targetSelectedType].price;
              }
            })
            .finally(() => {
              this.speedLoading = false;
            });
        }
      } catch (error) {
        console.log(error);
      }
    },

    //gas设置窗口改变事件
    async sourceGasEditorModalChange(status) {
      //每次显示时都重新获取最新的数据
      if (status) {
        //重新获取选中项
        this.sourceSelectedType = this.$store.state?.sourceGasDetails?.type;

        await this.getNetworkSpeeds({ sourceNetwork: true });

        const gwei = unFormatGasPrice(
          this.$store.state?.sourceGasDetails?.price
        );

        //如果price发生变化时,更新数据
        if (this.sourcePrice != gwei) {
          this.setSourceGasDetails(this.sourcePrice, this.sourceSelectedType);
        }
      }
    },

    //gas设置窗口改变事件
    async targetGasEditorModalChange(status) {
      //每次显示时都重新获取最新的数据
      if (status) {
        //重新获取选中项
        this.targetSelectedType = this.$store.state?.targetGasDetails?.type;

        await this.getNetworkSpeeds({ targetNetwork: true });

        const gwei = unFormatGasPrice(
          this.$store.state?.targetGasDetails?.price
        );

        //如果price发生变化时,更新数据
        if (this.targetPrice != gwei) {
          this.setTargetGasDetails(this.targetPrice, this.targetSelectedType);
        }
      }
    },

    //选择类型改变
    sourceSelectedTypeChange(type) {
      this.sourceSelectedType = type;
    },
    //选择类型改变
    targetSelectedTypeChange(type) {
      this.targetSelectedType = type;
    },

    //自定义gas输入框获取焦点事件
    sourceCustomPriceFocus() {
      this.sourceSelectedTypeChange("CUSTOM");
      this.$nextTick(() => {
        this.$refs.source.$el.querySelector("input").focus();
      });
    },

    //自定义gas输入框获取焦点事件
    targetCustomPriceFocus() {
      this.targetSelectedTypeChange("CUSTOM");
      this.$nextTick(() => {
        this.$refs.target.$el.querySelector("input").focus();
      });
    },

    //确认gas
    confirmGas(type) {
      if (type == this.CONFIRM_TYPE.SOURCE) {
        if (!this.sourceDisabledConfirmBtn) {
          let price;
          //获取price
          if (this.sourceSelectedType == "CUSTOM") {
            price = this.sourceCustomPrice;
          } else {
            price = this.sourceNetworkSpeeds[this.sourceSelectedType].price;
          }

          //防止为null
          if (price == null) {
            this.sourceCustomPrice = price = 0;
          }

          this.sourcePrice = price;
          this.setSourceGasDetails(price, this.sourceSelectedType);

          this.sourceGasEditorModal = false;
        }
      } else if (type == this.CONFIRM_TYPE.TARGET) {
        if (!this.targetDisabledConfirmBtn) {
          let price;

          //获取price
          if (this.targetSelectedType == "CUSTOM") {
            price = this.targetCustomPrice;
          } else {
            price = this.targetNetworkSpeeds[this.targetSelectedType].price;
          }

          //防止为null
          if (price == null) {
            this.targetCustomPrice = price = 0;
          }

          this.targetPrice = price;
          this.setTargetGasDetails(price, this.targetSelectedType);

          this.targetGasEditorModal = false;
        }
      }
    },

    //设置gas
    setSourceGasDetails(price, type) {
      this.$store.commit("setSourceGasDetails", {
        price: formatGasPrice(price),
        type,
        status: 1,
        networkId: this.walletNetworkId,
      });
    },

    //设置gas
    setTargetGasDetails(price, type) {
      const targetNetworkId = getOtherNetworks(this.walletNetworkId);
      this.$store.commit("setTargetGasDetails", {
        price: formatGasPrice(price),
        type,
        status: 1,
        networkId: targetNetworkId,
      });
    },
  },
};
</script>

<style lang="scss">
#gasEditorSwap {
  width: 100%;

  .simple {
    .target {
      margin-top: 8px;
    }

    .source,
    .target {
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-family: Gilroy-Regular;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #5a575c;

      .editInfo {
        flex: 1;
        display: flex;
        align-items: center;

        .editBtn {
          margin-left: 11px;
          padding: 3px 7px;
          border-radius: 14px;
          border: solid 1px #e5e5e5;
          font-family: Gilroy-Bold;
          font-size: 10px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: 1.25px;
          color: #1a38f8;
          cursor: pointer;
          transition: border $animete-time linear;

          img {
            width: 16px;
            height: 16px;
          }

          &:hover {
            border-color: #1a38f8;
          }
        }
        .app-dark & {
          color: white !important;
          .editBtn {
            border-color: #3851f0 !important;
            color: #3851f0 !important;
          }
        }
      }
    }
  }

  .normal {
    display: flex;
    position: relative;

    .source {
      background-color: #fafafa;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .target {
      background-color: #f6f6f6;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .source,
    .target {
      flex: 1;
      .editInfo {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 10px;

        .editLogo {
          width: 32px;
          height: 32px;
          margin-bottom: 8px;
        }

        .editNetwork {
          font-family: Gilroy-Medium;
          font-size: 12px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: center;
          color: #5a575c;
        }

        .editFee {
          font-family: Gilroy-Medium;
          font-size: 12px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: center;
          color: #99999a;
          display: flex;
          align-items: center;

          .editBtn {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-left: 4px;
          }
        }
      }
    }

    .arrow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;

      img {
        width: 15px;
        height: 15px;
      }
    }
    .app-dark & {
      .source {
        background: rgba(5, 13, 32, 0.7) !important;
      }
      .target {
        background: rgb(5, 13, 32) !important;
      }
      .arrow {
        background: #3851f0 !important;
      }
      .source,
      .target {
        .editFee {
          color: #99999a !important;
        }
      }
    }
  }

  .gasEditorSwapModal {
    .ivu-modal {
      .ivu-modal-body {
        position: relative;
        padding: 0;
        height: 100%;

        .closeBtn {
          position: absolute;
          top: 24px;
          right: 24px;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 193px;

          .contentTitle {
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

          .contentDesc {
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
          }

          @mixin selectedBox {
            border-radius: 8px;
            border: solid 1px #e5e5e5;
            cursor: pointer;
            transition: $animete-time linear;

            display: flex;
            flex-direction: column;
            align-items: center;

            &:hover {
              border-color: white;
              box-shadow: 0px 2px 12px #deddde;
            }

            &.active {
              border-color: #1a38f8;
              box-shadow: 0px 2px 12px rgba(26, 56, 248, 0.25);
            }
          }

          .selections {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 124px;

            .selectionItem {
              @include selectedBox;
              flex: 1;
              padding: 37px 15px;

              &:nth-child(2) {
                margin: 0 17px;
              }

              .itemSpeed {
                font-family: Gilroy-Bold;
                font-size: 14px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.29;
                letter-spacing: normal;
                text-align: center;
                color: #1a38f8;
              }

              .itemNumBox {
                margin-top: 8px;
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
              .itemTime {
                font-family: Gilroy-Regular;
                font-size: 14px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.29;
                letter-spacing: normal;
                text-align: center;
                color: #99999a;
              }
            }
          }

          .custom {
            @include selectedBox;
            width: 100%;
            margin-top: 17px;
            padding: 39px 24px;
            flex-direction: row;

            .leftRect {
              display: flex;
              align-items: center;
              flex: 1;

              .icon {
                width: 40px;
                height: 40px;
                border: solid 1px #deddde;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                margin-right: 16px;
              }

              .desc {
                .descTop {
                  font-family: Gilroy-Bold;
                  font-size: 16px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.5;
                  letter-spacing: normal;
                  color: #5a575c;
                }

                .unit {
                  font-family: Gilroy-Medium;
                  font-size: 12px;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #99999a;
                }
              }
            }

            .rightNum {
              box-shadow: none;
              border: none;

              width: 100px;

              .ivu-input-number-handler-wrap {
                display: none;
              }

              .ivu-input-number-input {
                padding: 0;
                color: #5a575c;
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
          }
        }

        .confirm {
          position: absolute;
          bottom: 0;
          width: 100%;
          cursor: pointer;
          height: 80px;
          line-height: 80px;
          background: #1a38f8;
          color: #ffffff;
          font-family: Gilroy;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 3px;
          transition: $animete-time linear;

          &:hover {
            &:not(.disabled) {
              background-color: #7eb5ff;
            }
          }

          &.disabled {
            opacity: 0.1;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #gasEditorSwap {
    width: 74.4vw;

    .simple {
      .source,
      .target {
        font-size: 12px;

        .editInfo {
          .editBtn {
            margin-left: 5px;
            padding: 0;
            border: none;
          }
        }
      }
    }

    .normal {
      .source,
      .target {
        .editInfo {
          .editLogo {
            width: 24px;
            height: 24px;
          }
        }
      }
    }

    .gasEditorSwapModal {
      .ivu-modal {
        .ivu-modal-body {
          .closeBtn {
            img {
              width: 26px;
              height: 26px;
            }
          }

          .content {
            padding: 24px 32px;
            align-items: flex-start;

            .contentTitle {
              text-align: left;
              font-size: 16px;
              line-height: 1.5;
              color: #5a575c;
            }

            .contentDesc {
              margin-top: 8px;
              text-align: left;
              font-size: 12px;
              line-height: 1.33;
              color: #99999a;
            }

            .selections {
              margin-top: 64px;

              .selectionItem {
                flex: 1;
                padding: 33px 12px;

                .itemNumBox {
                  font-size: 24px;
                  line-height: 1.33;
                }

                .itemTime {
                  font-size: 12px;
                  line-height: 1.33;
                }
              }
            }

            .custom {
              padding: 28px 16px;

              .leftRect {
                .desc {
                  .descTop {
                    font-size: 14px;
                    line-height: 1.29;
                  }

                  .unit {
                    font-family: Gilroy-Regular;
                    font-weight: normal;
                  }
                }
              }

              .rightNum {
                .ivu-input-number-input {
                  line-height: 1.25;
                  font-size: 24px;
                  line-height: 1.33;
                }
              }
            }
          }

          .confirm {
            margin: 0 32px;
            width: calc(100% - 64px);
            border-radius: 20px;
            bottom: 32px;
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1.5px;
          }
        }
      }
    }
  }
}
</style>
