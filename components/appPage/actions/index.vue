<template>
  <div id="actions">
    <div class="headerBox">
      <a href="/" class="webLogo">
        <img
          v-if="$store.getters.isDarkTheme"
          class="linearBuildrlogo"
          src="@/static/linear_logo_dark.svg"
        />
        <img
          v-else
          class="linearBuildrlogo"
          src="@/static/linear_logo_light.svg"
        />
      </a>

      <a href="/" class="mobileLogo">
        <img
          class="linearBuildrlogo"
          src="@/static/linear_buildr_logo.svg"
          v-show="
            currentAction == 0 &&
            othersAction == 0 &&
            !$store.getters.isDarkTheme
          "
        />
        <img
          v-show="
            currentAction == 0 &&
            othersAction == 0 &&
            $store.getters.isDarkTheme
          "
          class="linearBuildrlogo"
          src="@/static/linear_buildr_logo_dark.svg"
        />
        <img
          class="logoWhenAction"
          src="@/static/logo-crypto-linear-colour.svg"
          style="height: 32px"
          v-show="currentAction != 0 || othersAction != 0"
        />
      </a>

      <div
        class="introductActionBox"
        v-if="currentAction != 0 || othersAction != 0"
      >
        <div class="title" v-if="currentAction == 1 && othersAction == 0">
          Build
        </div>
        <div class="title" v-if="currentAction == 2 && othersAction == 0">
          Burn
        </div>
        <div class="title" v-if="currentAction == 3 && othersAction == 0">
          Claim
        </div>
        <div class="title" v-if="currentAction == 4 && othersAction == 0">
          Transfer
        </div>
        <div class="title" v-if="currentAction == 5 && othersAction == 0">
          Swap
        </div>

        <div class="title" v-if="othersAction == 1">Track Debt</div>
        <div class="title" v-if="othersAction == 2">Transaction</div>

        <img
          class="info"
          v-if="othersAction == 0"
          src="@/static/info.svg"
          @click="showIntroductActionModal"
        />
      </div>

      <Modal
        v-model="introductActionModal"
        :footer-hide="true"
        :closable="true"
        :transfer="false"
        :mask="true"
        class="introductActionModal"
      >
        <div class="title" v-if="currentAction == 1">Build</div>
        <div class="title" v-if="currentAction == 2">Burn</div>
        <div class="title" v-if="currentAction == 3">Claim</div>
        <div class="title" v-if="currentAction == 4">Transfer</div>
        <div class="title" v-if="currentAction == 5">Swap</div>

        <div class="context" v-if="currentAction == 1">
          Build ℓUSD and earn staking rewards by staking LINA
        </div>
        <div class="context" v-if="currentAction == 2">
          Burn ℓUSD to unlock staked LINA
        </div>
        <div class="context" v-if="currentAction == 3">
          Claim rewards from staking LINA and building ℓUSD
        </div>
        <div class="context" v-if="currentAction == 4">
          Transfer different currencies to specified wallet address
        </div>
        <div class="context" v-if="currentAction == 5">
          You can select the type of liquids and enter the amount you want to
          swap to the other chain.
        </div>
      </Modal>

      <!-- <Tooltip
                class="globalInfoStyle action"
                offset="0 6"
                max-width="300"
                placement="bottom"
                v-for="(item, index) in actions"
                :key="index"
                :class="{
                    activited: currentAction == index + 1,
                    isTransaction: isTransaction && currentAction != index + 1
                }"
                :disabled="!isTransaction || currentAction == index + 1"
                @click.native="actionChange(index + 1)"
            >
                {{ item }}

                <div slot="content">
                    <div class="tipTitle">
                        Please complete the
                        {{ actions[currentAction - 1] }} transaction
                    </div>
                    <div class="tipDesc">
                        You can only do one transaction at a time
                    </div>
                </div>
            </Tooltip> -->

      <div class="mNavigate" v-if="mMenuState && isMobile">
        <div class="mHead">
          <div class="mLogo">
            <img src="@/static/logo-crypto-linear-colour.svg" />
            Menu
          </div>
          <theme-switch variant="mobile" />
          <img
            @click="mHideMenuFun"
            class="mClose"
            src="@/static/icon-cancel.svg"
          />
        </div>
        <div
          class="mNavigateItem"
          @click="actionChange(0)"
          :class="{
            activited: currentAction == 0,
          }"
        >
          Home
        </div>
        <div
          v-for="(item, index) in actions"
          :key="index"
          class="mNavigateItem"
          :class="{
            activited: currentAction == index + 1,
          }"
          @click="actionChange(index + 1)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <transition name="tooltipModleFade">
      <div v-show="isShowTooltipModle" class="tooltipModle">
        <div @click="closeTooltipModle" class="tooltipModle-close">
          <img src="@/static/x_close.svg" />
        </div>
        <div class="tooltipModle-content">
          <div class="tooltipModle-content-img">
            <img src="@/static/linear_logo.svg" />
          </div>
          <ul class="tooltipModle-content-list">
            <li
              v-for="(item, index) in actions"
              :key="item"
              @click="actionChange(index + 1)"
            >
              {{ item }}
            </li>
          </ul>
          <ul class="tooltipModle-content-exList">
            <li
              v-for="(item, index) in external"
              :key="item"
              @click="actionChange(index + 1)"
            >
              <a target="_blank" :href="item.url">
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="actionsBox">
      <homePage v-if="currentAction == 0"></homePage>
      <build v-else-if="currentAction == 1"></build>
      <burn v-else-if="currentAction == 2"></burn>
      <claim v-else-if="currentAction == 3"></claim>
      <transfer v-else-if="currentAction == 4"></transfer>
      <swap v-else></swap>

      <transactionModal />
      <trackModal />
    </div>
    <notificationQueue />
  </div>
</template>

<script>
import homePage from "@/components/appPage/actions/homePage";
import notificationQueue from "@/components/notification/notificationQueue.vue";

import build from "@/components/appPage/actions/build";
import burn from "@/components/appPage/actions/burn";
import claim from "@/components/appPage/actions/claim";
import transfer from "@/components/appPage/actions/transfer";
import swap from "@/components/appPage/actions/swap";

import transactionModal from "@/components/appPage/walletDetails/actions/transactionModal";
import trackModal from "@/components/appPage/walletDetails/actions/trackModal";

import common from "@/config/common";
import ThemeSwitch from "~/components/themeSwitch.vue";

export default {
  name: "actions",
  components: {
    homePage,
    build,
    burn,
    claim,
    transfer,
    swap,
    trackModal,
    notificationQueue,
    transactionModal,
    ThemeSwitch,
  },
  data() {
    return {
      // currentAction: this.$store.state.currentAction,
      othersAction: 0, // 0没有 1track 2transaction 3referral
      actions: ["Build", "Burn", "Claim", "Transfer", "Swap"],
      external: [
        {
          label: "Blog",
          url: "https://linear-finance.medium.com/",
        },
        {
          label: "Instagram",
          url: "https://www.instagram.com/accounts/suspended/?next=https%3A%2F%2Fwww.instagram.com%2Flinear%2F%3F__coig_ufac%3D1",
        },
      ],
    };
  },
  created() {
    //订阅组件改变事件
    this.$pub.subscribe("trackModalChange", (msg, params) => {
      // console.log("trackModalChange", params);
      if (params) {
        this.othersAction = 1;
      }
    });
    this.$pub.subscribe("transactionModalChange", (msg, params) => {
      // console.log("transactionModalChange", params);
      if (params) {
        this.othersAction = 2;
      }
    });

    //订阅历史记录窗口关闭事件
    //this.$pub.subscribe("transactionModalCloseEvent", (msg, params) => {
    //    this.othersAction = 0;
    //});
    ////订阅历史记录窗口关闭事件
    //this.$pub.subscribe("trackModalCloseEvent", (msg, params) => {
    //    this.othersAction = 0;
    //});

    // temporary add dark css body
  },
  watch: {
    isMobile() {},

    //显示不同功能 0homePage 1build 2burn 3claim 4transfer 5swap
    currentAction() {},
    theme: {
      handler(newValue, oldValue) {
        this.setDarkThemeInBody(newValue, oldValue);
      },
      immediate: true,
    },
  },
  computed: {
    mMenuState() {
      return this.$store.state.mMenuState;
    },

    isMobile() {
      return this.$store.state.isMobile;
    },

    isTransaction() {
      return this.$store.state.isTransaction;
    },

    currentAction() {
      return this.$store.state.currentAction;
    },
    theme() {
      return this.$store.state.theme;
    },
    isShowTooltipModle() {
      return this.$store.state.isShowTooltipModle;
    },
  },
  methods: {
    // temporary dark theme in body
    setDarkThemeInBody(newValue, oldValue = undefined) {
      const theme = `${newValue}-theme`;
      const html = document.documentElement;
      const body = document.body;
      if (oldValue !== undefined) {
        const oldTheme = `${oldValue}-theme`;
        html.classList.remove(oldTheme);
        body.classList.remove(oldTheme);
      }
      html.classList.add(theme);
      body.classList.add(theme);
    },
    //切换功能
    //Switch between features
    actionChange(action) {
      //正在交易中无法点击其他按钮
      if (!this.isTransaction) {
        this.$store.commit("setIsShowTooltipModle", false);

        if (this.currentAction != action) {
          this.$store.commit("setCurrentAction", action);
          const path = common.SUBPAGE_OPTIONS_MAP[action];
          if (path !== undefined) {
            this.$router.push("/" + common.SUBPAGE_OPTIONS_MAP[action]);
          } else {
            this.$router.push("/");
          }

          //关闭 referral transaction track 的 modal
          this.$pub.publish("transactionModalCloseEvent");
          this.$pub.publish("trackModalCloseEvent");

          this.othersAction = 0;

          this.$pub.publish("transactionModalChange", false);
          this.$pub.publish("trackModalChange", false);
          this.$store.commit("setmMenuState", false);
        } else {
          this.$store.commit("setCurrentAction", 0);
          this.$router.push("/");
        }
      }
    },

    showIntroductActionModal() {
      this.introductActionModal = true;
    },

    mHideMenuFun() {
      this.$store.commit("setmMenuState", false);
    },

    closeTooltipModle() {
      this.$store.commit("setIsShowTooltipModle", false);
    },
    showTooltipModle() {
      this.$store.commit("setIsShowTooltipModle", true);
    },
  },
};
</script>

<style lang="scss" scoped>
#actions {
  width: 786px;
  margin-right: 40px;

  .headerBox {
    height: 120px;
    display: flex;
    align-items: center;

    .mobileLogo {
      display: none;
    }

    .webLogo {
      .linearBuildrlogo {
        width: 160px;
        height: 40px;
        cursor: pointer;
        margin-right: 28px;
      }
    }

    .introductActionBox {
      display: none;
    }

    .action {
      margin-right: 8px;
      border: solid 1px rgba(#fff, 0);
      cursor: pointer;
      font-family: Gilroy-Bold;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 1.5px;
      text-align: center;
      transition: $animete-time linear;
      padding: 8px 24px;
      border-radius: 20px;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      color: #99999a;

      text-transform: uppercase;

      &:hover {
        &:not(.isTransaction):not(.activited) {
          // border-color: #1a38f8;
          color: #1a38f8;
        }
      }

      &.isTransaction {
        cursor: not-allowed;
      }

      &.activited {
        color: #1a38f8;
      }

      .app-dark & {
        color: #ffffff;

        &:hover {
          &:not(.isTransaction):not(.activited) {
            color: $darkButtonColor;
          }
        }

        &.activited {
          color: $darkButtonColor;
        }
      }
    }
  }
  .tooltipModle {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(
        72.9% 64.69% at 40% 50%,
        rgba(53, 85, 254, 0.5) 0%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        180deg,
        rgba(26, 56, 248, 0.09) 0%,
        rgba(0, 0, 0, 0) 60.94%
      ),
      #000;
    // background: #000;
    z-index: 9999;
    overflow-y: auto;

    &-close {
      position: absolute;
      top: 32px;
      right: 32px;
      display: flex;
      width: 48px;
      height: 48px;
      padding: 8px;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid #b0b7c7;
      cursor: pointer;
    }

    li {
      list-style: none;
    }

    &-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      transform: translateX(200px);
      height: 100vh;
      // max-height: 666px;

      @media only screen and (max-width: $max-phone-width) {
        transform: translateX(-50px);
      }

      &-list {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        color: #fff;
        font-family: Gilroy-UltraLight;
        font-size: 48px;
        font-style: normal;
        font-weight: 200;
        line-height: 48px;
        flex-grow: 1;
        margin: 80px 0;
        max-height: 392px;

        & > li {
          cursor: pointer;
          transition: color 0.5s;
          &:hover {
            color: #1a38f8;
          }
        }
      }

      &-exList {
        font-family: Gilroy-Regular;
        font-size: 20px;
        font-style: normal;
        font-weight: 200;
        line-height: 32px;

        & > li > a {
          color: #fff;
          transition: color 0.5s;
          &:hover {
            color: #1a38f8;
          }
        }
      }
    }
  }
  .actionsBox {
    width: 786px;
    height: 840px;
    position: relative;
    overflow: hidden;
    box-shadow: 0px 2px 6px #deddde;
    border-radius: 16px;

    .app-dark & {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #actions {
    width: 100%;
    margin-right: 0;

    .headerBox {
      height: 32px;
      display: flex;
      align-items: center;
      margin: 16px 0;

      .webLogo {
        display: none;
      }

      .mobileLogo {
        display: block;

        .linearBuildrlogo {
          width: 160px;
          height: 45px;
          cursor: pointer;
          margin-right: 28px;
        }

        .logoWhenAction {
          cursor: pointer;
          margin-right: 8px;
        }
      }

      .introductActionBox {
        display: flex;
        align-items: center;

        .title {
          font-family: Gilroy-Bold;
          font-size: 20px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.6;
          letter-spacing: normal;
          color: #3c3a3e;
        }

        .info {
          margin-left: 4px;
          width: 16px;
          height: 16px;
        }
      }

      /deep/.introductActionModal {
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
                  margin-bottom: 16px;
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

      .action {
        display: none;
      }

      .mNavigate {
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10000;
        background-color: #ffffff;
        .mHead {
          width: 100%;
          height: 64px;
          padding: 16px 24px;
          display: flex;
          margin-bottom: 44px;
          align-items: center;
          justify-content: space-between;
          padding-right: 54px;
          .mLogo {
            font-family: Gilroy-Bold;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #3c3a3e;
            img {
              float: left;
              margin-right: 10px;
            }
          }
          .mClose {
            position: fixed;
            right: 19px;
            top: 19px;
          }
        }
        .mNavigateItem {
          width: 100%;
          height: 40px;
          font-family: Gilroy-Bold;
          font-size: 32px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.25;
          letter-spacing: normal;
          color: #99999a;
          padding-left: 56px;
          margin-bottom: 24px;
          &.activited {
            color: #1a38f8;
            .app-dark & {
              color: #ffffff;
            }
          }
        }
      }
    }

    .actionsBox {
      width: 100%;
      height: 88vh;
      min-height: 550px;
      position: relative;
      overflow: hidden;
      box-shadow: 0px 2px 6px #deddde;
      border-radius: 16px;

      .app-dark & {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }
    }
  }
}

.tooltipModleFade-enter-active,
.tooltipModleFade-leave-active {
  transition: opacity 0.5s;
}
.tooltipModleFade-enter, .tooltipModleFade-leave-to /* .tooltipModleFade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
