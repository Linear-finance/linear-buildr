<template>
  <div id="landingPage">
    <div class="headerBox">
      <img
        v-if="$store.getters.isDarkTheme"
        class="linearBuildrlogo"
        src="@/static/linear_buildr_logo_dark.svg"
      />
      <img
        v-else
        class="linearBuildrlogo"
        src="@/static/linear_buildr_logo.svg"
      />
      <theme-switch v-if="!isMobile" />
      <div class="mBuyLINA mobileShow" @click.stop="buyDisplay = true">
        <theme-switch v-if="isMobile" variant="mobile" />
        BUY LINA
        <img v-if="theme === 'light'" src="@/static/arrow_right.svg" />
        <img v-else src="@/static/dark-theme/arrow_right.svg" />
      </div>
    </div>

    <Modal
      v-model="buyDisplay"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="true"
      :mask-closable="true"
      :width="412"
      class="buyModal"
    >
      <Row justify="end">
        <div style="padding-top: 16px; padding-right: 16px">
          <img
            class="closeButton"
            src="@/static/close.svg"
            @click.stop="buyDisplay = false"
          />
        </div>
      </Row>
      <Row justify="center">
        <div style="padding: 16px">
          <p v-if="theme === 'light'" style="color: #5a575c">
            You would like to buy LINA from :
          </p>
          <p v-else style="color: #f6f6f6">You would like to buy LINA from :</p>
        </div>
        <div style="padding: 16px">
          <Card
            v-if="theme === 'light'"
            class="ivu-card ivu-card-bordered"
            style="width: 348px; height: 100px; cursor: pointer"
            @click.stop="closeThenOpenPCS"
          >
            <img src="@/static/exchanges/pcs.svg" class="cardImg" />
          </Card>
          <Card
            v-else
            class="ivu-card ivu-card-dark"
            style="
              background: #050d20;
              width: 348px;
              height: 100px;
              cursor: pointer;
            "
            @click.stop="closeThenOpenPCS"
          >
            <img src="@/static/exchanges/pcs_dark.svg" class="cardImg" />
          </Card>
        </div>
        <div style="padding: 16px">
          <Card
            v-if="theme === 'light'"
            class="ivu-card ivu-card-bordered"
            style="width: 348px; height: 100px; cursor: pointer"
            @click.stop="closeThenOpenBinance"
          >
            <img src="@/static/exchanges/binance.svg" class="cardImg" />
          </Card>
          <Card
            v-else
            class="ivu-card ivu-card-dark"
            style="
              background: #050d20;
              width: 348px;
              height: 100px;
              cursor: pointer;
            "
            @click.stop="closeThenOpenBinance"
          >
            <img src="@/static/exchanges/binance.svg" class="cardImg" />
          </Card>
        </div>
        <div style="padding: 24px"></div>
      </Row>
    </Modal>

    <Modal
      v-model="qrcodeDisplay"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="true"
      :mask-closable="true"
      class="seeDetailsModal"
    >
      <div class="walletConnect">
        <div class="walletConnectBox">
          <div class="top">
            <img
              class="button"
              src="@/static/close.svg"
              @click.stop="qrcodeDisplay = false"
            />
            <div class="title">WalletConnect</div>
            <img class="logo" src="@/static/logo-wallet-wallet-connect.svg" />
          </div>
          <div class="boxTitle">
            Scan QR code with a WalletConnect-compatible wallet
          </div>
          <div class="boxCopy">
            <div class="copyTitle">
              <div class="title">Copy to clipboard</div>
              <Tooltip
                class="globalInfoStyle"
                :content="tooltipContent"
                offset="0 6"
                placement="bottom"
                @on-popper-hide="resetTooltipContent"
              >
                <div
                  class="copyBtn"
                  :data-clipboard-text="WalletConnectUri"
                  data-clipboard-action="copy"
                  @click="copyYouCode"
                >
                  <img class="cooyIcon" src="@/static/copy.svg" />
                </div>
              </Tooltip>
            </div>
          </div>
          <canvas class="canvas" id="canvas"></canvas>
        </div>
      </div>
    </Modal>

    <div class="container">
      <div class="introductBox">
        <Collapse v-model="introduct" accordion>
          <Panel name="1">
            <div class="line"></div>
            Welcome to Linear!
            <p slot="content">
              The first cross-chain compatible, decentralized delta-one asset
              protocol to quickly and cost-effectively, create, trade, and
              manage synthetic assets (Liquids)
            </p>
          </Panel>
          <Panel name="2">
            <div class="line"></div>
            What is Buildr?
            <p slot="content">
              Buildr is part of the Linear’s dApp suite. You can pledge and
              stake supported on-chain assets to build ℓUSD, the base currency
              of Linear Exchange.
            </p>
          </Panel>
          <Panel name="3">
            <div class="line"></div>
            Why stake LINA?
            <p slot="content">
              By staking supported on-chain assets to build ℓUSD for self use /
              provide liquidity for traders, users are entitled to staking
              rewards and a split of the transaction fees generated on our
              exchange.
            </p>
          </Panel>
          <Panel name="4">
            <div class="line"></div>
            What do I do with ℓUSD?
            <p slot="content">
              Users can use ℓUSD to purchase synthetic assets on our exchange or
              even move it to other protocols or dapps within the DeFi
              ecosystem.
            </p>
          </Panel>

          <!-- <Panel name="5">
                        <div class="line"></div>
                        ethereum
                        <p slot="content">
                            {{ ethereum }}
                        </p>
                    </Panel> -->
        </Collapse>

        <div class="buyLINA" @click.stop="buyDisplay = true">
          Buy LINA
          <Icon type="ios-arrow-round-forward" />
        </div>

        <div
          class="mRect mobileShow"
          @click.stop="selectedWallet(SUPPORTED_WALLETS.METAMASK)"
        >
          <img class="boxLogo" src="@/static/metamask.svg" />
          <div class="box">
            <div class="context">Connect MetaMask Wallet</div>
            <div class="chain">Binance Smart Chain</div>
          </div>
        </div>
      </div>
      <div class="walletBox">
        <div class="box">
          <div
            class="boxItem"
            @click.stop="selectedWallet(SUPPORTED_WALLETS.METAMASK)"
          >
            <img class="boxLogo" src="@/static/metamask.svg" />

            <div class="wallet">
              <div class="boxSub">Connect wallet via</div>

              <div class="boxTitle">Metamask</div>
            </div>

            <!-- <div class="boxDesc">
                            via MetaMask
                        </div> -->
          </div>

          <div
            class="boxItem"
            @click.stop="selectedWallet(SUPPORTED_WALLETS.WALLET_CONNECT)"
          >
            <img
              class="boxLogo"
              src="@/static/logo-wallet-wallet-connect.svg"
            />
            <div class="wallet">
              <div class="boxSub">Connect wallet via</div>
              <div class="boxTitle">WalletConnect</div>
            </div>
            <!-- <div class="boxDesc">
                            via Binance Chain Wallet
                        </div> -->
          </div>

          <!-- <div
                        class="boxItem"
                        @click.stop="
                            selectedWallet(SUPPORTED_WALLETS.BINANCE_CHAIN)
                        "
                    >
                        <img
                            class="boxLogo"
                            src="@/static/binance.svg"

                        />

                        <div>
                            <div class="boxSub">Connect</div>

                            <div class="boxTitle">
                                Binance<br />
                                Smart Chain <br />
                                Network
                            </div>
                        </div>

                        <div class="boxDesc">
                            via Binance Chain Wallet
                        </div>
                    </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectedWallet } from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import {
  addEthereumChain,
  checkNetwork,
  SUPPORTED_NETWORKS_MAP,
  SUPPORTED_WALLETS,
} from "@/assets/linearLibrary/linearTools/network";
import { openBuyLINA, openBuyLINABinance } from "@/common/utils";
import Clipboard from "clipboard";
import QRCode from "qrcode";
import { Row } from "view-design";
import themeSwitch from "../themeSwitch.vue";

export default {
  components: { themeSwitch, Row },
  name: "landingPage",

  data() {
    return {
      SUPPORTED_WALLETS,
      introduct: "0",
      openBuyLINA,
      openBuyLINABinance,
      buyDisplay: false,
      tooltipContent: "Copy to clipboard",
      qrcodeDisplay: false,
    };
  },
  watch: {
    WalletConnectQrcode(newStatus) {
      this.qrcodeDisplay = newStatus;
    },
    qrcodeDisplay(newStatus) {
      if (newStatus) {
        this.makeCode();
      } else {
        this.$store.commit("setWalletConnect", {
          qrcode: false,
        });
      }
    },
  },
  computed: {
    WalletConnectQrcode() {
      return this.$store.state?.walletConnect?.qrcode;
    },

    WalletConnectUri() {
      return this.$store.state?.walletConnect?.uri;
    },
    theme() {
      return this.$store.state.theme;
    },
    isMobile() {
      return this.$store.state?.isMobile;
    },
  },
  mounted() {
    //进入界面的欢迎效果
    setTimeout(() => {
      this.introduct = "1";

      //自动连接metamasks
      let autoConnect = this.$store.state.autoConnect;
      if (autoConnect) {
        let walletType = this.$store.state.walletType;
        walletType && this.selectedWallet(walletType);
      }
    }, 100);
  },
  methods: {
    closeThenOpenPCS() {
      this.buyDisplay = false;
      setTimeout(() => openBuyLINA(), 100);
    },
    closeThenOpenBinance() {
      this.buyDisplay = false;
      setTimeout(() => openBuyLINABinance(), 100);
    },
    /**
     * 复制自己的code
     */
    copyYouCode() {
      var clipboarda = new Clipboard(".copyBtn");
      clipboarda.on("success", (e) => {
        this.tooltipContent = "Copied";
        e.clearSelection();
      });
      clipboarda.on("error", function (e) {
        this.tooltipContent = "Error";
      });
    },

    //重置复制提示框的文本
    resetTooltipContent() {
      setTimeout(() => {
        this.tooltipContent = "Copy to clipboard";
      }, 300);
    },

    makeCode() {
      let canvas = document.getElementById("canvas");

      QRCode.toCanvas(
        canvas,
        this.WalletConnectUri,
        {
          margin: 0,
          height: 429,
          width: 429,
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    },

    async selectedWallet(walletType) {
      // commit here to check walletType before checking network, if it is walletConnect, will not popup Metamask installation when getEthereumNetwork()
      this.$store.commit("setWalletType", walletType);
      const status = await checkNetwork();
      if (status || walletType === SUPPORTED_WALLETS.WALLET_CONNECT) {
        await selectedWallet(walletType);
      } else {
        try {
          await addEthereumChain(SUPPORTED_NETWORKS_MAP.BSCMAINNET);
          this.$store.commit("setAutoConnect", true);
          location.reload();
        } catch (error) {
          this.$store.commit("setSetupModal", true);
        }
      }
    },
  },
};
</script>

<style lang="scss">
#landingPage {
  overflow: hidden;
  padding-bottom: 64px;

  .mobileShow {
    display: none;
  }

  .headerBox {
    width: 1440px;
    height: 120px;
    padding-left: 120px;
    display: flex;
    align-items: center;
    padding-right: 60px;
    justify-content: space-between;

    .linearBuildrlogo {
      cursor: pointer;
      width: 163px;
      height: 32px;
    }
  }

  .buyModal {
    .ivu-modal-wrap {
      .ivu-modal {
        .ivu-modal-content {
          border-radius: 16px;
        }
      }
    }
  }

  .closeButton {
    cursor: pointer;

    &:hover {
      content: url("../../static/close_hover.svg");
    }
  }

  .ivu-card-dark:hover {
    box-shadow: 0px 0px 12px #4e66ff;
  }

  .cardImg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .seeDetailsModal {
    .ivu-modal-wrap {
      display: flex;
      justify-content: center;
      align-items: center;

      .ivu-modal {
        width: 509px !important;
        top: 0px;

        .ivu-modal-content {
          .ivu-modal-body {
            padding: 0px 0px;
            .walletConnect {
              display: flex;
              //position:absolute;
              justify-content: center;
              align-items: center;

              .walletConnectBox {
                width: 509px;
                height: 637px;
                border-radius: 16px;
                background-color: #ffffff;
                padding: 40px;

                .top {
                  display: flex;
                  flex-direction: row-reverse;
                  width: 100%;

                  .button {
                    width: 40px;
                    height: 40px;
                    margin-left: 62px;
                    cursor: pointer;

                    &:hover {
                      content: url("../../static/close_hover.svg");
                    }
                  }

                  .title {
                    margin: 4px 0 4px 16px;
                    font-family: Gilroy-Bold;
                    font-size: 24px;
                    font-weight: bold;
                    line-height: 1.33;
                    color: #5a575c;
                  }

                  .logo {
                    width: 40px;
                    height: 40px;
                  }
                }

                .boxTitle {
                  margin-top: 8px;
                  font-family: Gilroy-Regular;
                  font-size: 16px;
                  line-height: 1.5;
                  color: #5a575c;
                  text-align: center;
                }

                .boxCopy {
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  .copyTitle {
                    display: flex;

                    .title {
                      margin: 0 4px 0 0;
                      font-family: Gilroy-Bold;
                      font-size: 16px;
                      font-weight: bold;
                      line-height: 1.5;
                      color: #1a38f8;
                    }

                    .copyBtn {
                      display: flex;
                      cursor: pointer;
                      transition: $animete-time linear;

                      .cooyIcon {
                        width: 16px;
                        height: 16px;
                        margin: 4px 0 4px 4px;

                        &:hover {
                          content: url("../../static/copy_hover.svg");
                        }
                      }
                    }
                  }
                }

                .canvas {
                  margin: 32px 0 0;
                }
              }
            }
          }
        }
      }
    }
  }

  .container {
    display: flex;
    padding-bottom: 4px;

    .introductBox {
      width: 1014px;
      height: 840px;
      position: relative;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 16px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-right: 60px;

      .ivu-collapse {
        background: unset;
        border: unset;
        padding-left: 120px;

        .ivu-collapse-item {
          margin-bottom: 24px;
          border: unset;

          .ivu-collapse-header {
            padding: 0;
            border: unset;
            display: flex;
            align-items: center;
            font-family: Gilroy-Bold;
            font-size: 24px;
            font-weight: bold;
            height: unset;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #99999a;

            i {
              display: none;
            }

            .line {
              width: 4px;
              height: 24px;
              margin-right: 30px;
              border-radius: 4px;
              background: #bababa;
              transition: $animete-time linear;
            }
          }

          .ivu-collapse-content {
            width: 774px;
            padding: 0;

            .ivu-collapse-content-box {
              padding-left: 34px;
              font-family: Gilroy-Regular;
              font-size: 16px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              color: #5a575c;

              p {
                width: 400px;
              }
            }
          }
        }

        .ivu-collapse-item-active {
          &.ivu-collapse-item {
            margin-bottom: 8px;
          }

          .ivu-collapse-header {
            color: #5a575c;
            font-size: 56px;
            line-height: 64px;
            line-height: 1.14;

            .line {
              height: 55px;
              background: #1a38f8;
            }
          }
        }
      }

      .buyLINA {
        position: absolute;
        left: 120px;
        bottom: 68px;
        font-family: Gilroy-Bold;
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #1a38f8;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: $animete-time linear;

        .ivu-icon {
          font-size: 30px;
          color: #1a38f8;
          font-weight: bold;
          transition: $animete-time linear;
          margin-left: 4px;
        }

        &:hover {
          color: #7eb5ff;

          .ivu-icon {
            color: #7eb5ff;
          }
        }
      }
    }

    .walletBox {
      .box {
        width: 306px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .boxItem {
          flex: 1;
          cursor: pointer;
          border: solid 1px #e5e5e5;
          display: flex;
          flex-direction: column;
          transition: $animete-time linear;
          background-color: #ffffff;
          padding: 80px 32px 38px;
          border-radius: 8px;
          align-items: center;
          justify-content: flex-start;

          &:not(:last-of-type) {
            margin-bottom: 28px;
          }

          .boxLogo {
            width: 80px;
            height: 80px;
            /* position:relative; */
          }

          .boxSub {
            font-family: Gilroy-Bold;
            font-size: 16px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            text-align: center;
            color: #5a575c;
            margin-bottom: 8px;
            margin-top: 32px;
          }

          .boxTitle {
            font-family: Gilroy-bold;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #1a38f8;
            text-align: center;
          }

          /* .wallet{
                        position:absolute;
                        padding-top: 32px;
                    } */

          .boxDesc {
            font-family: Gilroy-Regular;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            text-align: center;
            color: #99999a;
          }

          &:hover {
            border: solid 1px #deddde;
            box-shadow: 0 2px 12px 0 #deddde;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #landingPage {
    overflow: hidden;
    padding-bottom: 0;

    .mobileShow {
      display: flex;
    }

    .headerBox {
      width: 100vw;
      height: 64px;
      padding: 16px 16px 16px 16px;
      display: flex;
      align-items: center;
      position: relative;

      .linearBuildrlogo {
        cursor: pointer;
        width: 163px;
        height: 32px;
      }

      .mBuyLINA {
        flex: 1;
        height: 16px;
        font-family: Gilroy-Bold;
        font-size: 12px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.4;
        letter-spacing: 1.5px;
        text-align: right;
        color: #1a38f8;
        align-items: center;
        justify-content: flex-end;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
        .app-dark & {
          color: #3851f0 !important;
        }
      }
    }

    .container {
      display: flex;
      padding: 0 16px;

      .introductBox {
        width: 100%;
        height: 88vh;
        position: relative;
        display: flex;
        align-items: stretch;
        background: #fff;
        border-radius: 16px;
        margin-right: 0;

        .ivu-collapse {
          background: unset;
          border: unset;
          padding-top: 92px;
          padding-left: 32px;

          .ivu-collapse-item {
            margin-bottom: 16px;
            border: unset;

            .ivu-collapse-header {
              padding: 0;
              border: unset;
              display: flex;
              align-items: center;
              font-family: Gilroy-Bold;
              font-size: 14px;
              font-weight: bold;
              height: unset;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.33;
              letter-spacing: normal;
              color: #99999a;

              i {
                display: none;
              }

              .line {
                width: 3px;
                height: 17px;
                margin-right: 16px;
                border-radius: 4px;
                background: #bababa;
                transition: $animete-time linear;
              }
            }

            .ivu-collapse-content {
              width: 100%;
              padding: 0 10px 0 0;

              .ivu-collapse-content-box {
                font-family: Gilroy-Regular;
                font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.5;
                letter-spacing: normal;
                color: #5a575c;
                padding-top: 8px;
                padding-bottom: 30px;
                padding-left: 20px;

                p {
                  width: 100%;
                }
              }
            }
          }

          .ivu-collapse-item-active {
            &.ivu-collapse-item {
              margin-bottom: 8px;
            }

            .ivu-collapse-header {
              color: #5a575c;
              font-size: 24px;
              height: 32px;
              line-height: 1.14;

              .line {
                height: 17px;
                background: #1a38f8;
              }
            }
          }
        }

        .buyLINA {
          display: none;
        }

        .mRect {
          display: flex;
          position: absolute;
          justify-content: space-around;
          align-items: center;
          width: 74.66vw;
          height: 28.57vw;
          bottom: 8.533vw;
          left: 8.533vw;
          border-radius: 8px;
          border: solid 1px #deddde;
          padding: 0 4vw;
          cursor: pointer;

          img {
            width: 10.66vw;
            height: 10.66vw;
          }

          .box {
            .context {
              font-family: Gilroy-Bold;
              font-size: 14px;
              font-weight: bold;
              color: #1a38f8;
            }

            .chain {
              font-family: Gilroy;
              font-size: 14px;
              color: #99999a;
            }
          }
        }
      }

      .walletBox {
        display: none;
      }
    }
  }
}
</style>
