<template>
  <Modal
    id="trackModal"
    v-model="trackModal"
    :footer-hide="true"
    :closable="false"
    :transfer="false"
    :mask="false"
    scrollable
    fullscreen
    @on-visible-change="trackModalChange"
  >
    <div class="closeBtn" @click="trackModal = false">
      <closeSvg></closeSvg>
    </div>

    <div v-if="true" class="trackBox">
      <div class="title" v-if="!isMobile">Track Debt</div>
      <div class="context" v-if="!isMobile">
        Track your debt over time, with charts
      </div>
      <div :class="{ mobileDropDown: isMobile }">
        <muticollateralSelector
          :selectedCollateral="selectedCollateral"
          :setSelectedCollateral="setSelectedCollateral"
        />
      </div>
      <div class="data">
        <div class="li_1">
          <div class="p_1">
            {{ isEthereumNetwork ? "N/A" : formatNumber(debtData.issuedDebt) }}
          </div>
          <div class="p_2">Total Issued Debt (ℓUSD)</div>
        </div>
        <div class="line"></div>
        <div class="li_2">
          <div class="p_1">
            {{ isEthereumNetwork ? "N/A" : formatNumber(debtData.currentDebt) }}
          </div>
          <div class="p_2">Total Current Debt (ℓUSD)</div>
        </div>
      </div>

      <div class="chart">
        <component
          :is="chartCompo"
          key="1"
          v-if="!hasTrackData"
          :data="emptyData"
          :color="{
            lineColor: '#fff',
            backgroundColor: $store.getters.isDarkTheme ? '#141B2D' : '#fff',
            areaColorBottom: $store.getters.isDarkTheme ? '#141B2D' : '#fff',
          }"
          :title="'Total Current Debt\n(ℓUSD)'"
        ></component>

        <component
          :is="chartCompo"
          key="2"
          v-else
          :data="trackData"
          :isMobile="isMobile"
          tooltip
          area
          :color="{
            lineColor: '#1a38f8',
            backgroundColor: $store.getters.isDarkTheme ? '#141B2D' : '#fff',
            textColor: $store.getters.isDarkTheme ? '#99999A' : '#99999A',
            areaColorBottom: $store.getters.isDarkTheme ? '#141B2D' : '#fff',
          }"
          :formatter="`ℓUSD : {c0}`"
          :title="
            !isMobile
              ? 'Total Current Debt\n(ℓUSD)'
              : 'Total Current Debt (ℓUSD) / Date'
          "
        ></component>
      </div>
    </div>

    <div v-else class="maintenance">
      <div class="title">
        Track debt function is currently undergoing maintenance
      </div>
      <img src="@/static/maintenance.svg" alt="" />
      <div class="desc">
        We're preparing to serve you better. We should be back shortly. Thank
        you for your patience.
      </div>
    </div>

    <Spin fix v-if="loading"> </Spin>
  </Modal>
</template>

<script>
import _ from "lodash";
import trackchart from "@/components/echarts/trackchart";
import closeSvg from "@/components/svg/close";
import { format } from "date-fns";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import currencies from "@/common/currency";
import {
  isEthereumNetwork,
  isBinanceNetwork,
} from "@/assets/linearLibrary/linearTools/network";
import { formatNumber } from "@/assets/linearLibrary/linearTools/format";
import { fetchTrackDebt } from "@/assets/linearLibrary/linearTools/request/trackDebt";
import muticollateralSelector from "~/components/selector/muticollateralSelector.vue";
import { collateralAssets } from "~/assets/linearLibrary/linearTools/collateralAssets";

export default {
  name: "trackModal",
  data() {
    return {
      currencies,
      chartCompo: "trackchart",
      trackModal: false,
      hasTrackData: false, //有无图表记录
      currentMobileTabs: 1, //移动端下的tabs, 1chart 2list

      trackData: {
        xAxis: {
          data: ["", "", ""],
        },
        series: [0, 0, 0],
      },

      debtData: { issuedDebt: 0, currentDebt: 0 },

      emptyData: {
        xAxis: {
          data: _.map([0, 0, 0, 0], (item, index) =>
            format(
              new Date().getTime() + index * 24 * 60 * 60 * 1000,
              "d MMM yy"
            )
          ),
        },
        series: [0, 0, 0, 0],
      },

      trackTableColumn: [
        {
          title: "Your Asset",
          key: "name",
          slot: "name",
          className: "cellAsset",
        },
        {
          title: "Balance",
          key: "balance",
          slot: "balance",
        },
        {
          title: "Value",
          key: "valueUSD",
          slot: "valueUSD",
        },
      ],

      trackTableData: [],
      formatNumber,
      loading: false,
      collateralAssets: collateralAssets,
      selectedCollateral: undefined,
    };
  },
  components: {
    trackchart,
    closeSvg,
    muticollateralSelector,
  },
  watch: {
    walletAddress() {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    theme() {
      this.chartCompo = "";
      this.$nextTick(() => {
        setTimeout(() => {
          this.chartCompo = "trackchart";
        });
      });
    },
    selectedCollateral() {
      this.trackModalChange(true);
    },
  },
  computed: {
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },

    //移动端
    isMobile() {
      return this.$store.state?.isMobile;
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
    theme() {
      return this.$store.state.theme;
    },
  },
  created() {
    //订阅组件改变事件
    this.$pub.subscribe("trackModalChange", (msg, params) => {
      this.trackModal = params;
    });
    this.selectedCollateral = this.collateralAssets[0];
  },
  destroyed() {
    this.selectedCollateral = this.collateralAssets[0];
  },
  methods: {
    openSocial(slug) {
      switch (slug) {
        case 0:
          window.open("https://t.me/joinchat/Tb3iAhuMZsyfspxhEWQLvw");
          break;
        case 1:
          window.open("https://www.linkedin.com/company/linearfinance/");
          break;
        case 2:
          window.open("https://medium.com/@linear.finance");
          break;
        case 3:
          window.open("https://twitter.com/LinearFinance");
          break;
        default:
          break;
      }
    },

    trackModalChange(status) {
      try {
        this.debtData = { issuedDebt: 0, currentDebt: 0 };
        this.trackTableData = [];
        this.trackData = this.emptyData;

        if (status) {
          this.loading = true;
          //获取交易记录
          this.getTrackData()
            .then((res) => {
              //有图表数据
              if (!_.isEmpty(res.chartData)) {
                this.trackData = {
                  xAxis: {
                    data: _.map(res.chartData, (item) =>
                      format(item[0], "MMM d")
                    ),
                  },
                  series: _.map(res.chartData, (item) => _.floor(item[1], 2)),
                };

                this.hasTrackData = true;
              }

              //表格数据
              this.trackTableData = res.tableData ?? [];
              this.debtData = res.debet;
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.hasTrackData = false;
          this.$pub.publish("trackModalCloseEvent");
        }
      } catch (e) {
        console.error(e, "trackModalChange err");
      }
    },

    async getTrackData() {
      try {
        const {
          lnrJS: { lUSD, BTCl, ETHl, lHB10 },
        } = lnrJSConnector;

        let trackData = { issuedDebt: 0, currentDebt: [] };

        if (this.isBinanceNetwork) {
          trackData = await fetchTrackDebt(
            this.walletAddress,
            this.selectedCollateral
          );
        }
        let tableData = [];

        const currentDebt = trackData.currentDebt.length
          ? trackData.currentDebt[trackData.currentDebt.length - 1][1]
          : [];
        return {
          chartData: trackData.currentDebt,
          tableData: tableData,
          debet: {
            issuedDebt: trackData.issuedDebt,
            currentDebt: currentDebt,
          },
        };
      } catch (e) {
        console.error(e, "getTrackData err");
      }
    },
    setSelectedCollateral(item) {
      this.selectedCollateral = item;
    },
  },
};
</script>

<style lang="scss">
#trackModal {
  .ivu-modal-wrap {
    position: absolute;

    .ivu-modal-body {
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0px 2px 6px #deddde;
      position: relative;
      padding: 60px 143px 0;
      height: 100%;
      overflow: hidden;

      .app-dark & {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }

      .closeBtn {
        z-index: 1;
        position: absolute;
        top: 24px;
        right: 24px;
      }

      .trackBox {
        display: flex;
        flex-direction: column;
        align-items: center;

        > .title {
          letter-spacing: normal;
          margin: 0 0 8px;
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

        > .context {
          margin-bottom: 48px;
          font-family: Gilroy-Regular;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #99999a;

          a {
            color: #1a38f8;
          }
          .app-dark & {
            color: #e5e5e5 !important;
          }
        }

        .actionInputItem {
          display: flex;
          width: 400px;
          height: 88px;
          margin-bottom: 48px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          padding: 33px 24px;
          justify-content: space-between;
          align-items: center;
          transition: $animete-time linear;
          position: relative;

          &:hover,
          &.active {
            border: 1px solid #1a38f8;
            box-shadow: 0px 2px 12px #deddde;
          }
        }

        .data {
          width: 100%;
          display: flex;
          margin-bottom: 48px;
          .li_1,
          .li_2 {
            flex: 1;
            text-align: center;
            .p_1 {
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
            .p_2 {
              font-family: Gilroy-Regular;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.29;
              letter-spacing: normal;
              text-align: center;
              color: #5a575c;
            }
          }
          .line {
            width: 2px;
            height: 59px;
            border: solid 1px #deddde;
          }
        }
        .chart {
          position: relative;
          width: 786px;
          height: 270px;
        }
        .table {
          width: 100%;
          height: 200px;
          margin-top: 5px;

          .ivu-table {
            .ivu-table-header {
              [class^="ivu-table-column-"] {
                background-color: #fff;
                border-color: #f6f5f6;
                font-family: Gilroy-Bold;
                font-size: 12px;
                font-weight: 700;
                font-stretch: normal;
                font-style: normal;
                line-height: 1.33;
                letter-spacing: normal;
                color: #99999a;
                .app-dark & {
                  background-color: transparent;
                  color: #f6f5f6;
                }
              }

              tr {
                th {
                  &:last-of-type {
                    //visibility: hidden;
                  }
                }
              }
            }

            .ivu-table-tbody {
              .ivu-table-row {
                [class^="ivu-table-column-"] {
                  height: 56px;
                  border-color: #f6f5f6;
                  .app-dark & {
                    background-color: transparent;
                    border-color: #313131;
                  }
                }
                .ivu-table-cell-slot {
                  font-family: Gilroy-Medium;
                  font-size: 12px;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #5a575c;
                  .app-dark & {
                    color: #ffffff;
                  }
                }
                .cellAsset {
                  .ivu-table-cell-slot {
                    display: flex;
                    align-items: center;
                    font-family: Gilroy-Bold;
                    font-size: 16px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    color: #5a575c;

                    img {
                      width: 32px;
                      height: 32px;

                      margin-right: 8px;
                    }
                  }
                }
                .app-dark & {
                  .ivu-table-cell-slot {
                    color: #ffffff;
                  }
                }
              }
            }

            &::before {
              content: none;
            }
            .app-dark & {
              background-color: transparent;
              th {
                border-bottom-color: #313131 !important;
              }
            }
          }

          .nothing {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            border: solid 1px #deddde;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              margin-right: 16px;
            }
            .text {
              color: #5a575c;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              font-size: 16px;

              .title {
                font-family: Gilroy-Bold;
              }
              .subject {
                font-family: Gilroy-Regular;
              }
            }
          }
        }
      }

      .maintenance {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title {
          font-family: Gilroy-Bold;
          font-size: 32px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.25;
          letter-spacing: normal;
          color: #5a575c;
          text-align: center;
        }

        img {
          width: 100%;
          height: auto;
          margin: 50px 0;
        }

        .desc {
          font-family: Gilroy-Regular;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: center;
          color: #5a575c;
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #trackModal {
    .ivu-modal-wrap {
      .ivu-modal-body {
        padding: 24px 24px 0;

        .closeBtn {
          position: absolute;
          top: 7px;
          right: 7px;

          #closeSvg {
            width: 26px;
          }
        }

        .mobileDropDown {
          width: 80vw;
          height: 32px;
          display: flex;
          align-items: center;
          margin: 65px 0 40px;
        }

        .data {
          margin-top: 16px;

          .li_1,
          .li_2 {
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .p_1 {
              font-size: 24px !important;
            }
            .p_2 {
              font-size: 12px !important;
            }
          }
        }

        .mobileTabs {
          width: 74.6vw;
          height: 32px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-family: Gilroy-Bold;
          font-size: 12px;
          line-height: 26px;
          color: #99999a;
          margin: 0 0 40px 0;
          border-radius: 20.5px;
          border: solid 1px #e5e5e5;
          letter-spacing: 1.5px;

          .debtChart,
          .debtList {
            flex: 1;
            height: 26px;
            margin: 0 3px 0;
            text-align: center;
            border-radius: 20px;
          }

          .activated {
            background-color: rgba(126, 181, 255, 0.2);
            color: #1a38f8;
          }
          .app-dark & {
            border-color: #3851f0;
            color: #3851f0;
            .activated {
              color: #ffffff;
              background-color: #3851f0;
            }
          }
        }

        .chart {
          position: relative;
          width: 160% !important;
          height: 270px;
        }

        .table {
          .ivu-table {
            .ivu-table-tbody {
              .ivu-table-row {
                .cellAsset {
                  .ivu-table-cell {
                    padding: 0 0 0 8px;

                    .ivu-table-cell-slot {
                      font-size: 14px !important;

                      img {
                        width: 24px !important;
                        height: 24px !important;
                        margin-right: 8px;
                      }
                    }
                  }
                }

                .ivu-table-cell-slot {
                  word-break: keep-all !important;
                }
              }
            }
          }

          .nothing {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            border: solid 1px #deddde;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            img {
              width: 60px !important;
              margin-right: 0px !important;
            }
            .text {
              color: #5a575c;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              font-size: 16px;
              text-align: center;

              .title {
                font-family: Gilroy-Bold;
              }
              .subject {
                font-family: Gilroy-Regular;
              }
            }
          }
        }

        .maintenance {
          .title {
            font-family: Gilroy-Bold;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.25;
            letter-spacing: normal;
            color: #5a575c;
            text-align: center;
          }

          img {
            margin: 25px 0;
          }

          .desc {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
