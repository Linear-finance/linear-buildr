<template>
  <div id="gasEditor">
    <div class="editInfo">
      <div class="infoLeft">
        <span class="editTitle">
          <template v-if="isEthereumNetwork"> Ethereum Network Fee </template>
          <template v-else-if="isBinanceNetwork">
            Binance Smart Chain fee
          </template>
        </span>
        <span class="editBtn" @click="gasEditorModal = true"
          ><svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.0682 3.70788L12.1254 2.76507C11.6047 2.24438 10.7605 2.24438 10.2398 2.76507L4.23671 8.76817C4.07267 8.93221 3.95427 9.13621 3.89321 9.36001L3.23225 11.7824C3.09644 12.2801 3.55317 12.7369 4.05089 12.6011L6.4733 11.9401C6.6971 11.879 6.9011 11.7606 7.06514 11.5966L13.0682 5.5935C13.5889 5.0728 13.5889 4.22858 13.0682 3.70788ZM12.5968 4.17929C12.8572 4.43964 12.8572 4.86175 12.5968 5.1221L6.59373 11.1252C6.51171 11.2072 6.40971 11.2664 6.29781 11.2969L3.8754 11.9579L4.53636 9.5355C4.5669 9.4236 4.62609 9.3216 4.70811 9.23958L10.7112 3.23648C10.9716 2.97613 11.3937 2.97613 11.654 3.23648L12.5968 4.17929Z"
                fill="#CBE1FF"
              />
            </g></svg
          >EDIT</span
        >

        <span class="editBtnMobile" @click="gasEditorModal = true"
          ><svg width="16px" height="16px" viewBox="0 0 16 16">
            <g>
              <path
                d="M1.3334 0L2.6668 0C3.40322 0 4.0002 0.596984 4.0002 1.3334L4.0002 9.82349C4.0002 10.0555 3.93967 10.2835 3.82459 10.4849L2.579 12.6653C2.32307 13.1133 1.67713 13.1133 1.4212 12.6653L0.175608 10.4849C0.0605293 10.2835 0 10.0555 0 9.82349L0 1.3334C0 0.596984 0.596984 0 1.3334 0ZM3.3335 1.3334C3.3335 0.965192 3.03501 0.6667 2.6668 0.6667L1.3334 0.6667C0.965192 0.6667 0.6667 0.965192 0.6667 1.3334L0.6667 9.82349C0.6667 9.93949 0.696965 10.0535 0.754504 10.1542L2.0001 12.3346L3.2457 10.1542C3.30324 10.0535 3.3335 9.93949 3.3335 9.82349L3.3335 1.3334Z"
                transform="matrix(0.70710677 0.70710677 -0.70710677 0.70710677 11.182764 1.8231096)"
                fill="#deddde"
                fill-rule="evenodd"
                stroke="none"
              />
            </g></svg
        ></span>
      </div>
      <div class="infoRight">
        <span class="price">{{ price }}</span>
        <span class="unit">GWEI</span>
      </div>
    </div>

    <Modal
      v-model="gasEditorModal"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="false"
      scrollable
      fullscreen
      class-name="vertical-center-modal"
      class="gasEditorModal"
      @on-visible-change="gasEditorModalChange"
    >
      <div class="header">
        <div class="closeBtn" @click="gasEditorModal = false">
          <closeSvg></closeSvg>
        </div>
      </div>

      <div class="content">
        <div class="contentTitle">Edit</div>
        <div class="contentTitleMobile">Edit Gas Fee</div>
        <div class="contentDesc">
          Adjust the gas price (GWEI) below to set the transaction speed by
          recommended ones or entering manually
        </div>

        <div class="selections">
          <div
            class="selectionItem"
            @click="selectedTypeChange(NETWORK_SPEEDS_TO_KEY.SLOW)"
            :class="{
              active: selectedType == NETWORK_SPEEDS_TO_KEY.SLOW,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.SLOW | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ networkSpeeds.SLOW.price }}
            </div>

            <div class="itemTime">{{ networkSpeeds.SLOW.time }} mins</div>
          </div>

          <div
            class="selectionItem"
            @click="selectedTypeChange(NETWORK_SPEEDS_TO_KEY.MEDIUM)"
            :class="{
              active: selectedType == NETWORK_SPEEDS_TO_KEY.MEDIUM,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.MEDIUM | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ networkSpeeds.MEDIUM.price }}
            </div>

            <div class="itemTime">{{ networkSpeeds.MEDIUM.time }} mins</div>
          </div>

          <div
            class="selectionItem"
            @click="selectedTypeChange(NETWORK_SPEEDS_TO_KEY.FAST)"
            :class="{
              active: selectedType == NETWORK_SPEEDS_TO_KEY.FAST,
            }"
          >
            <div class="itemSpeed">
              {{ NETWORK_SPEEDS_TO_KEY.FAST | capitalize }}
            </div>

            <div class="itemNumBox">
              {{ networkSpeeds.FAST.price }}
            </div>

            <div class="itemTime">{{ networkSpeeds.FAST.time }} mins</div>
          </div>
        </div>

        <div
          class="custom"
          :class="{
            active: selectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM,
          }"
          @click="customPriceFocus"
        >
          <div class="leftRect">
            <div class="icon">
              <template v-if="isEthereumNetwork">
                <img src="@/static/ETH.svg" />
              </template>
              <template v-else-if="isBinanceNetwork">
                <img src="@/static/bnb.svg" />
              </template>
            </div>

            <div class="desc">
              <div class="descTop">
                <template v-if="isEthereumNetwork">
                  Ethereum Network Fee
                </template>
                <template v-else-if="isBinanceNetwork">
                  Binance Smart Chain fee
                </template>
              </div>
              <div class="descTopMobile">Customize</div>

              <div class="unit">GWEI</div>
              <div class="unitMobile">
                <template v-if="isEthereumNetwork">
                  Ethereum Network Fee(GWEI)
                </template>
                <template v-else-if="isBinanceNetwork">
                  Binance Smart Chain fee(GWEI)
                </template>
              </div>
            </div>
          </div>

          <InputNumber
            class="rightNum"
            ref="num"
            :min="0"
            :max="10000"
            v-model="customPrice"
            placeholder="0"
            :formatter="(value) => `${parseInt(value)}`"
          ></InputNumber>
        </div>

        <Spin size="large" fix v-if="speedLoading"></Spin>
      </div>

      <div
        class="confirm"
        :class="{ disabled: disabledConfirmBtn }"
        @click="confirmGas"
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
} from "@/assets/linearLibrary/linearTools/network";
import { NETWORK_SPEEDS_TO_KEY } from "@/assets/linearLibrary/linearTools/constants/network";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";

export default {
  data() {
    return {
      price: unFormatGasPrice(this.$store.state?.gasDetails?.price), //当前选中的gas
      gasEditorModal: false, //设置弹窗
      selectedType: this.$store.state?.gasDetails?.type, //当前选择类型
      networkSpeeds: { SLOW: {}, MEDIUM: {}, FAST: {} }, //网络速度
      speedLoading: false, //加载状态
      customPrice: null, //自定义的gas
      NETWORK_SPEEDS_TO_KEY, //速度类型
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
    //获取数据
    await this.getNetworkSpeeds();

    //初始化当前数据
    if (this.$store.state?.gasDetails?.status == -1) {
      this.setGasDetails(this.price, this.selectedType);
    } else {
      this.gasEditorModalChange(true);
    }
  },
  watch: {
    selectedTypeChangeListener() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
  },

  computed: {
    //监听选择类型改变
    selectedTypeChangeListener() {
      if (this.selectedType != "CUSTOM") {
        this.customPrice = null;
      }
      return;
    },

    disabledConfirmBtn() {
      return this.selectedType == "CUSTOM" && _.lte(this.customPrice, 0);
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
  },

  methods: {
    //获取网络速度
    async getNetworkSpeeds() {
      try {
        this.speedLoading = true;

        await getNetworkSpeeds()
          .then((res) => {
            this.networkSpeeds = res;

            this.selectedType = this.$store.state?.gasDetails?.type;

            //判断赋值
            if (this.selectedType == NETWORK_SPEEDS_TO_KEY.CUSTOM) {
              this.price = this.customPrice = unFormatGasPrice(
                this.$store.state?.gasDetails?.price
              );
            } else {
              this.price = this.networkSpeeds[this.selectedType].price;
            }
          })
          .finally(() => {
            this.speedLoading = false;
          });
      } catch (error) {
        console.log(error);
      }
    },

    //gas设置窗口改变事件
    async gasEditorModalChange(status) {
      //每次显示时都重新获取最新的数据
      if (status) {
        //重新获取选中项
        this.selectedType = this.$store.state?.gasDetails?.type;

        await this.getNetworkSpeeds();

        const gwei = unFormatGasPrice(this.$store.state?.gasDetails?.price);

        //如果price发生变化时,更新数据
        if (this.price != gwei) {
          this.setGasDetails(this.price, this.selectedType);
        }
      }
    },

    //选择类型改变
    selectedTypeChange(type) {
      this.selectedType = type;
    },

    //自定义gas输入框获取焦点事件
    customPriceFocus() {
      this.selectedTypeChange("CUSTOM");
      this.$nextTick(() => {
        this.$refs.num.$el.querySelector("input").focus();
      });
    },

    //确认gas
    confirmGas() {
      if (!this.disabledConfirmBtn) {
        let price;

        //获取price
        if (this.selectedType == "CUSTOM") {
          price = this.customPrice;
        } else {
          price = this.networkSpeeds[this.selectedType].price;
        }

        //防止为null
        if (price == null) {
          this.customPrice = price = 0;
        }

        this.price = price;

        this.setGasDetails(price, this.selectedType);

        this.gasEditorModal = false;
      }
    },

    //设置gas
    setGasDetails(price, type) {
      this.$store.commit("setGasDetails", {
        price: formatGasPrice(price),
        type,
        status: 1,
      });
    },
  },
};
</script>

<style lang="scss">
#gasEditor {
  width: 100%;

  .editInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .infoLeft {
      display: flex;
      .editTitle {
        font-family: Gilroy-Regular;
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

      .editBtn {
        margin-left: 8px;
        width: 62px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #a4cbff;
        text-transform: uppercase;

        font-family: Gilroy-Bold;
        font-size: 10px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.6;
        letter-spacing: 1.25px;

        &,
        * {
          transition: $animete-time linear;
        }

        &:hover {
          // color: #1a38f8;
          border-color: #1a38f8;

          // img {
          //     filter: drop-shadow(red 80px 0);
          // }
        }

        svg {
          margin-right: 4px;
          path {
            fill: #1a38f8;
          }
        }
      }

      .editBtnMobile {
        display: none;
      }
    }

    .infoRight {
      display: flex;
      align-items: center;

      font-family: Gilroy-Regular;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: #99999a;

      .price {
        margin-right: 8px;
      }
    }
  }

  .gasEditorModal {
    .ivu-modal {
      .ivu-modal-body {
        position: relative;
        padding: 0;
        height: 100%;

        .header {
          position: absolute;
          top: 24px;
          right: 24px;

          .closeBtn {
          }
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

          .contentTitleMobile {
            display: none;
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
            border: solid 1px #deddde;
            cursor: pointer;
            transition: $animete-time linear;

            display: flex;
            flex-direction: column;
            align-items: center;

            &:hover {
              border-color: white;
              box-shadow: 0 2px 12px 0 #deddde;
            }

            &.active {
              border-color: #1a38f8;
              box-shadow: 0 2px 12px 0 rgba(26, 56, 248, 0.25);
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

                .descTopMobile {
                  display: none;
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

                .unitMobile {
                  display: none;
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
  #gasEditor {
    width: 74.4vw;
    // min-height: 600px;

    .editInfo {
      .infoLeft {
        .editTitle {
          font-size: 14px;
        }

        .editBtn {
          display: none;
        }

        .editBtnMobile {
          display: block;
          margin-left: 6px;
          .app-dark & {
            svg {
              path {
                fill: #3851f0;
              }
            }
          }
        }
      }

      .infoRight {
        font-size: 12px;
      }
    }

    .gasEditorModal {
      .ivu-modal {
        .ivu-modal-content {
          min-height: 600px;

          .ivu-modal-body {
            padding: 24px 32px 0;

            .header {
              img {
                width: 26px;
                left: 7px;
                top: -10px;
              }
            }

            .content {
              padding: unset;

              .contentTitle {
                display: none;
              }

              .contentTitleMobile {
                display: block;
                width: 100%;
                font-family: Gilroy-Bold;
                font-size: 16px;
                font-weight: bold;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.25;
                letter-spacing: normal;
                text-align: left;
                color: #5a575c;
              }

              .contentDesc {
                width: 100%;
                font-size: 12px;
                text-align: left;
              }

              .selections {
                margin-top: 63px;

                .selectionItem {
                  padding: 37px 0;

                  .itemNumBox {
                    font-size: 24px;
                  }
                }
              }

              .custom {
                padding: 15px 16px;

                .leftRect {
                  .icon {
                    display: none;
                  }

                  .desc {
                    .descTop {
                      display: none;
                    }

                    .descTopMobile {
                      display: block;
                      font-family: Gilroy-Bold;
                      font-size: 14px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.5;
                      letter-spacing: normal;
                      color: #5a575c;
                    }

                    .unit {
                      display: none;
                    }

                    .unitMobile {
                      display: block;
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
                  width: 80px;

                  .ivu-input-number-input {
                    font-size: 24px;
                  }
                }
              }
            }

            .confirm {
              bottom: 32px;
              width: 74.6vw;
              height: 40px;
              line-height: 40px;
              font-size: 12px;
              border-radius: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
