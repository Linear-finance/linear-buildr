<template>
  <div id="wallet" class="app-light">
    <Modal
      v-model="isWalletOpen"
      :footer-hide="true"
      :closable="false"
      :transfer="false"
      :mask="true"
      :mask-closable="false"
      class="seeDetailsModal"
    >
      <div class="walletSelect" v-show="selectWalletStep">
        <div class="walletSelectBox">
          <div class="top">
            <img
              class="button"
              src="@/static/close.svg"
              @click.stop="closeModal"
            />
            <div class="title">Connect Wallet</div>
          </div>
          <div class="boxTitle">
            Please connect your wallet with Linear Builder to start
          </div>
          <div class="wallets">
            <div class="item" @click.stop="checkConnectToMetamask">
              <img class="logo" src="@/static/metamask.svg" />
              <div class="wallet">
                <div class="itemSub">Connect via</div>

                <div class="itemTitle">Metamask</div>
              </div>
            </div>
            <div class="item" @click.stop="openQrcodeDisplay">
              <img class="logo" src="@/static/logo-wallet-wallet-connect.svg" />
              <div class="wallet">
                <div class="itemSub">Connect via</div>

                <div class="itemTitle">WalletConnect</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="walletConnect" v-show="qrCodeStep">
        <div class="walletConnectBox">
          <div class="top">
            <img
              class="closeButton"
              src="@/static/close.svg"
              @click.stop="closeQrCodeDisplay"
            />
            <div class="title">WalletConnect</div>
            <img class="logo" src="@/static/logo-wallet-wallet-connect.svg" />
            <img
              class="returnButton"
              src="@/static/icon-button-previous.svg"
              @click.stop="openWalletSelectDisplay"
            />
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
                  :data-clipboard-text="walletConnectUri"
                  data-clipboard-action="copy"
                  @click="copyYouCode"
                >
                  <img class="copyIcon" src="@/static/copy.svg" />
                </div>
              </Tooltip>
            </div>
          </div>
          <canvas class="canvas" id="canvas"></canvas>
        </div>
      </div>
      <SetupModal />
    </Modal>
  </div>
</template>

<script>
import _ from "lodash";
import QRCode from "qrcode";
import Clipboard from "clipboard";
import { selectedWallet } from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import {
  SUPPORTED_WALLETS,
  SUPPORTED_NETWORKS,
  getMetamaskNetwork,
  addEthereumChain,
} from "@/assets/linearLibrary/linearTools/network";
import SetupModal from "./setupModal";

export default {
  name: "Wallet",
  components: {
    SetupModal,
  },
  data() {
    return {
      tooltipContent: "Copy to clipboard",
      selectWalletStep: true,
      qrCodeStep: false,
    };
  },
  watch: {
    walletConnectQrcode(newStatus) {
      this.qrCodeStep = newStatus;
    },
    qrCodeStep(newStatus) {
      if (newStatus) {
        this.selectWalletStep = false;
        this.makeCode();
      } else {
        this.$store.commit("setWalletConnect", {
          qrcode: false,
        });
      }
    },
    isWalletOpen(newStatus) {
      if (!newStatus) {
        this.selectWalletStep = true;
        this.qrCodeStep = false;
      }
    },
  },

  computed: {
    walletConnectQrcode() {
      return this.$store.state?.walletConnect?.qrcode;
    },

    walletConnectUri() {
      return this.$store.state?.walletConnect?.uri;
    },

    isWalletOpen() {
      return this.$store.state?.isWalletOpen;
    },
  },

  methods: {
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

    resetTooltipContent() {
      setTimeout(() => {
        this.tooltipContent = "Copy to clipboard";
      }, 300);
    },

    makeCode() {
      let canvas = document.getElementById("canvas");
      QRCode.toCanvas(
        canvas,
        this.walletConnectUri,
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

    closeQrCodeDisplay() {
      this.selectWalletStep = true;
      this.qrCodeStep = false;
    },

    closeModal() {
      this.$store.commit("setIsWalletOpen", false);
    },

    openWalletSelectDisplay() {
      this.selectWalletStep = true;
      this.qrCodeStep = false;
    },

    openQrcodeDisplay() {
      selectedWallet(SUPPORTED_WALLETS.WALLET_CONNECT);
    },

    //检查网络
    async isNetworkSupported() {
      let network = await getMetamaskNetwork();
      const { name, networkId } = network;
      return !!SUPPORTED_NETWORKS[networkId];
    },

    async checkConnectToMetamask() {
      console.log("Herro");
      const isSupported = await this.isNetworkSupported();
      console.log("Herro1");
      if (isSupported) {
        console.log("Herro2");
        await selectedWallet(SUPPORTED_WALLETS.METAMASK);
        console.log("Herro3");
      } else {
        try {
          console.log("Herro4");
          await addEthereumChain(56);
          console.log("Herro5");
        } catch (error) {
          this.$store.commit("setSetupModal", true);
        }
      }
      this.$store.commit("setIsWalletOpen", false);
    },
  },
};
</script>

<style lang="scss">
#wallet {
  .seeDetailsModal {
    .ivu-modal-wrap {
      display: flex;
      justify-content: center;
      align-items: center;

      .ivu-modal {
        width: 716px !important;
        top: 0px;

        .ivu-modal-content {
          .ivu-modal-body {
            padding: 0px 0px;

            .walletSelect {
              display: flex;
              justify-content: center;
              align-items: center;

              .walletSelectBox {
                width: 716px;
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
                    margin-left: 190px;
                    cursor: pointer;

                    &:hover {
                      content: url("@/static/close_hover.svg");
                    }
                  }
                  .app-dark & {
                  }

                  .title {
                    margin: 4px 0px 4px 0px;
                    font-family: $BodyTextFontFamily;
                    font-size: 24px;
                    font-weight: bold;
                    line-height: 1.33;
                    color: #5a575c;
                  }
                }

                .boxTitle {
                  margin-top: 4px;
                  margin-bottom: 28px;
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  line-height: 1.5;
                  color: #5a575c;
                  text-align: center;
                }

                .wallets {
                  display: flex;
                  justify-content: space-between;
                  margin: 0 auto;

                  .item {
                    display: flex;
                    cursor: pointer;
                    width: 306px;
                    height: 461px;
                    border-radius: 8px;
                    border: solid 1px #e5e5e5;
                    align-items: center;
                    justify-content: flex-start;
                    transition: 1s linear;
                    padding: 117px 32px 151px;
                    flex-direction: column;

                    .logo {
                      width: 80px;
                      height: 80px;
                      text-align: center;
                    }

                    .itemSub {
                      font-family: $BodyTextFontFamily;
                      font-size: 16px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.5;
                      letter-spacing: normal;
                      text-align: center;
                      color: #5a575c;
                      margin-bottom: 8px;
                      margin-top: 49px;
                    }

                    .itemTitle {
                      font-family: $BodyTextFontFamily;
                      font-size: 24px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.33;
                      letter-spacing: normal;
                      color: #1a38f8;
                      text-align: center;
                    }

                    &:hover {
                      border: solid 1px #deddde;
                      box-shadow: 0 2px 12px 0 #deddde;
                    }
                  }
                }
              }
            }

            .walletConnect {
              display: flex;
              justify-content: center;
              align-items: center;

              .walletConnectBox {
                width: 716px;
                height: 637px;
                border-radius: 16px;
                background-color: #ffffff;
                padding: 40px;

                .top {
                  display: flex;
                  flex-direction: row-reverse;
                  width: 100%;

                  .closeButton {
                    width: 40px;
                    height: 40px;
                    margin-left: 165px;
                    cursor: pointer;

                    &:hover {
                      content: url("@/static/close_hover.svg");
                    }
                  }

                  .title {
                    margin: 4px 0 4px 16px;
                    font-family: $BodyTextFontFamily;
                    font-size: 24px;
                    font-weight: bold;
                    line-height: 1.33;
                    color: #5a575c;
                  }

                  .logo {
                    width: 40px;
                    height: 40px;
                    margin-left: 165px;
                  }

                  .returnButton {
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                  }
                }

                .boxTitle {
                  margin-top: 8px;
                  font-family: $BodyTextFontFamily;
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
                      font-family: $BodyTextFontFamily;
                      font-size: 16px;
                      font-weight: bold;
                      line-height: 1.5;
                      color: #1a38f8;
                    }

                    .copyBtn {
                      display: flex;
                      cursor: pointer;
                      transition: 1s linear;

                      .copyIcon {
                        width: 16px;
                        height: 16px;
                        margin: 4px 0 4px 4px;

                        &:hover {
                          content: url("@/static/copy_hover.svg");
                        }
                      }
                    }
                  }
                }

                .canvas {
                  text-align: center;
                  margin: 32px 104px 40px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
