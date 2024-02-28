import numbro from "numbro";
import { BigNumber, utils } from "ethers";
import { DECIMAL_PRECISION, n2bn, n2bnForAsset } from "@/common/bnCalc";
import { collateralAssets } from "./collateralAssets";
import _ from "lodash";

//格式化bigNumber到number(向下取数值)
export const formatEtherToNumber = (val, unit = undefined) => {
  if (_.isArray(val)) {
    return val.map((item) => floorBigNumber(item, unit));
  } else {
    if (!val || !Number(val)) return 0;
    return floorBigNumber(val, unit);
  }
};

// For build/burn pages in replacement of formatEtherToNumber - format decimal by collateral decimal places
export const formatByStoreCollateral = (val) => {
  const multiCollateralAsset = $nuxt.$store.state?.multiCollateralAsset;
  let unit = undefined;
  if (multiCollateralAsset)
    unit = getAssetObjectInfo(multiCollateralAsset).decimal;
  if (_.isArray(val)) {
    return val.map((item) => floorBigNumber(item, unit));
  } else {
    if (!val || !Number(val)) return 0;
    return floorBigNumber(val, unit);
  }
};

//数字千分位
export const formatNumber = (val, decimals = DECIMAL_PRECISION) => {
  if (!val || !Number(val)) return 0;
  return numbro(_.floor(val, decimals)).format("0,0." + "0".repeat(decimals));
};

//大数转千分位
export const formatNumberFromBigNumber = (
  val,
  decimals = DECIMAL_PRECISION
) => {
  if (!val || !Number(val)) return 0;
  return numbro(_.floor(floorBigNumber(val), decimals)).format(
    "0,0." + "0".repeat(decimals)
  );
};

//文本转byte32
export const formatStringToByte32 = (text) => {
  return utils.hexlify(utils.zeroPad(utils.toUtf8Bytes(text.toString()), 32));
};

//钱包地址转byte32
export const formatAddressToByte32 = (address) => {
  return utils.hexlify(utils.zeroPad(address, 32));
};

//钱包地址缩略, 例: 0x1234...7890
export const abbreviateAddress = (address, omit = 4) => {
  if (!address) return "";
  return address.substr(0, 6) + ".".repeat(omit) + address.substr(-4, 4);
};

export const abbreviateAddressMobile = (address, omit = 3) => {
  if (!address) return "";
  return address.substr(0, 6) + ".".repeat(omit);
};

//将大数向下取指定位数(防止过长小数导致精度的问题)
export const floorBigNumber = (val, unit = undefined) => {
  if (!BigNumber.isBigNumber(val) || val.isZero()) return 0;
  if (unit == 18 || !unit) {
    val = utils.formatEther(val.toString());
  } else {
    val = utils.formatUnits(val.toString(), unit);
  }

  let arr = val.split("."),
    res;
  let MAX_LENGTH = 16;
  if (arr.length == 2) {
    let decimalLength = MAX_LENGTH - arr[0].length;
    res = arr[0].toString() + "." + arr[1].toString().substr(0, decimalLength);
  } else if (arr.length == 1) {
    res = arr[0];
  } else {
    res = 0;
  }
  return Number(res);
};

// for multicollateral, pass in asset key for the asset object within collateral assets
export const getAssetObjectInfo = (assetKey) => {
  const assetObj = collateralAssets.filter(
    (asset) => asset.key == assetKey || asset.contractKey == assetKey
  );
  return assetObj[0];
};

// Get original value of asset then reformat to big number
export const parseUnitAndReformat = (
  val,
  toCollateral = true,
  assetKey = undefined
) => {
  if (toCollateral) {
    return n2bnForAsset(formatByStoreCollateral(val), assetKey);
  } else if (!toCollateral) {
    return n2bnForAsset(formatEtherToNumber(val), assetKey);
  } else {
    console.error("parseUnitAndReformat error");
  }
};

export function roundCryptoValueString(str, assetKey) {
  if (!str.includes(".")) {
    return str;
  } else {
    const decimalPlaces = getAssetObjectInfo(assetKey).decimal;
    const arr = str.split(".");
    const fraction = arr[1].substr(0, decimalPlaces);
    return arr[0] + "." + fraction;
  }
}

export function replaceWaitProcessString(processKey, replacementKey) {
  collateralAssets.forEach((string) => {
    if (processKey.includes(string.name)) {
      processKey = _.replace(processKey, string.name, replacementKey);
    } else {
      console.error("cannot find name and replace");
    }
  });
  return processKey;
}
