<template>
  <div id="unlockSchedule">
    <div class="unlockScheduleWrapper" @click.self="closeUnlockSchedule">
      <div class="unlockScheduleBox">
        <div class="closeBtn" @click="closeUnlockSchedule">
          <template v-if="!isMobile"> <closeSvg /></template>
          <template v-else>
            <img src="@/static/icon-cancel.svg" />
          </template>
        </div>
        <div class="title">Unlocking Schedule</div>
        <div class="customTable">
          <tr class="tableHead">
            <th>Date</th>
            <th>LINA Unlock</th>
          </tr>

          <div class="tableBody">
            <tr v-for="(row, index) in currentPageData" :key="index">
              <td>{{ format(row.unlockTime * 1000, "d MMM yyyy kk:mm") }}</td>
              <td>
                {{
                  formatEtherToNumber(row.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                  })
                }}
              </td>
            </tr>
          </div>

          <Spin size="large" fix v-if="gettingData"></Spin>
        </div>

        <div class="pageBox">
          <Page
            :total="totalData"
            @on-change="pageChange"
            :current="currentPage"
            :page-size="defaultPageSize"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import {
  isEthereumNetwork,
  isBinanceNetwork,
} from "@/assets/linearLibrary/linearTools/network";
import closeSvg from "@/components/svg/close.vue";
import { openBlockchainBrowser } from "@/common/utils";
import { format } from "date-fns";
import { formatEtherToNumber } from "@/assets/linearLibrary/linearTools/format";
import { fetchRewardEntriesForAddress } from "@/assets/linearLibrary/linearTools/request/linearData/rewardEntries";
import { bnAdd } from "~/common/bnCalc";

export default {
  components: { closeSvg },
  name: "unlockSchedule",
  data() {
    return {
      gettingData: true,
      currentPage: 1, //当前所在页数
      defaultPageSize: 10, //每页显示数据条数
      tableData: [],
      isEthereumNetwork,
      isBinanceNetwork,
      openBlockchainBrowser,
    };
  },
  created() {
    this.getUnlockData();
  },
  watch: {
    currentPageData() {},
    walletAddress() {},
    walletNetworkId() {},
  },
  computed: {
    //筛选后的数据总数
    totalData() {
      return this.tableData.length;
    },
    //当前分页的数据
    currentPageData() {
      if (this.tableData.length) {
        return this.tableData.slice(
          (this.currentPage - 1) * this.defaultPageSize,
          this.currentPage * this.defaultPageSize,
          this.currentPage
        );
      }
    },
    //网络类型
    walletNetworkId() {
      return this.$store.state.walletNetworkId;
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    //移动端
    isMobile() {
      return this.$store.state?.isMobile;
    },
  },
  methods: {
    async getUnlockData() {
      const rewardEntries = await fetchRewardEntriesForAddress({
        networkId: this.walletNetworkId,
        walletAddress: this.walletAddress,
      });
      const groupedRewardEntriesByDate = rewardEntries.reduce((acc, curr) => {
        var key = `${curr.unlockTime}`;
        if (!(key in acc)) acc[key] = Object.assign({}, curr);
        else acc[key].amount = bnAdd(acc[key].amount, curr.amount);
        return acc;
      }, {});
      this.tableData = Object.values(groupedRewardEntriesByDate);
      this.gettingData = false;
    },

    //当前分页改变
    pageChange(currentPage) {
      this.currentPage = currentPage;
    },

    closeUnlockSchedule() {
      this.currentPage = 1;
      this.$store.commit("setIsUnlockScheduleShow", false);
    },

    format,
    formatEtherToNumber,
  },
};
</script>

<style lang="scss">
#unlockSchedule {
  z-index: 10000;
  background: rgba(60, 58, 62, 0.5);
  mix-blend-mode: normal;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .unlockScheduleWrapper {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
  }

  .unlockScheduleBox {
    width: 500px;
    height: 660px;
    padding: 40px 50px;
    margin: 6% auto;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
  }

  .closeBtn {
    position: absolute;
    top: 24px;
    right: 24px;
    cursor: pointer;
  }

  .title {
    margin-bottom: 32px;
    text-align: center;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    color: #5a575c;
  }

  .customTable {
    width: 100%;
    height: 440px;
    font-family: "Gilroy";
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #99999a;

    tr {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #e5e5e5;
      display: inline-flex;
    }

    th {
      font-weight: 700;
    }

    th,
    td {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
    }

    th:first-child,
    td:first-child {
      justify-content: left;
    }

    th:nth-child(2),
    td:nth-child(2) {
      justify-content: right;
    }
  }

  .pageBox {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: 40px;
    .ivu-page {
      .ivu-page-item {
        border: 1px solid #cacaca;
        a {
          color: #cacaca;
        }
      }

      .ivu-page-item:hover {
        &:not(.ivu-page-item-active) {
          border: 1px solid #1a38f8;
          a {
            color: #1a38f8;
          }
        }
      }

      .ivu-page-item-active {
        border-color: #1a38f8;
        background-color: #1a38f8;
        a {
          color: #fff;
        }
      }

      .ivu-page-item-jump-next,
      .ivu-page-item-jump-prev {
        a {
          i {
            color: #cacaca;
          }
        }
      }

      .ivu-page-item-jump-next:hover,
      .ivu-page-item-jump-prev:hover {
        a {
          i {
            color: #1a38f8;
          }
        }
      }

      .ivu-page-prev,
      .ivu-page-next {
        a {
          i {
            color: #cacaca;
          }
        }
      }

      .ivu-page-prev:hover,
      .ivu-page-next:hover {
        &:not(.ivu-page-disabled) {
          a {
            i {
              color: #1a38f8;
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #unlockSchedule {
    .unlockScheduleBox {
      width: 100vw;
      height: 80vh;
      padding: 16px 0px;
      margin: 0;
      border-radius: 16px 16px 0 0;
      overflow: hidden;
      position: fixed;
      bottom: 0;
    }

    .title {
      font-size: 16px;
      line-height: 24px;
    }

    .closeBtn {
      top: 16px;
      right: 24px;
    }

    .customTable {
      height: 500px;
      max-height: 80%;
      .tableBody {
        padding: 0 32px;
        max-height: 80%;
        overflow-y: auto;
      }
      th {
        font-weight: 700;
      }
    }
    tr {
      &.tableHead {
        padding: 0 32px;
        border-bottom: none;

        th {
          border-bottom: 1px solid #e5e5e5;
        }
      }
    }
    .pageBox {
      bottom: 24px;
    }
  }
}

// dark mode design
.app-dark {
  #unlockSchedule {
    background: rgba(0, 0, 0, 0.5);

    .unlockScheduleBox {
      background: #141b2d;
    }

    .title {
      color: #f6f5f6;
    }
    .customTable {
      color: #f6f5f6;

      tr {
        border-bottom: 1px solid rgba(246, 245, 246, 0.2);
      }

      tr {
        &.tableHead {
          border-bottom: none;
          th {
            border-bottom: 1px solid rgba(246, 245, 246, 0.2);
          }
        }
      }
    }
    .pageBox {
      .ivu-page {
        .ivu-page-item {
          a {
            color: #99999a;
          }
        }
      }
    }
  }
}
</style>
