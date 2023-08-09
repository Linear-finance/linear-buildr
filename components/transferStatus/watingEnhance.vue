<!-- pc端多步build、burn -->

<template>
  <div id="transferWatingEnhance">
    <div
      class="close"
      v-if="
        !currentConfirm || currentErrMsg || currentStep > setupArray.length - 1
      "
      @click.stop="$emit('close')"
    >
      <img v-if="isMobile" src="@/static/icon-cancel.svg" />
      <closeSvg v-else></closeSvg>
    </div>

    <div class="waitImg">
      <!-- 已完成 -->
      <img
        v-if="currentStep > setupArray.length - 1"
        class="course completed"
        src="@/static/transferProgress/transaction_completed.svg"
      />
      <!-- 已确认或错误 -->
      <img
        v-else-if="currentConfirm || currentErrMsg"
        class="course"
        src="@/static/transferProgress/wellet_metamask.svg"
      />

      <!-- 需要approve -->
      <thumbnail
        v-else-if="shouldApprove"
        class="course"
        thumb="transferProgress/course/approve_bsc_mainnet_thumb.png"
        src="transferProgress/course/approve_bsc_mainnet.png"
      />
      <!-- 等待确认 -->
      <thumbnail
        v-else-if="!currentConfirm"
        class="course"
        thumb="transferProgress/course/confirm_bsc_mainnet_thumb.png"
        src="transferProgress/course/confirm_bsc_mainnet.png"
      />
    </div>

    <div class="waitTitle">
      <!-- 已完成 -->
      <template v-if="currentStep > setupArray.length - 1">
        Congratulations!</template
      >

      <!-- 有错误 -->
      <template v-else-if="currentErrMsg"> Oops! Something is wrong. </template>
      <!-- 交易中 -->
      <template v-else-if="currentConfirm"> Loading... </template>
      <!-- 需要approve -->
      <template v-else-if="shouldApprove">
        Approve address with Metamask</template
      >
      <!-- 等待确认 -->
      <template v-else-if="!currentConfirm"> Confirm with Metamask </template>
    </div>

    <div class="waitDesc" :class="{ error: currentErrMsg }">
      <!-- 已完成 -->
      <template v-if="currentStep > setupArray.length - 1">
        Your transaction has been processed.</template
      >

      <!-- 有错误 -->
      <template v-else-if="currentErrMsg">
        {{ currentErrMsg }}
      </template>

      <!-- 等待确认 -->
      <template v-else-if="!currentConfirm">
        Check the transaction under MetaMask Activity if it doesn't pop up.
      </template>
    </div>

    <div class="processBar" v-if="!(currentStep > setupArray.length - 1)">
      <div class="itemBox">
        <div v-for="(item, index) in setupArray" :key="index" class="item">
          <div class="imgBox">
            <transition-group name="img-fade">
              <!-- 大于进度 -->
              <img
                key="1"
                v-if="currentStep < index"
                src="@/static/transferProgress/default.svg"
              />

              <!-- 当前进度没错误 -->

              <template v-else-if="currentStep == index && !currentErrMsg">
                <img
                  key="2"
                  class="loading"
                  src="@/static/transferProgress/loading.svg"
                />

                <template v-if="!isMobile">
                  <template v-if="isEthereumNetwork(currentNetworkId)">
                    <img
                      key="21"
                      class="walletType"
                      src="@/static/transferProgress/eth_network.svg"
                    />
                  </template>
                  <template v-else-if="isBinanceNetwork(currentNetworkId)">
                    <img
                      key="22"
                      class="walletType"
                      src="@/static/transferProgress/bsc_network.svg"
                    />
                  </template>
                </template>
              </template>

              <!-- 当前进度有错误 -->
              <img
                key="3"
                v-else-if="currentStep == index && currentErrMsg"
                src="@/static/transferProgress/failed.svg"
              />

              <!-- 已完成进度没错误 -->
              <img
                key="4"
                v-else-if="currentStep > index && !currentErrMsg"
                src="@/static/transferProgress/completed.svg"
              />

              <!-- 已完成进度有错误 -->
              <img
                key="5"
                v-else-if="currentStep > index && currentErrMsg"
                src="@/static/transferProgress/completed_disable.svg"
              />
            </transition-group>
          </div>
          <div class="text" :class="{ current: currentStep == index }">
            {{ item }}
          </div>
          <div
            class="view"
            v-if="
              currentStep == index &&
              currentConfirm &&
              !currentErrMsg &&
              !isMobile
            "
            @click.stop="openBlockchainBrowser(currentHash, currentNetworkId)"
          >
            <template v-if="isEthereumNetwork(currentNetworkId)">
              View Etherscan
            </template>
            <template v-else-if="isBinanceNetwork(currentNetworkId)">
              View Bscscan
            </template>

            <img src="@/static/arrow_right.svg" />
          </div>
          <div
            v-else-if="currentStep == index && currentErrMsg && !isMobile"
            class="tryAgain"
            @click.stop="tryAgain"
          >
            try again
          </div>
        </div>
      </div>

      <div class="dividerBox">
        <ul>
          <li
            v-for="(item, index) in setupArray"
            :key="index"
            class="divider"
            :class="{
              has: index < setupArray.length - 1,
              active: currentStep > index && !currentErrMsg,
            }"
            :style="{
              left: `calc(100% / ${setupArray.length} /2)`,
            }"
          ></li>
        </ul>
      </div>
    </div>

    <!-- 不是等待切链状态且是移动端的时候 -->
    <div v-if="isMobile" class="mobileBtns">
      <!-- 完成 -->
      <div
        class="funcMobileBtn"
        v-if="currentStep > setupArray.length - 1"
        @click.stop="$emit('close')"
      >
        Done
      </div>
      <!-- 错误 -->
      <div
        class="funcMobileBtn"
        v-else-if="currentErrMsg"
        @click.stop="tryAgain"
      >
        try again
      </div>
      <!-- 未确认交易 -->
      <!-- <div class="funcMobileBtn" v-else-if="!currentConfirm">
                Confirm Contract
            </div> -->

      <div
        class="viewMobileBtn"
        v-if="currentConfirm"
        @click.stop="openBlockchainBrowser(currentHash, currentNetworkId)"
      >
        <template v-if="isEthereumNetwork(currentNetworkId)">
          View Etherscan
        </template>
        <template v-else-if="isBinanceNetwork(currentNetworkId)">
          View Bscscan
        </template>
        <img src="@/static/arrow_right.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import { openBlockchainBrowser } from "@/common/utils";
import closeSvg from "@/components/svg/close";
import {
  SUPPORTED_WALLETS,
  isEthereumNetwork,
  isBinanceNetwork,
} from "@/assets/linearLibrary/linearTools/network";
import { abbreviateAddress } from "@/assets/linearLibrary/linearTools/format";
export default {
  name: "transferWatingEnhance",
  components: {
    closeSvg,
  },
  props: {
    currentStep: {
      type: Number,
      default: 1,
    },
    currentHash: {
      type: String,
      default: "",
    },
    currentConfirm: {
      type: Boolean,
      default: false,
    },
    currentNetworkId: {
      type: [Number, String],
      default: 1,
    },
    shouldApprove: {
      type: Boolean,
      default: false,
    },
    currentErrMsg: {
      type: String,
      default: "",
    },
    setupArray: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      abbreviateAddress,
      openBlockchainBrowser,
      SUPPORTED_WALLETS,
      isEthereumNetwork,
      isBinanceNetwork,
    };
  },
  watch: {
    walletType() {},
    isMobile() {},
    walletAddress() {},
    walletNetworkName() {},
  },
  computed: {
    walletType() {
      return this.$store.state?.walletType;
    },
    isMobile() {
      return this.$store.state?.isMobile;
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    walletNetworkName() {
      return this.$store.state?.walletNetworkName;
    },
  },
  methods: {
    tryAgain() {
      this.$emit("tryAgain");
    },
  },
  created() {
    this.$store.commit("setIsTransaction", true);
  },
  destroyed() {
    this.$store.commit("setIsTransaction", false);
  },
};
</script>

<style lang="scss">
#transferWatingEnhance {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: white;

  .waitImg {
    margin-top: 112px;
    .course {
      width: 200px;
      height: 361px;
    }
  }

  .waitTitle {
    margin-top: 32px;
    font-family: Gilroy-Bold;
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: center;
    color: #5a575c;
  }

  .waitDesc {
    font-family: Gilroy-Regular;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;

    &.error {
      color: #df434c;
    }
  }

  .processBar {
    width: 100%;
    max-width: 500px;
    position: absolute;
    bottom: 165px;

    .itemBox {
      width: 100%;
      position: absolute;
      display: flex;
      justify-content: space-around;
      z-index: 2;

      .item {
        // z-index: 1;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .imgBox {
          position: relative;
          width: 40px;
          height: 40px;
          margin-bottom: 8px;

          img {
            background-color: white;
            border-radius: 50%;
            width: 100%;
            height: 100%;
            position: absolute;
            transform: translateZ(0);

            &.walletType {
              width: 16px;
              height: 16px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            &.loading {
              animation: rotate 3s linear infinite;
            }
          }
        }

        .text {
          margin-bottom: 4px;
          font-family: Gilroy-Medium;
          font-size: 12px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: center;
          color: #5a575c;

          &.current {
            font-family: Gilroy-Bold;
            font-weight: bold;
          }
        }

        .view,
        .tryAgain {
          cursor: pointer;
          opacity: 0.2;
          text-align: center;
          display: flex;
          font-family: Gilroy-Bold;
          font-size: 10px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.6;
          letter-spacing: 1.25px;
          color: #1a38f8;
          text-transform: uppercase;

          transition: opacity $animete-time linear;

          img {
            width: 16px;
            height: 16px;
          }

          &:hover {
            opacity: 1;
          }
        }
      }
    }

    .dividerBox {
      position: relative;
      z-index: 1;
      ul {
        list-style: none;
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-around;
        top: 17.5px;

        li {
          flex: 1;
          position: relative;

          &.has {
            height: 5px;
            background-color: #e5e5e5;

            &.active {
              background-color: #1a38f8;
            }
          }
        }
      }
    }
  }

  .close {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}

@media only screen and (max-width: $max-phone-width) {
  #transferWatingEnhance {
    padding: 0px 32px 150px;

    .waitImg {
      margin-top: 0;
    }

    .waitTitle {
      text-align: left;
      font-size: 16px;
      line-height: 1.5;
      margin-top: 0;
    }

    .waitDesc {
      text-align: left;
      top: 48px;
      left: 32px;
      font-size: 12px;
      line-height: 1.33;
      color: #99999a;
    }

    .walletRect {
      .step {
        font-size: 10px;
        line-height: 1.6;
        letter-spacing: 1.25px;
        position: absolute;
        bottom: 32px;

        img {
          width: 16px;
          height: 16px;
        }
      }
      .walletIcon {
        margin-top: 136px;
        .wallteLogo {
          width: 80px;
          height: 80px;

          &.eth {
            margin-left: 13px;
          }
        }

        .arrow {
          width: 24px;
          height: 24px;
          margin: 0 16px;
        }
      }

      .notBinanceWallet {
        .walletIcon {
          margin-top: 136px;
        }
      }
    }

    .processBar {
      position: absolute;
      bottom: 0;
      top: 75%;
      height: 48px;
      width: calc(100% - 20px);

      .itemBox {
        .item {
          .imgBox {
            width: 24px;
            height: 24px;

            img {
              &.walletType {
                width: 9.6px;
                height: 9.6px;
              }
            }
          }

          .text {
            margin-bottom: 4px;
            font-family: Gilroy;
            font-size: 10px;
            line-height: 1.2;
          }
        }
      }

      .dividerBox {
        ul {
          top: 10.5px;
          li {
            &.has {
              height: 3px;
            }
          }
        }
      }
    }

    .close {
      img {
        width: 26px;
        height: 26px;
      }
    }

    .mobileBtns {
      padding: 0 32px;
      position: absolute;
      //bottom: 32px;
      bottom: 20px;
      width: 100%;

      .funcMobileBtn {
        width: 100%;
        font-family: Gilroy-Bold;
        font-size: 12px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.33;
        letter-spacing: 1.5px;
        text-align: center;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1a38f8;
        text-transform: uppercase;
      }

      .viewMobileBtn {
        margin-top: 17px;
        font-family: Gilroy-Bold;
        font-size: 10px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.6;
        letter-spacing: 1.25px;
        color: #1a38f8;
        display: flex;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        img {
          width: 16px;
          height: 16px;
          margin-left: 4px;
        }
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
