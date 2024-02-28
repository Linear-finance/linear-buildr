<template>
  <Modal
    id="transactionModal"
    v-model="transactionModal"
    :footer-hide="true"
    :closable="false"
    :transfer="false"
    :mask="false"
    scrollable
    fullscreen
    @on-visible-change="transactionModalChange"
  >
    <div class="closeBtn" @click="transactionModal = false">
      <closeSvg />
    </div>

    <div
      v-if="transactionHistoryData.length != 0 || gettingData"
      class="transactionBox"
    >
      <div class="title" v-if="!isMobile">Transaction History</div>

      <div class="filterMenu" v-if="!isMobile">
        <div class="box">
          <Select
            class="chainSelect"
            :class="{ hasFilter: filters.chainType }"
            v-model="filters.chainType"
            placeholder="All Chains"
          >
            <Option value="ethereum" label="Ethereum">
              <img src="@/static/ETH.svg" />
              <span>Ethereum</span>
            </Option>
            <Option value="binance" label="Binance">
              <img src="@/static/binance.svg" />
              <span> Binance</span>
            </Option>
          </Select>

          <DatePicker
            :value="dateValue"
            class="dateDropdown"
            :class="{
              hasFilter:
                filters.dateRange.length != 0 &&
                filters.dateRange[0] != '' &&
                filters.dateRange[1] != '',
            }"
            @on-change="dateRangeChange"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="All Dates"
            :options="options1"
            transfer
          >
          </DatePicker>

          <Dropdown
            trigger="click"
            class="typeDropdown"
            :class="{
              hasFilter: filters.transactionType.length != 0,
            }"
          >
            <div class="typeBtn" v-if="filters.transactionType.length == 0">
              <span>All Types</span><Icon type="ios-arrow-down"></Icon>
            </div>
            <div
              class="typeBtnSelected"
              v-else-if="filters.transactionType.length == 1"
            >
              {{ filters.transactionType[0] }}
            </div>
            <div class="typeBtnSelected" v-else>
              {{ filters.transactionType.length }} Selected
            </div>
            <DropdownMenu slot="list">
              <CheckboxGroup v-model="filters.transactionType">
                <Checkbox label="Build"> Build </Checkbox>
                <Checkbox label="Burn"> Burn </Checkbox>
                <Checkbox label="Claim"> Claim </Checkbox>
                <Checkbox label="Transfer"> Transfer </Checkbox>
                <Checkbox label="Stake"> Stake </Checkbox>
                <Checkbox label="Unstake"> Unstake </Checkbox>
                <Checkbox label="Referral"> Referral </Checkbox>
                <Checkbox label="Swap"> Bridge </Checkbox>
                <Checkbox label="Liquidated(Staked)">
                  Liquidated(Staked)
                </Checkbox>
                <Checkbox label="Liquidated(Locked)">
                  Liquidated(Locked)
                </Checkbox>
                <Checkbox label="Unlock Reward"> Unlock Reward </Checkbox>
              </CheckboxGroup>
            </DropdownMenu>
          </Dropdown>

          <Dropdown
            trigger="click"
            class="amountDropdown"
            :class="{
              hasFilter: filters.amountRange.from || filters.amountRange.to,
            }"
          >
            <div
              class="amountBtn"
              v-if="filters.amountRange.from || filters.amountRange.to"
            >
              From
              {{ filters.amountRange.from ? filters.amountRange.from : 0 }}
              to
              {{ filters.amountRange.to ? filters.amountRange.to : 0 }}
            </div>
            <div class="amountBtnSelected" v-else>
              <span>All Amount</span><Icon type="ios-arrow-down"></Icon>
            </div>
            <DropdownMenu slot="list">
              <span>From:</span>
              <InputNumber
                :max="999999999999"
                :min="0"
                v-model="filters.amountRange.from"
              ></InputNumber>
              <span>To:</span>
              <InputNumber
                :max="999999999999"
                :min="0"
                v-model="filters.amountRange.to"
              ></InputNumber>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div
          class="clearFiltersBtn"
          :class="{
            hasFilter:
              filters.chainType ||
              filters.dateRange.length != 0 ||
              filters.transactionType.length != 0 ||
              filters.amountRange.from ||
              filters.amountRange.to,
          }"
          @click="clearFilters"
        >
          {{ "CLEAR" }}
        </div>
      </div>

      <div class="filterMenuMobile" v-if="isMobile">
        <img src="@/static/add.svg" @click="showFilterMenuMobileModal" />
        <template v-if="filterNum != 0">
          {{ filterNum }} Filters Applied
        </template>
        <template v-if="filterNum == 0"> Filter </template>
      </div>

      <div class="customTable">
        <div class="tabelHeader">
          <div class="th sort chain">
            <template v-if="!isMobile">Smart </template>Chain
          </div>
          <div class="th sort date">Date</div>
          <template v-if="!isMobile">
            <div class="th sort type">Type</div>
            <div class="th sort amount">Amount</div>
          </template>
          <template v-if="isMobile">
            <div class="th sort typeAmount">Type/Amount</div>
          </template>
          <div class="th sort viewInBrowser"></div>
        </div>

        <div v-if="tableData.length" class="hasData">
          <div class="tableBody">
            <div class="tr" v-for="(row, index) in tableData" :key="index">
              <div class="td chain">
                <template v-if="isEthereumNetwork(row.networkId)">
                  <img src="@/static/ETH.svg" />
                </template>
                <template v-if="isBinanceNetwork(row.networkId)">
                  <img src="@/static/logo-wallet-bsc.svg" />
                </template>

                <template v-if="!isMobile">
                  {{ row.chain }}
                </template>
              </div>
              <div class="td date">
                <template>
                  <span>{{ row.date | mobileDate }} </span>
                  <br />
                  <span>{{ row.date | mobileDate(true) }} </span>
                </template>
              </div>

              <template v-if="!isMobile">
                <div class="td type">
                  <div>
                    {{ row.newType }}
                  </div>
                  <div v-if="row.asset != ''">({{ row.asset }})</div>
                  <div v-else></div>
                </div>
                <div class="td amount">
                  <span>{{ row.amount }}</span>
                </div>
              </template>
              <template v-if="isMobile">
                <div class="td typeAmount">
                  <span v-if="row.asset != ''"
                    >{{ row.newType }} ({{ row.asset }})</span
                  >
                  <span v-else>{{ row.newType }}</span>
                  <span>{{ row.amount }}</span>
                </div>
              </template>
              <div
                class="td viewInBrowser"
                @click="openBlockchainBrowser(row.hash, row.networkId)"
              >
                <template v-if="!isMobile">VIEW →</template>
                <template v-else> → </template>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="notData">No Data</div>

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
        <!-- <Page total="100" @on-change="pageChange" :current="currentPage" :page-size="defaultPageSize" size="small"/> -->
      </div>
    </div>

    <div v-else class="noTransactionBox">
      <img src="@/static/no_transaction.svg" />
      <div class="title">No Transactions</div>
      <div class="context">You have not made any transactions yet</div>
      <div class="buildBtn" @click="toBuild()">Build ℓUSD</div>
    </div>

    <Modal
      v-model="filterMenuMobileModal"
      :footer-hide="true"
      :closable="true"
      :transfer="false"
      :mask="true"
      class="filterMenuMobileModal"
    >
      <div class="titleBox">
        <template v-if="filterNum !== 0">
          {{ filterNum }} Filters applied
          <div
            class="clearFiltersBtn"
            :class="{
              hasFilter:
                filters.chainType ||
                filters.dateRange.length != 0 ||
                filters.transactionType.length != 0 ||
                filters.amountRange.from ||
                filters.amountRange.to,
            }"
            @click="clearMobileFilters"
          >
            CLEAR
          </div>
        </template>
        <template v-if="filterNum == 0"> Filter </template>
      </div>

      <div class="filterBox">
        <Select
          class="chainSelect"
          :class="{ hasFilter: mobileFilters.chainType }"
          v-model="mobileFilters.chainType"
          placeholder="All Chains"
        >
          <Option value="ethereum" label="Ethereum">
            <img src="@/static/ETH.svg" />
            <span>Ethereum</span>
          </Option>
          <Option value="binance" label="Binance">
            <img src="@/static/binance.svg" />
            <span> Binance</span>
          </Option>
        </Select>

        <DatePicker
          :value="dateValue"
          class="dateDropdown"
          :class="{
            hasFilter:
              mobileFilters.dateRange.length != 0 &&
              mobileFilters.dateRange[0] != '' &&
              mobileFilters.dateRange[1] != '',
          }"
          split-panels
          @on-change="dateRangeChange"
          format="yyyy/MM/dd"
          type="daterange"
          placement="bottom-end"
          placeholder="All Dates"
          :options="options1"
          transfer
        >
        </DatePicker>

        <Dropdown
          trigger="click"
          class="typeDropdown"
          :class="{
            hasFilter: mobileFilters.transactionType.length != 0,
          }"
        >
          <div class="typeBtn" v-if="mobileFilters.transactionType.length == 0">
            <span>All Types</span><Icon type="ios-arrow-down"></Icon>
          </div>
          <div
            class="typeBtnSelected"
            v-else-if="mobileFilters.transactionType.length == 1"
          >
            {{ mobileFilters.transactionType[0] }}
          </div>
          <div class="typeBtnSelected" v-else>
            {{ mobileFilters.transactionType.length }} Selected
          </div>
          <DropdownMenu slot="list">
            <CheckboxGroup v-model="mobileFilters.transactionType">
              <Checkbox label="Build"> Build </Checkbox>
              <Checkbox label="Burn"> Burn </Checkbox>
              <Checkbox label="Claim"> Claim </Checkbox>
              <Checkbox label="Transfer"> Transfer </Checkbox>
              <Checkbox label="Stake"> Stake </Checkbox>
              <Checkbox label="Unstake"> Unstake </Checkbox>
              <Checkbox label="Referral"> Referral </Checkbox>
              <Checkbox label="Swap"> Bridge </Checkbox>
              <Checkbox label="Liquidated(Staked)">
                Liquidated(Staked)
              </Checkbox>
              <Checkbox label="Liquidated(Locked)">
                Liquidated(Locked)
              </Checkbox>
              <Checkbox label="Unlock Reward"> Unlock Reward </Checkbox>
            </CheckboxGroup>
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          trigger="click"
          class="amountDropdown"
          :class="{
            hasFilter:
              mobileFilters.amountRange.from || mobileFilters.amountRange.to,
          }"
        >
          <div
            class="amountBtn"
            v-if="
              mobileFilters.amountRange.from || mobileFilters.amountRange.to
            "
          >
            From
            {{
              mobileFilters.amountRange.from
                ? mobileFilters.amountRange.from
                : 0
            }}
            to
            {{
              mobileFilters.amountRange.to ? mobileFilters.amountRange.to : 0
            }}
          </div>
          <div class="amountBtnSelected" v-else>
            <span>All Amount</span><Icon type="ios-arrow-down"></Icon>
          </div>
          <DropdownMenu slot="list">
            <span>From:</span>
            <InputNumber
              :max="999999999999"
              :min="0"
              v-model="mobileFilters.amountRange.from"
            ></InputNumber>
            <span>To:</span>
            <InputNumber
              :max="999999999999"
              :min="0"
              v-model="mobileFilters.amountRange.to"
            ></InputNumber>
          </DropdownMenu>
        </Dropdown>

        <div
          class="applyFilterBtn"
          :class="{ mobileFiltersChange: mobileFiltersChange }"
          @click="applyMobileFilters"
        >
          APPLY FILTERS
        </div>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import _ from "lodash";
import {
  fetchTransactionHistory,
  TRANSACTION_EVENTS,
} from "@/assets/linearLibrary/linearTools/request/transactionHistory";
import { format } from "date-fns";
import {
  isEthereumNetwork,
  isBinanceNetwork,
  getOtherNetworks,
} from "@/assets/linearLibrary/linearTools/network";
import { formatNumber } from "@/assets/linearLibrary/linearTools/format";
import closeSvg from "@/components/svg/close.vue";
import { openBlockchainBrowser } from "@/common/utils";

export default {
  components: { closeSvg },
  name: "transactionModal",
  data() {
    return {
      transactionModal: false,
      gettingData: true,
      dateValue: [], //时间区间数组
      filters: {
        chainType: null,
        dateRange: [],
        transactionType: [],
        amountRange: { from: 0, to: 0 },
      }, //筛选条件：当前选择的链0all 1eth 2bsc 交易类型 时间区间 金额区间
      mobileFilters: {
        chainType: null,
        dateRange: [],
        transactionType: [],
        amountRange: { from: 0, to: 0 },
      },
      currentPage: 1, //当前所在页数
      defaultPageSize: 10, //每页显示数据条数
      filterMenuMobileModal: false, //手机显示filter modal
      transactionHistoryData: [], //交易记录数据
      //显示表格日期,大于今天的日期禁用
      options1: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
      },

      tableData: [],
      tableDataMobile: [],

      isEthereumNetwork,
      isBinanceNetwork,
      openBlockchainBrowser,
    };
  },
  filters: {
    mobileDate(date, time = false) {
      if (time) {
        return date.split(" ").pop();
      }
      return date.split(" ").slice(0, 3).join(" ");
    },
  },
  created() {
    //订阅组件改变事件
    this.$pub.subscribe("transactionModalChange", (msg, params) => {
      this.transactionModal = params;
      if (params) {
        this.gettingData = true;
        this.fetchTransactionHistoryClick();
      }
    });
  },
  watch: {
    currentPageData() {
      var that = this;
      var newType = "";
      var asset = "";
      var amount = "",
        date = "",
        tempData = [];

      if (this.currentPageData.length == 0) {
        that.$nextTick(function () {
          this.tableData = tempData;
        });
        return null;
      }

      this.currentPageData.map(function (item, index, ary) {
        date = format(item.timestamp, "d MMM yyyy kk:mm");
        const { networkId, hash, chain } = item;

        if (
          item.type == "Unstake" ||
          item.type == "Stake" ||
          item.type == "Swap" ||
          item.type == "Referral" ||
          item.type == "Transfer" ||
          item.type == "Liquidated(Staked)" ||
          item.type == "Liquidated(Locked)"
        ) {
          const asset = item.source == "BNB" ? "WBNB" : item.source;

          amount =
            item.symbol +
            formatNumber(item.value, item.decimal) +
            " " +
            "\n" +
            asset;
        } else if (item.type == "Build" || item.type == "Burn") {
          amount = item.symbol + formatNumber(item.value) + " " + "\n" + "ℓUSD";
        } else if (item.type == "Claim") {
          let reward = "";
          if (item.rewardslusd == 0) {
            reward = formatNumber(item.rewardsLina) + " " + "LINA";
          } else {
            reward =
              formatNumber(item.rewardsLina) +
              " " +
              "LINA" +
              "\n" +
              "+" +
              formatNumber(item.rewardslusd) +
              " ℓUSD";
          }
          amount = "+" + reward;
        } else if (item.type == "Unlock Reward") {
          amount = formatNumber(item.value) + " LINA";
        } else {
          return null;
        }

        if (item.type == "Burn" || item.type == "Build") {
          newType = item.type;
          asset = item.source === "BNB" ? "WBNB" : item.source;
        } else if (item.type == "Liquidated(Staked)") {
          newType = "Liquidated";
          asset = "Staked";
        } else if (item.type == "Liquidated(Locked)") {
          newType = "Liquidated";
          asset = "Locked";
        } else if (item.type == "Claim") {
          newType = item.type;
          asset =
            item.collateralCurrency === "BNB"
              ? "WBNB"
              : item.collateralCurrency;
        } else {
          newType = item.type;
          asset = "";
        }

        tempData.push({
          networkId,
          chain,
          newType,
          asset,
          amount,
          date,
          hash,
        });
      });

      that.$nextTick(function () {
        this.tableData = tempData;
      });
    },
    filterTransactionHistoryData() {},
    walletNetworkId() {},
  },
  computed: {
    //根据筛选条件计算交易数据
    filterTransactionHistoryData() {
      var that = this;
      this.currentPage = 1; //每次筛选数据都将当前分页改为1

      //筛选交易记录
      var filterTransactionHistoryData = this.transactionHistoryData.filter(
        function (record) {
          var { chainType, transactionType, dateRange, amountRange } =
            that.filters;

          //在不在筛选的链中
          if (chainType != null && chainType != record.chain) {
            return false;
          }

          //在不在筛选的类型中 筛选数组为空则表示显示全部
          if (
            transactionType.length != 0 &&
            !transactionType.includes(record.type)
          ) {
            return false;
          }

          //在不在筛选的金额范围内
          if (amountRange.from || amountRange.to) {
            if (
              record.value < amountRange.from ||
              record.value > amountRange.to
            )
              return false;
            if (
              record.amount < amountRange.from ||
              record.amount > amountRange.to
            )
              return false;
            if (
              record.fromAmount < amountRange.from ||
              record.fromAmount > amountRange.to
            )
              return false;
            if (
              record.rewardslusd < amountRange.from ||
              record.rewardslusd > amountRange.to
            ) {
              if (
                record.rewardsLina < amountRange.from ||
                record.rewardsLina > amountRange.to
              )
                return false;
            }
          }

          //在不在筛选的时间范围内,  iview日期区间是以两个日期的零点算，所以大的日期要加多一天的毫秒数
          if (
            dateRange.length != 0 &&
            (record.timestamp < Date.parse(dateRange[0]) ||
              record.timestamp > Date.parse(dateRange[1]) + 86400000)
          ) {
            return false;
          }

          //符合以上所有筛选条件则保留
          return true;
        }
      );
      return filterTransactionHistoryData;
    },
    //筛选后的数据总数
    totalData() {
      return this.filterTransactionHistoryData.length;
    },
    //当前分页的数据
    currentPageData() {
      return this.filterTransactionHistoryData.slice(
        (this.currentPage - 1) * this.defaultPageSize,
        this.currentPage * this.defaultPageSize,
        this.currentPage
      );
    },
    //筛选条件数量
    filterNum() {
      var filterNum = 0;
      for (let key in this.filters) {
        switch (key) {
          case "chainType":
            if (this.filters[key]) filterNum++;
            break;
          case "dateRange":
            if (
              this.filters[key].length != 0 &&
              this.filters[key][0] != "" &&
              this.filters[key][0] != ""
            ) {
              filterNum++;
            }
            break;
          case "transactionType":
            if (this.filters[key].length != 0) {
              filterNum++;
            }
            break;
          case "amountRange":
            if (this.filters[key].from || this.filters[key].to) {
              filterNum++;
            }
            break;
        }
      }

      return filterNum;
    },
    //网络类型
    walletNetworkId() {
      return this.$store.state.walletNetworkId;
    },
    //移动端
    isMobile() {
      return this.$store.state?.isMobile;
    },
    mobileFiltersChange() {
      if (
        !_.isEqual(this.filters, this.mobileFilters) &&
        this.filterMenuMobileModal
      ) {
        return true;
      } else {
        return false;
      }
    },
    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },
  },
  methods: {
    transactionModalChange(status) {
      if (status) {
        //获取交易记录
        this.transactionHistoryData = [];
      } else {
        this.$pub.publish("transactionModalCloseEvent");
        this.clearFilters();

        //to do list: 清理筛选条件
      }
    },
    //获取交易记录
    async fetchTransactionHistoryClick() {
      let waitArray = [];

      //push当前网络
      waitArray.push(
        fetchTransactionHistory(
          this.$store.state?.wallet?.address,
          this.walletNetworkId
        )
      );

      //获取其他网络graph数据
      const otherNetworkId = getOtherNetworks(this.walletNetworkId);
      waitArray.push(
        fetchTransactionHistory(
          this.$store.state?.wallet?.address,
          otherNetworkId
        )
      );

      const [one, two] = await Promise.all(waitArray);
      this.transactionHistoryData = [...one, ...two];

      this.transactionHistoryData = this.transactionHistoryData.sort(function (
        record1,
        record2
      ) {
        return record2.timestamp - record1.timestamp;
      });

      this.gettingData = false;
    },
    //日期范围改变
    dateRangeChange(dateRange) {
      // console.log(dateRange, "dateRangeChange");
      if (this.isMobile) {
        this.mobileFilters.dateRange = dateRange;
      } else {
        this.filters.dateRange = dateRange;
      }
    },
    //当前分页改变
    pageChange(currentPage) {
      this.currentPage = currentPage;
    },
    //清除筛选条件数据
    clearFilters() {
      this.filters = {
        chainType: null,
        transactionType: [],
        dateRange: [],
        amountRange: { from: 0, to: 0 },
      };
      this.dateValue = [];
      this.currentPag = 1;
    },
    //移动端清除筛选条件数据
    clearMobileFilters() {
      this.filters = {
        chainType: null,
        transactionType: [],
        dateRange: [],
        amountRange: { from: 0, to: 0 },
      };
      this.mobileFilters = {
        chainType: null,
        transactionType: [],
        dateRange: [],
        amountRange: { from: 0, to: 0 },
      };
      this.dateValue = [];
      this.currentPag = 1;
    },
    //打开build功能
    toBuild() {
      this.transactionModal = false;
      this.$store.commit("setCurrentAction", 1);
      this.$router.push("/build");
    },
    showFilterMenuMobileModal() {
      this.mobileFilters = _.cloneDeep(this.filters);
      this.filterMenuMobileModal = true;
    },
    applyMobileFilters() {
      this.filters = _.cloneDeep(this.mobileFilters);
      this.filterMenuMobileModal = false;
    },
  },
};
</script>

<style lang="scss">
body {
  .ivu-date-picker-transfer {
    font-family: Gilroy;

    .ivu-date-picker-with-range {
      .ivu-picker-panel-body-date {
        min-width: unset;

        .ivu-picker-panel-content-right {
          display: none;
        }
      }
    }
  }
}

#transactionModal {
  $animete-time: 0.2s;

  .ivu-modal-wrap {
    position: absolute;

    .ivu-page-item {
      border-radius: 20px;
      margin: 2px;
    }

    .ivu-modal-body {
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0px 2px 6px #deddde;
      position: relative;
      padding: 64px 93px 0;
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
        cursor: pointer;
      }

      .noTransactionBox {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 125px;
          margin-top: 188px;
        }

        .title {
          font-family: Gilroy-Bold;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: normal;
          color: #5a575c;
          margin: 40px 0 8px;
        }

        .context {
          font-family: Gilroy;
          font-size: 16px;
          font-weight: normal;
          letter-spacing: normal;
          color: #5a575c;
          margin-bottom: 32px;
        }

        .buildBtn {
          width: 134px;
          height: 40px;
          border-radius: 20px;
          background-color: #1a38f8;
          font-family: Gilroy;
          font-size: 12px;
          font-weight: bold;
          line-height: 40px;
          letter-spacing: 1.5px;
          text-align: center;
          color: #ffffff;
          cursor: pointer;
        }

        .buildBtn:hover {
          background-color: #1a38f8;
        }
      }

      .transactionBox {
        .title {
          color: #5a575c;
          font-family: Gilroy-Bold;
          font-size: 32px;
          font-weight: 700;
          line-height: 40px;
          text-align: center;
        }

        .filterMenu {
          display: flex;
          justify-content: space-between;
          margin: 32px 0;

          .box {
            display: flex;
            justify-content: space-between;
            padding-left: 16px;

            .chainSelect,
            .dateDropdown,
            .typeDropdown {
              margin-right: 8px;
            }

            .chainSelect {
              width: 100px;

              .ivu-select-selection {
                border: 1px solid #e5e5e5;
                box-shadow: none !important;

                span {
                  font-family: Gilroy-Medium;
                  font-size: 12px;
                  font-weight: 500;
                  color: #99999a;
                }

                .ivu-icon:before {
                  line-height: 32px;
                  content: "\f116";
                  color: #cacaca;
                }
              }

              .ivu-select-dropdown {
                .ivu-select-dropdown-list {
                  .ivu-select-item {
                    display: flex;
                    align-items: center;
                    font-family: Gilroy;
                    font-size: 12px;
                    color: #515a6e;

                    img {
                      width: 24px;
                      margin-right: 8px;
                    }
                  }
                }
              }

              &.hasFilter {
                .ivu-select-selection {
                  border: 1px solid #1a38f8;

                  span {
                    color: #5a575c;
                  }
                }
              }
            }

            .dateDropdown {
              font-family: Gilroy-Medium;

              * {
                box-shadow: none !important;
              }

              .ivu-date-picker-rel {
                .ivu-input-suffix {
                  cursor: pointer;

                  i:before {
                    line-height: 32px;
                    content: "\f116";
                    color: #cacaca;
                  }
                }

                input {
                  width: 144px;
                  height: 32px;
                  font-size: 12px;
                  line-height: 32px;
                  border: 1px solid #e5e5e5;
                  border-radius: 4px;
                  color: #99999a;
                }

                input::-webkit-input-placeholder {
                  color: #99999a;
                }
                input:-ms-input-placeholder {
                  color: #99999a;
                }
                input:-moz-placeholder {
                  color: #99999a;
                }
                input::-moz-placeholder {
                  color: #99999a;
                }
              }

              &.hasFilter {
                input {
                  border: 1px solid #1a38f8;
                  color: #5a575c;
                }
              }
            }

            .typeDropdown {
              font-family: Gilroy-Medium;

              .ivu-dropdown-rel {
                .typeBtn,
                .typeBtnSelected {
                  width: 103px;
                  height: 32px;
                  font-size: 12px;
                  line-height: 32px;
                  border: 1px solid #e5e5e5;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 0 8px;
                  color: #99999a;
                  cursor: pointer;

                  img {
                    width: 20px;
                    margin-top: 12px;
                    display: inline-block;
                  }
                }

                .typeBtnSelected {
                  justify-content: center;
                }
              }

              .ivu-select-dropdown {
                width: 160px;
                left: 0;
                padding-left: 6px;

                .ivu-checkbox-group {
                  display: flex;
                  flex-direction: column;

                  .ivu-checkbox-wrapper {
                    margin: 4px 0;

                    img {
                      width: 16px;
                      margin: 0 2px 0 3px;
                    }
                  }
                }
              }

              &.hasFilter {
                .ivu-dropdown-rel {
                  .typeBtn,
                  .typeBtnSelected {
                    border: 1px solid #1a38f8;
                    color: #5a575c;
                  }
                }
              }
            }

            .amountDropdown {
              font-family: Gilroy-Medium;

              .ivu-dropdown-rel {
                .amountBtn,
                .amountBtnSelected {
                  width: 144px;
                  height: 32px;
                  font-size: 12px;
                  //line-height: 32px;
                  border: 1px solid #e5e5e5;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 0 8px;
                  color: #99999a;
                  cursor: pointer;
                }
              }

              .ivu-select-dropdown {
                width: 190px;
                padding: 16px 24px;

                .ivu-dropdown-menu {
                  display: flex;
                  flex-direction: column;

                  .ivu-input-number {
                    width: 100%;
                  }
                }
              }

              &.hasFilter {
                .ivu-dropdown-rel {
                  .amountBtn,
                  .amountBtnSelected {
                    border: 1px solid #1a38f8;
                    color: #5a575c;
                  }
                }
              }
            }
            .app-dark & {
              .chainSelect,
              .dateDropdown,
              .typeDropdown,
              .amountDropdown {
                border-radius: 4px;
                border: 1px solid #f6f5f6;
                &.hasFilter {
                  border: 1px solid #3851f0;
                }
              }
              .chainSelect .ivu-select-selection {
                background: transparent !important;
                span {
                  color: #f6f5f6;
                }
              }
              .dateDropdown {
                background: transparent !important;
                .ivu-date-picker-rel {
                  .ivu-input {
                    background: transparent !important;
                    &::placeholder {
                      color: #f6f5f6;
                    }
                  }
                }
              }
              .ivu-dropdown-rel {
                .typeBtn,
                span {
                  color: #f6f5f6;
                }
              }
              .typeDropdown {
                background: transparent !important;
                &.hasFilter {
                  .ivu-dropdown-rel .typeBtnSelected {
                    border: none;
                  }
                }
                .typeBtn {
                  background: transparent !important;
                }
              }
              .amountDropdown {
                .amountBtnSelected {
                  background: transparent !important;
                }
              }
            }
          }

          .clearFiltersBtn {
            width: 166px;
            color: #1a38f8;
            opacity: 0.2;
            font-family: Gilroy-Bold;
            font-size: 12px;
            font-weight: 700;
            line-height: 32px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: not-allowed;
            text-align: center;

            &.hasFilter {
              opacity: 1;
              cursor: pointer;
            }
            .app-dark & {
              color: #3851f0 !important;
              opacity: 0.5;
            }
          }
        }
      }

      .ivu-table-wrapper {
        .ivu-table {
          .ivu-table-header {
            color: #5a575c;
            font-family: Gilroy;
            font-size: 12px;
            font-weight: 700;
            line-height: 16px;

            th {
              background: #fff;
            }
          }

          .ivu-table-body {
            overflow-x: hidden;

            .ivu-table-row {
              color: #5a575c;
              font-family: Gilroy;
              font-size: 12px;
              font-weight: 400;

              .viewInBrowser {
                color: #1a38f8;
                font-family: Gilroy;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                opacity: 0.2;
                float: right;
                cursor: pointer;

                &:hover {
                  opacity: 1;
                }
                .app-dark & {
                  color: #3851f0 !important;
                }
              }
            }
          }
        }
      }

      .customTable {
        .tabelHeader {
          min-height: 34px;
          display: flex;
          padding: 0 6px;

          .th {
            flex: 1;
            font-family: Gilroy-Bold;
            font-size: 12px;
            font-weight: 700;
            line-height: 16px;
            color: #99999a;
            display: flex;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid #f6f5f6;

            &:first-of-type {
              padding-left: 16px;
            }

            &:last-of-type {
              padding-right: 16px;
            }

            &.typeAmount {
              padding-left: 55px;
            }
            .app-dark & {
              color: #f6f5f6 !important;
            }
          }
        }

        .hasData {
          .tableBody {
            overflow-y: auto;
            overflow-x: unset;
            padding: 0 6px 6px;

            .tr {
              display: flex;
              align-items: center;
              transition: $animete-time linear;
              min-height: 48px;
              cursor: default;
              border-bottom: 1px solid #f6f5f6;
              margin-top: 0px;

              &:hover {
                box-shadow: 0 2px 6px 0 #deddde;
                border-color: white;
              }

              .td {
                flex: 1;
                font-family: Gilroy-Medium;
                font-size: 12px;
                font-weight: 500;
                line-height: 16px;
                color: #5a575c;
                padding: 5px;
                height: 100%;
                word-break: keep-all !important;
                width: calc(100% / 5);

                .app-dark & {
                  color: #e5e5e5;
                }

                &:first-of-type {
                  padding-left: 16px;
                }

                &:last-of-type {
                  text-align: center;

                  color: #1a38f8;
                  font-family: Gilroy-Bold;
                  font-weight: bold;
                  padding-right: 16px;
                  opacity: 0.2 !important;
                  cursor: pointer;
                  letter-spacing: 1.5px;
                  text-transform: uppercase;

                  &:hover {
                    opacity: 1 !important;
                  }
                  .app-dark & {
                    color: #3851f0 !important;
                  }
                }
              }

              .chain {
                font-family: Gilroy-Bold;
                display: flex;
                align-items: center;
                text-transform: capitalize;
                img {
                  width: 16px;
                  margin-right: 8px;
                }
              }

              .amount {
                span {
                  white-space: pre-wrap;
                }
              }
              .app-dark & {
                &:hover {
                  background: #050d20;
                  border: 1px solid;
                  border-color: #3851f0 !important;
                  border-left: none;
                  border-right: none;
                  box-shadow: none !important;
                }
              }
            }
          }
        }

        .notData {
          min-height: 48px;
          text-align: center;
          font-family: Gilroy;
          font-size: 14px;
          line-height: 48px;
          color: #c1c1c1;
        }
      }

      .pageBox {
        width: 100%;
        margin-top: 32px;
        text-align: center;

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
  }
}

@media only screen and (max-width: $max-phone-width) {
  #transactionModal {
    .ivu-modal-wrap {
      .ivu-modal-body {
        overflow-y: auto;
        padding: 24px 16px;

        .closeBtn {
          position: absolute;
          top: 7px;
          right: 7px;

          #closeSvg {
            width: 26px;
          }
        }

        .noTransactionBox {
          display: flex;
          flex-direction: column;
          align-items: center;

          img {
            width: 120px;
            margin-top: 96px;
          }

          .title {
            font-family: Gilroy-Bold;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: normal;
            color: #5a575c;
            margin: 40px 0 8px;
          }

          .context {
            font-size: 16px;
            margin-bottom: 32px;
            text-align: center;
          }

          .buildBtn {
            width: 100%;
            height: 40px;
            font-size: 12px;
          }

          .buildBtn:hover {
            background-color: #1a38f8;
          }
        }

        .transactionBox {
          .filterMenuMobile {
            display: flex;
            align-items: center;
            font-family: Gilroy-Bold;
            font-size: 14px;
            line-height: 18px;
            color: #99999a;
            margin-bottom: 16px;

            img {
              width: 24px;
              height: 24px;
              margin-right: 8px;
              padding: 5px 4px 4px 5px;
              border: solid 1px #e5e5e5;
              border-radius: 50%;
            }
            .app-dark & {
              color: #3851f0 !important;
            }
          }
        }

        .ivu-table-wrapper {
          .ivu-table {
            .ivu-table-header {
              color: #5a575c;
              font-family: Gilroy;
              font-size: 12px;
              font-weight: 700;
              line-height: 16px;

              th {
                background: #fff;
              }
            }

            .ivu-table-body {
              overflow-x: hidden;

              .ivu-table-row {
                color: #5a575c;
                font-family: Gilroy;
                font-size: 12px;
                font-weight: 400;

                .viewInBrowser {
                  color: #1a38f8;
                  font-family: Gilroy;
                  font-size: 12px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  opacity: 0.2;
                  float: right;

                  &:hover {
                    opacity: 1;
                  }
                }
              }
            }
          }
        }

        .customTable {
          .tabelHeader {
            min-height: 34px;
            display: flex;
            padding: 0 6px;

            .th {
              flex: 1;
              font-size: 12px;
              font-weight: 700;
              line-height: 16px;
              color: #99999a;
              display: flex;
              align-items: center;
              padding: 5px;
              border-bottom: 1px solid #f6f5f6;

              &:first-of-type {
                padding-left: 16px;
              }

              &:last-of-type {
                flex: 1;
                padding-right: 16px;
              }

              &.date {
                padding-left: 20px;
              }
            }
          }

          .hasData {
            .tableBody {
              overflow-y: auto;
              overflow-x: unset;
              padding: 0 6px 6px;

              .tr {
                display: flex;
                align-items: center;
                transition: $animete-time linear;
                min-height: 48px;
                cursor: default;
                border-bottom: 1px solid #f6f5f6;
                margin-top: 0px;

                &:hover {
                  box-shadow: 0 2px 6px 0 #deddde;
                  border-color: white;
                }

                .td {
                  flex: 1;
                  font-family: Gilroy-Regular;
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 18px;
                  color: #5a575c;
                  padding: 5px;
                  height: 100%;
                  word-break: break-all;
                  width: auto;

                  &:first-of-type {
                    padding-left: 0px;
                  }

                  &:last-of-type {
                    text-align: center;
                    flex: 0.2;

                    color: #1a38f8;
                    font-family: Gilroy-Bold;
                    font-weight: bold;
                    padding-right: 16px;
                    opacity: 0.2 !important;
                    cursor: pointer;

                    &:hover {
                      opacity: 1 !important;
                    }
                    .app-dark & {
                      color: #1a38f8 !important;
                    }
                  }
                }

                .chain {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-transform: capitalize;
                  flex: 1.4;

                  img {
                    width: 16px;
                    margin-right: 5px;
                  }
                }

                .date {
                  flex: 1.8;
                  // width: 90px;
                  .app-dark & {
                    span {
                      &:last-child {
                        font-size: 12px;
                        line-break: 16px;
                        color: #99999a !important;
                      }
                    }
                  }
                }

                .amount {
                  span {
                    white-space: pre-wrap;
                  }
                }

                .typeAmount {
                  display: flex;
                  flex-direction: column;
                  flex: 2;

                  .app-dark & {
                    span {
                      &:last-child {
                        font-size: 12px;
                        line-break: 16px;
                        color: #99999a !important;
                      }
                    }
                  }
                }
              }
            }
          }

          .notData {
            min-height: 48px;
            text-align: center;
            font-family: Gilroy;
            font-size: 14px;
            line-height: 48px;
            color: #c1c1c1;
          }
        }

        .pageBox {
          width: 100%;
          margin-top: 32px;
          text-align: center;

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
    }

    .filterMenuMobileModal {
      .ivu-modal-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
          width: 100% !important;
          height: 100%;
          top: 0 !important;
          margin: 0;
          .app-dark & {
            .ivu-icon.ivu-icon-ios-close {
              color: #ffffff;
            }
          }

          .ivu-modal-content {
            height: 100%;
            border-radius: 6px;

            .ivu-modal-body {
              height: 100%;
              padding: 24px;
              box-shadow: unset;

              .titleBox {
                display: flex;
                align-items: center;
                font-family: Gilroy-Bold;
                font-size: 14px;
                color: #99999a;
                margin-bottom: 16px;

                .clearFiltersBtn {
                  font-weight: 700;
                  color: #1a38f8;
                  margin-left: 16px;
                  font-size: 12px;
                  line-height: 16px;
                  letter-spacing: 1.5px;
                  .app-dark & {
                    color: #3851f0 !important;
                  }
                }
                .app-dark & {
                  color: #ffffff;
                }
              }

              .filterBox {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .chainSelect,
                .dateDropdown,
                .typeDropdown,
                .amountDropdown {
                  margin-bottom: 16px;
                }

                .chainSelect {
                  width: 100%;

                  .ivu-select-selection {
                    height: 80px;
                    border: 1px solid #e5e5e5;
                    box-shadow: none !important;

                    span {
                      height: 80px;
                      line-height: 80px;
                      font-family: Gilroy-Bold;
                      font-size: 16px;
                      font-weight: 700;
                      color: #99999a;
                    }

                    .ivu-icon:before {
                      line-height: 32px;
                      content: "\f116";
                      color: #cacaca;
                    }
                    .app-dark & {
                      background: transparent !important;
                      border: 1px solid;
                      border-color: rgba(
                        $color: #99999a,
                        $alpha: 0.5
                      ) !important;
                      .ivu-select-placeholder {
                        color: #3851f0;
                      }
                      .ivu-select-selected-value {
                        color: #ffffff !important;
                      }
                      .ivu-select-arrow {
                        &.ivu-icon:before {
                          color: #3851f0;
                        }
                      }
                    }
                  }

                  .ivu-select-dropdown {
                    .ivu-select-dropdown-list {
                      .ivu-select-item {
                        display: flex;
                        align-items: center;
                        font-family: Gilroy-Bold;
                        font-weight: 700;
                        font-size: 16px;
                        color: #515a6e;

                        img {
                          width: 24px;
                          margin-right: 8px;
                        }
                        .app-dark & {
                          color: #ffffff !important;
                          &.ivu-select-item-focus {
                            background: rgba($color: #7eb5ff, $alpha: 0.1);
                            color: #1a38f8 !important;
                          }
                        }
                      }
                    }
                  }

                  &.hasFilter {
                    .ivu-select-selection {
                      border: 1px solid #1a38f8;

                      span {
                        color: #5a575c;
                      }
                      .app-dark & {
                        border-color: #1a38f8 !important;
                      }
                    }
                  }
                }

                .dateDropdown {
                  font-family: Gilroy-Bold;

                  * {
                    box-shadow: none !important;
                  }

                  .ivu-date-picker-rel {
                    .ivu-input-suffix {
                      cursor: pointer;

                      i:before {
                        line-height: 80px;
                        content: "\f116";
                        color: #cacaca;
                      }
                    }

                    input {
                      height: 80px;
                      font-size: 16px;
                      line-height: 32px;
                      border: 1px solid #e5e5e5;
                      border-radius: 4px;
                      color: #99999a;
                    }

                    input::-webkit-input-placeholder {
                      color: #99999a;
                    }
                    input:-ms-input-placeholder {
                      color: #99999a;
                    }
                    input:-moz-placeholder {
                      color: #99999a;
                    }
                    input::-moz-placeholder {
                      color: #99999a;
                    }
                  }
                  .app-dark & {
                    .ivu-date-picker-rel {
                      color: #3851f0 !important;
                      .ivu-input-prefix i,
                      .ivu-input-suffix i {
                        &:before {
                          color: #3851f0 !important;
                        }
                      }
                      input {
                        font-family: Gilroy-Bold;
                        font-weight: 700;
                        background: transparent !important;
                        border: 1px solid rgba($color: #99999a, $alpha: 0.5) !important;
                        &::placeholder,
                        &::-webkit-input-placeholder,
                        &::-moz-placeholder,
                        &:-moz-placeholder,
                        &:-ms-input-placeholder {
                          color: #3851f0 !important;
                        }
                      }
                    }
                  }

                  &.hasFilter {
                    input {
                      border: 1px solid #1a38f8;
                      color: #5a575c;
                      .app-dark & {
                        border-color: #1a38f8 !important;
                      }
                    }
                  }
                }

                .typeDropdown {
                  font-family: Gilroy-Medium;

                  .ivu-dropdown-rel {
                    .typeBtn,
                    .typeBtnSelected {
                      font-family: Gilroy-Bold;
                      font-weight: 700;
                      width: 100%;
                      height: 80px;
                      font-size: 16px;
                      line-height: 32px;
                      border: 1px solid #e5e5e5;
                      border-radius: 4px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 0 8px;
                      color: #99999a;
                      cursor: pointer;

                      img {
                        width: 20px;
                        margin-top: 12px;
                        display: inline-block;
                      }
                    }
                    .app-dark & {
                      .typeBtn {
                        color: #3851f0 !important;
                        background: transparent !important;
                        border: 1px solid rgba($color: #99999a, $alpha: 0.5) !important;
                      }
                    }
                  }

                  .ivu-select-dropdown {
                    width: calc(100% - 48px);
                    left: 0;
                    padding-left: 6px;

                    .ivu-checkbox-group {
                      display: flex;
                      flex-direction: column;

                      .ivu-checkbox-wrapper {
                        margin: 4px 0;

                        img {
                          width: 16px;
                          margin: 0 2px 0 3px;
                        }
                      }
                    }
                  }

                  &.hasFilter {
                    .ivu-dropdown-rel {
                      .typeBtn,
                      .typeBtnSelected {
                        border: 1px solid #1a38f8;
                        color: #5a575c;
                      }
                    }
                  }
                }

                .amountDropdown {
                  font-family: Gilroy-Bold;
                  font-weight: 700;

                  .ivu-dropdown-rel {
                    .amountBtn,
                    .amountBtnSelected {
                      width: 100%;
                      height: 80px;
                      font-size: 16px;
                      border: 1px solid #e5e5e5;
                      border-radius: 4px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 0 8px;
                      color: #99999a;
                      cursor: pointer;
                    }
                    .app-dark & {
                      .amountBtnSelected {
                        color: #3851f0 !important;
                        background: transparent !important;
                        border: 1px solid rgba($color: #99999a, $alpha: 0.5) !important;
                      }
                      .amountBtn {
                        color: #ffffff !important;
                      }
                    }
                  }

                  .ivu-select-dropdown {
                    width: calc(100% - 48px);
                    padding: 16px 24px;

                    .ivu-dropdown-menu {
                      display: flex;
                      flex-direction: column;

                      .ivu-input-number {
                        width: 100%;
                      }
                    }
                  }

                  &.hasFilter {
                    .ivu-dropdown-rel {
                      .amountBtn,
                      .amountBtnSelected {
                        border: 1px solid #1a38f8;
                        color: #5a575c;
                      }
                    }
                  }
                }

                .applyFilterBtn {
                  width: 100%;
                  height: 40px;
                  line-height: 40px;
                  font-family: Gilroy-Bold;
                  font-size: 12px;
                  text-align: center;
                  color: #ffffff;
                  background-color: rgba(126, 181, 255, 0.2);
                  border-radius: 20px;
                  letter-spacing: 1.5px;
                }

                .mobileFiltersChange {
                  background-color: #1a38f8;
                  .app-dark & {
                    background-color: #3851f0;
                  }
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
