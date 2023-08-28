import _ from "lodash";
import {
  NETWORK_SPEEDS_TO_KEY,
  GWEI_UNIT,
  GAS_LIMIT_BUFFER,
} from "./constants/network";
import { URLS } from "./constants/urls";
import api from "@/api";
import {
  typedConfigs,
  ChainType,
  NetworkType,
} from "../linearJs/web3Connector";
import { INFURA_PROJECT_ID as infuraId } from "../../../constants/envVars";

/**
 * ethererm网络
 */
let ETHEREUM_NETWORKS: number[] = [];

/**
 * bsc网络
 */
let BINANCE_NETWORKS: number[] = [];

/**
 * 主网网络
 */
let MAINNET_NETWORKS: number[] = [];

/**
 * 测试网网络
 */
let TESTNET_NETWORKS: number[] = [];

let ETHDEV_NETWORKS: number[] = [];

let BSCDEV_NETWORKS: number[] = [];

let DEV_NETWORKS: number[] = [];

let LIQUIDATION_NETWORKS: { [k: number]: string } = {};

let REWARD_UNLOCK_NETWORKS: { [k: number]: string } = {};

let SUPPORTED_NETWORKS: { [k: number]: string } = {};

let SUPPORTED_NETWORKS_CONFIG: { [k: number]: object } = {};

let BLOCKCHAIN_BROWSER: { [k: number]: string } = {};

let BLOCKCHAIN_BROWSER_API: { [k: number]: string } = {};

let REWARD_API_BASES: { [k: number]: string } = {};

let RPC_URL: { [k: number]: string } = {};

let BRIDGE_ADDRESSES: { [k: number]: string } = {};
let WORMHOLE_NETWORK_IDS: { [k: number]: number } = {};

for (let i = 0; i < typedConfigs.length; i++) {
  let object = typedConfigs[i];
  let id = object.networkId;
  if (object.chainType === ChainType.ETHEREUM) {
    ETHEREUM_NETWORKS.push(id);
  }
  if (object.chainType === ChainType.BINANCE) {
    BINANCE_NETWORKS.push(id);
  }
  if (object.networkType === NetworkType.MAINNET) {
    MAINNET_NETWORKS.push(id);
  }
  if (object.networkType === NetworkType.TEST) {
    TESTNET_NETWORKS.push(id);
  }
  if (object.networkType === NetworkType.DEV) {
    DEV_NETWORKS.push(id);
  }
  if (
    object.chainType === ChainType.ETHEREUM &&
    object.networkType === NetworkType.DEV
  ) {
    ETHDEV_NETWORKS.push(id);
  }
  if (
    object.chainType === ChainType.BINANCE &&
    object.networkType === NetworkType.DEV
  ) {
    BSCDEV_NETWORKS.push(id);
  }
  if (object.isLiquidationEnable) {
    LIQUIDATION_NETWORKS[id] = object.name;
  }
  if (object.isRewardable) {
    REWARD_UNLOCK_NETWORKS[id] = object.name;
  }
  SUPPORTED_NETWORKS[id] = object.name;
  SUPPORTED_NETWORKS_CONFIG[id] = object;
  BLOCKCHAIN_BROWSER[id] = object.blockchainBrowser;
  BLOCKCHAIN_BROWSER_API[id] = object.blockchainBrowserApi;
  REWARD_API_BASES[id] = object.rewardApiBase;
  if (object.rpcUrl) {
    RPC_URL[id] = object.rpcUrl;
  }

  BRIDGE_ADDRESSES[id] = object.addresses.LnErc20Bridge;
  WORMHOLE_NETWORK_IDS[id] = object.wormholeNetworkId;
}

export const isEthereumNetwork = (walletNetworkId: number) => {
  return ETHEREUM_NETWORKS.includes(+walletNetworkId);
};
export const isBinanceNetwork = (walletNetworkId: number) => {
  return BINANCE_NETWORKS.includes(+walletNetworkId);
};
export const isMainnetNetwork = (walletNetworkId: number) => {
  return MAINNET_NETWORKS.includes(+walletNetworkId);
};
export const isTestnetNetwork = (walletNetworkId: number) => {
  return TESTNET_NETWORKS.includes(+walletNetworkId);
};
export const isDevNetwork = (walletNetworkId: number) => {
  return DEV_NETWORKS.includes(+walletNetworkId);
};
export const isEthDevNetwork = (walletNetworkId: number) => {
  return ETHDEV_NETWORKS.includes(+walletNetworkId);
};
export const isBscDevNetwork = (walletNetworkId: number) => {
  return BSCDEV_NETWORKS.includes(+walletNetworkId);
};
export const isSupportNetwork = (walletNetworkId: number) => {
  return SUPPORTED_NETWORKS.hasOwnProperty(+walletNetworkId);
};

/**
 * 获取所在网络其他网络id
 * @param walletNetworkId 网络Id
 */
export const getOtherNetworks = (walletNetworkId: number) => {
  let other: number[] = [];
  if (isMainnetNetwork(walletNetworkId)) {
    other = MAINNET_NETWORKS.filter(
      (networkId) => networkId != walletNetworkId
    );
  } else if (isDevNetwork(walletNetworkId)) {
    other = DEV_NETWORKS.filter((networkId) => networkId != walletNetworkId);
  } else if (isTestnetNetwork(walletNetworkId)) {
    other = TESTNET_NETWORKS.filter(
      (networkId) => networkId != walletNetworkId
    );
  }
  return other;
};

export const SUPPORTED_NETWORKS_MAP = _.invert(SUPPORTED_NETWORKS);

export enum SUPPORTED_WALLETS {
  METAMASK = "MetaMask",
  BINANCE_CHAIN = "BinanceChain",
  WALLET_CONNECT = "WalletConnect",
}

/**
 * PC端钱包安装地址
 */
export const WALLET_EXTENSIONS = {
  METAMASK:
    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  BINANCE:
    "https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp",
};

/**
 * 链切换类型
 * network 钱包内切换网络
 * wallet 切换钱包
 */
export const CHAIN_CHANGE_TYPE = {
  NETWORK: "network",
  WALLET: "wallet",
};

/**
 * 默认gas 限制
 */
export const DEFAULT_GAS_LIMIT = {
  approve: 300000,
  staking: 300000,
  build: 500000,
  burn: 500000,
  unstake: 500000,
  claim: 140000,
  exchange: 22000,
  freeze: 200000,
  unfreeze: 200000,
};

/**
 * 钱包信息更新状态
 */
export const WALLET_STATUS = {
  UNINIT: -1, //未初始化
  UPDATING: 0, //更新中
  FINISH: 1, //更新完成
  ERROR: 2, //更新失败
};

//infura project id
export const INFURA_PROJECT_ID = infuraId;

export const INFURA_JSON_RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
};

// export const BLOCKCHAIN = {
//     ETHEREUM: "ethereum",
//     BINANCE: "binance"
// };

//RPC网络配置
export const ETHEREUM_CHAIN_OPTIONS: { [k: number]: any } = {
  56: {
    chainName: "BSC Mainnet",
    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    chainId: "0x38",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com"],
  },
};

export async function getEthereumNetwork() {
  const isMobile = window.$nuxt.$store.state?.isMobile;
  const walletType = window.$nuxt.$store.state?.walletType;
  if (
    !window.ethereum &&
    !isMobile &&
    walletType != SUPPORTED_WALLETS.WALLET_CONNECT
  ) {
    window.open(WALLET_EXTENSIONS.METAMASK);
    return {};
  }
  let networkId = 1;
  try {
    if (window.ethereum?.chainId) {
      networkId = Number(window.ethereum?.chainId);
      return {
        name: SUPPORTED_NETWORKS[networkId],
        networkId: networkId,
      };
    } else if (window.ethereum?.networkVersion) {
      networkId = Number(window.ethereum?.networkVersion);
      return {
        name: SUPPORTED_NETWORKS[networkId],
        networkId: networkId,
      };
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getBinanceNetwork() {
  const isMobile = window.$nuxt.$store.state?.isMobile;
  if (!window.BinanceChain && !isMobile) {
    window.open(WALLET_EXTENSIONS.BINANCE);
    return {};
  }
  let networkId = 56;
  try {
    if (window.BinanceChain?.chainId) {
      networkId = Number(window.BinanceChain?.chainId);
      return {
        name: SUPPORTED_NETWORKS[networkId],
        networkId: networkId,
      };
    }
  } catch (e) {
    console.log(e);
  }
}

export const getNetworkSpeeds = async (walletNetworkId: number) => {
  !walletNetworkId &&
    (walletNetworkId = window.$nuxt.$store.state?.walletNetworkId);

  if (isDevNetwork(walletNetworkId)) {
    return {
      [NETWORK_SPEEDS_TO_KEY.SLOW]: {
        price: 10,
        time: 1,
      },
      [NETWORK_SPEEDS_TO_KEY.MEDIUM]: {
        price: 15,
        time: 0.5,
      },
      [NETWORK_SPEEDS_TO_KEY.FAST]: {
        price: 20,
        time: 0.2,
      },
    };
  } else if (isEthereumNetwork(walletNetworkId)) {
    let result = await fetch(URLS.ETH_GAS_STATION, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (result?.status != 200) {
      result = await fetch(URLS.DEFI_PULSE_STATION, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }
    const networkInfo = await result.json();
    return {
      [NETWORK_SPEEDS_TO_KEY.SLOW]: {
        price: networkInfo.safeLow / 10,
        time: networkInfo.safeLowWait,
      },
      [NETWORK_SPEEDS_TO_KEY.MEDIUM]: {
        price: networkInfo.average / 10,
        time: networkInfo.avgWait,
      },
      [NETWORK_SPEEDS_TO_KEY.FAST]: {
        price: networkInfo.fast / 10,
        time: networkInfo.fastWait,
      },
    };
  } else if (isBinanceNetwork(walletNetworkId)) {
    let currentGasPrice = 20;
    const res = await api.getBSCGasPrice(walletNetworkId);
    if (res?.result) {
      currentGasPrice = unFormatGasPrice(res.result);
    }
    return {
      [NETWORK_SPEEDS_TO_KEY.SLOW]: {
        price: currentGasPrice * 0.75,
        time: 1,
      },
      [NETWORK_SPEEDS_TO_KEY.MEDIUM]: {
        price: currentGasPrice,
        time: 0.5,
      },
      [NETWORK_SPEEDS_TO_KEY.FAST]: {
        price: currentGasPrice * 1.25,
        time: 0.2,
      },
    };
  }
};

export const formatGasPrice = (gasPrice: number) => gasPrice * GWEI_UNIT;

export const unFormatGasPrice = (gasPrice: number) => gasPrice / GWEI_UNIT;

export function onMetamaskAccountChange(cb: any) {
  if (!window.ethereum) return;
  const listener = _.throttle(cb, 2000);
  window.ethereum.on("accountsChanged", listener);
}

export function onMetamaskChainChange(cb: any) {
  if (!window.ethereum) return;
  const listener = _.throttle(cb, 2000);
  window.ethereum.on("chainChanged", listener);
}

export function onBinanceAccountChange(cb: any) {
  if (!window.BinanceChain) return;
  const listener = _.throttle(cb, 2000);
  window.BinanceChain.on("accountsChanged", listener);
}

export function onBinanceChainChange(cb: any) {
  if (!window.BinanceChain) return;
  const listener = _.throttle(cb, 2000);
  window.BinanceChain.on("chainChanged", listener);
}

export function onWalletConnectAccountChange(provider: any, cb: any) {
  if (!provider) return;
  const listener = _.throttle(cb, 2000);
  provider.on("accountsChanged", listener);
}

export function onWalletConnectChainChange(provider: any, cb: any) {
  if (!provider) return;
  const listener = _.throttle(cb, 2000);
  provider.on("chainChanged", listener);
}

export function onWalletConnectDisconnect(provider: any, cb: any) {
  if (!provider) return;
  const listener = _.throttle(cb, 2000);
  provider.on("disconnect", listener);
}

export const bufferGasLimit = (gasLimit: string) =>
  Math.round(Number(gasLimit) * (1 + GAS_LIMIT_BUFFER));

/**
 * 添加网络到metamask
 * @param {*} networkId  网络ID
 */
export const addEthereumChain = async (networkId: number) => {
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{ ...ETHEREUM_CHAIN_OPTIONS[networkId] }],
  });
};

/**
 * 检查连接的网络ID
 * @returns
 */
export const checkNetwork = async (networkId: number | undefined) => {
  if (!networkId) {
    const network = await getEthereumNetwork();
    if (!network) return;
    networkId = network.networkId;
  }
  return isSupportNetwork(networkId!);
};

export {
  ETHEREUM_NETWORKS,
  BINANCE_NETWORKS,
  MAINNET_NETWORKS,
  TESTNET_NETWORKS,
  ETHDEV_NETWORKS,
  BSCDEV_NETWORKS,
  DEV_NETWORKS,
  LIQUIDATION_NETWORKS,
  REWARD_UNLOCK_NETWORKS,
  SUPPORTED_NETWORKS,
  SUPPORTED_NETWORKS_CONFIG,
  BLOCKCHAIN_BROWSER,
  BLOCKCHAIN_BROWSER_API,
  REWARD_API_BASES,
  RPC_URL,
  BRIDGE_ADDRESSES,
  WORMHOLE_NETWORK_IDS,
};
