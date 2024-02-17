<template>
  <div id="walletDetails" :class="{ mScroll: mShowWallet }">
    <div
      :class="[
        `${
          theme === 'dark' ? 'walletAndAddressBox' : 'walletAndAddressBoxLight'
        }`,
      ]"
      v-if="!mShowWallet"
    >
      <div
        v-if="!isMobile"
        class="chainChange"
        @click="isShowChainList = !isShowChainList"
      >
        <div
          class="ethBox"
          v-if="isEthereumNetwork"
          @click="triggerSwitchChain(SUPPORTED_NETWORKS_MAP.Mainnet)"
        >
          <ethereumSvg :selected="isEthereumNetwork" />
        </div>
        <div
          class="bscBox"
          v-if="isBinanceNetwork"
          @click="triggerSwitchChain(SUPPORTED_NETWORKS_MAP.BscMainnet)"
        >
          <binanceSvg :selected="isBinanceNetwork" />
        </div>
        <div class="mNetworkName">
          {{ walletNetworkName }}
        </div>
        <div :class="{ showList: !isShowChainList }">
          <img src="@/static/awrow.svg" alt="" />
        </div>

        <div class="chainChange-list" v-show="isShowChainList">
          <div
            class="chainChange-list-item"
            :selected="isEthereumNetwork"
            @click="triggerSwitchChain(SUPPORTED_NETWORKS_MAP.Mainnet)"
          >
            <ethereumSvg :selected="isEthereumNetwork" />
            <span>Mainnet</span>
          </div>
          <div
            class="chainChange-list-item"
            :selected="isBinanceNetwork"
            @click="triggerSwitchChain(SUPPORTED_NETWORKS_MAP.BscMainnet)"
          >
            <binanceSvg :selected="isBinanceNetwork" />
            <span>BscMainnet</span>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="address">
          {{ abbreviateAddress }}
        </div>
        <Tooltip
          class="globalInfoStyle"
          :content="tooltipContent"
          offset="0 6"
          placement="bottom"
          @on-popper-hide="resetTooltipContent"
        >
          <svg
            class="copyBtn"
            :data-clipboard-text="walletAddress"
            data-clipboard-action="copy"
            @click="copyAddress()"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
          >
            <desc>Created with Lunacy</desc>
            <g id="Icon/Copy">
              <path
                d="M12.9947 2.33562C12.91 1.03154 11.8255 0 10.5 0L2.5 0L2.33562 0.00531768C1.03154 0.0899613 0 1.17452 0 2.5L0 10.5L0.00531768
                                10.6644C0.0899613 11.9685 1.17452 13 2.5 13L4.44938 13L4.44938 12L2.5 12L2.35554 11.9931C1.59489 11.9204 1 11.2797 1 10.5L1 2.5L1.00687
                                2.35554C1.07955 1.59489 1.7203 1 2.5 1L10.5 1L10.6445 1.00687C11.4051 1.07955 12 1.7203 12 2.5L12 4.69901L13 4.69901L13 2.5L12.9947
                                2.33562ZM16.5 6L8.5 6C7.11929 6 6 7.11929 6 8.5L6 16.5C6 17.8807 7.11929 19 8.5 19L16.5 19C17.8807 19 19 17.8807 19 16.5L19 8.5C19 7.11929
                                17.8807 6 16.5 6ZM8.5 7L16.5 7C17.3284 7 18 7.67157 18 8.5L18 16.5C18 17.3284 17.3284 18 16.5 18L8.5 18C7.67157 18 7 17.3284 7 16.5L7 8.5C7
                                7.67157 7.67157 7 8.5 7Z"
                transform="translate(2.5 2.5)"
                id="Combined-Shape"
                fill="#5a575c"
                fill-rule="evenodd"
                stroke="none"
              />
            </g>
          </svg>
        </Tooltip>

        <div class="disconnect" @click.stop="disconnect">Disconnect</div>
      </div>

      <div class="info-themeSwitch">
        <theme-switch :variant="variant" />
      </div>

      <div v-if="isMobile" class="mNetwork" @click="mShowWallet = true">
        <ethereumSvg v-if="isEthereumNetwork" :selected="true" />
        <binanceSvg v-else :selected="true" />
        <div class="mNetworkName">
          {{ walletNetworkName }}
        </div>
      </div>
      <div v-if="isMobile" @click="showTooltipModle" class="menu">
        <font-awesome-icon
          v-if="theme === 'dark'"
          class="menu-logo"
          :icon="['fas', 'bars']"
          size="lh"
          color="white"
        />
        <font-awesome-icon
          v-else
          class="menu-logo"
          :icon="['fas', 'bars']"
          size="lh"
          color="black"
        />
      </div>
      <div v-if="!isMobile" @click="showTooltipModle" class="menu">
        <font-awesome-icon
          v-if="theme === 'dark'"
          class="menu-logo"
          :icon="['fas', 'bars']"
          size="lh"
          color="white"
        />
        <font-awesome-icon
          v-else
          class="menu-logo"
          :icon="['fas', 'bars']"
          size="lh"
          color="black"
        />
      </div>
    </div>
    <div class="walletDetailsBox" :class="{ mShowWalletClass: mShowWallet }">
      <div class="mWalletHead">
        <ethereumSvg
          class="networkIcon"
          v-if="isEthereumNetwork"
          :selected="true"
        />
        <binanceSvg class="networkIcon" v-else :selected="true" />

        <div class="mInfo">
          <div class="wallet">
            {{ walletNetworkName }}
          </div>
          <div class="address">
            {{ abbreviateAddress }}
          </div>
          <Tooltip
            class="globalInfoStyle"
            :content="tooltipContent"
            offset="0 6"
            placement="bottom"
            @on-popper-hide="resetTooltipContent"
          >
            <svg
              class="copyBtn"
              :data-clipboard-text="walletAddress"
              data-clipboard-action="copy"
              @click="copyAddress()"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
            >
              <desc>Created with Lunacy</desc>
              <g id="Icon/Copy">
                <path
                  d="M12.9947 2.33562C12.91 1.03154 11.8255 0 10.5 0L2.5 0L2.33562 0.00531768C1.03154 0.0899613 0 1.17452 0 2.5L0 10.5L0.00531768
                                    10.6644C0.0899613 11.9685 1.17452 13 2.5 13L4.44938 13L4.44938 12L2.5 12L2.35554 11.9931C1.59489 11.9204 1 11.2797 1 10.5L1 2.5L1.00687
                                    2.35554C1.07955 1.59489 1.7203 1 2.5 1L10.5 1L10.6445 1.00687C11.4051 1.07955 12 1.7203 12 2.5L12 4.69901L13 4.69901L13 2.5L12.9947
                                    2.33562ZM16.5 6L8.5 6C7.11929 6 6 7.11929 6 8.5L6 16.5C6 17.8807 7.11929 19 8.5 19L16.5 19C17.8807 19 19 17.8807 19 16.5L19 8.5C19 7.11929
                                    17.8807 6 16.5 6ZM8.5 7L16.5 7C17.3284 7 18 7.67157 18 8.5L18 16.5C18 17.3284 17.3284 18 16.5 18L8.5 18C7.67157 18 7 17.3284 7 16.5L7 8.5C7
                                    7.67157 7.67157 7 8.5 7Z"
                  transform="translate(2.5 2.5)"
                  id="Combined-Shape"
                  fill="#5a575c"
                  fill-rule="evenodd"
                  stroke="none"
                  class="copy-path"
                />
              </g>
            </svg>
          </Tooltip>
          <img
            v-if="isMobile"
            class="disconnectMobile"
            src="@/static/disconnectMobile.svg"
            alt="disconnect"
            @click.stop="disconnect"
          />
        </div>
        <img
          @click="mShowWallet = false"
          class="mClose"
          src="@/static/icon-cancel.svg"
        />
      </div>
      <div class="actionsBox">
        <div class="box">
          <div
            class="boxItem"
            :class="{ selected: trackStatus }"
            @click="trackModalClick"
            @mouseenter="trackIconStatus = 1"
            @mouseleave="trackIconStatus = 0"
          >
            <div class="placeholder">
              <transition-group name="img-fade">
                <img
                  v-if="theme === 'light'"
                  key="1"
                  v-show="!trackStatus && !trackIconStatus"
                  src="@/static/appPage/track.svg"
                />
                <img
                  v-else
                  key="1"
                  v-show="!trackStatus && !trackIconStatus"
                  src="@/static/dark-theme/appPage/track.svg"
                />
                <img
                  key="2"
                  v-show="!trackStatus && trackIconStatus"
                  src="@/static/appPage/track_hover.svg"
                />
                <img
                  key="3"
                  v-show="trackStatus"
                  src="@/static/appPage/track_selected.svg"
                />
              </transition-group>
            </div>
            TRACK DEBT
          </div>
        </div>
        <div class="box">
          <div
            class="boxItem"
            :class="{ selected: transactionStatus }"
            @click="transactionModalClick"
            @mouseenter="transactionIconStatus = 1"
            @mouseleave="transactionIconStatus = 0"
          >
            <div class="placeholder">
              <transition-group name="img-fade">
                <img
                  v-if="theme === 'light'"
                  key="1"
                  v-show="!transactionStatus && !transactionIconStatus"
                  src="@/static/appPage/transaction.svg"
                />
                <img
                  v-else
                  key="1"
                  v-show="!transactionStatus && !transactionIconStatus"
                  src="@/static/dark-theme/appPage/transaction.svg"
                />
                <img
                  key="2"
                  v-show="!transactionStatus && transactionIconStatus"
                  src="@/static/appPage/transaction_hover.svg"
                />
                <img
                  key="3"
                  v-show="transactionStatus"
                  src="@/static/appPage/transaction_selected.svg"
                />
              </transition-group>
            </div>
            TRANSACTION
          </div>
        </div>
      </div>

      <div class="walletInfo">
        <div class="portfolioSection">
          <div class="portfolioBox">
            <div class="box">
              <div class="tokenItems obtrusive singer">
                <div class="left portfolio">Portfolio</div>
              </div>
            </div>
            <div class="allAssets">
              <div
                v-for="(item, index) in multiCollateralValuesRatios"
                :key="index"
                class="portfolioTabsContainer"
                :class="{
                  assetSelected:
                    selectedAsset ==
                    collateralAssets.filter((asset) => asset.key === index)[0],
                }"
                @click="onAssetSelect(index)"
              >
                <div class="assetTabLeft">
                  <div class="icon">
                    <img
                      v-if="
                        selectedAsset ==
                        collateralAssets.filter(
                          (asset) => asset.key === index
                        )[0]
                      "
                      :src="
                        theme == 'light'
                          ? require(`@/static/${
                              collateralAssets.filter(
                                (asset) => asset.key == index
                              )[0].img
                            }`)
                          : require(`@/static/${
                              collateralAssets.filter(
                                (asset) => asset.key == index
                              )[0].darkimg
                            }`)
                      "
                    />
                    <img
                      v-else
                      :src="
                        require(`@/static/${
                          collateralAssets.filter(
                            (asset) => asset.key == index
                          )[0].inactive
                        }`)
                      "
                      alt="inactiveLogo"
                    />
                  </div>
                  <div class="assetName">
                    {{ displayKey(index) }}
                  </div>
                </div>
                <!-- <div class="assetTabRight"> -->
                <div
                  class="assetTabRight"
                  :class="[
                    multiCollateralValuesRatios[index] == 0
                      ? 'noPRatioBal'
                      : multiCollateralValuesRatios[index] <= 200
                      ? 'lowAssetBal'
                      : multiCollateralValuesRatios[index] >=
                        getAssetTargetRatio(index)
                      ? 'highAssetBal'
                      : 'midAssetBal',
                  ]"
                >
                  {{ multiCollateralValuesRatios[index] }}
                </div>
              </div>
              <!-- <div class="dissolve"></div> -->
            </div>
          </div>
          <div class="loadingImg" v-if="loading">
            <div class="loading-page"><Spin size="large"></Spin></div>
          </div>
          <div class="loadingImg" v-else>
            <div class="ratioBox">
              <div class="context">
                <div class="pRatioTitle">
                  <img
                    :src="
                      theme == 'light'
                        ? require(`@/static/${this.selectedAsset.img}`)
                        : require(`@/static/${this.selectedAsset.darkimg}`)
                    "
                  />
                  {{ this.selectedAsset.name.toUpperCase() }} Pledge Ratio
                  <img
                    v-if="isMobile"
                    class="showInfoMobile"
                    src="@/static/info_grey.svg"
                    @click="showModal(1)"
                  />

                  <Tooltip
                    v-else-if="!isMobile"
                    max-width="200"
                    class="globalInfoStyle"
                    content="Target ratio is the minimum threshold that needs to be maintained to claim rewards or unlock collateral."
                    placement="bottom"
                    offset="0 6"
                  >
                    <img
                      v-if="theme === 'light'"
                      src="@/static/info_grey.svg"
                    />
                    <img v-else src="@/static/info_grey.svg" />
                  </Tooltip>
                </div>

                <!-- <div class="currentRatio"> -->
                <div
                  class="currentRatio"
                  :class="[
                    multiCollateralValuesRatios &&
                    multiCollateralValuesRatios[this.selectedAsset.key] == 0
                      ? 'noPRatioBal'
                      : multiCollateralValuesRatios &&
                        multiCollateralValuesRatios[this.selectedAsset.key] <=
                          200
                      ? 'lowAssetBal'
                      : multiCollateralValuesRatios &&
                        multiCollateralValuesRatios[this.selectedAsset.key] >=
                          getAssetTargetRatio(this.selectedAsset.key)
                      ? 'highAssetBal'
                      : 'midAssetBal',
                  ]"
                >
                  {{
                    walletDetails.amountDebtBeforeFormat < 0.01
                      ? 0
                      : multiCollateralValuesRatios
                      ? multiCollateralValuesRatios[this.selectedAsset.key]
                      : 0
                  }}
                </div>
              </div>
              <div class="percentBox">
                <div class="cursorBox">
                  <div
                    class="cursor"
                    :style="{
                      left: cursorPosition + '%!important',
                      marginLeft:
                        cursorPosition > 2 ? '-6px!important' : '0px!important',
                    }"
                  ></div>
                </div>
                <div class="scale200"></div>
                <div class="scale500"></div>
                <div class="colorBlock">
                  <div class="leftBlock"></div>
                  <div class="centerBlock"></div>
                  <div class="rightBlock"></div>
                </div>
                <div class="flag">
                  <div class="item">Liquidate: 200</div>
                  <div class="item">
                    Target:
                    {{
                      this.selectedAsset.targetRatio
                        ? this.selectedAsset.targetRatio * 100
                        : "500"
                    }}
                  </div>
                </div>
                <div
                  class="countDown"
                  v-if="
                    multiCollateralValuesRatios &&
                    multiCollateralValuesRatios[this.selectedAsset.key] < 200 &&
                    liquidationStatus &&
                    liquidationStatus.status &&
                    liquidationStatus.collateralCurrency ==
                      this.selectedAsset.contractKey
                  "
                >
                  Liquidating in {{ liquidationCountDown }}
                </div>
                <div class="countDown" v-else></div>
              </div>
            </div>
            <div class="tokenBox">
              <div class="box">
                <div class="tokenItems obtrusive">
                  <div class="leftAsset">
                    {{
                      isEthereumNetwork
                        ? walletDetails.avaliableLINA || 0
                        : walletDetails.amountLINA || 0
                    }}
                    {{ this.selectedAsset.name.toUpperCase() }}
                  </div>
                  <div class="tokenItemTop">
                    <div class="right">
                      ≈ ${{
                        isEthereumNetwork
                          ? walletDetails.avaliableLINA2USD || 0
                          : walletDetails.amountLINA2USD || 0
                      }}
                      USD
                    </div>
                    <div class="right">
                      1 {{ this.selectedAsset.name }} = ${{
                        walletDetails.LINA2USDRate || 0
                      }}
                      USD
                    </div>
                  </div>
                </div>
                <div class="tokenItems unobtrusive">
                  <div class="left">Available</div>
                  <div class="right">
                    {{ walletDetails.avaliableLINA || 0 }}
                    {{ this.selectedAsset.name }}
                  </div>
                </div>
                <div class="tokenItems unobtrusive">
                  <div class="left">Staked</div>
                  <div class="right">
                    <template v-if="isEthereumNetwork"> N/A </template>
                    <template v-else>
                      {{ walletDetails.stakedLINA || 0 }}
                      {{ this.selectedAsset.name }}
                    </template>
                  </div>
                </div>

                <div
                  class="tokenItems unobtrusive"
                  v-if="this.selectedAsset.key === 'LINA'"
                >
                  <div class="left">
                    Locked
                    <span
                      v-show="walletDetails.lockLINA"
                      @click="openUnlockSchedule"
                      class="unlockScheduleButton"
                    >
                      <expandMoreSvg></expandMoreSvg>
                    </span>
                  </div>
                  <div class="right">
                    <template v-if="isEthereumNetwork"> N/A </template>
                    <template v-else>
                      {{ walletDetails.lockLINA || 0 }}
                      {{ this.selectedAsset.name }}
                    </template>
                  </div>
                </div>
                <div class="tokenItems unobtrusive" v-else>
                  <div class="left"></div>
                  <div class="right">
                    <template v-if="isEthereumNetwork"></template>
                  </div>
                </div>
              </div>
            </div>
            <div class="portfolioBox">
              <div class="box">
                <div class="tokenItems obtrusive singer">
                  <div class="left">
                    Debt
                    <img
                      v-if="isMobile"
                      class="showInfoMobile"
                      src="@/static/info_grey.svg"
                      @click="showModal(2)"
                    />

                    <Tooltip
                      v-else-if="!isMobile"
                      max-width="200"
                      class="globalInfoStyle"
                      content="Total value that must be paid off before unlocking collateral. Fluctuates depending on trading activity."
                      placement="bottom"
                      offset="0 6"
                    >
                      <img
                        v-if="theme === 'light'"
                        src="@/static/info_grey.svg"
                      />
                      <img v-else src="@/static/info_grey.svg" />
                    </Tooltip>
                  </div>
                  <div class="right">
                    <div
                      class="top"
                      :style="{
                        marginTop: isEthereumNetwork ? '9px' : '0px',
                      }"
                    >
                      <template v-if="!isEthereumNetwork">
                        <b>{{ walletDetails.amountDebt || 0 }}</b>
                        ℓUSD
                      </template>
                      <template v-if="isEthereumNetwork"> N/A </template>
                    </div>
                    <div class="bottom" v-if="!isEthereumNetwork">
                      ≈ ${{ walletDetails.amountDebt2USD || 0 }}
                      USD
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tokenBox">
          <img
            v-if="theme === 'light'"
            class="tokenIcon"
            src="@/static/collateral.svg"
          />
          <img v-else class="tokenIcon" src="@/static/collateral_dark.svg" />
          <div class="box">
            <div class="tokenItems obtrusive">
              <div class="left">Collateral</div>
              <div class="rightCollateral">${{ sumOfTotalCollateral }} USD</div>
            </div>
            <div
              class="expandIcon"
              @click="toggleShowCollateral"
              v-if="sumOfTotalCollateral != 0"
            >
              <img src="@/static/arrow_down_blue.svg" v-if="!showCollaterals" />

              <div v-if="showCollaterals">
                <div
                  v-for="(item, index) in multiCollateralValuesTotalCollateral"
                  :key="index"
                  class="collateralsContainer"
                >
                  <div>
                    {{ getCollateralName(index) }}
                  </div>
                  <div>
                    {{
                      formatCollateral(
                        multiCollateralValuesTotalCollateral[index]
                      )
                    }}
                    USD
                  </div>
                </div>
                <img src="@/static/arrow_up_blue.svg" />
              </div>
            </div>
          </div>
        </div>
        <div class="tokenBox">
          <img
            v-if="theme === 'light'"
            class="tokenIcon"
            src="@/static/LUSD_logo.svg"
          />
          <img
            v-else
            class="tokenIcon"
            src="@/static/dark-theme/LUSD_logo.svg"
          />
          <div class="box">
            <div class="tokenItems obtrusive">
              <div class="left">ℓUSD</div>
              <div class="rightCollateral">
                <b>{{ walletDetails.amountlUSD || 0 }} ℓUSD</b>
              </div>
            </div>
            <div class="tokenItems">
              <div class="right">
                1 ℓUSD = ${{ walletDetails.lUSD2USDRate || 1 }}
                USD
              </div>
              <div class="right">
                ≈ ${{ walletDetails.amountlUSD2USD || 0 }} USD
              </div>
            </div>
          </div>
        </div>
        <div class="tokenBox">
          <img
            v-if="theme === 'light'"
            class="tokenIcon"
            src="@/static/LUSD_logo.svg"
          />
          <img
            v-else
            class="tokenIcon"
            src="@/static/dark-theme/LUSD_logo.svg"
          />
          <div class="box">
            <div class="tokenItems obtrusive singer">
              <div class="left liquidsLeft">
                Liquids
                <img
                  v-if="isMobile"
                  class="showInfoMobile"
                  src="@/static/info_grey.svg"
                  @click="showModal(3)"
                />
                <Tooltip
                  v-else-if="!isMobile"
                  max-width="200"
                  class="globalInfoStyle"
                  content="Total value of synthetic exposure created using Linear.Exchange."
                  placement="bottom"
                  offset="0 6"
                >
                  <img
                    v-if="theme === 'light'"
                    src="@/static/new_info_white.svg"
                  />
                  <img v-else src="@/static/dark-theme/new_info_white.svg" />
                </Tooltip>
              </div>
              <div class="right">
                <div class="rightCollateral">
                  {{ walletDetails.liquids || 0 }} ℓUSD
                </div>
                <div class="bottom">
                  ≈ ${{ walletDetails.liquids2USD || 0 }} USD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="totalBalanceToUSD">
        <div class="box">
          <div class="title">Total Crypto Balance in USD</div>
          <div class="amount">${{ walletDetails.totalBalanceInUsd || 0 }}</div>
        </div>

        <svg
          class="refreshBtn"
          :class="{
            selected: refreshSelected,
            refreshing: walletStatus == 0,
          }"
          @click="getdata"
          xmlns="http://www.w3.org/2000/svg"
          :width="mShowWallet ? 40 : 64"
          :height="mShowWallet ? 40 : 64"
          viewBox="0 0 64 64"
          @mousedown="refreshSelected = true"
          @mouseup="refreshSelected = false"
        >
          <!-- :class="{ refreshing: walletStatus == 0 }" -->
          <g fill="none" fill-rule="evenodd">
            <g>
              <g>
                <g
                  class="border"
                  stroke="#E5E5E5"
                  transform="translate(-1110 -917) translate(1110 917)"
                >
                  <circle cx="32" cy="32" r="31.5" />
                </g>
                <g stroke="#7A8BA5" fill="#99999A" class="shape">
                  <path
                    d="M9.062 22.422C10.185 27.514 14.718 31.2 20 31.2c4.593 0 8.646-2.79 10.353-6.917l-6.214 1.094c-.387.068-.758-.154-.89-.51l-.037-.139c-.068-.387.154-.757.51-.889l.14-.038 7.878-1.389c.386-.068.757.154.889.51l.037.14 1.39 7.878c.076.435-.214.85-.65.926-.386.069-.757-.153-.889-.51l-.037-.139-.984-5.581C29.385 29.943 24.97 32.8 20 32.8c-6.037 0-11.217-4.212-12.5-10.033-.095-.432.178-.859.609-.954.432-.095.858.178.953.61zm11.22-16.628c6.037 0 11.216 4.213 12.5 10.034.094.431-.178.858-.61.953-.431.095-.858-.178-.953-.609-1.122-5.091-5.655-8.778-10.938-8.778-4.593 0-8.646 2.79-10.352 6.918l6.213-1.095c.387-.068.758.154.89.51l.037.14c.068.386-.154.757-.51.889l-.139.037-7.878 1.39c-.387.068-.758-.154-.89-.51l-.037-.14-1.39-7.878c-.076-.435.215-.85.65-.927.386-.068.757.154.889.51l.037.14.984 5.58c2.112-4.307 6.527-7.164 11.496-7.164z"
                    transform="translate(-1110 -917) translate(1110 917) translate(11.8 12.8)"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
    <Modal
      v-model="modalPopup"
      :footer-hide="true"
      :closable="true"
      :transfer="false"
      :mask="true"
      class="introductActionModal"
    >
      <div class="title">Build ℓUSD</div>
      <div class="context">
        {{ this.modalText }}
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from "lodash";
import Clipboard from "clipboard";
import { storeDetailsData } from "@/assets/linearLibrary/linearTools/request";

import {
  CHAIN_CHANGE_TYPE,
  isBinanceNetwork,
  isEthereumNetwork,
  SUPPORTED_WALLETS,
  LIQUIDATION_NETWORKS,
  SUPPORTED_NETWORKS_MAP,
  SUPPORTED_NETWORKS,
  SUPPORTED_NETWORKS_CONFIG,
} from "@/assets/linearLibrary/linearTools/network";
import lnrJSConnector, {
  selectedWallet,
} from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import ethereumSvg from "@/components/svg/ethereum";
import binanceSvg from "@/components/svg/binance";

import expandMoreSvg from "@/components/svg/more";
import {
  abbreviateAddress,
  abbreviateAddressMobile,
  getAssetObjectInfo,
  formatNumber,
} from "@/assets/linearLibrary/linearTools/format";
import { lnr } from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";
import ThemeSwitch from "~/components/themeSwitch.vue";
import { collateralAssets } from "~/assets/linearLibrary/linearTools/collateralAssets";
import { LINA } from "~/common/currency";

export default {
  name: "walletDetails",
  data() {
    return {
      SUPPORTED_NETWORKS_MAP,
      tooltipContent: "Copy to clipboard",
      // refreshing: false, //刷新钱包详情数据中
      isShowChainList: false,
      transactionStatus: false, //历史记录窗口状态
      transactionIconStatus: 0, //鼠标状态 0离开,1进入

      trackStatus: false, //踪迹窗口状态
      trackIconStatus: 0, //鼠标状态 0离开,1进入

      referStatus: false, //推荐窗口状态
      referIconStatus: 0, //鼠标状态 0离开,1进入

      chainChanging: false,

      SUPPORTED_WALLETS,

      refreshSelected: false,

      cursorPosition: 0,

      liquidationCountDown: "",
      liquidationCountDownId: 0,

      //移动端 显示钱包状态
      mShowWallet: false,
      variant: "desktop",
      loading: false,
      ratioObj: {},
      selectedAsset: collateralAssets[0],
      showCollaterals: false,
      collateralAssets: collateralAssets,
      perAssetCurrentRatio: {},
      perAssetTotalCollateral: {},
      onDrag: false,
      modalPopup: false,
      modalText: "",
    };
  },
  components: {
    ethereumSvg,
    binanceSvg,
    expandMoreSvg,
    ThemeSwitch,
  },
  watch: {
    trackStatusChange() {},
    walletStatus() {},
    walletAddress() {},
    abbreviateAddress() {},
    walletDetails(data) {},
    isEthereumNetwork() {},
    isBinanceNetwork() {},
    walletNetworkId() {},
    walletType() {},
    sumOfTotalCollateral() {},
    multiCollateralValuesRatios() {},
    multiCollateralValuesTotalCollateral() {},
    isMobile: {
      handler(mobile) {
        if (mobile === true) {
          this.variant = "mobile";
        } else {
          this.variant = "desktop";
        }
      },
      immediate: true,
    },
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
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
    walletType() {
      return this.$store.state?.walletType;
    },
    walletStatus() {
      return this.$store.state?.wallet?.status;
    },
    walletNetworkName() {
      return this.$store.state?.walletNetworkName;
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    liquidationStatus() {
      return this.$store.state?.liquidationStatus;
    },
    abbreviateAddress() {
      if (this.$store.state.isMobile) {
        return abbreviateAddressMobile(this.walletAddress);
      } else {
        return abbreviateAddress(this.walletAddress);
      }
    },
    multiCollateralAsset() {
      return this.$store.state?.multiCollateralAsset;
    },
    portfolioAsset() {
      return this.$store.state?.portfolioAsset;
    },
    multiCollateralValuesRatios() {
      return this.$store.state?.multiCollateralValues.currentRatio;
    },
    multiCollateralValuesTotalCollateral() {
      return this.$store.state?.multiCollateralValues.totalCollateralValueInUsd;
    },
    sumOfTotalCollateral() {
      let collateralValue = this.$store.state?.multiCollateralValues
        .totalCollateralValueInUsd || [0];
      return formatNumber(
        Object.values(collateralValue).reduce((a, b) => a + b)
      );
    },
    walletDetails() {
      if (this.$store.state?.walletDetails.currentRatioPercent > 700) {
        this.cursorPosition = 98;
      } else {
        this.cursorPosition =
          (this.$store.state?.walletDetails.currentRatioPercent / 700) * 100;
      }
      return _.clone(this.$store.state?.walletDetails);
    },
    //当前抵押率占目标抵押率的百分比
    currentRatio() {
      var currentRatio = 0;

      if (Object.keys(this.walletDetails).length !== 0) {
        currentRatio =
          (this.walletDetails.currentRatioPercent /
            this.walletDetails.targetRatioPercent) *
          100;
        if (currentRatio > 100) currentRatio = 100;
      }

      return currentRatio;
    },
    theme() {
      return this.$store.state.theme;
    },
    walletDetails() {
      const asset = this.$store.state?.portfolioAsset;
      const maxRatio = getAssetObjectInfo(asset).maxTotalPRatio;
      const targetRatio = getAssetObjectInfo(asset).targetRatio * 100;
      const currentRatio = this.$store.state?.walletDetails.currentRatioPercent;
      const yellowRatio = targetRatio - 200;
      const liquidatedRatio = 200;
      const assetArr = ["ETH", "BTCB"];

      if (asset == LINA || asset == "WBNB") {
        currentRatio > 600
          ? (this.cursorPosition = 98)
          : (this.cursorPosition = (currentRatio / 600) * 100);
      } else if (assetArr.includes(asset)) {
        if (currentRatio > maxRatio || currentRatio < 50) {
          currentRatio < 50
            ? (this.cursorPosition = 0)
            : (this.cursorPosition = 98);
        } else if (currentRatio <= 200) {
          const pxAway = (200 - currentRatio) / (150 / 33.3);
          this.cursorPosition = 33.3 - pxAway;
        } else if (currentRatio >= targetRatio) {
          const pxAway = (maxRatio - currentRatio) / (150 / 33.3);
          this.cursorPosition = 100 - pxAway;
        } else {
          this.cursorPosition =
            33.3 + 33.3 * ((currentRatio - liquidatedRatio) / yellowRatio);
        }
      } else {
        console.error("unsupported asset");
      }
      return _.clone(this.$store.state?.walletDetails);
    },
  },
  created() {
    //订阅历史记录窗口关闭事件
    this.$pub.subscribe("transactionModalCloseEvent", (msg, params) => {
      this.transactionStatus = false;
    });
    //订阅历史记录窗口关闭事件
    this.$pub.subscribe("trackModalCloseEvent", (msg, params) => {
      this.trackStatus = false;
    });
    //订阅钱包账户改变事件
    this.$pub.subscribe("onWalletAccountChange", (msg, params) => {
      this.walletStatusChange(true);
    });
    //订阅链改变事件
    this.$pub.subscribe("onWalletChainChange", (msg, params) => {
      this.walletStatusChange();
    });
  },
  destroyed() {
    //关闭自动刷新
    this.$pub.publish("onWalletDetailsLoopRefreshStop");
  },
  mounted() {
    // 测试用,无用时删除
    // _.delay(this.trackModalClick, 500)
    // 测试用,无用时删除

    this.checkLiquidation();

    //根据url参数判断是否打开track transaction referral
    if (this.$store.state?.walletDetailsActionURL) {
      switch (this.$store.state?.walletDetailsActionURL) {
        case "transaction":
          this.transactionStatus = true;
          this.$pub.publish("transactionModalChange", true);
          break;
        case "track":
          this.trackStatus = true;
          this.$pub.publish("trackModalChange", true);
          break;
      }

      this.$store.commit("setWalletDetailsActionURL", "");
    }
  },
  methods: {
    displayKey(key) {
      return getAssetObjectInfo(key).name;
    },
    showModal(textNumber) {
      this.modalPopup = true;
      switch (textNumber) {
        case 1:
          this.modalText =
            "Target ratio is the minimum threshold that needs to be maintained to claim rewards or unlock collateral.";
          break;
        case 2:
          this.modalText =
            "Total value that must be paid off before unlocking collateral. Fluctuates depending on trading activity.";
          break;
        case 3:
          this.modalText =
            "Total value of synthetic exposure created using Athos.Exchange.";
      }
    },
    toggleShowCollateral() {
      this.showCollaterals = !this.showCollaterals;
    },
    getCollateralName(asset) {
      return getAssetObjectInfo(asset).name;
    },
    getAssetTargetRatio(assetKey) {
      return getAssetObjectInfo(assetKey).targetRatio * 100;
    },
    formatCollateral(value) {
      return formatNumber(value);
    },
    async onAssetSelect(item) {
      if (this.onDrag) return;
      const assetObj = collateralAssets.filter((asset) => asset.key == item)[0];
      this.loading = true;
      // this.$store.commit("setMultiCollateralAsset", item);
      this.$store.commit("setPortfolioAsset", item);
      await this.getdata();
      this.selectedAsset = assetObj;
      await this.checkLiquidation();
      this.loading = false;
    },
    async getdata() {
      await storeDetailsData();
    },
    async triggerSwitchChain(chainId, account) {
      const provider = await lnrJSConnector.signer.provider.provider;

      provider
        ?.send("wallet_switchEthereumChain", [
          {
            chainId: SUPPORTED_NETWORKS_CONFIG[chainId].hexChainId,
          },
          account,
        ])
        .catch((err) => {
          if (err?.code === 4001) return;
          const params = SUPPORTED_NETWORKS_CONFIG[chainId];
          const obj = {};
          obj.chainId = SUPPORTED_NETWORKS_CONFIG[chainId].hexChainId;
          obj.chainName = params?.name;
          obj.nativeCurrency = params?.nativeCurrency;
          obj.rpcUrls = params?.rpcUrl;
          obj.blockExplorerUrls = params?.blockExplorerUrls;

          provider?.send("wallet_addEthereumChain", [obj, account]);
        });
    },
    async checkLiquidation() {
      try {
        clearInterval(this.liquidationCountDownId);

        //如果是bsc main/bsc(私链)则检查liquidation
        if (LIQUIDATION_NETWORKS[this.walletNetworkId] !== undefined) {
          let liquidationStatus = await lnr.userPositionMarked({
            account: this.walletAddress,
          });

          if (liquidationStatus.length > 0 && liquidationStatus[0].state) {
            //已标记
            this.$store.commit("setLiquidationStatus", {
              status: liquidationStatus[0].state,
              timestamp: liquidationStatus[0].timestamp / 1000,
            });

            this.liquidationCal();
            this.liquidationCountDownId = setInterval(
              this.liquidationCal,
              60000
            );
          } else {
            //未标记要清除
            this.$store.commit("setLiquidationStatus", {
              status: false,
              timestamp: 0,
            });
          }
        }
      } catch (e) {
        console.log(e, "wallet details check liquidation err");
      }
    },
    async onAssetSelect(item) {
      if (this.onDrag) return;
      const assetObj = collateralAssets.filter((asset) => asset.key == item)[0];
      this.loading = true;
      // this.$store.commit("setMultiCollateralAsset", item);
      this.$store.commit("setPortfolioAsset", item);
      await this.getdata();
      this.selectedAsset = assetObj;
      await this.checkLiquidation();
      this.loading = false;
    },

    //liquidated清算倒计时
    liquidationCal() {
      let currentTimstamp = Math.round(new Date() / 1000);
      let liquidationWindow =
        this.$store.state?.liquidationStatus.timestamp +
        172800 -
        currentTimstamp;

      if (liquidationWindow < 0) {
        //已经过了三天窗口
        clearInterval(this.liquidationCountDownId);
        this.liquidationCountDown = "0h 0m";
        return;
      }

      let liquidationWindowHour = _.floor(liquidationWindow / 3600);
      let liquidationWindowMinute = _.floor((liquidationWindow % 3600) / 60);

      if (liquidationWindowHour != 0) {
        this.liquidationCountDown =
          liquidationWindowHour + "h " + liquidationWindowMinute + "m";
      } else {
        this.liquidationCountDown = liquidationWindowMinute + "m";
      }
    },

    //测试复制文字
    copyAddress() {
      var that = this;
      var clipboarda = new Clipboard(".copyBtn");
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

    async changeChain(walletType) {
      return;

      //不重复连接
      if (walletType == this.walletType || this.chainChanging) return;

      this.chainChanging = true;
      const staus = await selectedWallet(walletType);

      staus &&
        this.$pub.publish("onWalletChainChange", CHAIN_CHANGE_TYPE.WALLET);
      this.chainChanging = false;
    },

    //获取当前钱包详情数据
    async getdata() {
      // this.refreshing = true;
      await storeDetailsData();
      // this.refreshing = false;
    },

    //历史记录窗口状态改变
    transactionModalClick() {
      this.transactionStatus = !this.transactionStatus;
      this.$pub.publish("transactionModalChange", this.transactionStatus);

      //窗口打开时关闭其他两个窗口
      if (this.transactionStatus) {
        this.referStatus = false;
        this.trackStatus = false;
        this.$pub.publish("trackModalChange", this.trackStatus);

        if (this.mShowWallet) {
          this.mShowWallet = false;
        }
      }
    },

    //踪迹窗口状态改变
    trackModalClick() {
      this.trackStatus = !this.trackStatus;
      this.$pub.publish("trackModalChange", this.trackStatus);

      //窗口打开时关闭其他两个窗口
      if (this.trackStatus) {
        this.transactionStatus = false;
        this.referStatus = false;
        this.$pub.publish("transactionModalChange", this.transactionStatus);

        if (this.mShowWallet) {
          this.mShowWallet = false;
        }
      }
    },

    walletStatusChange(forceAction = false) {
      //切换钱包关闭窗口,防止出错
      this.referStatus = false;
      this.transactionStatus = false;
      this.trackStatus = false;
      this.$pub.publish("referralModalChange", this.referStatus);
      this.$pub.publish("transactionModalChange", this.transactionStatus);
      this.$pub.publish("trackModalChange", this.trackStatus);

      const currentAction = this.$store.state?.currentAction;

      this.checkLiquidation();

      //build,swap
      if (![1, 5].includes(currentAction) || forceAction) {
        this.$store.commit("setCurrentAction", 0);
        this.$router.push("/");
      }
    },
    mShowMenuFun() {
      this.$store.commit("setmMenuState", true);
    },

    //断开连接
    async disconnect() {
      // this.$store.commit("setWallet", "");
      this.$store.commit("setAutoConnect", false);
      let registeredWalletConnectEvents =
        $nuxt.$store.state?.registeredWalletConnectEvents;
      if (registeredWalletConnectEvents) {
        await lnrJSConnector.signer.provider.provider.disconnect();
        this.$store.commit("setRegisteredWalletConnectEvents", false);
      }
      location.reload();
    },

    openUnlockSchedule() {
      this.$store.commit("setIsUnlockScheduleShow", true);
    },

    showTooltipModle() {
      this.$store.commit("setIsShowTooltipModle", true);
    },
  },
};
</script>

<style lang="scss">
#walletDetails {
  width: 374px;

  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotate(360deg);
    }
    to {
      -webkit-transform: rotate(0deg);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  .img-fade-enter-active,
  .img-fade-leave-active {
    transition: opacity $animete-time;
  }

  .img-fade-enter,
  .img-fade-leave-to {
    opacity: 0;
  }

  .walletAndAddressBox {
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    // transform: translateX(-80px);

    .info {
      width: calc(100% - 32px - 8px);
      padding: 3px 16px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      border-radius: 20px;
      border: 1px solid #fff;

      &-themeSwitch {
        margin-left: 16px;
      }

      .app-dark & {
        background: $darkBackgroundColor;
      }

      .network {
        margin-right: 8px;
        width: 16px;
        height: 16px;
      }

      .wallet {
        margin-right: 8px;
        font-family: Gilroy-Bold;
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #5a575c;

        .app-dark & {
          color: $darkFontColorSecondary;
        }
      }

      .address {
        flex: 1;
        font-family: Gilroy-Regular;
        font-size: 14px;
        margin-right: 4px;
        text-align: center;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #475a75;

        .app-dark & {
          color: #dde4e9;
        }
      }

      .copyBtn {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin-top: 4px;
        margin-right: 12px;

        &:hover {
          #Combined-Shape {
            fill: #1a38f8;
            stroke: #1a38f8;
          }
        }
        .app-dark & {
          &,
          #Combined-Shape {
            fill: #ffffff;
            stroke: #ffffff;
          }
        }
      }

      .disconnect {
        font-family: Gilroy-Bold;
        font-size: 10px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: 1.25px;
        text-align: center;
        color: #475a75;
        text-transform: uppercase;
        cursor: pointer;
        transition: $animete-time linear;

        .app-dark & {
          color: $darkFontColorSecondary;
          &:hover {
            color: #fff;
          }
        }

        &:hover {
          color: #1a38f8;
        }
      }
    }

    .chainChange {
      position: relative;
      width: calc(100% - 32px - 8px);
      padding: 3px 16px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      border-radius: 20px;
      border: 1px solid #fff;
      color: #fff;
      cursor: pointer;
      margin-right: 20px;

      & > .showList {
        transform: rotate(-90deg);
      }

      & > .mNetworkName {
        margin: 0 4px;
      }

      &-list {
        position: absolute;
        top: 36px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 10px;
        overflow: hidden;
        background-color: #151927;
        box-shadow: rgba(72, 69, 69, 0.2) 0px 8px 24px;
        z-index: 99;

        &-item {
          display: flex;
          align-items: center;
          padding: 7px 16px 7px 10px;
          transition: all 0.5s;

          & > span {
            margin-left: 8px;
          }
        }

        &-item:hover {
          background-color: #ffffff27;
        }
      }
    }

    .mMenu {
      display: none;
    }
    .menu {
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .walletAndAddressBoxLight {
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // transform: translateX(-80px);

    .info {
      width: calc(100% - 32px - 8px);
      padding: 3px 16px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      border-radius: 20px;
      border: 1px solid #475a75;

      &-themeSwitch {
        margin-left: 16px;
      }

      .app-dark & {
        background: $darkBackgroundColor;
      }

      .network {
        margin-right: 8px;
        width: 16px;
        height: 16px;
      }

      .wallet {
        margin-right: 8px;
        font-family: Gilroy-Bold;
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #5a575c;

        .app-dark & {
          color: $darkFontColorSecondary !important;
        }
      }

      .address {
        flex: 1;
        font-family: Gilroy-Regular;
        font-size: 14px;
        margin-right: 4px;
        text-align: center;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #99999a;

        .app-dark & {
          color: $darkFontColorSecondary;
        }
      }

      .copyBtn {
        cursor: pointer;
        width: 16px;
        height: 16px;
        margin-top: 4px;
        margin-right: 12px;

        &:hover {
          #Combined-Shape {
            fill: #1a38f8;
            stroke: #1a38f8;
          }
        }
        .app-dark & {
          &,
          #Combined-Shape {
            fill: #ffffff;
            stroke: #ffffff;
          }
        }
      }

      .disconnect {
        font-family: Gilroy-Bold;
        font-size: 10px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: 1.25px;
        text-align: center;
        color: #475a75;
        text-transform: uppercase;
        cursor: pointer;
        transition: $animete-time linear;

        .app-dark & {
          color: $darkFontColorSecondary !important;
          &:hover {
            color: #fff;
          }
        }

        &:hover {
          color: #1a38f8;
        }
      }
    }

    .chainChange {
      position: relative;
      width: calc(100% - 32px - 8px);
      padding: 3px 16px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      border-radius: 20px;
      border: 1px solid #475a75;
      color: #475a75;
      cursor: pointer;
      margin-right: 20px;

      & > .showList {
        transform: rotate(-90deg);
      }

      & > .mNetworkName {
        margin: 0 4px;
      }

      &-list {
        position: absolute;
        top: 36px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        z-index: 99;

        &-item {
          display: flex;
          align-items: center;
          padding: 7px 16px;
          transition: all 0.5s;

          & > span {
            margin-left: 8px;
          }
        }

        &-item:hover {
          background-color: #00000027;
        }
      }
    }

    .mMenu {
      display: none;
    }
    .menu {
      margin-left: 8px;
      margin-right: 8px;
      cursor: pointer;
    }
  }

  .walletDetailsBox {
    width: 100%;
    height: 840px;

    .ivu-tooltip-rel {
      transition: $animete-time linear;
      line-height: 1;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .mWalletHead {
      display: none;
    }
    .actionsBox {
      display: flex;
      justify-content: space-around;

      .box {
        .boxItem {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: #99999a;
          text-align: center;
          text-transform: uppercase;
          cursor: pointer;
          transition: $animete-time linear;
          font-weight: bold;
          letter-spacing: 1.5px;
          font-family: $BodyTextFontFamily;
          font-size: 12px;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;

          .placeholder {
            width: 48px;
            height: 48px;
            margin-bottom: 8px;
            position: relative;

            img {
              left: 0;
              width: 48px;
              position: absolute;
              transform: translateZ(0);
            }
          }

          &:hover,
          &.selected {
            color: #1a38f8;
            .app-dark & {
              color: $darkFontColorLight;
            }
          }
        }
      }
    }

    .loadingImg {
      height: 330px;
    }
    .loading-page {
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @-moz-keyframes spin {
      100% {
        -moz-transform: rotate(360deg);
      }
    }
    @-webkit-keyframes spin {
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes spin {
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    .ratioBox {
      border-top: solid 1px #e5e5e5;
      border-bottom: solid 1px #e5e5e5;
      padding: 24px 0;

      .title {
        font-family: Gilroy-bold;
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #5a575c;
        margin-bottom: 8px;

        .app-dark & {
          color: $darkFontColorLight;
        }
      }

      .currentRatio {
        font-family: Gilroy-Bold;
        font-size: 32px;
        text-align: center;
        color: #1d2639;

        .app-dark & {
          color: $darkFontColorLight;
        }

        &.noPRatioBal {
          color: #5a575c;

          .app-dark & {
            color: #e5e5e5;
          }
        }
        &.highAssetBal {
          color: #3ecb87;
        }
        &.midAssetBal {
          color: #f2c94c;

          .app-dark & {
            color: #e5e5e5;
          }
        }
        &.lowAssetBal {
          color: #df434c;
        }
      }

      .countDown {
        font-family: Gilroy-Bold;
        font-size: 12px;
        text-align: center;
        color: #df434c;
        height: 14px;
      }

      .context {
        display: flex;
        justify-content: space-between;
        font-family: $BodyTextFontFamily;
        font-size: 14px;
        text-align: center;
        color: #1d2639;
        font-weight: 700;
        line-height: 24px;
        align-items: center;

        .pRatioTitle {
          margin: 10px 0;
          font-family: Gilroy-Bold;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
        }

        .globalInfoStyle {
          img {
            height: 16px;
            width: 16px;
          }
        }

        .app-dark & {
          color: $darkFontColorLight;
        }

        img {
          margin-top: -3px;
          margin-left: 2px;
          height: 40px;
          width: 40px;
        }
        .showInfoMobile {
          margin-left: 4px;
        }
      }

      .percentBox {
        position: relative;

        .cursorBox {
          .cursor {
            width: 0;
            height: 0;
            position: relative;
            margin-bottom: -3px;
            border: 6px solid;
            border-color: black transparent transparent;

            .app-dark & {
              border-color: white transparent transparent;
            }
          }
        }

        .scale200,
        .scale500 {
          width: 1px;
          height: 24px;
          background-color: #5a575c;
          position: absolute;

          .app-dark & {
            color: $darkFontColorLight;
          }
        }

        .scale200 {
          left: 33.3%;
        }

        .scale500 {
          left: 66.7%;
        }

        .colorBlock {
          width: 100%;
          display: flex;

          .leftBlock {
            width: 33.3%;
            height: 16px;
            border-bottom-left-radius: 100px;
            border-top-left-radius: 100px;
            background-color: #df434c;
          }

          .centerBlock {
            width: 33.4%;
            height: 16px;
            background-color: #ffc941;
          }

          .rightBlock {
            width: 33.3%;
            height: 16px;
            border-bottom-right-radius: 100px;
            border-top-right-radius: 100px;
            background-color: #7eb5ff;
          }
        }

        .flag {
          display: flex;
          margin-top: 12px;

          .item {
            font-family: $BodyTextFontFamily;
            font-size: 12px;
            text-align: center;
            color: #475a75;

            &:first-child {
              margin-left: 21%;
            }
            &:last-child {
              margin-left: 3%;
            }

            .app-dark &:first-child {
              color: $darkFontColor;
            }

            .app-dark &:last-child {
              color: $darkFontColor;
            }
          }
        }
      }
    }

    .walletInfo {
      margin: 24px 0px;

      .portfolioSection {
        border: 1px solid #5a575c;
        border-radius: 10px;
        padding: 5px 15px;
      }

      .tokenIcon {
        border-radius: 50%;
      }

      .title {
        font-family: Gilroy-bold;
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #5a575c;
        margin-bottom: 8px;

        .app-dark & {
          color: $darkFontColorLight;
        }
      }

      .tokenBox {
        padding: 12px 0;
        border-bottom: solid 1px #e5e5e5;
      }

      .portfolioBox,
      .tokenBox {
        display: flex;
        .tokenIcon {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }

        .allAssets {
          display: flex;
          overflow-x: scroll;
          padding: 0 0 15px 0;

          &::-webkit-scrollbar-track {
            background: transparent;
          }

          &::-webkit-scrollbar {
            height: 8px !important;
            cursor: pointer !important;
          }

          &::-webkit-scrollbar-thumb {
            background: #3b3737;
          }
        }

        .allAssetsdiv.noSelect {
          -webkit-user-select: none; /* Safari */
          -ms-user-select: none; /* IE 10 and IE 11 */
          user-select: none; /* Standard syntax */
        }

        // .dissolve {
        //   width: 24px;
        //   height: 24px;
        //   background: red;
        //   z-index: 10;
        // }
        // .allAssets::before {
        //   position: absolute;
        //   top: 0;
        //   width: 300px;
        //   height: 25px;
        //   background: linear-gradient(
        //     red,
        //     rgba(255, 255, 255, 0.001)
        //   ); /* transparent keyword is broken in Safari */
        // }
        // .allAssets::after {
        //   position: absolute;
        //   top: 0;
        //   width: 300px;
        //   height: 25px;
        //   background: linear-gradient(
        //     red,
        //     rgba(255, 255, 255, 0.001)
        //   ); /* transparent keyword is broken in Safari */
        // }

        .portfolioTabsContainer {
          height: 24px;
          background: rgba(171, 168, 168, 0.25);
          border: 1px solid #5a575c;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 4px;
          gap: 8px;
          margin: 10px 8px 0 0;
          cursor: pointer;
          color: #696565;
          background: #fff;
          border: 1px solid #e5e5e5;

          .app-dark & {
            background-color: #141b2d;
            border: 1px solid #3c3a3e;
          }
        }

        .assetTabLeft {
          text-align: center;
          display: inline-flex;
          margin-left: 5px;

          .icon {
            width: 16px;
            height: 16px;
            margin-right: 3px;

            img {
              width: 100%;
              height: 100%;
              margin-bottom: 12px;
            }
          }

          .assetName {
            font-family: Gilroy-Bold;
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 16px; /* 133.333% */
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #bababa;
          }
        }

        .assetSelected {
          border: 1px solid #1a38f8;
          color: #5a575c;

          .assetName {
            color: #5a575c;
            .app-dark & {
              color: #fff;
            }
          }

          .app-dark & {
            color: $darkFontColorSecondary !important;
            border: 1px solid #1a38f8;
          }
        }
        .assetTabRight {
          border-left: 1px solid #bababa;
          font-family: Gilroy-Bold;
          font-size: 10px;
          font-style: normal;
          font-weight: 700;
          line-height: 16px; /* 160% */
          letter-spacing: 1.25px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          padding: 0px 3px 0 6px;
          &.noPRatioBal {
            color: #bababa;

            .app-dark & {
              color: #99999a;
            }
          }
        }

        .highAssetBal {
          color: #3ecb87;
        }
        .midAssetBal {
          color: #f2c94c;
        }
        .lowAssetBal {
          color: #df434c;
        }

        .box {
          flex: 1;
          .expandIcon {
            text-align: center;
            cursor: pointer;
            img {
              max-width: 10px;
            }

            .collateralsContainer {
              display: flex;
              justify-content: space-between;
              font-family: Gilroy;
              font-size: 12px;
              color: #99999a;
              margin: 2px 0;
            }
          }
          .tokenItems {
            font-family: $BodyTextFontFamily;
            font-size: 12px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #475a75;
            display: flex;
            justify-content: space-between;

            .rightCollateral {
              font-family: Gilroy-Bold;
              font-size: 16px;
              font-style: normal;
              font-weight: 700;
              line-height: 24px;

            .rightCollateral {
              font-family: Gilroy-Bold;
              font-size: 16px;
              font-style: normal;
              font-weight: 700;
              line-height: 24px;

            .app-dark & {
              color: #9d9d9d;
            }
            .app-dark &:first-child {
              color: $darkFontColorLight;
              font-size: 16px;
              font-style: normal;
              font-weight: 700;
              line-height: 28px; /* 175% */
            }

            &.obtrusive {
              font-family: $BodyTextFontFamily;
              font-size: 16px;
              line-height: 24px;
              color: #5a575c;
              font-variation-settings: "GRAD" 100, "slnt" 0, "XTRA" 468,
                "XOPQ" 96, "YOPQ" 79, "YTLC" 514, "YTUC" 712, "YTAS" 750,
                "YTDE" -203, "YTFI" 738, "wght" 750;

              .left,
              .leftAsset {
                text-align: left;
                color: #1d2639;

                .app-dark & {
                  color: $darkFontColorLight;
                }
                font-family: Gilroy-Bold;
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
                .showInfoMobile {
                  margin-left: 4px;
                }
              }

              .portfolio {
                color: #5a575c;
                font-family: Gilroy-Bold;
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 20px;
                .app-dark & {
                  color: #fff;
                }
              }

              .leftAsset {
                margin-top: 5px;
                font-variation-settings: "GRAD" 100, "slnt" 0, "XTRA" 468,
                  "XOPQ" 96, "YOPQ" 79, "YTLC" 514, "YTUC" 712, "YTAS" 750,
                  "YTDE" -203, "YTFI" 738, "wght" 750;
              }

              .right {
                font-family: $BodyTextFontFamily;
                font-size: 12px;
                text-align: right;
                font-weight: 700;
              }

              .tokenItemTop {
                font-family: Gilroy;
                font-weight: 400 !important;
                font-size: 12px;
                line-height: 16px;
                color: #696565;
                display: flex;

                .right {
                  .app-dark & {
                    color: #99999a !important;
                  }
                }
              }

              .tokenItemTop {
                font-family: Gilroy;
                font-weight: 400 !important;
                font-size: 12px;
                line-height: 16px;
                color: #696565;
                display: flex;

                .right {
                  .app-dark & {
                    color: #99999a !important;
                  }
                }
              }

              &.singer {
                height: 100%;
                .left {
                  display: flex;
                  align-items: center;
                  .ivu-tooltip {
                    margin-left: 8px;
                  }
                }

                .liquidsLeft {
                  align-items: flex-start;
                  .globalInfoStyle {
                    margin-top: 4px;
                  }
                }

                .right {
                  font-family: $BodyTextFontFamily;
                  font-weight: 500;
                  font-stretch: normal;
                  font-style: normal;
                  letter-spacing: normal;
                  color: #475a75;

                  .app-dark & {
                    color: #99999a;
                  }
                  .top {
                    font-size: 12px;
                    line-height: 1.5;
                    font-weight: 700;
                  }
                  .bottom {
                    font-size: 12px;
                    line-height: 1.33;
                    font-weight: 400;
                  }
                }
              }
            }

            &.unobtrusive {
              color: #475a75;
              margin-top: 8px;
              .left {
                height: 18px;
                color: #99999a;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                font-family: Gilroy-Regular;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 16px;
                .unlockScheduleButton {
                  width: 18px;
                  height: 18px;
                  margin-left: 6px;
                }
              }
            }
          }
        }
      }

      .portfolioBox {
        flex-direction: column;
        padding: 8px 0;

        .top {
          font-family: Gilroy-Bold;
          .app-dark & {
            color: #e5e5e5;
          }
        }

        .bottom {
          font-size: 12px;
        }
      }

      .tokenBox {
        border-bottom: solid 1px #e5e5e5;

        .app-dark & {
          border-bottom: solid 1px #3c3a3e;
        }

        .tokenItems {
          .right {
            color: #5a575c;
            .app-dark & {
              color: #99999a;
            }
          }
        }
      }
    }

    .totalBalanceToUSD {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .box {
        .title {
          font-family: $BodyTextFontFamily;
          font-size: 14px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #5a575c;
          margin-bottom: 8px;

          .app-dark & {
            color: $darkFontColorLight;
          }
        }

        .amount {
          font-family: Gilroy-Bold;
          font-size: 32px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.25;
          letter-spacing: normal;
          color: #5a575c;

          .app-dark & {
            color: $darkFontColorLight;
          }
        }
      }

      .refreshBtn {
        cursor: pointer;
        .border,
        .shape {
          transition: fill $animete-time linear;
        }

        .app-dark & {
          &:not(.selected) {
            .border {
              stroke: #ffffff;
            }
            .shape {
              fill: #ffffff;
            }
          }
        }

        &:hover {
          &:not(.selected) {
            .border {
              stroke: #1a38f8;
            }
            .shape {
              fill: #1a38f8;
            }
          }
        }

        &.selected {
          .border {
            stroke: #1a38f8;
            fill: #1a38f8;
          }
          .shape {
            fill: #fff;
          }
        }

        &.refreshing {
          -webkit-animation: spin 1s linear 1s 5 alternate;
          animation: spin 1s linear infinite;
          cursor: not-allowed;
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  #walletDetails {
    width: 10vw;
    position: fixed;
    right: 0;
    top: 0;
    min-height: 100% !important;
    // z-index: 999 !important;

    &.mScroll {
      overflow-y: scroll;
      height: 100%;
      width: 100vw;
    }

    @-webkit-keyframes spin {
      from {
        -webkit-transform: rotate(360deg);
      }
      to {
        -webkit-transform: rotate(0deg);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(360deg);
      }
      to {
        transform: rotate(0deg);
      }
    }

    .img-fade-enter-active,
    .img-fade-leave-active {
      transition: opacity $animete-time;
    }

    .img-fade-enter,
    .img-fade-leave-to {
      opacity: 0;
    }

    .walletAndAddressBox {
      height: 44px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 10px;
      margin-right: 16px;
      position: absolute;
      right: 0px;
      top: 0;

      .info {
        width: 294px;
        padding: 3px 16px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border-radius: 20px;
        background: #f6f5f6;
        display: none;

        .wallet {
          margin-right: 8px;
          font-family: Gilroy-Bold;
          font-size: 14px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #5a575c;

          .app-dark & {
            color: $darkFontColorLight;
          }
        }

        .address {
          flex: 1;
          font-family: Gilroy-Regular;
          font-size: 14px;
          margin-right: 4px;
          text-align: center;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #99999a;
        }

        .copyBtn {
          cursor: pointer;
          width: 16px;
          height: 16px;
          display: none;
          margin-right: 12px;

          &:hover {
            #Combined-Shape {
              fill: #1a38f8;
              stroke: #1a38f8;
            }
          }
        }
      }

      // .chainChange {
      //     width: 90px;
      //     height: 32px;
      //     display: flex;
      //     border-radius: 20px;
      //     background: #fff;
      //     box-shadow: 0 2px 6px 0 #deddde;
      //     padding: 0 0;
      //     position: relative;

      //     &.chainChanging {
      //         .ethBox,
      //         .bscBox {
      //             opacity: 0.2 !important;
      //             cursor: not-allowed !important;
      //         }
      //     }

      //     .ethBox,
      //     .bscBox {
      //         width: 32px;
      //         height: 32px;
      //         border-radius: 50%;
      //         display: flex;
      //         justify-content: center;
      //         align-items: center;
      //         transition: $animete-time linear;

      //         &.selected {
      //             box-shadow: 0 0 0 0 #deddde;
      //             background-color: #ffffff;
      //         }
      //     }

      //     .bscBox {
      //         display: none;
      //     }

      //     .mNetworkName {
      //         display: block;
      //         font-family: Gilroy;
      //         font-size: 12px;
      //         font-weight: 500;
      //         font-stretch: normal;
      //         font-style: normal;
      //         line-height: 32px;
      //         letter-spacing: normal;
      //         color: #99999a;
      //         position: absolute;
      //         padding-left: 29px;
      //         left: 0;
      //         top: 0px;
      //     }
      // }

      .mNetwork {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        box-shadow: 0 2px 6px 0 #deddde;
        background-color: #ffffff;
        border-radius: 16px;

        #ethereumSvg,
        #binanceSvg {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }

        .mNetworkName {
          font-family: Gilroy;
          font-size: 12px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          color: #99999a;
          margin: 0 4px;
        }
      }

      .mMenu {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-shadow: 0 2px 6px 0 #deddde;
        background-color: #ffffff;
        .app-dark & {
          border: 1px solid #ffffff;
        }
      }
    }

    .walletAndAddressBoxLight {
      height: 44px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 10px;
      margin-right: 16px;
      position: absolute;
      right: 0px;
      top: 0;

      .info {
        width: 294px;
        padding: 3px 16px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border-radius: 20px;
        background: #f6f5f6;
        display: none;

        .wallet {
          margin-right: 8px;
          font-family: Gilroy-Bold;
          font-size: 14px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #5a575c;

          .app-dark & {
            color: $darkFontColorLight;
          }
        }

        .address {
          flex: 1;
          font-family: Gilroy-Regular;
          font-size: 14px;
          margin-right: 4px;
          text-align: center;
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #99999a;
        }

        .copyBtn {
          width: 16px;
          height: 16px;
          cursor: pointer;
          margin: 2px 8px 0 4px;

          &:hover {
            #Combined-Shape {
              fill: #1a38f8;
              stroke: #1a38f8;
            }
          }
        }
      }

      // .chainChange {
      //     width: 90px;
      //     height: 32px;
      //     display: flex;
      //     border-radius: 20px;
      //     background: #fff;
      //     box-shadow: 0 2px 6px 0 #deddde;
      //     padding: 0 0;
      //     position: relative;

      //     &.chainChanging {
      //         .ethBox,
      //         .bscBox {
      //             opacity: 0.2 !important;
      //             cursor: not-allowed !important;
      //         }
      //     }

      //     .ethBox,
      //     .bscBox {
      //         width: 32px;
      //         height: 32px;
      //         border-radius: 50%;
      //         display: flex;
      //         justify-content: center;
      //         align-items: center;
      //         transition: $animete-time linear;

      //         &.selected {
      //             box-shadow: 0 0 0 0 #deddde;
      //             background-color: #ffffff;
      //         }
      //     }

      //     .bscBox {
      //         display: none;
      //     }

      //     .mNetworkName {
      //         display: block;
      //         font-family: Gilroy;
      //         font-size: 12px;
      //         font-weight: 500;
      //         font-stretch: normal;
      //         font-style: normal;
      //         line-height: 32px;
      //         letter-spacing: normal;
      //         color: #99999a;
      //         position: absolute;
      //         padding-left: 29px;
      //         left: 0;
      //         top: 0px;
      //     }
      // }

      .mNetwork {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        box-shadow: 0 2px 6px 0 #deddde;
        background-color: #ffffff;
        border-radius: 16px;

        #ethereumSvg,
        #binanceSvg {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }

        .mNetworkName {
          font-family: Gilroy-Medium;
          font-size: 12px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 12px;
          letter-spacing: normal;
          color: #99999a;
          margin: 0 4px;
        }
      }

      .mMenu {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-shadow: 0 2px 6px 0 #deddde;
        background-color: #ffffff;
        .app-dark & {
          border: 1px solid #ffffff;
        }
      }
    }
    .mShowWalletClass {
      display: block !important;
    }
    .walletDetailsBox {
      width: 100%;
      height: 1000px;
      display: none;
      background-color: #ffffff;

      .mWalletHead {
        width: 100%;
        height: 64px;
        padding: 16px 24px;
        display: flex;
        margin-bottom: 16px;

        .networkIcon {
          width: 32px;
          height: 32px;
          padding: 8px 8px 8px 8px;
          box-shadow: 0 2px 6px 0 #deddde;
          background-color: #ffffff;
          text-align: center;
          border-radius: 16px;
          span {
            width: 100%;
            height: 100%;
            display: block;
          }
          img {
            width: 16px;
            height: 16px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .mInfo {
          width: 65.3333333317vw;
          padding: 7px 16px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          border-radius: 20px;
          background: #f6f5f6;
          margin-left: 10px;

          .wallet {
            margin-right: 8px;
            font-family: Gilroy-Bold;
            font-size: 14px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: #5a575c;

            .app-dark & {
              color: $darkFontColorLight;
            }
          }

          .address {
            flex: 1;
            font-family: Gilroy-Regular;
            font-size: 14px;
            text-align: center;
            // white-space: nowrap;
            // overflow: hidden;
            // text-overflow: ellipsis;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: #99999a;
            .app-dark & {
              color: #ffffff !important;
            }
          }

          .copyBtn {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin: 2px 8px 0 4px;

            &:hover {
              #Combined-Shape {
                fill: #1a38f8;
                stroke: #1a38f8;
              }
            }
            .app-dark & {
              #Combined-Shape {
                fill: #ffffff;
                stroke: #ffffff;
              }
            }
          }
        }

        .mClose {
          position: relative;
          left: 16px;
        }
      }
      .actionsBox {
        display: flex;
        justify-content: space-around;

        .box {
          .boxItem {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #99999a;
            text-align: center;
            text-transform: uppercase;
            cursor: pointer;
            transition: $animete-time linear;
            font-weight: bold;
            letter-spacing: 1.5px;
            font-family: Gilroy-bold;
            font-size: 12px;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;

            .placeholder {
              width: 40px;
              height: 40px;
              margin-bottom: 8px;
              position: relative;

              img {
                left: 0;
                width: 40px;
                position: absolute;
                transform: translateZ(0);
              }
            }

            &:hover,
            &.selected {
              color: #1a38f8;
            }
          }
        }
      }

      .ratioBox {
        margin: 12px 0;
        border-top: none;
        border-bottom: solid 1px #e5e5e5;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;

        .context {
          width: 100%;
          .pRatioTitle {
            .showInfoMobile {
              width: 16px;
            }
          }
        }

        .percentBox {
          width: 100%;
          .colorBlock {
            .leftBlock,
            .centerBlock,
            .rightBlock {
              height: 12px;
            }
          }

          .flag {
            margin-top: 10px;

            .item {
              &:first-child {
                margin-left: 15vw;
              }
              &:last-child {
                margin-left: 10vw;
              }
            }
          }
        }

        .title {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 27px;
          font-family: Gilroy-bold;
          font-size: 14px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #5a575c;

          .app-dark & {
            color: $darkFontColorLight;
          }

          .ivu-tooltip {
            margin-left: 8px;
          }
        }

        .ratio {
          display: flex;
          width: 100%;

          .box {
            flex: 1;
            font-family: Gilroy-bold;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.25;
            letter-spacing: normal;
            text-align: center;
            color: #5a575c;

            .app-dark & {
              color: $darkFontColorLight;
            }

            .context {
              font-size: 14px;
              font-family: Gilroy;
              line-height: 1.29;
              font-weight: 100;
            }

            &:nth-child(1) {
              border-right: solid 1px #eae9ea;
            }

            &:nth-child(2) {
              color: #99999a;
            }
          }
        }

        .ivu-progress {
          margin-top: 4px;
          width: 87.46666666448vw;
          .ivu-progress-outer {
            .ivu-progress-inner {
              .ivu-progress-bg {
                background-color: rgba(#7eb5ff, 0.2) !important;
              }
              .ivu-progress-success-bg {
                background-color: #1a38f8;
              }
            }
          }
        }
      }

      .walletInfo {
        margin-bottom: 24px;
        padding: 0 24px 100px;

        .tokenIcon {
          border-radius: 50%;
        }

        .title {
          font-family: Gilroy-bold;
          font-size: 14px;
          font-weight: bold;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #5a575c;
          margin-bottom: 8px;

          .app-dark & {
            color: $darkFontColorLight;
          }
        }

        .tokenBox {
          border-bottom: solid 1px #e5e5e5;
          display: flex;
          padding: 16px 0;
          &:nth-last-child(1) {
            border: 0px;
          }

          .tokenIcon {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }

          .box {
            flex: 1;
            .tokenItems {
              font-family: Gilroy;
              font-size: 12px;
              font-weight: 500;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.33;
              letter-spacing: normal;
              color: #5a575c;
              display: flex;
              justify-content: space-between;

              .app-dark & {
                color: #9d9d9d;
              }
              .app-dark &:first-child {
                color: $darkFontColorLight;
              }

              &.obtrusive {
                .left {
                  color: #5a575c;
                  font-family: Gilroy;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 24px;
                }

                // .tokenItemTop {
                //   font-size: 12px;
                // }

                .right {
                  font-family: Gilroy;
                  font-size: 12px;
                  text-align: right;
                }

                &.singer {
                  height: 100%;
                  .left {
                    display: flex;
                    align-items: center;

                    .ivu-tooltip {
                      margin-left: 8px;
                    }
                  }

                  .right {
                    font-family: Gilroy;
                    font-weight: 500;
                    font-stretch: normal;
                    font-style: normal;
                    letter-spacing: normal;
                    color: #5a575c;

                    .app-dark & {
                      color: $darkFontColorLight;
                    }
                    .top {
                      font-size: 16px;
                      line-height: 1.5;
                      font-family: Gilroy;
                      font-size: 16px;
                      font-style: normal;
                      font-weight: 700;
                      line-height: 24px;
                    }
                    .bottom {
                      font-size: 12px;
                      line-height: 1.33;
                    }
                  }
                }
              }

              &.unobtrusive {
                color: #99999a;
                margin-top: 8px;
              }
            }
          }
        }
      }

      .totalBalanceToUSD {
        height: 90px;
        width: 100vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        box-shadow: 0 -2px 6px 0 #deddde;
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: #ffffff;

        .box {
          .title {
            font-family: $BodyTextFontFamily;
            font-size: 14px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: #1d2639;
            margin-bottom: 8px;

            .app-dark & {
              color: $darkFontColorLight;
            }
          }

          .amount {
            font-family: $BodyTextFontFamily;
            font-size: 24px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.25;
            letter-spacing: normal;
            color: #1d2639;

            .app-dark & {
              color: $darkFontColorLight;
            }
          }
        }

        .refreshBtn {
          cursor: pointer;
          .border,
          .shape {
            transition: fill $animete-time linear;
          }

          &:hover {
            &:not(.selected) {
              .border {
                stroke: #1a38f8;
              }
              .shape {
                fill: #1a38f8;
              }
            }
          }

          &.selected {
            .border {
              stroke: #1a38f8;
              fill: #1a38f8;
            }
            .shape {
              fill: #fff;
            }
          }

          &.refreshing {
            -webkit-animation: spin 1s linear 1s 5 alternate;
            animation: spin 1s linear infinite;
            cursor: not-allowed;
          }
        }
      }
    }
    .mNavigate {
      width: 100vw;
      position: fixed;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
    }
  }
}
</style>
