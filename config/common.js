import _ from "lodash";

let SUBPAGE_OPTIONS = {
  build: 1,
  burn: 2,
  claim: 3,
  transfer: 4,
  bridge: 5,
};

let WALLET_DETAILS_OPTIONS = {
  transaction: "transaction",
  track: "track",
};

let common = {
  //基础url前缀
  baseUrl: process.env.BACKEND_API,

  walletDetailsRefreshTimeout: 10000, //钱包面板刷新间隔(毫秒)

  SUBPAGE_OPTIONS,
  SUBPAGE_OPTIONS_MAP: _.invert(SUBPAGE_OPTIONS),

  WALLET_DETAILS_OPTIONS,
};

export default common;
