import _ from "lodash";
import lnrJSConnector from "../lnrJSConnector";
import { band } from "@/assets/linearLibrary/linearTools/request/linearData/bandPrice";

import {
  CRYPTO_CURRENCIES,
  CRYPTO_CURRENCIES_API,
} from "../constants/currency";
import currencies from "@/common/currency";
import { formatNumber, formatEtherToNumber } from "../format";
import {
  isBinanceNetwork,
  isEthDevNetwork,
  isEthereumNetwork,
  WALLET_STATUS,
} from "../network";
import config from "@/config/common";
import api from "@/api";
import { n2bn, bn2n, bnMul, bnAdd } from "@/common/bnCalc";

let loopId = 0;

/**
 * 获取所有合成资产余额/汇率列表，所有合成资产换算成lusd的总价值
 */
export const getLiquids = async (wallet, all = false) => {
  const {
    lnrJS: { LnAssetSystem },
    addressList,
  } = lnrJSConnector;

  //获取资产列表
  const assetAddress = await LnAssetSystem.getAssetAddresses();

  let liquids = n2bn("0");
  let assetKeys = [];
  let assetPromise = [];
  let liquidsData = { liquids: 0, liquidsList: [] };

  //整理数据,判断前端库中是否有该资产的合约
  for (let i = 0; i < assetAddress.length; i++) {
    for (const key in addressList) {
      //获取相同合约地址的数据
      if (addressList[key] == assetAddress[i]) {
        let asset = lnrJSConnector.lnrJS[key];
        //汇总获取price的key
        assetKeys.push(key);

        //汇总取余额的token
        assetPromise.push(asset.balanceOf(wallet));
      }
    }
  }

  if (assetKeys.length && assetPromise.length) {
    const walletNetworkId = $nuxt.$store.state.walletNetworkId;
    const isEthereum = isEthereumNetwork(walletNetworkId);

    let priceFunc;
    if (isEthereum) {
      priceFunc = band.pricesLast({ sources: assetKeys });
    } else {
      priceFunc = getPriceRates(assetKeys);
    }

    //获取汇总数据
    const [assetPrices, assetBalances] = await Promise.all([
      priceFunc,
      Promise.all(assetPromise),
    ]);

    //计算资产总数
    for (const index in assetKeys) {
      const key = assetKeys[index]; //资产名称
      const balance = assetBalances[index]; //余额
      let price = key == "lUSD" ? (price = n2bn(1)) : assetPrices[key]; //价格

      //如果不是获取所有且余额为0则跳过
      if (!all && balance.isZero()) {
        continue;
      }

      !price && (price = n2bn("0"));

      const value = bnMul(balance, price);
      liquidsData.liquidsList.push({
        name: key,
        balance: bn2n(balance),
        valueUSD: bn2n(value),
        img: currencies[key].icon,
      });

      liquids = bnAdd(liquids, value);
    }
  }
  liquidsData.liquids = liquids;
  return liquidsData;
};

/**
 * 获取当前抵押率基数
 */
export const getBuildRatio = async () => {
  const {
    lnrJS: { LnConfig },
  } = lnrJSConnector;
  let BUILD_RATIO = await LnConfig.BUILD_RATIO();
  let uint = await LnConfig.getUint(BUILD_RATIO);
  return uint;
};

/**
 * 获取兑换率
 * @param {String} currency 货币名称, 参考CRYPTO_CURRENCIES
 */
export const getPriceRates = async (currency) => {
  const walletNetworkId = $nuxt.$store.state.walletNetworkId;
  const isEthereum = isEthereumNetwork(walletNetworkId);
  const isBinance = isBinanceNetwork(walletNetworkId);

  let rates = {};
  const { utils } = lnrJSConnector;

  let contract,
    pricesPromise = [];
  if (isEthereum) {
    rates = await band.pricesLast({ sources: currency });
  } else if (isBinance) {
    contract = lnrJSConnector.lnrJS.LnOracleRouter;
    if (_.isString(currency)) {
      ["ETH", "BNB"].includes(currency) && (currency = "l" + currency);
      rates[currency] = await contract.getPrice(
        utils.formatBytes32String(currency)
      );
    } else if (_.isArray(currency)) {
      for (let index = 0; index < currency.length; index++) {
        let name = currency[index];
        ["ETH", "BNB"].includes(name) && (name = "l" + name);
        pricesPromise.push(contract.getPrice(utils.formatBytes32String(name)));
      }

      let prices = await Promise.all(pricesPromise);

      for (let index = 0; index < currency.length; index++) {
        const name = currency[index];
        let price = prices[index];
        rates[name] = price;
      }
    }
  }

  // console.log(rates, "rates");
  return rates;
};

/**
 * 从coingecko获取兑换率
 * @param {String} currency 货币名称, 参考CRYPTO_CURRENCIES_API
 */
export const getPriceRatesFromApi = async (currency) => {
  const rates = {};
  const {
    lnrJS: { LnChainLinkPrices },
    utils,
  } = lnrJSConnector;
  if (_.isString(currency)) {
    if (currency == "lUSD") {
      rates["lUSD"] = n2bn("1");
    } else if (currency == "LINA") {
      rates["LINA"] = await LnChainLinkPrices.getPrice(
        utils.formatBytes32String("LINA")
      );
    } else {
      const id = CRYPTO_CURRENCIES_API[currency]?.id;
      const results = await api.getTokenPrice({
        tokenid: [id],
      });
      rates[currency] = n2bn(results[id]?.usd);
    }
  } else if (_.isArray(currency)) {
    let ids = [];

    for (const index in currency) {
      const c = currency[index];
      if (!["lUSD", "LINA"].includes(c)) {
        ids.push(CRYPTO_CURRENCIES_API[c]?.id);
      }
    }

    const results = await api.getTokenPrice({ tokenid: ids });

    for (const index in currency) {
      const c = currency[index];
      if (c == "lUSD") {
        rates["lUSD"] = n2bn("1");
      } else if (c == "LINA") {
        rates["LINA"] = await LnChainLinkPrices.getPrice(
          utils.formatBytes32String("LINA")
        );
      } else {
        const id = CRYPTO_CURRENCIES_API[c]?.id;
        rates[c] = n2bn(results[id]?.usd);
      }
    }
  }
  return rates;
};

/**
 * 保存详情面板下所有数据到store中
 */
export const storeDetailsData = async () => {
  const store = $nuxt.$store;
  const walletAddress = store.state?.wallet?.address;

  if (walletAddress) {
    clearTimeout(loopId);

    //之前状态
    // const status = store.state?.wallet?.status;

    try {
      await store.commit("mergeWallet", {
        status: WALLET_STATUS.UPDATING,
      });

      const walletNetworkId = store.state.walletNetworkId;
      const isEthereum = isEthereumNetwork(walletNetworkId);
      const isBinance = isBinanceNetwork(walletNetworkId);
      const isEthDev = isEthDevNetwork(walletNetworkId);

      const {
        lnrJS: {
          LinearFinance,
          LnCollateralSystem,
          lUSD,
          LnDebtSystem,
          LnRewardLocker,
        },
        utils,
        provider,
      } = lnrJSConnector;

      let promiseArray = [
        LinearFinance.balanceOf(walletAddress),
        lUSD.balanceOf(walletAddress),
        provider.getBalance(walletAddress),
      ];

      if (!isEthDev) {
        promiseArray = [
          ...promiseArray,
          LnCollateralSystem.userCollateralData(
            walletAddress,
            utils.formatBytes32String("LINA")
          ),
          LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress),
          LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress),
          LnRewardLocker.balanceOf(walletAddress),
          getBuildRatio(),
        ];
      }

      //可以直接转换数值的组
      const result = await Promise.all(promiseArray);

      let [
        avaliableLINA,
        amountlUSD,
        amountETH,
        stakedLINA,
        totalCollateralInUsd,
        amountDebt,
        lockLINA,
        buildRatio,
      ] = result.map(formatEtherToNumber);

      let liquidsData = await getLiquids(walletAddress);

      //获取货币->USD 兑换率
      const priceRates = await getPriceRates(CRYPTO_CURRENCIES);
      // const priceRates = await getPriceRatesFromApi(CRYPTO_CURRENCIES);

      const LINA2USDRate = priceRates.LINA / 1e18 || 0;
      const lUSD2USDRate = priceRates.lUSD / 1e18 || 1;
      const ETH2USDRate =
        (isEthereum ? priceRates.ETH : isBinance ? priceRates.BNB : 1) / 1e18 ||
        1;

      let amountDebt2USD;
      if (isEthDev) {
        amountDebt2USD = 0;
        stakedLINA = lockLINA = totalCollateralInUsd = n2bn("0");
        buildRatio = 0.2;
        amountDebt = [n2bn("0")];
      } else {
        amountDebt2USD = amountDebt[0] * lUSD2USDRate;
      }

      let currentRatioPercent =
        totalCollateralInUsd != 0 && amountDebt[0] != 0
          ? (totalCollateralInUsd / amountDebt[0]) * 100
          : 0;

      const amountLINA = avaliableLINA + stakedLINA + lockLINA;
      const amountLINA2USD = amountLINA * LINA2USDRate;
      const avaliableLINA2USD = avaliableLINA * LINA2USDRate;
      const amountlUSD2USD = amountlUSD * lUSD2USDRate;
      const amountETH2USD = amountETH * ETH2USDRate;
      const liquids2USD = formatEtherToNumber(liquidsData.liquids);

      const totalCryptoBalanceInUSD =
        amountETH2USD +
        liquids2USD +
        (isEthereum ? avaliableLINA2USD : isBinance ? amountLINA2USD : 0);

      //所有资产余额
      let transferableAssets = [
        {
          name: "LINA",
          balance: avaliableLINA,
          valueUSD: 0,
          img: require("@/static/LINA_logo.svg"),
        },
      ];

      if (isEthereum) {
        transferableAssets.push({
          name: "ETH",
          balance: amountETH,
          valueUSD: 0,
          img: require("@/static/ETH_logo.svg"),
        });
      } else if (isBinance) {
        transferableAssets.push({
          name: "BNB",
          balance: amountETH,
          valueUSD: 0,
          img: require("@/static/currency/BNBl.svg"),
        });
      }

      transferableAssets = transferableAssets.concat(liquidsData.liquidsList);

      let formatData = {
        currentRatioPercent,
        targetRatioPercent: 100 / buildRatio,
        amountLINA,
        amountLINA2USD,
        avaliableLINA,
        avaliableLINA2USD,
        stakedLINA,
        lockLINA,
        amountlUSD,
        lUSD2USDRate,
        amountlUSD2USD,
        amountETH,
        ETH2USDRate,
        amountETH2USD,
        amountDebt: amountDebt[0],
        amountDebt2USD,
        totalCryptoBalanceInUSD,
        buildRatio,
        totalCollateralInUsd,
        liquids2USD,
      };

      //统一格式化数据
      formatData = formatDecimal(formatData, [
        "currentRatioPercent",
        "targetRatioPercent",
      ]);
      formatData.LINA2USDRate = _.floor(LINA2USDRate, 4);
      formatData.priceRates = priceRates;
      //不需要格式化
      formatData.transferableAssets = transferableAssets;

      formatData.liquids = formatData.liquids2USD;

      formatData.amountDebtBeforeFormat = amountDebt[0];
      // console.log(formatData,'storeDetailsData');

      await store.commit("setWalletDetails", formatData);
      await store.commit("mergeWallet", { status: WALLET_STATUS.FINISH });
      return formatData;
    } catch (error) {
      await store.commit("mergeWallet", { status: WALLET_STATUS.ERROR });
      console.log(error, "storeDetailsData error");
    } finally {
      if (store.state.walletDetailsLoopRefreshStatus) {
        loopId = setTimeout(
          storeDetailsData,
          config.walletDetailsRefreshTimeout
        );
      }
    }
  }
};

/**
 * 遍历格式化数据
 * @param {Object} data     //数据
 * @param {Array} ignoreList    //忽略列表
 */
const formatDecimal = (data, ignoreList = []) => {
  let newData = {};

  for (const key in data) {
    newData[key] = ignoreList.includes(key)
      ? _.floor(data[key])
      : formatNumber(data[key]);
  }

  return newData;
};
