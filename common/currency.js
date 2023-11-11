const currencies = {
  lUSD: {
    name: "ℓUSD",
    fullName: "ℓUSD",
    type: "crypto",
  },
  BTCl: {
    name: "BTCℓ",
    fullName: "Liquid Bitcoin",
    type: "crypto",
  },
  ETHl: {
    name: "ETHℓ",
    fullName: "Liquid Ether",
    type: "crypto",
  },
  //lBCH: {
  //    name: "BCH",
  //    fullName: "BCH",
  //    type: "crypto"
  //},
  //lEOS: {
  //    name: "EOS",
  //    fullName: "EOS",
  //    type: "crypto"
  //},
  //lLTC: {
  //    name: "LTC",
  //    fullName: "LTC",
  //    type: "crypto"
  //},
  XRPl: {
    name: "XRPℓ",
    fullName: "XRPℓ",
    type: "crypto",
  },
  TRXl: {
    name: "TRXℓ",
    fullName: "TRXℓ",
    type: "crypto",
  },
  //lBSV: {
  //    name: "BSV",
  //    fullName: "BSV",
  //    type: "crypto"
  //},
  LINKl: {
    name: "LINKℓ",
    fullName: "LINKℓ",
    type: "crypto",
  },
  //lZEC: {
  //    name: "ZEC",
  //    fullName: "ZEC",
  //    type: "crypto"
  //},
  //lNEO: {
  //    name: "NEO",
  //    fullName: "NEO",
  //    type: "crypto"
  //},
  BNBl: {
    name: "BNBℓ",
    fullName: "BNBℓ",
    type: "crypto",
  },
  //lDASH: {
  //    name: "DASH",
  //    fullName: "DASH",
  //    type: "crypto"
  //},
  //lJUST: {
  //    name: "JUST",
  //    fullName: "JUST",
  //    type: "crypto"
  //},
  DOTl: {
    name: "DOTℓ",
    fullName: "DOTℓ",
    type: "crypto",
  },
  YFIl: {
    name: "YFIℓ",
    fullName: "Yearn.finance",
    type: "crypto",
  },
  ADAl: {
    name: "ADAℓ",
    fullName: "Cardano",
    type: "crypto",
  },
  XLMl: {
    name: "XLMℓ",
    fullName: "Stellar",
    type: "crypto",
  },
  //lXCF: {
  //    name: "XCF",
  //    fullName: "XCF",
  //    type: " "
  //},
  XAUl: {
    name: "XAUℓ",
    fullName: "XAUℓ",
    type: "commodity",
  },
  XAGl: {
    name: "XAGℓ",
    fullName: "XAGℓ",
    type: "commodity",
  },
  //lSOY: {
  //    name: "SOY",
  //    fullName: "SOY",
  //    type: "commodity"
  //},
  //lOIL: {
  //    name: "OIL",
  //    fullName: "OIL",
  //    type: "commodity"
  //},
  //lNIKK: {
  //    name: "NIKK",
  //    fullName: "NIKK",
  //    type: "index"
  //},
  //lFTSE: {
  //    name: "FTSE",
  //    fullName: "FTSE",
  //    type: "index"
  //},
  //lCAC: {
  //    name: "CAC",
  //    fullName: "CAC",
  //    type: "index"
  //},
  //lDAX: {
  //    name: "DAX",
  //    fullName: "DAX",
  //    type: "index"
  //},
  lHB10: {
    name: "HB-10ℓ",
    fullName: "Liquid Huobi index",
    type: "index",
  },
  lXBCI: {
    name: "XBCIℓ",
    fullName: "Xangle Blue Chip Index",
    type: "index",
  },
  lXLCI: {
    name: "XLCIℓ",
    fullName: "Xangle Large Cap Index",
    type: "index",
  },
  lXCI: {
    name: "XCIℓ",
    fullName: "Xangle Cap index",
    type: "index",
  },
  lDEFI: {
    name: "DEFIℓ",
    fullName: "Pie DAO Index",
    type: "index",
  },
  UNIl: {
    name: "UNIℓ",
    fullName: "Uniswap",
    type: "crypto",
  },
  lXCU: {
    name: "XCUℓ",
    fullName: "XCUℓ",
    type: "commodity",
  },
  lCHF: {
    name: "CHFℓ",
    fullName: "CHFℓ",
    type: "currencies",
  },
  JPYl: {
    name: "JPYℓ",
    fullName: "JPYℓ",
    type: "currencies",
  },
  EURl: {
    name: "EURℓ",
    fullName: "EURℓ",
    type: "currencies",
  },
  DOGEl: {
    name: "DOGEℓ",
    fullName: "Doge Coin",
    type: "crypto",
  },
  VETl: {
    name: "VETℓ",
    fullName: "Vechain",
    type: "crypto",
  },
  CAKEl: {
    name: "CAKEℓ",
    fullName: "PancakeSwap",
    type: "crypto",
  },
  MATICl: {
    name: "MATICℓ",
    fullName: "Polygon",
    type: "crypto",
    tokenColor: "#2BBDF7",
  },
  SOLl: {
    name: "SOLℓ",
    fullName: "Solana",
    type: "crypto",
    tokenColor: "#9945FF",
  },
  lPLAY: {
    name: "PLAYℓ",
    fullName: "Pie DAO Index",
    type: "index",
    tokenColor: "#D50A99",
  },
};

//导入资源路径
const requireIcon = () => {
  return Object.keys(currencies).map((key) => {
    let currency = currencies[key];
    currency.icon = require(`@/static/currency/${key}.svg`);
    currency.icon_inactive = require(`@/static/currency/${key}_inactive.svg`);
  });
};

requireIcon();

export const sourceKey = "lUSD";

export default currencies;
