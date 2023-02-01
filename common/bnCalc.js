import { BigNumber, utils } from "ethers";
import { floor } from "lodash";
import { formatEtherToNumber } from "@/assets/linearLibrary/linearTools/format";
import { toNonExponential } from "./utils";

//最大小数长度
export const MAX_DECIMAL_LENGTH = 18;
//大数转换基数
export const BIGNUMBER_BASENUMBER = (1e18).toString();
//保留小数位
export const DECIMAL_PRECISION = 2;

//Number转bigNumber
export const n2bn = (num) => {
  if (num !== undefined) {
    return utils.parseEther(num.toString());
  }
};

//bigNumber转Number
// export const bn2n = num => Number(utils.formatEther(num.toString()));
export const bn2n = (num) => formatEtherToNumber(num);

//数字字符串直接转bigNumber
export const numberStrToBN = (num) => BigNumber.from(num.toString());

//bigNumber加法,返回bigNumber
export const bnAdd = (a, b) => _add(a, b);
//bigNumber加法,返回number
export const bnAdd2N = (a, b) => formatEtherToNumber(_add(a, b));
const _add = (a, b) => a.add(b);

//bigNumber减法,返回bigNumber
export const bnSub = (a, b) => _sub(a, b);
//bigNumber减法,返回number
export const bnSub2N = (a, b) => formatEtherToNumber(_sub(a, b));
const _sub = (a, b) => a.sub(b);

//bigNumber乘法,返回bigNumber
export const bnMul = (a, b) => _mul(a, b);
//bigNumber乘法,返回number
export const bnMul2N = (a, b) => formatEtherToNumber(_mul(a, b));
const _mul = (a, b) => a.mul(b).div(BIGNUMBER_BASENUMBER);

//bigNumber除法,返回bigNumber
export const bnDiv = (a, b) => _div(a, b);
//bigNumber除法,返回number
export const bnDiv2N = (a, b) => formatEtherToNumber(_div(a, b));
const _div = (a, b) => {
  return BigNumber.from(
    toNonExponential(
      floor(
        floor(Number(a.toString()) / Number(b.toString()), MAX_DECIMAL_LENGTH) *
          BIGNUMBER_BASENUMBER
      ).toString()
    )
  );
};
