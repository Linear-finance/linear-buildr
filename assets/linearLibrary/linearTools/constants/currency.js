import _ from "lodash";

export const CRYPTO_CURRENCIES = ["ETH", "BNB", "LINA", "lUSD", "BTCB"];
export const CRYPTO_CURRENCIES_API = {
  ETH: {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
  },
  BNB: {
    id: "binancecoin",
    symbol: "bnb",
    name: "Binance Coin",
  },
};
export const CRYPTO_CURRENCY_TO_KEY = _.keyBy(CRYPTO_CURRENCIES, (key) => key);

export const LINA = "LINA";
