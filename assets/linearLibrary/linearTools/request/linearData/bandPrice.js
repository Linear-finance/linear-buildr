"use strict";
const { BigNumber } = require("ethers");
const pageResults = require("graph-results-pager");

const maxRequest = 1000;

const graphAPIEndpoints = {
  1: process.env.GRAPH_BAND_BINANCE_MAINNET,
  56: process.env.GRAPH_BAND_BINANCE_MAINNET,
  10001: process.env.GRAPH_BAND_BSCDEV,
  10056: process.env.GRAPH_BAND_BSCDEV,
};

module.exports = {
  pageResults,
  graphAPIEndpoints,
  band: {
    pricesLast({
      max = maxRequest,
      source = undefined,
      sources = [],
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "pricesLasts",
          selection: {
            where: {
              id: source ? `\\"${source}\\"` : undefined,
              id_in:
                sources.length != 0
                  ? "[" + sources.map((code) => `\\"${code}\\"`).join(",") + "]"
                  : undefined,
            },
          },
          properties: ["id", "currentPrice"],
        },
      })
        .then((results) => {
          let prices = {};
          results.map(
            ({ id, currentPrice }) =>
              (prices[id] = BigNumber.from(currentPrice))
          );
          return prices;
        })
        .catch((err) => console.error(err));
    },
  },
};
