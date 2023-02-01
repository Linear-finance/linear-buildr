<!-- swap多步 -->

<template>
  <div id="watingEnhanceSwapNew">
    <div
      class="close"
      @click.stop="setDefaultTab"
      v-if="
        !confirmTransactionStatus ||
        transactionErrMsg ||
        confirmTransactionStep > waitProcessArray.length - 1
      "
    >
      <img v-if="isMobile" src="@/static/icon-cancel.svg" />
      <closeSvg v-else></closeSvg>
    </div>

    <Tabs v-model="actionTabs" class="actionTabs">
      <TabPane name="m0" class="checkPage">
        <div class="tabContent">
          <div class="contentTitle">…We are preparing the contract...</div>

          <div class="contentIcon">
            <img
              v-if="theme === 'light'"
              src="@/static/transferProgress/swap_check_icon.svg"
            />
            <img
              v-else
              src="@/static/dark-theme/transferProgress/swap_check_icon.svg"
            />
          </div>

          <div class="contentStep">
            <div class="stepBox">
              <div
                v-for="(item, index) in checkStatus.stepArray"
                :key="index"
                class="stepItem"
              >
                <!-- 垂直连接线 -->
                <div
                  class="line"
                  v-if="index < checkStatus.stepArray.length - 1"
                ></div>

                <!-- index大于当前进度显示默认 -->
                <img
                  :key="Math.random()"
                  class="stepIcon"
                  v-if="index > checkStatus.stepIndex"
                  src="@/static/transferProgress/default.svg"
                />

                <!-- index小于当前进度 -->
                <template v-else-if="index < checkStatus.stepIndex">
                  <!-- 有错误显示灰色完成 -->
                  <img
                    :key="Math.random()"
                    class="stepIcon"
                    v-if="checkStatus.stepError"
                    src="@/static/transferProgress/completed_disable.svg"
                  />

                  <!-- 没错误显示正确完成 -->
                  <img
                    :key="Math.random()"
                    class="stepIcon"
                    v-else
                    src="@/static/transferProgress/completed.svg"
                  />
                </template>

                <!-- index等于当前进度 -->
                <template v-else>
                  <!-- 第二步未安装目标钱包 -->
                  <img
                    :key="Math.random()"
                    class="stepIcon"
                    v-if="
                      checkStatus.stepIndex == 1 && checkStatus.stepType == 2
                    "
                    src="@/static/transferProgress/option.svg"
                  />

                  <!-- 有错误显示失败 -->
                  <img
                    :key="Math.random()"
                    class="stepIcon"
                    v-else-if="checkStatus.stepError"
                    src="@/static/transferProgress/failed.svg"
                  />

                  <!-- 没有错误显示加载 -->
                  <img
                    :key="Math.random()"
                    class="stepIcon loading"
                    v-else
                    src="@/static/transferProgress/loading.svg"
                  />
                </template>

                <div
                  class="stepInfo"
                  :class="{
                    active: checkStatus.stepIndex == index,
                  }"
                >
                  {{ item }}

                  <!-- 检查钱包插件 -->
                  <div
                    class="stepJump"
                    v-if="
                      index == checkStatus.stepIndex &&
                      checkStatus.stepIndex == 1 &&
                      checkStatus.stepType == 2
                    "
                  >
                    <div class="jumpInfo" @click="stepClickHandle">
                      {{ checkStatus.stepInstall }}
                      <img
                        :key="Math.random()"
                        class="jumpIcon"
                        src="@/static/transferProgress/arrow_right active.svg"
                      />
                    </div>

                    <div
                      v-if="isBinanceNetwork(targetNetworkId)"
                      class="jumpInfo"
                      @click="changeTargetWalletInfo"
                    >
                      Or I have connected my MetaMask to BSC network
                      <img
                        :key="Math.random()"
                        class="jumpIcon"
                        src="@/static/transferProgress/arrow_right active.svg"
                      />
                    </div>
                  </div>

                  <!-- 当前错误信息 -->
                  <div
                    v-if="
                      checkStatus.stepIndex == index && checkStatus.stepError
                    "
                    class="stepError"
                    :class="{
                      clickable: checkStatus.stepType == 1,
                    }"
                    @click="stepClickHandle"
                  >
                    {{ checkStatus.stepError }}

                    <!-- 可点击错误icon -->
                    <img
                      :key="Math.random()"
                      v-if="checkStatus.stepType == 1"
                      class="errorIcon"
                      src="@/static/transferProgress/arrow_right_error.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="checkStatus.stepType != -1"
          class="refreshBtn"
          @click="checkPrepare(checkStatus.stepIndex)"
        >
          refresh
          <img src="@/static/transferProgress/refresh.svg" />
        </div>
      </TabPane>

      <TabPane name="m1" class="waitingPage">
        <div class="waitImg">
          <!-- 已完成 -->
          <img
            v-if="confirmTransactionStep > waitProcessArray.length - 1"
            class="course completed"
            src="@/static/transferProgress/transaction_completed.svg"
          />

          <!-- 已确认或错误 -->
          <img
            v-else-if="confirmTransactionStatus || transactionErrMsg"
            class="course"
            src="@/static/transferProgress/wellet_metamask.svg"
          />
          <!-- 需要approve -->

          <template v-else-if="shouldApprove">
            <thumbnail
              class="course"
              v-if="isEthereumNetwork(sourceNetworkId)"
              thumb="transferProgress/course/approve_eth_mainnet_thumb.png"
              src="transferProgress/course/approve_eth_mainnet.png"
            />

            <thumbnail
              v-else
              class="course"
              thumb="transferProgress/course/approve_bsc_mainnet_thumb.png"
              src="transferProgress/course/approve_bsc_mainnet.png"
            />
          </template>

          <!-- 在切链状态 -->
          <template v-else-if="confirmTransactionChainChanging">
            <thumbnail
              v-if="isEthereumNetwork(sourceNetworkId)"
              class="course"
              thumb="transferProgress/course/switch_bsc_mainnet_thumb.png"
              src="transferProgress/course/switch_bsc_mainnet.png"
            />
            <thumbnail
              v-else
              class="course"
              thumb="transferProgress/course/switch_eth_mainnet_thumb.png"
              src="transferProgress/course/switch_eth_mainnet.png"
            />
          </template>

          <!-- 等待确认 -->
          <template v-else-if="!confirmTransactionStatus">
            <thumbnail
              v-if="isEthereumNetwork(walletNetworkId)"
              class="course"
              thumb="transferProgress/course/confirm_eth_mainnet_thumb.png"
              src="transferProgress/course/confirm_eth_mainnet.png"
            />
            <thumbnail
              v-else
              class="course"
              thumb="transferProgress/course/confirm_bsc_mainnet_thumb.png"
              src="transferProgress/course/confirm_bsc_mainnet.png"
            />
          </template>
        </div>

        <div class="waitTitle">
          <!-- 已完成 -->
          <template v-if="confirmTransactionStep > waitProcessArray.length - 1">
            Congratulations!</template
          >

          <!-- 有错误 -->
          <template v-else-if="transactionErrMsg">
            Oops! Something is wrong.
          </template>
          <!-- 交易中 -->
          <template v-else-if="confirmTransactionStatus"> Loading... </template>
          <!-- 需要approve -->
          <template v-else-if="shouldApprove">
            Approve address with Metamask</template
          >
          <!-- 在切链状态 -->
          <template v-else-if="confirmTransactionChainChanging">
            Switch to
            <template v-if="isEthereumNetwork(sourceNetworkId)"
              >Binance</template
            >
            <template v-else>Ethereum</template>
            Network
          </template>
          <!-- 等待确认 -->
          <template v-else-if="!confirmTransactionStatus">
            Confirm with Metamask
          </template>
        </div>

        <div class="waitDesc" :class="{ error: transactionErrMsg }">
          <!-- 已完成 -->
          <template v-if="confirmTransactionStep > waitProcessArray.length - 1">
            Your transaction has been processed.</template
          >

          <!-- 有错误 -->
          <template v-else-if="transactionErrMsg">
            {{ transactionErrMsg }}
          </template>

          <!-- 在切链状态 -->
          <template
            v-else-if="
              confirmTransactionChainChanging &&
              isEthereumNetwork(sourceNetworkId)
            "
          >
            If you do not have BSC
            <template v-if="isMainnetNetwork(sourceNetworkId)"
              >Mainnet</template
            >
            <template v-else>Testnet</template>
            , please setup and change
          </template>

          <!-- 等待确认 -->
          <template
            v-else-if="
              !confirmTransactionChainChanging && !confirmTransactionStatus
            "
          >
            Check the transaction under MetaMask Activity if it doesn't pop up.
          </template>
        </div>

        <div
          v-if="
            confirmTransactionChainChanging &&
            isEthereumNetwork(sourceNetworkId)
          "
          class="stepNetwork"
          @click.stop="stepNetwork"
        >
          How to Setup <img src="@/static/info_white.svg" />
        </div>

        <!-- 当前是freeze,开始等待blocks,不在approve,不是错误 -->
        <div
          class="blockCompletedBox"
          v-if="startWaitingBlocks && !shouldApprove && !transactionErrMsg"
        >
          <div class="blockBox">
            <div class="blocks">
              <span
                v-for="(item, index) in tansactionBlocks.total"
                :key="index"
                class="blockItem"
                :class="{
                  active: tansactionBlocks.confirmations > index,
                }"
              ></span>
            </div>
            <div class="blocknInfo">
              <span class="confirmations">{{
                tansactionBlocks.confirmations
              }}</span>
              / {{ tansactionBlocks.total }} blocks completed
            </div>
          </div>

          <span
            class="refreshBtn"
            :class="{ disabled: !canRefreshBlocks }"
            @click.stop="refreshBlock"
          >
            <svg
              :class="{ loading: !canRefreshBlocks }"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <g fill="none" fill-rule="evenodd">
                <g fill="#99999a" class="color">
                  <g>
                    <g>
                      <g>
                        <path
                          d="M3.56 9.162c.494 2.534 2.88 4.204 5.331 3.73 1.467-.285 2.664-1.288 3.25-2.655l-2.376.46c-.248.048-.49-.107-.566-.351l-.015-.058c-.05-.257.096-.506.33-.582l.057-.014 3.185-.617c.248-.048.49.106.566.35l.015.058.663 3.4c.054.278-.119.545-.386.597-.248.049-.49-.105-.567-.35l-.015-.058-.336-1.728c-.786 1.313-2.078 2.255-3.61 2.552-2.984.578-5.891-1.456-6.493-4.545-.054-.278.118-.545.386-.597.267-.052.527.13.581.408zm10.188-3.365c.097.265-.032.556-.288.65-.255.093-.541-.046-.638-.312-.886-2.426-3.505-3.703-5.85-2.852-1.108.402-1.985 1.218-2.479 2.256l2.065-.75c.238-.086.501.029.615.258l.023.055c.09.247-.015.515-.236.626l-.053.023-3.049 1.107c-.237.086-.5-.028-.614-.257l-.024-.055L2.032 3.29c-.097-.265.032-.556.288-.65.238-.086.501.028.615.257l.024.055.718 1.972C4.3 3.719 5.334 2.789 6.622 2.32c2.857-1.036 6.047.52 7.126 3.476z"
                          transform="translate(-544 -904) translate(466 904) translate(78)"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </svg>

            Refresh
          </span>
        </div>

        <div class="processBar">
          <div class="itemBox">
            <div
              v-for="(item, index) in waitProcessArray"
              :key="index"
              class="item"
            >
              <div class="imgBox">
                <transition-group name="img-fade">
                  <!-- 已经完成的进度 -->
                  <img
                    key="1"
                    v-if="confirmTransactionStep < index"
                    src="@/static/transferProgress/default.svg"
                  />

                  <!-- 未完成,没错误,在当前进度 -->

                  <template
                    v-else-if="
                      confirmTransactionStep == index && !transactionErrMsg
                    "
                  >
                    <img
                      key="2"
                      class="loading"
                      src="@/static/transferProgress/loading.svg"
                    />

                    <!-- 不是移动端 -->
                    <template v-if="!isMobile">
                      <!-- 切链 -->
                      <template v-if="confirmTransactionChainChanging">
                        <img
                          v-if="isEthereumNetwork(targetNetworkId)"
                          key="23"
                          class="walletType"
                          src="@/static/transferProgress/eth_network.svg"
                        />
                        <img
                          v-if="isBinanceNetwork(targetNetworkId)"
                          key="24"
                          class="walletType"
                          src="@/static/transferProgress/bsc_network.svg"
                        />
                      </template>

                      <!-- 不是切链 -->
                      <template v-else>
                        <img
                          v-if="isEthereumNetwork(confirmTransactionNetworkId)"
                          key="23"
                          class="walletType"
                          src="@/static/transferProgress/eth_network.svg"
                        />
                        <img
                          v-if="isBinanceNetwork(confirmTransactionNetworkId)"
                          key="24"
                          class="walletType"
                          src="@/static/transferProgress/bsc_network.svg"
                        />
                      </template>
                    </template>
                  </template>

                  <!-- 没完成,当前进度有错误 -->
                  <img
                    key="3"
                    v-else-if="
                      confirmTransactionStep == index && transactionErrMsg
                    "
                    src="@/static/transferProgress/failed.svg"
                  />

                  <!-- 已完成进度没错误 -->
                  <img
                    key="4"
                    v-else-if="
                      confirmTransactionStep > index && !transactionErrMsg
                    "
                    src="@/static/transferProgress/completed.svg"
                  />

                  <!-- 已完成进度有错误 -->
                  <img
                    key="5"
                    v-else-if="
                      confirmTransactionStep > index && transactionErrMsg
                    "
                    src="@/static/transferProgress/completed_disable.svg"
                  />
                </transition-group>
              </div>
              <div
                class="text"
                :class="{
                  current: confirmTransactionStep == index,
                }"
              >
                {{ item }}
              </div>

              <!-- 不是移动端 -->
              <template v-if="!isMobile">
                <!-- 当前进度,已确认,没有错误 -->
                <div
                  class="view"
                  v-if="
                    confirmTransactionStep == index &&
                    confirmTransactionStatus &&
                    !transactionErrMsg
                  "
                  @click.stop="
                    openBlockchainBrowser(
                      confirmTransactionHash,
                      confirmTransactionNetworkId
                    )
                  "
                >
                  <template
                    v-if="isEthereumNetwork(confirmTransactionNetworkId)"
                  >
                    View Etherscan
                  </template>
                  <template
                    v-else-if="isBinanceNetwork(confirmTransactionNetworkId)"
                  >
                    View Bscscan
                  </template>

                  <img src="@/static/arrow_right.svg" />
                </div>
                <!-- 当前进度有错误 -->
                <div
                  v-else-if="
                    confirmTransactionStep == index && transactionErrMsg
                  "
                  class="tryAgain"
                  @click.stop="waitProcessFlow"
                >
                  try again
                </div>
              </template>
            </div>
          </div>

          <div class="dividerBox">
            <ul>
              <li
                v-for="(item, index) in waitProcessArray"
                :key="index"
                class="divider"
                :class="{
                  has: index < waitProcessArray.length - 1,
                  active: confirmTransactionStep > index && !transactionErrMsg,
                }"
                :style="{
                  left: `calc(100% / ${waitProcessArray.length} /2)`,
                }"
              ></li>
            </ul>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import _ from "lodash";
import { openBlockchainBrowser } from "@/common/utils";
import closeSvg from "@/components/svg/close";
import {
  SUPPORTED_WALLETS,
  isEthereumNetwork,
  isBinanceNetwork,
  getOtherNetworks,
  isMainnetNetwork,
  WALLET_EXTENSIONS,
  DEFAULT_GAS_LIMIT,
  bufferGasLimit,
  unFormatGasPrice,
  getBinanceNetwork,
  getEthereumNetwork,
  isTestnetNetwork,
  isDevNetwork,
} from "@/assets/linearLibrary/linearTools/network";
import api from "@/api";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { bn2n, bnAdd, bnSub, n2bn } from "@/common/bnCalc";
import { providers } from "ethers";
import Web3Connector from "~/assets/linearLibrary/linearJs/web3Connector";
import signers from "~/assets/linearLibrary/linearJs/lib/signers";
import {
  BUILD_PROCESS_SETUP,
  BUILD_PROCESS_SETUP_MOBILE,
} from "@/assets/linearLibrary/linearTools/constants/process";
import {
  formatAddressToByte32,
  formatStringToByte32,
  abbreviateAddress,
} from "@/assets/linearLibrary/linearTools/format";
import { BigNumber } from "ethers";
import { lnr } from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";
import currenciesList from "@/common/currency";

export default {
  name: "watingEnhanceSwapNew",
  components: {
    closeSvg,
  },
  props: {
    //需要swap的数量
    amount: {
      type: Number,
      default: 0,
    },

    //需要swap的token
    currency: {
      type: String,
      default: "LINA", //LINA, lUSD
    },

    //swap类型
    swapType: {
      type: Number,
      default: 0, //0=only swap,1=swap and build
    },
  },

  data() {
    return {
      BUILD_PROCESS_SETUP,
      SUPPORTED_WALLETS,

      openBlockchainBrowser,
      isEthereumNetwork,
      isBinanceNetwork,
      isMainnetNetwork,
      abbreviateAddress,

      actionTabs: "m0", //m0检查页,m1交易页

      swapNumber: 0,

      checkStatus: {
        stepIndex: 0, //当前检查步骤
        stepError: "", //错误信息
        stepInstall: "", //插件安装信息
        stepType: -1, //步骤类型,-1默认,0显示错误文本,1余额不足,2未安装钱包插件
        stepArray: [], //检测进度组
      },

      sourceGasPrice: "",
      targetGasPrice: "",

      freezeFee: "", //冻结费用
      unfreezeFee: "", //解锁费用

      tansactionBlocks: {
        blockNumber: 0,
        confirmations: 0, //当前确认交易块
        total: 15, //总需确认块数量
      },

      // waitProcessArray: [
      //     "Approve address",
      //     "Contract on ETH",
      //     "Contract on BSC"
      // ], //等待交易进度组
      waitProcessArray: [], //等待交易进度组
      waitProcessFlow: Function, //逻辑流
      confirmTransactionStep: -1, //当前确认步骤
      freezeSuccessHash: "", //冻结成功hash
      sourceWalletType: "", //原始钱包类型
      targetWalletType: "", //目标钱包类型
      sourceNetworkId: "", //原始网络id
      targetNetworkId: "", //目标网络id
      confirmTransactionNetworkId: "", //当前确认时网络
      sourceWalletAddress: "", //原始钱包地址
      targetWalletAddress: "", //目标钱包地址
      transactionErrMsg: "", //交易错误信息
      chainChangedStatus: false, //是否已完成切链
      confirmTransactionChainChanging: false, //是否在切链状态
      confirmTransactionStatus: false, //确认交易状态
      shouldApprove: false, //是否需要approve
      startWaitingBlocks: false, //开始的等待获取blocks
      canRefreshBlocks: true, //是否可以刷新blocks

      chainChangeTokenFromUnfreeze: "", //解冻切换钱包事件监听id
      chainChangeFromSubscribe: "", //切换钱包事件监听id
      walletChangeAccountFromSubscribe: "", //切换钱包地址时间监听id
      waitChainChangeLoopId: "", //等待切链循环id
      waitingBlockConfirmationsLoopId: "", //等待块确认循环id
      getPendingProcessLoopId: "", //等待获取交易数据循环id
    };
  },
  watch: {
    currentWalletType() {},
    hasBinanceWallet() {},
    isMobile() {},
    walletAddress() {},
    walletNetworkId() {},
    // isEthereumNetwork() {},
    // isBinanceNetwork() {}
  },
  computed: {
    currentWalletType() {
      return this.$store.state?.walletType;
    },

    hasBinanceWallet() {
      return window.BinanceChain;
    },

    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },

    // isEthereumNetwork() {
    //     return isEthereumNetwork(this.walletNetworkId);
    // },

    // isBinanceNetwork() {
    //     return isBinanceNetwork(this.walletNetworkId);
    // },

    isMobile() {
      return this.$store.state?.isMobile;
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    theme() {
      return this.$store.state.theme;
    },
    swapUnfreezeContinue() {
      return this.$store.state?.swapUnfreezeContinue;
    },
  },
  created() {
    this.$store.commit("setIsTransaction", true);
    this.swapNumber = this.amount;
    this.initStep();
  },
  mounted() {
    this.checkPrepare();
    this.swapUnfreezeContinue = this.$store.state?.swapUnfreezeContinue;

    if (this.swapUnfreezeContinue) {
      const unfreezeDatas = this.$store.state?.swapUnfreezeDatas;
      this.confirmTransactionStep = unfreezeDatas.confirmTransactionStep;
      this.freezeSuccessHash = unfreezeDatas.freezeSuccessHash;
      this.sourceWalletType = unfreezeDatas.sourceWalletType;
      this.sourceNetworkId = getOtherNetworks(this.walletNetworkId)[0];
      this.confirmTransactionNetworkId = unfreezeDatas.targetNetworkId;
      this.sourceWalletAddress = unfreezeDatas.sourceWalletAddress;
      this.targetNetworkId = this.walletNetworkId;
      this.waitProcessArray = unfreezeDatas.waitProcessArray ?? [];
      this.swapNumber = unfreezeDatas.swapNumber;
      this.targetGasPrice = unfreezeDatas.targetGasPrice;
      this.chainChangedStatus = true;
      this.confirmTransactionChainChanging = false;

      this.checkContract();
    }
  },
  methods: {
    //初始化进度信息
    initStep() {
      this.checkStatus.stepArray = [];

      this.targetNetworkId = getOtherNetworks(this.walletNetworkId);
      const sourceStep = isEthereumNetwork(this.walletNetworkId)
        ? "Checking the amount of ETH on Metamask"
        : isBinanceNetwork(this.walletNetworkId)
        ? "Checking your BNB balance on BSC"
        : "";

      // const extention = isEthereumNetwork(this.targetNetworkId)
      //     ? "Checking your MetaMask Wallet Extention"
      //     : isBinanceNetwork(this.targetNetworkId)
      //     ? "Checking your Binance Chain Wallet Extension"
      //     : "";

      const targetStep = isEthereumNetwork(this.targetNetworkId)
        ? "Checking the amount of ETH on Metamask"
        : isBinanceNetwork(this.targetNetworkId)
        ? "Checking your BNB balance on BSC"
        : "";

      this.checkStatus.stepArray.push(sourceStep);
      // this.checkStatus.stepArray.push(extention);
      this.checkStatus.stepArray.push(targetStep);
    },

    //检查准备工作
    async checkPrepare(currentStep = 0) {
      try {
        //记录gas price
        this.sourceGasPrice =
          this.$store.state?.sourceGasDetails?.price || 50 * 1000000000;
        this.targetGasPrice =
          this.$store.state?.targetGasDetails?.price || 50 * 1000000000;

        // this.targetWalletAddress = this.walletAddress;
        // this.targetWalletType = SUPPORTED_WALLETS.BINANCE_CHAIN;
        // await this.checkContract();
        // this.actionTabs = "m1";

        // return;

        this.checkStatus.stepIndex = currentStep;
        this.checkStatus.stepError = "";
        this.checkStatus.stepType = -1;
        if (this.swapUnfreezeContinue) {
          this.targetNetworkId = this.walletNetworkId;
          this.sourceNetworkId = getOtherNetworks(this.walletNetworkId)[0];
        } else {
          //记录原始网络类型
          this.sourceNetworkId = this.walletNetworkId;

          //记录目标网络id
          this.targetNetworkId = getOtherNetworks(this.walletNetworkId)[0];
        }

        //记录原始钱包类型
        this.sourceWalletType = this.currentWalletType;

        //记录原始钱包地址
        this.sourceWalletAddress = this.walletAddress.toLocaleLowerCase();

        //单钱包连接
        this.targetWalletAddress = this.walletAddress;
        this.targetWalletType = SUPPORTED_WALLETS.METAMASK;

        if (currentStep < 1) {
          await this.checkSounrceBalance();
          if (this.checkStatus.stepType != -1) return;
        }

        //双钱包连接
        // if (currentStep < 2) {
        //     //连接目标钱包
        //     await this.connectToTargetWallet();
        //     if (this.checkStatus.stepType != -1) return;
        // }
        // this.checkStatus.stepIndex++;

        if (currentStep < 2) {
          //skip check target network step if start from claimng freeze tokens
          if (!this.swapUnfreezeContinue) {
            await this.checkTargetBalace();
          }
          if (this.checkStatus.stepType != -1) return;

          await this.checkContract();
          // this.actionTabs = "m1";
        }
      } catch (error) {
        //自定义错误
        if (
          _.has(error, "code") &&
          [100001, 100002, 100003, 100004].includes(error.code)
        ) {
          this.checkStatus.stepError = error.message;
        } else {
          console.log(error, "checkPrepare error");
          //通用错误
          this.checkStatus.stepError =
            "Something went wrong, please try again.";
        }

        this.checkStatus.stepType = 0;
      }
    },

    async checkContract() {
      try {
        //移动端更换进度设置
        this.BUILD_PROCESS_SETUP = this.isMobile
          ? { ...BUILD_PROCESS_SETUP_MOBILE }
          : { ...BUILD_PROCESS_SETUP };

        //如果是继续的流程
        if (this.swapUnfreezeContinue && this.isMobile) {
          if (isEthereumNetwork(this.targetNetworkId)) {
            this.BUILD_PROCESS_SETUP.UNFREEZE =
              BUILD_PROCESS_SETUP.UNFREEZE + "ETH";
          } else if (isBinanceNetwork(this.targetNetworkId)) {
            this.BUILD_PROCESS_SETUP.UNFREEZE =
              BUILD_PROCESS_SETUP.UNFREEZE + "BSC";
          }
        } else {
          //清空之前数据
          this.waitProcessArray = [];
          this.waitProcessFlow = null;

          let LnProxy,
            LnBridge = lnrJSConnector.lnrJS.LnErc20Bridge;
          if (isEthereumNetwork(this.sourceNetworkId)) {
            // LnProxy = lnrJSConnector.lnrJS.LnProxyERC20;
            this.BUILD_PROCESS_SETUP.FREEZE =
              BUILD_PROCESS_SETUP.FREEZE + "ETH";
            this.BUILD_PROCESS_SETUP.UNFREEZE =
              BUILD_PROCESS_SETUP.UNFREEZE + "BSC";
            // this.BUILD_PROCESS_SETUP.STAKING_BUILD =
            //     BUILD_PROCESS_SETUP.STAKING_BUILD + "ETH";
          } else if (isBinanceNetwork(this.sourceNetworkId)) {
            // LnProxy = lnrJSConnector.lnrJS.LinearFinance;
            this.BUILD_PROCESS_SETUP.FREEZE =
              BUILD_PROCESS_SETUP.FREEZE + "BSC";
            this.BUILD_PROCESS_SETUP.UNFREEZE =
              BUILD_PROCESS_SETUP.UNFREEZE + "ETH";
            // this.BUILD_PROCESS_SETUP.STAKING_BUILD =
            //     BUILD_PROCESS_SETUP.STAKING_BUILD + "BSC";
          }

          let replaceCurrency = this.currency;
          if (this.currency == "LINA") {
            LnProxy = lnrJSConnector.lnrJS.LinearFinance;
          } else {
            LnProxy = lnrJSConnector.lnrJS[this.currency];
            replaceCurrency = currenciesList[this.currency].name;
          }

          //替换货币名称
          this.BUILD_PROCESS_SETUP.FREEZE = _.replace(
            this.BUILD_PROCESS_SETUP.FREEZE,
            "[REPLACE_CURRENCY]",
            replaceCurrency
          );

          this.BUILD_PROCESS_SETUP.UNFREEZE = _.replace(
            this.BUILD_PROCESS_SETUP.UNFREEZE,
            "[REPLACE_CURRENCY]",
            replaceCurrency
          );

          //取合约地址
          const LnBridgeAddress = LnBridge.address;

          //获取之前approve的数量
          const approveAmount = await LnProxy.allowance(
            this.walletAddress,
            LnBridgeAddress
          );

          const freezeAmount = n2bn(this.swapNumber);

          if (freezeAmount !== undefined) {
            //LINA差值
            const diffCollateralLINA = bnSub(freezeAmount, approveAmount);

            if (diffCollateralLINA.gt(approveAmount)) {
              this.shouldApprove = true;
            }
          }

          this.swapNumber > 0 &&
            this.waitProcessArray.push(this.BUILD_PROCESS_SETUP.FREEZE);

          this.waitProcessArray.push(this.BUILD_PROCESS_SETUP.UNFREEZE);

          // if (this.swapType == 1) {
          //     this.waitProcessArray.push(
          //         this.BUILD_PROCESS_SETUP.STAKING_BUILD
          //     );
          // }
        }

        this.checkStatus.stepIndex++;

        this.confirmTransactionStep = 0;
        this.actionTabs = "m1";

        this.waitProcessFlow = this.startFlow();

        // //开始逻辑流处理函数
        await this.waitProcessFlow();
      } catch (error) {
        console.log(error, "checkContract error");
      } finally {
        this.processing = false;
      }
    },

    startFlow() {
      return async () => {
        try {
          this.transactionErrMsg = "";

          let swapNumber = n2bn(this.swapNumber);

          //build合约需要大于1
          // if (swapNumber.eq(n2bn("1"))) {
          //     this.swapNumber = bnAdd(
          //         swapNumber,
          //         n2bn("0.000000000000000001")
          //     );
          // }

          if (this.shouldApprove) {
            await this.startApproveContract(n2bn(Number.MAX_SAFE_INTEGER));
          }

          if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            this.BUILD_PROCESS_SETUP.FREEZE
          ) {
            await this.startFreezeContract(swapNumber);
          }

          if (
            this.waitProcessArray[this.confirmTransactionStep] ==
            this.BUILD_PROCESS_SETUP.UNFREEZE
          ) {
            await this.startUnFreezeContract();
          }

          // if (
          //     this.swapType == 1 &&
          //     this.waitProcessArray[this.confirmTransactionStep] ==
          //         this.BUILD_PROCESS_SETUP.STAKING_BUILD
          // ) {
          //     await this.startStakingAndBuildContract(swapNumber);
          // }
        } catch (error) {
          console.log(error, "startFlow error");
          //自定义错误
          if (
            _.has(error, "code") &&
            [
              6100001, 6100002, 6100003, 6100004, 6100005, 6100006, 6100007,
            ].includes(error.code)
          ) {
            this.transactionErrMsg = error.message;
          } else {
            //通用错误
            this.transactionErrMsg = "Something went wrong, please try again.";
          }
        }
      };
    },

    //开始Approve合约调用
    async startApproveContract(approveAmountLINA) {
      this.confirmTransactionStatus = false;

      let LnProxy,
        LnBridge = lnrJSConnector.lnrJS.LnErc20Bridge;

      if (this.currency == "LINA") {
        LnProxy = lnrJSConnector.lnrJS.LinearFinance;
      } else {
        LnProxy = lnrJSConnector.lnrJS[this.currency];
      }

      const { utils } = lnrJSConnector;

      //取合约地址
      const LnBridgeAddress = LnBridge.address;

      const transactionSettings = {
        gasPrice: this.sourceGasPrice,
        gasLimit: DEFAULT_GAS_LIMIT.approve,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit = await this.getGasEstimateFromApprove(
        LnBridgeAddress,
        approveAmountLINA
      );

      let transaction = await LnProxy.approve(
        LnBridgeAddress,
        approveAmountLINA,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: this.BUILD_PROCESS_SETUP.APPROVE,
          networkId: this.sourceNetworkId,
          value: `Approve ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });
        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100001,
            message:
              "Something went wrong while gaining approval from the contract, please try again.",
          };
        }

        this.shouldApprove = false;
      }
    },

    //评估Approve的gas
    async getGasEstimateFromApprove(contractAddress, approveAmountLINA) {
      try {
        let LnProxy;
        // if (isEthereumNetwork(this.walletNetworkId)) {
        //     LnProxy = lnrJSConnector.lnrJS.LnProxyERC20;
        // } else if (isBinanceNetwork(this.walletNetworkId)) {
        //     LnProxy = lnrJSConnector.lnrJS.LinearFinance;
        // }

        if (this.currency == "LINA") {
          LnProxy = lnrJSConnector.lnrJS.LinearFinance;
        } else {
          LnProxy = lnrJSConnector.lnrJS[this.currency];
        }

        if (
          approveAmountLINA.isZero() ||
          approveAmountLINA.lt("0") //小于等于0
        ) {
          throw new Error("invalid approveAmountLINA");
        }

        let gasEstimate = await LnProxy.estimateGas.approve(
          contractAddress,
          approveAmountLINA
        );
        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.approve);
      }
    },

    async startFreezeContract(swapNumber) {
      this.confirmTransactionStatus = false;

      let LnBridge = lnrJSConnector.lnrJS.LnErc20Bridge,
        SETUP;
      if (isEthereumNetwork(this.walletNetworkId)) {
        SETUP = "ETH";
      } else if (isBinanceNetwork(this.walletNetworkId)) {
        SETUP = "BSC";
      }

      const { utils } = lnrJSConnector;

      const transactionSettings = {
        gasPrice: this.sourceGasPrice,
        gasLimit: DEFAULT_GAS_LIMIT.freeze,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit = await this.getGasEstimateFromFreeze(
        LnBridge,
        swapNumber
      );

      let transaction = await LnBridge.deposit(
        utils.formatBytes32String(this.currency),
        swapNumber,
        this.targetNetworkId,
        formatAddressToByte32(this.targetWalletAddress),
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: this.BUILD_PROCESS_SETUP.FREEZE,
          networkId: this.sourceNetworkId,
          value: `Swapped on ${SETUP} ${this.confirmTransactionStep + 1}/${
            this.waitProcessArray.length
          }`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100002,
            message: `Something went wrong while Swapping your ${this.currency}, please try again.`,
          };
        }

        this.freezeSuccessHash = transaction.hash;

        const { blockNumber } = await lnrJSConnector.provider.getTransaction(
          transaction.hash
        );

        //等待交易块确认完毕
        this.startWaitingBlocks = true;
        this.tansactionBlocks.blockNumber = blockNumber || 0;
        await this.waitingBlockConfirmations();
        this.startWaitingBlocks = false;

        this.confirmTransactionStep += 1;
      }
    },

    //评估冻结gas limit
    async getGasEstimateFromFreeze(LnBridge, swapNumber) {
      try {
        if (
          swapNumber.lte(n2bn("0")) //小于等于0
        ) {
          throw new Error("invalid freezeAmount");
        }

        const { utils } = lnrJSConnector;

        let gasEstimate = await LnBridge.estimateGas.deposit(
          utils.formatBytes32String(this.currency),
          swapNumber,
          this.targetNetworkId,
          formatAddressToByte32(this.targetWalletAddress)
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.freeze);
      }
    },

    async startUnFreezeContract() {
      this.confirmTransactionStatus = false;

      //不是自动进入流程,且是手机端时
      if (!this.swapUnfreezeContinue && this.isMobile) {
        const unfreezeDatas = {
          confirmTransactionStep: this.confirmTransactionStep,
          waitProcessArray: this.waitProcessArray,
          freezeSuccessHash: this.freezeSuccessHash,
          targetNetworkId: this.targetNetworkId,
          sourceWalletType: this.sourceWalletType,
          sourceWalletAddress: this.sourceWalletAddress,
          swapNumber: this.swapNumber,
          sourceNetworkId: this.sourceNetworkId,
          targetGasPrice: this.targetGasPrice,
        };

        //保存手机端解冻的数据
        this.$store.commit("setSwapUnfreezeDatas", unfreezeDatas);
      }

      //清除自动进入流程
      this.swapUnfreezeContinue &&
        this.$store.commit("setSwapUnfreezeContinue", false);

      let walletStatus;

      /**
       * 当前网络是原始网络
       * 当前网络Id,不等于目标网络Id
       * 等待用户切换钱包或网络 */
      if (
        this.walletNetworkId == this.sourceNetworkId &&
        this.walletNetworkId != this.targetNetworkId
        // && this.walletType == this.sourceWalletType
      ) {
        this.confirmTransactionChainChanging = true;
        this.chainChangedStatus = false;
        this.confirmTransactionNetworkId = this.walletNetworkId;

        //监听手动切换事件
        this.chainChangeTokenFromUnfreeze = this.$pub.subscribe(
          "onWalletChainChange",
          async (msg, changeType) => {
            // console.log(changeType, "startUnFreezeContract");
            this.chainChangedStatus = true;
            this.confirmTransactionChainChanging = false;
            this.confirmTransactionNetworkId = this.walletNetworkId;
          }
        );

        // console.log("开始切链");
        walletStatus = await this.waitChainChange();
        // console.log("切链完成");
      } else {
        walletStatus = true;
      }

      this.confirmTransactionNetworkId = this.walletNetworkId;

      //验证当前网络id是否目标网络id
      if (this.walletNetworkId != this.targetNetworkId) {
        throw {
          code: 6100007,
          message:
            "The network is not correct. Please switch to a valid network",
        };
      }

      if (walletStatus) {
        let LnBridge = lnrJSConnector.lnrJS.LnErc20Bridge,
          SETUP;
        if (isEthereumNetwork(this.sourceNetworkId)) {
          SETUP = "ETH";
        } else if (isBinanceNetwork(this.sourceNetworkId)) {
          SETUP = "BSC";
        }

        // console.log(`等待获取锁定hash`);
        this.waitPendingProcess = true;
        const depositArray = await this.getPendingProcess();
        // console.log(`获取锁定hash完成`, depositArray);

        const { utils } = lnrJSConnector;

        const transactionSettings = {
          gasPrice: this.targetGasPrice,
          gasLimit: DEFAULT_GAS_LIMIT.unfreeze,
        };

        for (const index in depositArray) {
          const deposit = depositArray[index];

          this.confirmTransactionStatus = false;

          transactionSettings.gasLimit = await this.getGasEstimateFromUnFreeze(
            LnBridge,
            deposit
          );

          let transaction = await LnBridge.withdraw(
            deposit.srcChainId,
            deposit.destChainId,
            deposit.depositId,
            formatAddressToByte32(deposit.depositor),
            formatAddressToByte32(deposit.recipient),
            utils.formatBytes32String(deposit.currency),
            BigNumber.from(deposit.amount),
            deposit.signatures[0].signature,
            transactionSettings
          );

          if (transaction) {
            this.confirmTransactionStatus = true;
            this.confirmTransactionHash = transaction.hash;

            // 发起右下角通知
            this.$pub.publish("notificationQueue", {
              hash: this.confirmTransactionHash,
              type: this.BUILD_PROCESS_SETUP.UNFREEZE,
              networkId: this.sourceNetworkId,
              value: `Swapped on ${SETUP} ${this.confirmTransactionStep + 1}/${
                this.waitProcessArray.length
              }`,
            });

            let status = await utils.waitForTransaction(transaction.hash);

            if (!status) {
              throw {
                code: 6100003,
                message: `Something went wrong while Getting your ${this.currency}, please try again.`,
              };
              break;
            }
          }
        }

        this.confirmTransactionStep += 1;

        this.$store.commit("setSwapUnfreezeDatas", {});
      } else {
        throw {
          code: 6100004,
          message:
            "Something went wrong, please try again or install wallet extensions.",
        };
      }
    },

    //评估解冻手续费
    async getGasEstimateFromUnFreeze(LnBridge, deposit) {
      try {
        const { utils } = lnrJSConnector;

        if (!deposit) {
          throw new Error("invalid data");
        }

        // console.log(
        //     deposit.srcChainId,
        //     deposit.destChainId,
        //     deposit.depositId,
        //     formatAddressToByte32(deposit.depositor),
        //     formatAddressToByte32(deposit.recipient),
        //     utils.formatBytes32String(deposit.currency),
        //     BigNumber.from(deposit.amount),
        //     deposit.signatures[0].signature
        // );

        //如果是bridge里面能提取的lina不足,会报错但无法捕捉异常,导致无限等待
        let gasEstimate = await LnBridge.estimateGas.withdraw(
          deposit.srcChainId,
          deposit.destChainId,
          deposit.depositId,
          formatAddressToByte32(deposit.depositor),
          formatAddressToByte32(deposit.recipient),
          utils.formatBytes32String(deposit.currency),
          BigNumber.from(deposit.amount),
          deposit.signatures[0].signature
        );
        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.unfreeze);
      }
    },

    //开始抵押和build合约调用
    async startStakingAndBuildContract(stakeAmountLINA) {
      this.confirmTransactionStatus = false;

      const {
        lnrJS: { LnCollateralSystem },
        utils,
      } = lnrJSConnector;

      const transactionSettings = {
        gasPrice: this.targetGasPrice,
        gasLimit: DEFAULT_GAS_LIMIT.build,
      };

      this.confirmTransactionNetworkId = this.walletNetworkId;

      transactionSettings.gasLimit =
        await this.getGasEstimateFromStakingAndBuild(stakeAmountLINA);

      let transaction = await LnCollateralSystem.collateralAndBuild(
        utils.formatBytes32String(this.currency),
        stakeAmountLINA,
        transactionSettings
      );

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: BUILD_PROCESS_SETUP.BUILD,
          networkId: this.sourceNetworkId,
          value: `Building ${this.confirmTransactionStep + 1} / ${
            this.waitProcessArray.length
          }`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100005,
            message:
              "Something went wrong while building your ℓUSD, please try again.",
          };
        }

        this.confirmTransactionStep += 1;
      }
    },

    //评估StakingAndBuild的gas
    async getGasEstimateFromStakingAndBuild(stakeAmountLINA) {
      try {
        const {
          lnrJS: { LnCollateralSystem },
          utils,
        } = lnrJSConnector;

        if (
          stakeAmountLINA.isZero() ||
          stakeAmountLINA.lt("0") //小于等于0
        ) {
          throw new Error("invalid stakeAmountLINA");
        }

        let gasEstimate =
          await LnCollateralSystem.estimateGas.collateralAndBuild(
            utils.formatBytes32String(this.currency),
            stakeAmountLINA
          );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.staking);
      }
    },

    //等待链改变
    waitChainChange() {
      return new Promise((resolve) => {
        const wait = () => {
          if (this.chainChangedStatus) {
            if (this.chainChangeTokenFromUnfreeze) {
              this.$pub.unsubscribe(this.chainChangeTokenFromUnfreeze);
            }

            this.chainChangeTokenFromUnfreeze = "";
            this.chainChangedStatus = false;
            resolve(true);
          } else {
            this.waitChainChangeLoopId = setTimeout(wait, 1000);
          }
        };

        wait();
      });
    },

    //等待交易块完成
    async waitingBlockConfirmations() {
      return new Promise((resolve) => {
        const wait = async () => {
          await this.refreshBlock();

          //达到条件
          if (
            this.tansactionBlocks.confirmations >= this.tansactionBlocks.total
          ) {
            resolve(true);
            return;
          }

          this.waitingBlockConfirmationsLoopId = setTimeout(wait, 5000);
        };

        wait();
      });
    },

    //刷新block
    async refreshBlock() {
      //防止刷新中点击刷新
      if (this.canRefreshBlocks) {
        this.canRefreshBlocks = false;
        //获取当前块高度
        let currentBlock = await lnrJSConnector.provider.getBlockNumber();

        //已确认块
        const confirmations = currentBlock - this.tansactionBlocks.blockNumber;

        //1个以上,防止回退
        if (confirmations > 0) {
          this.tansactionBlocks.confirmations = confirmations;
        }
        this.canRefreshBlocks = true;
      }
    },

    async getPendingProcess() {
      let count = 0;

      return new Promise((resolve, reject) => {
        const wait = async () => {
          //超时退出
          // if (count > 60) {
          //     reject({
          //         code: 6100006,
          //         message: `No valid ${this.currency} was found`
          //     });
          // }

          this.getPendingProcessLoopId = this.waitPendingProcess
            ? setTimeout(wait, 3000)
            : 0;

          //获取存取数据
          let [sourceArray, targetArray] = await Promise.all([
            lnr.freeZe({
              depositor: this.sourceWalletAddress,
              recipient: this.targetWalletAddress,
              networkId: this.sourceNetworkId,
              source: this.currency,
            }),
            lnr.unfreeze({
              depositor: this.sourceWalletAddress,
              recipient: this.targetWalletAddress,
              networkId: this.targetNetworkId,
              source: this.currency,
            }),
          ]);

          // console.log(sourceArray, targetArray, ++count);

          //有存数据
          if (sourceArray.length) {
            //有冻结hash
            if (this.freezeSuccessHash) {
              const findHash = _.find(sourceArray, [
                "hash",
                this.freezeSuccessHash,
              ]);

              //没有找到hash
              if (!findHash) {
                return;
              }
            }

            //取不同存储记录
            const diffArray = _.xorBy(sourceArray, targetArray, "depositId");

            //没有可解锁的记录
            if (!diffArray.length) {
              clearTimeout(this.getPendingProcessLoopId);
              reject({
                code: 6100006,
                message: `No valid ${this.currency} was found`,
              });
            }

            const depositPromise = diffArray.map((item) =>
              api.getDeposits(this.sourceNetworkId, item.depositId)
            );

            //获取签名数据
            const depositArray = await Promise.all(depositPromise);
            clearTimeout(this.getPendingProcessLoopId);
            resolve(depositArray);
          }
        };

        wait();
      });
    },

    //检查原始网络余额
    async checkSounrceBalance() {
      let sourceCurrency = isEthereumNetwork(this.walletNetworkId)
        ? "ETH"
        : "BNB";

      let sourceNetworkType = isEthereumNetwork(this.walletNetworkId)
        ? "Ethereum"
        : "BSC";

      const sourceBalance = await lnrJSConnector.provider.getBalance(
        this.walletAddress
      );

      const freezeFee = await this.getFreezeFee();
      // console.log(freezeFee, "freezeFee");
      // console.log(sourceBalance / 1e18, "sourceBalance");

      if (sourceBalance.lt(n2bn(freezeFee))) {
        this.checkStatus.stepType = 1;
        this.checkStatus.stepError = `Deposit some ${sourceCurrency} on ${sourceNetworkType} for transaction fee`;
        return;
      }
      this.checkStatus.stepIndex++;
    },

    //检查目标网络余额
    async checkTargetBalace() {
      let targetCurrency = isEthereumNetwork(this.targetNetworkId)
        ? "ETH"
        : "BNB";

      let targetNetworkType = isEthereumNetwork(this.targetNetworkId)
        ? "Ethereum"
        : "BSC";

      const { result } = await api.getWalletBalance(
        this.targetWalletAddress,
        this.targetNetworkId
      );
      let targetBalance = n2bn(result / 1e18);

      // let unfreezeFee = isEthereumNetwork(this.targetNetworkId)
      //     ? 0.075
      //     : 0.01;

      let unfreezeFee;
      if (isEthereumNetwork(this.targetNetworkId)) {
        unfreezeFee =
          (unFormatGasPrice(this.targetGasPrice) * DEFAULT_GAS_LIMIT.unfreeze) /
          1000000000;
      } else {
        unfreezeFee =
          (unFormatGasPrice(this.targetGasPrice) * DEFAULT_GAS_LIMIT.unfreeze) /
          2 /
          1000000000;
      }

      // console.log(unfreezeFee, "unfreezeFee");
      // console.log(targetBalance / 1e18, "targetBalance");

      if (targetBalance.lt(n2bn(unfreezeFee))) {
        this.checkStatus.stepType = 1;
        this.checkStatus.stepError = `Deposit some ${targetCurrency} on ${targetNetworkType} for transaction fee`;
        return;
      }
      // this.checkStatus.stepIndex++;

      /* const providerObject = this.getProviderObject(
                    this.targetNetworkId
                );
                if (providerObject) {
                    await this.connectToTargetWallet(providerObject);
                    //没有冻结lina的签名,无法预先评估gas limit
                    unfreezeFee = await this.getUnfreezeFee();
                } else {
                    const { result } = await api.getWalletBalance(
                        this.walletAddress,
                        this.targetNetworkId
                    );

                    targetBalance = n2bn(result / 1e18);
                    unfreezeFee = freezeFee;
                    // unfreezeFee = 0.01;
                } */
    },

    //连接钱包
    async connectToTargetWallet(provider = null) {
      try {
        provider == null &&
          (provider = await this.getProviderObject(this.targetNetworkId));

        // console.log(provider);

        //钱包注入对象
        if (provider) {
          const [walletAddress] = await provider.enable();
          this.targetWalletAddress = walletAddress.toLowerCase();
          this.targetWalletType = isEthereumNetwork(this.targetNetworkId)
            ? SUPPORTED_WALLETS.METAMASK
            : SUPPORTED_WALLETS.BINANCE_CHAIN;

          let network;
          if (isBinanceNetwork(this.targetNetworkId)) {
            network = await getBinanceNetwork();
          } else if (isEthereumNetwork(this.targetNetworkId)) {
            network = await getEthereumNetwork();
          }
          const { networkId } = network;

          //目标为bsc钱包时候检查目标网络id
          if (
            this.targetWalletType == SUPPORTED_WALLETS.BINANCE_CHAIN &&
            networkId != this.targetNetworkId
          ) {
            throw {
              code: 100004,
              message:
                "The network is not correct. Please switch to a valid network",
            };
          }

          this.checkStatus.stepIndex++;
        } else {
          //目标为以太网
          if (isEthereumNetwork(this.targetNetworkId)) {
            this.checkStatus.stepType = 2;
            this.checkStatus.stepInstall =
              "Install MetaMask wallet extension here";
          } else if (isBinanceNetwork(this.targetNetworkId)) {
            //目标为BSC
            this.checkStatus.stepType = 2;
            this.checkStatus.stepInstall =
              "Install Binance chain wallet extension here";
          }
        }
      } catch (error) {
        throw error;
      }
    },

    changeTargetWalletInfo(type) {
      this.targetWalletType = SUPPORTED_WALLETS.METAMASK;
      this.targetWalletAddress = this.walletAddress;
      this.checkPrepare(++this.checkStatus.stepIndex);
    },

    //获取钱包
    getProviderObject(networkId) {
      return window["ethereum"];

      //钱包注入对象名称
      const injection = isEthereumNetwork(networkId)
        ? "ethereum"
        : isBinanceNetwork(networkId)
        ? "BinanceChain"
        : null;

      return window[injection];
    },

    //获取解冻合约
    getTargetContract() {
      let type,
        contract = "LnErc20Bridge";
      if (isEthereumNetwork(this.targetNetworkId)) {
        type = SUPPORTED_WALLETS.METAMASK;
        // contract = "LnErc20Bridge";
      } else if (isBinanceNetwork(this.targetNetworkId)) {
        type = SUPPORTED_WALLETS.BINANCE_CHAIN;
        // contract = "LnBep20Bridge";
      }

      const signer = new signers[type]();
      this.targetContract = new Web3Connector({
        networkId: Number(this.targetNetworkId),
        signer,
      });

      return this.targetContract.contracts[contract];
    },

    //获取冻结手续费
    async getFreezeFee() {
      let LnBridge = lnrJSConnector.lnrJS.LnErc20Bridge;
      const gasLimit = await this.getGasEstimateFromFreeze(
        LnBridge,
        n2bn(this.swapNumber)
      );

      const fee =
        (unFormatGasPrice(this.sourceGasPrice) * gasLimit) / 1000000000;

      return fee;
    },

    //获取解冻手续费
    async getUnfreezeFee() {
      const LnBridge = await this.getTargetContract();
      // const gasLimit = await this.getGasEstimateFromUnFreeze(
      //     LnBridge,
      //     n2bn(this.swapNumber)
      // );

      const fee =
        (unFormatGasPrice(this.targetGasPrice) * gasLimit) / 1000000000;

      return fee;
    },

    //步骤可点击处理
    stepClickHandle() {
      //余额不足
      if (this.checkStatus.stepType == 1) {
        if (
          isMainnetNetwork(this.sourceNetworkId) ||
          isMainnetNetwork(this.targetNetworkId)
        ) {
          return;
        }

        const urls = {
          1: "",
          3: "https://faucet.metamask.io/",
          56: "",
          97: "https://testnet.binance.org/faucet-smart",
        };

        if (this.checkStatus.stepIndex == 0) {
          window.open(urls[this.walletNetworkId]);
        } else if (this.checkStatus.stepIndex == 2) {
          window.open(urls[this.targetNetworkId]);
        }
      } else if (this.checkStatus.stepType == 2) {
        const url = isEthereumNetwork(this.targetNetworkId)
          ? WALLET_EXTENSIONS.METAMASK
          : WALLET_EXTENSIONS.BINANCE;

        //打开钱包插件安装路径
        window.open(url);
      }
    },

    stepNetwork() {
      this.$store.commit("setSetupModal", true);
    },

    //回到默认状态
    async setDefaultTab() {
      this.waitProcessArray = [];
      this.confirmTransactionStep = -1;
      this.swapNumber = null;
      this.waitPendingProcess = false;
      this.freezeSuccessHash = "";
      this.processing = false;
      this.sourceWalletType = "";
      this.sourceWalletAddress = "";
      this.chainChangedStatus = false;
      this.confirmTransactionChainChanging = false;
      this.confirmTransactionHash = "";
      this.confirmTransactionNetworkId = "";
      this.confirmTransactionStatus = false;
      this.actionTabs = "m0";
      this.sourceNetworkId = "";
      this.targetNetworkId = "";
      this.checkStatus = {
        stepIndex: 0,
        stepError: "",
        stepInstall: "",
        stepType: -1,
        stepArray: [],
      };
      this.sourceGasPrice = "";
      this.targetGasPrice = "";
      this.$emit("close");
    },
  },
  destroyed() {
    this.$store.commit("setIsTransaction", false);

    //清除事件,防止重复
    if (this.chainChangeTokenFromUnfreeze) {
      this.$pub.unsubscribe(this.chainChangeTokenFromUnfreeze);
      this.chainChangeTokenFromUnfreeze = "";
    }

    clearTimeout(this.waitChainChangeLoopId);
    clearTimeout(this.waitingBlockConfirmationsLoopId);
    clearTimeout(this.getPendingProcessLoopId);
  },
};
</script>

<style lang="scss">
#watingEnhanceSwapNew {
  position: relative;

  .close {
    z-index: 1;
    position: absolute;
    top: 24px;
    right: 24px;
  }

  .actionTabs {
    .ivu-tabs-tabpane {
      &.checkPage {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .tabContent {
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

          .contentIcon {
            text-align: center;
            margin: 73px auto 54px;
            img {
              width: 160px;
              height: 160px;
            }
          }

          .contentStep {
            display: flex;
            flex-direction: column;
            justify-items: center;
            align-items: center;

            .stepBox {
              // max-width: 270px;
              .stepItem {
                display: flex;
                align-items: flex-start;
                position: relative;

                &:not(:last-of-type) {
                  margin-bottom: 12px;
                }

                .line {
                  position: absolute;
                  background-color: #e5e5e5;
                  width: 2px;
                  height: calc(100% + 12px);
                  left: 11px;
                  top: 11px;
                }

                .stepIcon {
                  width: 24px;
                  height: 24px;
                  margin-right: 8px;
                  background: white;
                  border-radius: 50%;
                  position: relative;
                  z-index: 1;
                  margin-top: -5.5px;

                  &.loading {
                    animation: rotate 3s linear infinite;
                  }
                }

                .stepInfo {
                  font-family: Gilroy-Medium;
                  font-size: 12px;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.33;
                  letter-spacing: normal;
                  color: #99999a;

                  &.active {
                    font-family: Gilroy-Bold;
                    color: #5a575c;
                  }

                  .subStep {
                    margin-top: 8px;
                    .subItem {
                      display: flex;
                      align-items: center;

                      &.active {
                        .oval {
                          background-color: #5a575c;
                        }

                        .subStepInfo {
                          font-family: Gilroy-Bold;
                          color: #5a575c;
                        }
                      }

                      .oval {
                        width: 8px;
                        height: 8px;
                        background-color: #99999a;
                        margin-right: 8px;
                        border-radius: 50%;
                      }

                      .subStepInfo {
                        font-family: Gilroy-Medium;
                        font-size: 12px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.33;
                        letter-spacing: normal;
                        color: #99999a;
                      }
                    }

                    .subStepErrorBox {
                      margin-top: 8px;
                      .subStepErrorItem {
                        font-family: Gilroy-Medium;
                        font-size: 12px;
                        font-weight: 500;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.33;
                        letter-spacing: normal;
                        color: #df434c;
                        display: flex;
                        align-items: center;
                        cursor: pointer;

                        .errorIcon {
                          width: 16px;
                          height: 16px;
                          margin-left: 4px;
                        }
                      }
                    }
                  }

                  .stepJump {
                    .jumpInfo {
                      font-family: Gilroy-Medium;
                      font-size: 12px;
                      font-weight: 500;
                      font-stretch: normal;
                      font-style: normal;
                      line-height: 1.33;
                      letter-spacing: normal;
                      color: #1a38f8;
                      display: flex;
                      align-items: center;
                      cursor: pointer;
                      margin-top: 4px;

                      .jumpIcon {
                        width: 16px;
                        height: 16px;
                        margin-left: 4px;
                      }
                    }
                  }

                  .stepError {
                    margin-top: 4px;
                    font-family: Gilroy-Medium;
                    font-size: 12px;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.33;
                    letter-spacing: normal;
                    color: #df434c;

                    display: flex;
                    align-items: center;

                    &.clickable {
                      cursor: pointer;
                    }

                    .errorIcon {
                      width: 16px;
                      height: 16px;
                      margin-left: 4px;
                    }
                  }
                }
              }
            }
          }
        }

        .refreshBtn {
          position: absolute;
          bottom: 40px;
          font-family: Gilroy-Bold;
          font-size: 12px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: 1.5px;
          text-align: center;
          color: #1a38f8;
          text-transform: uppercase;

          cursor: pointer;
          display: flex;
          align-items: center;

          img {
            width: 16px;
            height: 16px;
            margin-left: 4px;
          }
        }
      }

      &.waitingPage {
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

        .stepNetwork {
          font-family: Gilroy-Bold;
          font-size: 10px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.6;
          letter-spacing: 1.25px;
          color: #1a38f8;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;

          img {
            width: 13px;
            height: 13px;
            margin-left: 5px;
          }
        }

        .blockCompletedBox {
          margin-top: 24px;
          text-align: center;

          .blockBox {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            .blocks {
              display: flex;

              .blockItem {
                background-color: #e5e5e5;
                width: 8px;
                height: 8px;
                margin: 0 3px;
                transition: $animete-time linear;

                &.active {
                  background-color: #1a38f8;
                }
              }
            }

            .blocknInfo {
              font-family: Gilroy-Medium;
              font-size: 12px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.33;
              letter-spacing: normal;
              color: #99999a;
              margin-left: 8px;

              .confirmations {
                font-family: Gilroy-Bold;
                font-weight: bold;
                color: #5a575c;
              }
            }
          }

          .refreshBtn {
            font-family: Gilroy-SemiBold;
            font-size: 12px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: 1.5px;
            color: #99999a;
            padding: 4px 12px;
            border-radius: 20px;
            border: solid 1px #e5e5e5;
            cursor: pointer;
            transition: $animete-time linear;
            position: relative;

            &.disabled {
              cursor: not-allowed;
              opacity: 0.5;
            }

            svg {
              position: relative;
              margin-right: 4px;
              top: 4px;

              &.loading {
                animation: rotate_reverse 3s linear infinite;
              }
            }

            &:hover {
              &:not(.disabled) {
                border-color: #1a38f8;
                color: #1a38f8;

                .color {
                  fill: #1a38f8;
                }
              }
            }
            .app-dark & {
              color: #3851f0;
              border-color: #3851f0 !important;
              .color {
                fill: #3851f0;
              }
            }
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
                .app-dark & {
                  color: #99999a;
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
                .app-dark & {
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
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #watingEnhanceSwapNew {
    .close {
      img {
        width: 26px;
        height: 26px;
      }
    }

    .actionTabs {
      .ivu-tabs-tabpane {
        &.checkPage {
        }

        &.waitingPage {
          padding: 24px 32px;
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
            // .step {
            //     font-size: 10px;
            //     line-height: 1.6;
            //     letter-spacing: 1.25px;
            //     position: absolute;
            //     bottom: 32px;

            //     img {
            //         width: 16px;
            //         height: 16px;
            //     }
            // }
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
            top: 288px;
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
            bottom: 32px;
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

@keyframes rotate_reverse {
  from {
    transform: rotate(359deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
