<template>
  <div id="setupModal">
    <Modal
      :value="setupModal"
      :footer-hide="true"
      :transfer="true"
      :closable="false"
      :mask-closable="false"
      :mask="true"
      class="setupModal"
    >
      <div class="close">
        <CloseSvg @click.native="$store.commit('setSetupModal', false)" />
      </div>
      <div class="title">Setup MetaMask to connect to BSC Mainnet</div>
      <div class="context">
        <div class="step step1">
          <div class="num">01</div>
          <div class="text">
            <p>Click on the MetaMask logo then click on expand view.</p>
          </div>
          <div class="picture">
            <img
              style="width: 402px; height: 262px"
              src="@/static/setupModal/1.png"
              alt=""
            />
          </div>
        </div>
        <div class="step step2">
          <div class="num">02</div>
          <div class="text">
            <p>
              Click on the Ethereum Mainnet tab to add the Binanne Smart Chain
              network. Scroll down until you find Custom RPC
            </p>
          </div>
          <div class="picture">
            <img
              style="width: 398px; height: 258px"
              src="@/static/setupModal/2.png"
              alt=""
            />
          </div>
        </div>
        <div class="step step3">
          <div class="num">03</div>
          <div class="text">
            Enter in the BSC mainnet details as follows:

            <div class="table">
              <div class="secondTitle">Option 1: Connect BSC Mainnet</div>
              <Row>
                <Col span="8">Network Name</Col>
                <Col span="16"
                  >BSC Mainnet
                  <Tooltip
                    class="globalInfoStyle"
                    :content="tooltipContent"
                    offset="0 4"
                    placement="bottom"
                    @on-popper-hide="resetTooltipContent"
                  >
                    <CopySvg
                      class="copyBtn BSC_Mainnet"
                      data-clipboard-text="BSC Mainnet"
                      data-clipboard-action="copy"
                      @click.native="copyConfig('.BSC_Mainnet')"
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col span="8">New RPC URL</Col>
                <Col span="16">
                  https://bsc-dataseed1.binance.org/
                  <Tooltip
                    class="globalInfoStyle"
                    :content="tooltipContent"
                    offset="0 4"
                    placement="bottom"
                    @on-popper-hide="resetTooltipContent"
                  >
                    <CopySvg
                      class="copyBtn RPC_URL1"
                      data-clipboard-text="https://bsc-dataseed1.binance.org/"
                      data-clipboard-action="copy"
                      @click.native="copyConfig('.RPC_URL1')"
                    />
                  </Tooltip>
                  or
                  <span>
                    (https://bsc-dataseed2.binance.org/<Tooltip
                      class="globalInfoStyle"
                      :content="tooltipContent"
                      offset="0 4"
                      placement="bottom"
                      @on-popper-hide="resetTooltipContent"
                    >
                      <CopySvg
                        class="copyBtn RPC_URL2"
                        data-clipboard-text="https://bsc-dataseed2.binance.org/"
                        data-clipboard-action="copy"
                        @click.native="copyConfig('.RPC_URL2')"
                      /> </Tooltip
                    >)
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span="8">ChainID</Col>
                <Col span="16"
                  >56 <span>(or 0x38 if 56 doesn’t work)</span></Col
                >
              </Row>
              <Row>
                <Col span="8">Symbol</Col>
                <Col span="16">BNB</Col>
              </Row>
              <Row>
                <Col span="8">Block Explorer URL</Col>
                <Col span="16"
                  >https://bscscan.com/<Tooltip
                    class="globalInfoStyle"
                    :content="tooltipContent"
                    offset="0 4"
                    placement="bottom"
                    @on-popper-hide="resetTooltipContent"
                  >
                    <CopySvg
                      class="copyBtn Block_URL"
                      data-clipboard-text="https://bscscan.com/"
                      data-clipboard-action="copy"
                      @click.native="copyConfig('.Block_URL')"
                    />
                  </Tooltip>
                </Col>
              </Row>
            </div>
          </div>
          <div class="picture">
            <div class="p_1">
              <img
                style="width: 187px; height: 240px; margin: 0 auto"
                src="@/static/setupModal/3.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="step step4">
          <div class="num">04</div>
          <div class="text">
            Click Save. The BSC mainnet is connected with your Metamask Wallet.
          </div>
        </div>

        <div class="step step5">
          <div class="num">05</div>
          <div class="text">
            You can
            <span
              class="light"
              :class="{ disable: isOpen }"
              @click="clickAddNetwork(56)"
              >add BSC mainnet</span
            >
            to your Metamask Wallet.
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from "lodash";
import Clipboard from "clipboard";
import CloseSvg from "@/components/svg/close";
import CopySvg from "@/components/svg/copy";
import { addEthereumChain } from "@/assets/linearLibrary/linearTools/network";

export default {
  components: {
    CloseSvg,
    CopySvg,
  },
  name: "setupModal",
  data() {
    return {
      tooltipContent: "Copy to clipboard",
      isOpen: false,
    };
  },
  watch: { setupModal() {} },
  computed: {
    setupModal() {
      return this.$store.state?.setupModal;
    },
  },
  methods: {
    async clickAddNetwork(networkId) {
      if (!this.isOpen) {
        this.isOpen = true;
        await addEthereumChain(networkId);
        this.isOpen = false;
      }
    },

    //测试复制文字
    copyConfig(str) {
      var that = this;
      var clipboarda = new Clipboard(str);

      clipboarda.on("success", function (e) {
        that.tooltipContent = "Copied";
        e.clearSelection();
      });

      clipboarda.on("error", function (e) {
        that.tooltipContent = "Error";
      });
    },
    //重置复制提示框的文本
    resetTooltipContent() {
      var that = this;
      setTimeout(function () {
        that.tooltipContent = "Copy to clipboard";
      }, 300);
    },
  },
};
</script>

<style lang="scss">
body {
  .setupModal {
    .ivu-modal-wrap {
      display: flex;
      align-items: center;
      justify-content: center;

      .ivu-modal {
        width: 1024px !important;
        max-width: 100vw !important;
        height: 784px;
        top: 0 !important;

        .ivu-modal-content {
          height: inherit;
          border-radius: 16px;

          .ivu-modal-body {
            height: inherit;
            padding: 40px 50px;
            overflow-y: hidden;
            display: flex;
            flex-direction: column;

            .close {
              position: absolute;
              right: 40px;
              top: 40px;
            }

            .title {
              margin: 0 0 36px 0;
              font-family: $BodyTextFontFamily;
              font-size: 32px !important;
              font-weight: bold;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.25;
              letter-spacing: normal;
              color: #5a575c;
            }

            .context {
              font-family: $BodyTextFontFamily;
              font-size: 14px;
              overflow-y: scroll;
              flex: 1;
              min-height: 0;

              .step {
                display: flex;
                margin-bottom: 20px;
                .num {
                  width: 25px;
                  margin-right: 16px;
                  font-family: $BodyTextFontFamily;
                  font-size: 24px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #1a38f8;
                  position: relative;
                  &::before {
                    position: absolute;
                    width: 3px;
                    height: 100%;
                    border-left: dashed 1px #c3c3c3;
                    content: "";
                    display: block;
                    transform: translate3d(12px, 31px, 0);
                  }
                }
                .text {
                  flex: 1;
                  font-family: $BodyTextFontFamily;
                  font-size: 16px;
                  font-weight: normal;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 24px;
                  letter-spacing: normal;
                  color: #5a575c;
                  .table {
                    float: left;
                    margin: 24px 0 0 40px;
                    &:nth-child(1) {
                      margin-bottom: 20px;
                    }
                    .secondTitle {
                      margin: 0 0 16px 0;
                      font-family: $BodyTextFontFamily;
                      font-size: 16px;
                      font-weight: bold;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.5;
                      letter-spacing: normal;
                      color: #1a38f8;
                    }
                    .ivu-row {
                      line-height: 18px;
                      margin: 0 0 16px 0;

                      .ivu-col:nth-child(1) {
                        font-family: $BodyTextFontFamily;
                        font-size: 14px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.29;
                        letter-spacing: normal;
                        color: #5a575c;
                      }
                      .ivu-col:nth-child(2) {
                        font-family: $BodyTextFontFamily;
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.29;
                        letter-spacing: normal;
                        color: #5a575c;
                        span {
                          color: #99999a;
                        }

                        .copyBtn {
                          margin-left: 5px;
                        }
                      }
                    }
                  }
                }
                .picture {
                  width: 402px;
                  text-align: center;

                  .p_1 {
                    margin: 73px 0 42px 0;
                  }
                }
              }

              .step1,
              .step2 {
                .text p {
                  max-width: 315px;
                }
              }
              .step3 {
                margin: 0 0 10px 0;
                .picture {
                  width: 375px;
                }
              }
              .step4 {
                align-items: center;
                margin: 0 0 20px 0;
              }

              .step5 {
                align-items: center;
                .num::before {
                  display: none;
                }

                .light {
                  cursor: pointer;
                  color: #1a38f8;

                  &.disable {
                    opacity: 0.5;
                  }
                }
              }
            }

            .globalInfoStyle {
              .ivu-tooltip-rel {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
