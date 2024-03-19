interface collateral {
  name: string;
  key: string;
  contractKey: string;
  targetRatio: number;
  img: string;
  darkimg: string;
  inactive: string;
  buyLink: string;
  decimal: number;
  maxTotalPRatio: number;
  minCollateral: number;
}

export const collateralAssets: collateral[] = [
  {
    name: "LINA",
    key: "LINA",
    contractKey: "LINA",
    targetRatio: 3.5,
    img: "LINA_logo.svg",
    darkimg: "LINA_logo_dark.svg",
    inactive: "LINA_logo.svg",
    buyLink:
      "https://pancakeswap.finance/swap?inputCurrency=0x762539b45A1dCcE3D36d080F74d1AED37844b878",
    decimal: 18,
    maxTotalPRatio: 600,
    minCollateral: 1,
  },
  {
    name: "WBNB",
    key: "WBNB",
    contractKey: "WBNB",
    targetRatio: 3.5,
    img: "currency/BNB.svg",
    darkimg: "currency/BNB.svg",
    inactive: "currency/BNB.svg",
    buyLink:
      "https://pancakeswap.finance/swap?outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    decimal: 18,
    maxTotalPRatio: 600,
    minCollateral: 0.0001,
  },
  {
    name: "ETH",
    key: "ETH",
    contractKey: "ETH",
    targetRatio: 3.5,
    img: "currency/ETH.svg",
    darkimg: "currency/ETH.svg",
    inactive: "currency/ETH.svg",
    buyLink:
      "https://pancakeswap.finance/swap?outputCurrency=0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    decimal: 18,
    maxTotalPRatio: 600,
    minCollateral: 0.0001,
  },
  {
    name: "BTCB",
    key: "BTCB",
    contractKey: "BTCB",
    targetRatio: 3.5,
    img: "currency/BTCl.svg",
    darkimg: "currency/BTCl.svg",
    inactive: "currency/BTCl.svg",
    buyLink:
      "https://pancakeswap.finance/swap?outputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    decimal: 18,
    maxTotalPRatio: 600,
    minCollateral: 0.0001,
  },
];
