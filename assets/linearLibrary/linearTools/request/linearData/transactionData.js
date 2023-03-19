"use strict";
const { BigNumber } = require("ethers");
const pageResults = require("graph-results-pager");
const { bn2n } = require("@/common/bnCalc");

const maxRequest = 1000;

const graphAPIEndpoints = {
  1: process.env.GRAPH_BUILDR_ETHEREUM_MAINNET,
  56: process.env.GRAPH_BUILDR_BINANCE_MAINNET,
  10001: process.env.GRAPH_BUILDR_ETHDEV,
  10056: process.env.GRAPH_BUILDR_BSCDEV,
};

const swapGraphAPIEndpoints = {
  1: process.env.GRAPH_BUILDR_SWAP_ETHEREUM_MAINNET,
  56: process.env.GRAPH_BUILDR_BINANCE_MAINNET,
  10001: process.env.GRAPH_BUILDR_SWAP_ETHDEV,
  10056: process.env.GRAPH_BUILDR_BSCDEV,
};

module.exports = {
  pageResults,
  graphAPIEndpoints,
  lnr: {
    minted({
      max = maxRequest,
      account = undefined,
      minBlock = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "minteds",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
              block_gte: minBlock || undefined,
            },
          },
          properties: [
            "id", // the transaction hash
            "account", // the address of the burner
            "timestamp", // the timestamp when this transaction happened
            "block", // the block in which this transaction happened
            "value", // the issued amount in lUSD
            "source", //符号
          ],
        },
      })
        .then((results) =>
          results.map(({ id, account, timestamp, block, value, source }) => ({
            hash: id.split("-")[0],
            account,
            timestamp: Number(timestamp * 1000),
            block: Number(block),
            value: bn2n(BigNumber.from(value)),
            source: source,
            symbol: "+",
          }))
        )
        .catch((err) => console.error(err));
    },
    burned({
      max = maxRequest,
      account = undefined,
      minBlock = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "burneds",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
              block_gte: minBlock || undefined,
            },
          },
          properties: [
            "id", // the transaction hash
            "account", // the address of the burner
            "timestamp", // the timestamp when this transaction happened
            "block", // the block in which this transaction happened
            "value", // the burned amount in lUSD
            "source", //符号
          ],
        },
      })
        .then((results) =>
          results.map(({ id, account, timestamp, block, value, source }) => ({
            hash: id.split("-")[0],
            account,
            timestamp: Number(timestamp * 1000),
            block: Number(block),
            value: bn2n(BigNumber.from(value)),
            source: source,
            symbol: "-",
          }))
        )
        .catch((err) => console.error(err));
    },
    debtSnapshots({
      max = maxRequest,
      account = undefined,
      minBlock = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "debtSnapshots",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
              block_gte: minBlock || undefined,
            },
          },
          properties: [
            "id", // the transaction hash
            "account", // the address of the burner
            "timestamp",
            "debtBalanceOf",
          ],
        },
      })
        .then((results) =>
          results.map(({ id, account, timestamp, debtBalanceOf }) => ({
            hash: id.split("-")[0],
            account,
            timestamp: Number(timestamp * 1000),
            debtBalanceOf,
          }))
        )
        .catch((err) => console.error(err, "debtSnapshot err"));
    },
    transfer({
      account = undefined,
      max = maxRequest,
      minBlock = undefined,
      maxBlock = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "transfers",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              addressStr_contains: account
                ? `\\"${account.toLocaleLowerCase()}\\"`
                : undefined,
              block_gte: minBlock || undefined,
              block_lte: maxBlock || undefined,
            },
          },
          properties: [
            "id",
            "to",
            "from",
            "value",
            "block",
            "timestamp",
            "source",
          ],
        },
      })
        .then((results) =>
          results.map(({ id, block, timestamp, from, to, value, source }) => ({
            block: Number(block),
            timestamp: Number(timestamp * 1000),
            date: new Date(timestamp * 1000),
            hash: id.split("-")[0],
            from,
            to,
            value: bn2n(BigNumber.from(value)),
            source: source,
            symbol: account.toUpperCase() == from.toUpperCase() ? "-" : "+",
          }))
        )
        .catch((err) => console.error(err));
    },
    feesClaimed({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "feesClaimeds",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
            },
          },
          properties: [
            "id", // the transaction hash
            "account", // the address of the claimer
            "timestamp", // the timestamp when this transaction happened
            "block", // the block in which this transaction happened
            "rewardslusd",
            "rewardsLina",
          ],
        },
      })
        .then((results) =>
          results.map(
            ({ id, account, timestamp, block, rewardslusd, rewardsLina }) => ({
              hash: id.split("-")[0],
              account,
              timestamp: Number(timestamp * 1000),
              block: Number(block),
              rewardslusd: bn2n(BigNumber.from(rewardslusd)),
              rewardsLina: bn2n(BigNumber.from(rewardsLina)),
            })
          )
        )
        .catch((err) => console.error(err));
    },
    collateral({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "collaterals",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
            },
          },
          properties: [
            "id",
            "account",
            "timestamp",
            "block",
            "value",
            "currency",
          ],
        },
      })
        .then((results) =>
          results.map(({ id, account, timestamp, block, value, currency }) => ({
            hash: id.split("-")[0],
            account,
            timestamp: Number(timestamp * 1000),
            block: Number(block),
            value: bn2n(BigNumber.from(value)),
            source: currency,
            symbol: "-",
          }))
        )
        .catch((err) => console.error(err));
    },
    unlockReward({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "rewardUnlockeds",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
            },
          },
          properties: ["id", "account", "timestamp", "block", "value"],
        },
      })
        .then((results) =>
          results.map(({ id, account, timestamp, block, value }) => ({
            hash: id.split("-")[0],
            account,
            timestamp: Number(timestamp * 1000),
            block: Number(block),
            value: bn2n(BigNumber.from(value)),
          }))
        )
        .catch((err) => console.error(err));
    },
    redeemCollateral({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "redeemCollaterals",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              account: account ? `\\"${account}\\"` : undefined,
            },
          },
          properties: [
            "id",
            "account",
            "timestamp",
            "block",
            "value",
            "currency",
          ],
        },
      })
        .then((results) =>
          results.map(({ id, account, timestamp, block, value, currency }) => ({
            hash: id.split("-")[0],
            account,
            timestamp: Number(timestamp * 1000),
            block: Number(block),
            value: bn2n(BigNumber.from(value)),
            source: currency,
            symbol: "+",
          }))
        )
        .catch((err) => console.error(err));
    },
    //用户pratio状态（是否被标记为即将清算，有三天窗口）
    userPositionMarked({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "userPositionMarkeds",
          selection: {
            where: {
              user: account ? `\\"${account}\\"` : undefined,
            },
          },
          properties: ["user", "markertimestamp", "positionMarkedState"],
        },
      })
        .then((results) =>
          results.map(({ user, markertimestamp, positionMarkedState }) => ({
            account: user,
            timestamp: Number(markertimestamp * 1000),
            state: positionMarkedState == 1 ? true : false,
          }))
        )
        .catch((err) => console.error(err));
    },
    //用户最近的爆仓状态
    positionLiquidated({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "positionLiquidateds",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              user: account ? `\\"${account}\\"` : undefined,
            },
          },
          properties: [
            "user",
            "collateralWithdrawnFromStaked",
            "collateralWithdrawnFromLocked",
            "timestamp",
          ],
        },
      })
        .then((results) =>
          results.map(
            ({
              user,
              collateralWithdrawnFromStaked,
              collateralWithdrawnFromLocked,
              timestamp,
            }) => ({
              account: user,
              stakedValue: bn2n(BigNumber.from(collateralWithdrawnFromStaked)),
              lockedValue: bn2n(BigNumber.from(collateralWithdrawnFromLocked)),
              timestamp: Number(timestamp * 1000),
            })
          )
        )
        .catch((err) => console.error(err));
    },
    liquidatedStakedCollateral({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
      value = undefined,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "liquidatedStakedCollaterals",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              user: account ? `\\"${account}\\"` : undefined,
              value_gt: value || undefined,
            },
          },
          properties: ["id", "user", "value", "timestamp", "currency"],
        },
      })
        .then((results) =>
          results.map(({ id, user, value, timestamp, currency }) => ({
            hash: id.split("-")[0],
            account: user,
            timestamp: Number(timestamp * 1000),
            value: bn2n(BigNumber.from(value)),
            source: currency,
            symbol: "-",
          }))
        )
        .catch((err) => console.error(err));
    },
    liquidatedLockedCollateral({
      max = maxRequest,
      account = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
      value = undefined,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "liquidatedLockedCollaterals",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              user: account ? `\\"${account}\\"` : undefined,
              value_gt: value || undefined,
            },
          },
          properties: ["id", "user", "value", "timestamp", "currency"],
        },
      })
        .then((results) =>
          results.map(({ id, user, value, timestamp, currency }) => ({
            hash: id.split("-")[0],
            account: user,
            timestamp: Number(timestamp * 1000),
            value: bn2n(BigNumber.from(value)),
            source: currency,
            symbol: "-",
          }))
        )
        .catch((err) => console.error(err));
    },
    referral({
      to = undefined,
      max = maxRequest,
      minBlock = undefined,
      maxBlock = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "referrals",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: {
              to: to ? `\\"${to}\\"` : undefined,
              block_gte: minBlock || undefined,
              block_lte: maxBlock || undefined,
            },
          },
          properties: [
            "id",
            "to",
            "from",
            "value",
            "block",
            "timestamp",
            "source",
          ],
        },
      })
        .then((results) =>
          results.map(({ id, block, timestamp, from, to, value, source }) => ({
            block: Number(block),
            timestamp: Number(timestamp * 1000),
            date: new Date(timestamp * 1000),
            hash: id.split("-")[0],
            from,
            to,
            value: bn2n(BigNumber.from(value)),
            source: source,
            symbol: "+",
          }))
        )
        .catch((err) => console.error(err));
    },
    updateUserDebt({
      max = maxRequest,
      filter = {},
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "updateUserDebts",
          selection: {
            orderBy: "timestamp",
            orderDirection: "desc",
            where: filter,
          },
          properties: [
            "debtProportion",
            "debtFactor",
            "totalAssetSupplyInUsd",
            "timestamp",
          ],
        },
      })
        .then((results) =>
          results.map(
            ({
              debtProportion,
              debtFactor,
              totalAssetSupplyInUsd,
              timestamp,
            }) => ({
              debtProportion: debtProportion,
              debtFactor: debtFactor,
              totalAssetSupplyInUsd: totalAssetSupplyInUsd,
              timestamp: Number(timestamp * 1000),
            })
          )
        )
        .catch((err) => console.error(err));
    },
    freeZe({
      max = maxRequest,
      depositor = undefined,
      recipient = undefined,
      source = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: swapGraphAPIEndpoints[networkId],
        max,
        query: {
          entity: "freeZes",
          selection: {
            orderBy: "index",
            orderDirection: "desc",
            where: {
              depositor: depositor
                ? `\\"${depositor.replace(
                    "0x",
                    "0x000000000000000000000000"
                  )}\\"`
                : undefined,
              recipient: recipient
                ? `\\"${recipient.replace(
                    "0x",
                    "0x000000000000000000000000"
                  )}\\"`
                : undefined,
              currency: source ? `\\"${source}\\"` : undefined,
            },
          },
          properties: [
            "id",
            "srcChainId",
            "destChainId",
            "depositId",
            "depositor",
            "recipient",
            "currency",
            "amount",
            "timestamp",
          ],
        },
      })
        .then((results) =>
          results.map(
            ({
              id,
              srcChainId,
              destChainId,
              depositId,
              depositor,
              recipient,
              currency,
              amount,
              timestamp,
            }) => ({
              hash: id.split("-")[0],
              srcChainId,
              destChainId,
              depositId,
              depositor,
              recipient,
              source: currency,
              value: bn2n(BigNumber.from(amount)),
              timestamp: Number(timestamp * 1000),
              symbol: "-",
            })
          )
        )
        .catch((err) => console.error(err));
    },
    unfreeze({
      max = maxRequest,
      depositor = undefined,
      recipient = undefined,
      source = undefined,
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: swapGraphAPIEndpoints[networkId],
        max,
        query: {
          entity: "unfreezes",
          selection: {
            orderBy: "index",
            orderDirection: "desc",
            where: {
              depositor: depositor
                ? `\\"${depositor.replace(
                    "0x",
                    "0x000000000000000000000000"
                  )}\\"`
                : undefined,
              recipient: recipient
                ? `\\"${recipient.replace(
                    "0x",
                    "0x000000000000000000000000"
                  )}\\"`
                : undefined,
              currency: source ? `\\"${source}\\"` : undefined,
            },
          },
          properties: [
            "id",
            "srcChainId",
            "destChainId",
            "depositId",
            "depositor",
            "recipient",
            "currency",
            "amount",
            "timestamp",
          ],
        },
      })
        .then((results) =>
          results.map(
            ({
              id,
              srcChainId,
              destChainId,
              depositId,
              depositor,
              recipient,
              currency,
              amount,
              timestamp,
            }) => ({
              hash: id.split("-")[0],
              srcChainId,
              destChainId,
              depositId,
              depositor,
              recipient,
              source: currency,
              value: bn2n(BigNumber.from(amount)),
              timestamp: Number(timestamp * 1000),
              symbol: "+",
            })
          )
        )
        .catch((err) => console.error(err));
    },
    userMintOrBurnAssetsCount({
      max = maxRequest,
      account = undefined,
      source = "lUSD",
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: graphAPIEndpoints[networkId],
        max,
        query: {
          entity: "userMintOrBurnAssetsCounts",
          selection: {
            where: {
              account: account ? `\\"${account}\\"` : undefined,
              source: source ? `\\"${source}\\"` : undefined,
            },
          },
          properties: ["mintTokens", "burnTokens"],
        },
      })
        .then((results) =>
          results.map(({ mintTokens, burnTokens }) => ({
            mintTokens: bn2n(BigNumber.from(mintTokens)),
            burnTokens: bn2n(BigNumber.from(burnTokens)),
          }))
        )
        .catch((err) => console.error(err));
    },
    userSwapAssetsCount({
      max = maxRequest,
      account = undefined,
      source = undefined,
      sourceKeyInArr = [],
      networkId = $nuxt.$store.state?.walletNetworkId,
    } = {}) {
      return pageResults({
        api: swapGraphAPIEndpoints[networkId],
        max,
        query: {
          entity: "userSwapAssetsCounts",
          selection: {
            where: {
              account: account
                ? `\\"${account
                    .replace("0x", "0x000000000000000000000000")
                    .toLocaleLowerCase()}\\"`
                : undefined,
              source: source ? `\\"${source}\\"` : undefined,
              source_in:
                sourceKeyInArr != undefined && sourceKeyInArr.length != 0
                  ? "[" +
                    sourceKeyInArr.map((code) => `\\"${code}\\"`).join(",") +
                    "]"
                  : undefined,
            },
          },
          properties: ["account", "source", "freeZeTokens", "UnFreeZeTokens"],
        },
      })
        .then((results) =>
          results.map(({ account, source, freeZeTokens, UnFreeZeTokens }) => ({
            account: account.replace("0x000000000000000000000000", "0x"),
            source,
            freeZeTokens: BigNumber.from(freeZeTokens),
            UnFreeZeTokens: BigNumber.from(UnFreeZeTokens),
          }))
        )
        .catch((err) => console.error(err));
    },
  },
};
