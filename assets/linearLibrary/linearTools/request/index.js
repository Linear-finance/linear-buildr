import _ from "lodash";
import { ethers } from "ethers";
import lnrJSConnector from "../lnrJSConnector";
import { band } from "@/assets/linearLibrary/linearTools/request/linearData/bandPrice";

import {
  CRYPTO_CURRENCIES,
  CRYPTO_CURRENCIES_API,
} from "../constants/currency";
import currencies, { LINA } from "@/common/currency";
import {
  formatNumber,
  formatEtherToNumber,
  getAssetObjectInfo,
  formatByStoreCollateral,
} from "../format";
import {
  isBinanceNetwork,
  isEthDevNetwork,
  isEthereumNetwork,
  WALLET_STATUS,
} from "../network";
import config from "@/config/common";
import api from "@/api";
import { n2bn, bn2n, bnMul, bnAdd, n2bnForAsset } from "@/common/bnCalc";
import { collateralAssets } from "@/assets/linearLibrary/linearTools/collateralAssets";

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

  let liquids = n2bnForAsset("0");
  let assetKeys = [];
  let assetPromise = [];
  let liquidsData = { liquids: 0, liquidsList: [] };

  //整理数据,判断前端库中是否有该资产的合约
  for (let i = 0; i < assetAddress.length; i++) {
    for (const key in addressList.asset) {
      //获取相同合约地址的数据
      if (addressList.asset[key] == assetAddress[i]) {
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
      try {
        let price =
          key == "lUSD" ? (price = n2bnForAsset(1)) : assetPrices[key]; //价格
      } catch {
        console.error("Failed to fetch price for: " + key);
      }
      //如果不是获取所有且余额为0则跳过
      if (!all && balance.isZero()) {
        continue;
      }

      !price && (price = n2bnForAsset("0"));

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
export const getBuildRatio = async (multiCollateralAsset) => {
  const {
    lnrJS: { LnConfig },
    utils,
  } = lnrJSConnector;
  const BUILD_RATIO = ethers.utils.formatBytes32String("BuildRatio");
  const uint = await LnConfig.getUint(BUILD_RATIO);
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
  // if (isEthereum) {
  //   console.log("happy")
  //   rates = await band.pricesLast({ sources: currency });
  //   console.log("happy1")
  // } else if (isBinance) {
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
  // }
  return rates;
};

async function totalCryptoBalanceInUSD(multiCollateralAsset) {
  const walletNetworkId = $nuxt.$store.state.walletNetworkId;
  const isEthereum = isEthereumNetwork(walletNetworkId);
  const isBinance = isBinanceNetwork(walletNetworkId);
  const isEthDev = isEthDevNetwork(walletNetworkId);
  const walletAddress = $nuxt.$store.state?.wallet?.address;

  const {
    lnrJS: { LnRewardLocker },
    utils,
    provider,
    multiCollateral,
  } = lnrJSConnector;

  const LinearFinance = multiCollateral[multiCollateralAsset.key].LinearFinance;
  const unformattedBal = await LinearFinance.balanceOf(walletAddress);

  let avaliableLINA = formatEtherToNumber(
    unformattedBal,
    multiCollateralAsset.decimal
  );

  let lockLINA = n2bn("0");
  let stakedLina = "";
  if (isEthDev) {
    stakedLina = lockLINA = totalCollateralInUsd = n2bn("0");
  } else {
    const LnCollateralSystem =
      multiCollateral[multiCollateralAsset.key].LnCollateralSystem;
    const unformattedLockedLina = await LnRewardLocker.balanceOf(walletAddress);
    stakedLina = formatEtherToNumber(
      await LnCollateralSystem.userCollateralData(
        walletAddress,
        utils.formatBytes32String(multiCollateralAsset.contractKey)
      ),
      multiCollateralAsset.decimal
    );
    if (multiCollateralAsset.key == LINA) lockLINA = unformattedLockedLina;
  }

  const priceRateKey = multiCollateralAsset.contractKey;
  const priceRates = await getPriceRates(CRYPTO_CURRENCIES);
  const LINA2USDRate = priceRates[priceRateKey] / 1e18 || 0;
  const amountLINA = avaliableLINA + stakedLina + formatEtherToNumber(lockLINA);
  const amountLINA2USD = amountLINA * LINA2USDRate;
  const avaliableLINA2USD = avaliableLINA * LINA2USDRate;
  const totalCryptoBalanceInUSD = isEthereum
    ? avaliableLINA2USD
    : isBinance
    ? amountLINA2USD
    : 0;
  return totalCryptoBalanceInUSD;
}

export const getAllCollaterals = async (walletAddress) => {
  let globalAssetObj = {};
  let collateralObj = {};
  let amountDebtObj = {};
  let currentRatioObj = {};
  let promiseArrCollateral = [];
  let amountDebtArrCollateral = [];

  const { multiCollateral } = lnrJSConnector;
  if (isEthereumNetwork) {
    console.log("getAllCOllaterals");
    const contract = multiCollateral[collateralAssets[0].key];
    console.log(contract, "promiseArrCollateral", promiseArrCollateral);
    promiseArrCollateral.push(0);
    amountDebtArrCollateral.push(0);
  } else {
    for (let index = 0; index < collateralAssets.length; index++) {
      const contract = multiCollateral[collateralAssets[index].key];
      promiseArrCollateral.push(
        contract.LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress)
      );
      amountDebtArrCollateral.push(
        contract.LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress)
      );
    }
  }

  const totalCollaterals = await Promise.all(promiseArrCollateral);

  const totalAmountDebts = await Promise.all(amountDebtArrCollateral);

  for (let index = 0; index < collateralAssets.length; index++) {
    const name = collateralAssets[index].key;
    let totalCollateral = totalCollaterals[index];
    let amountDebtMappedResult = totalAmountDebts[index];
    collateralObj[name] = formatEtherToNumber(totalCollateral);
    amountDebtObj[name] = formatEtherToNumber(amountDebtMappedResult);
    currentRatioObj[name] =
      formatEtherToNumber(totalCollateral) != 0 && amountDebtObj[name][0] != 0
        ? Math.round(
            (formatEtherToNumber(totalCollateral) / amountDebtObj[name][0]) *
              100
          )
        : 0;

    globalAssetObj.totalCollateralValueInUsd = collateralObj;
    globalAssetObj.totalAmountDebt = amountDebtObj;
    globalAssetObj.currentRatio = currentRatioObj;
  }

  return globalAssetObj;
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
  const portfolioAsset = store.state?.portfolioAsset;
  if (walletAddress) {
    clearTimeout(loopId);

    let totalBalanceWithoutLusd = 0;
    let arr = [];

    if (isEthereumNetwork) {
      let liquidsData = await getLiquids(walletAddress);
      const liquids2USD = formatEtherToNumber(liquidsData.liquids);
      let totalCrypto = await totalCryptoBalanceInUSD(collateralAssets[0]);
      arr.push(totalCrypto);
      totalBalanceWithoutLusd = arr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        liquids2USD
      );
    } else {
      for (let index = 0; index < collateralAssets.length; index++) {
        let liquidsData = await getLiquids(walletAddress);
        const liquids2USD = formatEtherToNumber(liquidsData.liquids);
        let totalCrypto = await totalCryptoBalanceInUSD(
          collateralAssets[index]
        );
        arr.push(totalCrypto);
        totalBalanceWithoutLusd = arr.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          liquids2USD
        );
      }
    }
    try {
      await store.commit("mergeWallet", {
        status: WALLET_STATUS.UPDATING,
      });

      const walletNetworkId = store.state.walletNetworkId;
      const isEthereum = isEthereumNetwork(walletNetworkId);
      const isBinance = isBinanceNetwork(walletNetworkId);
      const isEthDev = isEthDevNetwork(walletNetworkId);

      const {
        lnrJS: { lUSD, LnRewardLocker },
        utils,
        provider,
        multiCollateral,
      } = lnrJSConnector;

      if (!portfolioAsset) return;
      const LinearFinance = multiCollateral[portfolioAsset].LinearFinance;
      const LnCollateralSystem =
        multiCollateral[portfolioAsset].LnCollateralSystem;
      const LnDebtSystem = multiCollateral[portfolioAsset].LnDebtSystem;
      let promiseArray = [
        LinearFinance.balanceOf(walletAddress),
        provider.getBalance(walletAddress),
      ];

      let promiseArrayTwo;
      if (isEthereum) {
        promiseArrayTwo = [0, 0];
      } else {
        promiseArrayTwo = [
          lUSD.balanceOf(walletAddress),
          LnRewardLocker.balanceOf(walletAddress),
        ];
      }

      const contractKey = getAssetObjectInfo(portfolioAsset).contractKey;

      if (!isEthDev) {
        promiseArray = [
          ...promiseArray,
          LnCollateralSystem.userCollateralData(
            walletAddress,
            utils.formatBytes32String(contractKey)
          ),
          getBuildRatio(portfolioAsset),
        ];
      }

      //可以直接转换数值的组
      const result = await Promise.all(promiseArray);
      const resultTwo = await Promise.all(promiseArrayTwo);

      let [avaliableLINA, amountETH, stakedLINA, buildRatio] = result.map(
        (item) =>
          formatEtherToNumber(item, getAssetObjectInfo(portfolioAsset).decimal)
      );

      let [amountlUSD, lockLINA] = resultTwo.map((item) =>
        formatEtherToNumber(item)
      );

      const allCollaterals = await getAllCollaterals(walletAddress);

      const amountDebt = formatEtherToNumber(
        await LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress)
      );
      const totalCollateralInUsd = formatEtherToNumber(
        await LnCollateralSystem.GetUserTotalCollateralInUsd(walletAddress)
      );

      let liquidsData = await getLiquids(walletAddress);
      const priceRateKey = getAssetObjectInfo(portfolioAsset).contractKey;
      //获取货币->USD 兑换率
      const priceRates = await getPriceRates(CRYPTO_CURRENCIES);

      const LINA2USDRate = priceRates[priceRateKey] / 1e18 || 0;
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

      let amountLINA = avaliableLINA + stakedLINA;

      if (portfolioAsset == LINA) {
        amountLINA = avaliableLINA + stakedLINA + lockLINA;
      }
      const amountLINA2USD = amountLINA * LINA2USDRate;
      const avaliableLINA2USD = avaliableLINA * LINA2USDRate;
      const amountlUSD2USD = amountlUSD * lUSD2USDRate;
      const amountETH2USD = amountETH * ETH2USDRate;
      const liquids2USD =
        formatEtherToNumber(liquidsData.liquids) - amountlUSD2USD;

      const totalBalanceInUsd = totalBalanceWithoutLusd + amountlUSD2USD;

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
        totalBalanceInUsd,
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
      await store.commit("setMultiCollateralValues", allCollaterals);
      await store.commit("setWalletDetails", formatData);
      await store.commit("mergeWallet", { status: WALLET_STATUS.FINISH });
      return { formatData, allCollaterals };
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
