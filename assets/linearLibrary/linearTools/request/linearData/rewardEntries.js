"use strict";
const { utils, BigNumber } = require("ethers");
const pageResults = require("graph-results-pager");

const GRAPHQL_BATCH_SIZE = 500;
const graphLiquidationPortalEndpoints = {
  56: process.env.SUBGRAPH_LIQUIDATION_PORTAL_BINANCE_MAINNET,
  10056: process.env.SUBGRAPH_LIQUIDATION_PORTAL_BSC_DEV,
};

module.exports = {
  pageResults,
  graphLiquidationPortalEndpoints,
  fetchRewardEntriesForAddress({
    max = GRAPHQL_BATCH_SIZE,
    networkId = undefined,
    walletAddress = undefined,
  } = {}) {
    if (networkId === undefined || walletAddress === undefined) return;
    return pageResults({
      api: graphLiquidationPortalEndpoints[networkId],
      max,
      query: {
        entity: "rewardEntries",
        selection: {
          orderBy: "unlockTime",
          orderDirection: "asc",
          where: {
            address: `\\"${walletAddress}\\"`,
            unlocked: false,
          },
        },
        properties: [
          "id",
          "entryId",
          "address",
          "amount",
          "unlockTime",
          "unlocked",
          "removed",
        ],
      },
    })
      .then((results) => {
        const rewardEntries = [];
        results.map((item) => {
          rewardEntries.push({
            id: item.id,
            entryId: parseInt(item.entryId),
            address: utils.getAddress(item.address),
            amount: BigNumber.from(item.amount),
            unlockTime: parseInt(item.unlockTime),
            unlocked: item.unlocked,
            removed: item.removed,
          });
        });
        return rewardEntries;
      })
      .catch((err) => console.error(err));
  },
};
