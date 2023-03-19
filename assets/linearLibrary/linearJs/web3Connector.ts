import * as ethers from "ethers";
import { getDefaultProvider, providers } from "ethers";
import ChainConfigs from "./chainConfigs.json";
import util from "./util";
import * as contracts from "../linearJs/lib/contracts";
import { INFURA_PROJECT_ID } from "../../../constants/envVars";

let Contracts: any = contracts;

export const typedConfigs: ChainConfig[] = ChainConfigs;

export interface ChainConfig {
  name: string;
  networkId: number;
  wormholeNetworkId: number;
  networkType: string;
  chainType: string;
  rpcUrl: string;
  isLiquidationEnable: boolean;
  isRewardable: boolean;
  blockchainBrowser: string;
  blockchainBrowserApi: string;
  addresses: ChainAddresses;
}

export enum ChainType {
  ETHEREUM = "ethereum",
  BINANCE = "binance",
}

export enum NetworkType {
  DEV = "dev",
  TEST = "test",
  MAINNET = "mainnet",
}

export interface ChainAddresses {
  LinearFinance: string;
  LnAssetSystem: string;
  LnErc20Bridge: string;
  LnBuildBurnSystem?: string;
  LnConfig?: string;
  LnOracleRouter?: string;
  LnDebtSystem?: string;
  LnCollateralSystem?: string;
  LnRewardLocker?: string;
  LnRewardSystem?: string;
  lUSD: string;
  lBTC: string;
  lETH: string;
  lLINK: string;
  lTRX: string;
  lDOT: string;
  lYFI: string;
  lBNB: string;
  lADA: string;
  lXLM: string;
  lXAU: string;
  lXAG: string;
  lJPY: string;
  lXLCI: string;
  lXBCI: string;
  lVET: string;
  lEUR: string;
  lUNI: string;
  lDEFI: string;
  lCAKE: string;
  lMATIC: string;
  lSOL: string;
  lPLAY: string;
}

export interface NetworksMap {
  key: number;
  value: ChainConfig;
}

interface Contracts {
  [k: string]: ethers.Contract;
}

export const networksMap = new Map();

typedConfigs.forEach((object) => {
  let id = object.networkId;
  networksMap.set(id, object);
});

const assetUpgradeableSubcontract = [
  "lUSD",
  "lBTC",
  "lETH",
  "lLINK",
  "lTRX",
  "lDOT",
  "lYFI",
  "lBNB",
  "lADA",
  "lXLM",
  "lXAU",
  "lXAG",
  "lEUR",
  "lUNI",
  "lJPY",
  "lXLCI",
  "lXBCI",
  "lVET",
  "lDEFI",
  "lCAKE",
  "lMATIC",
  "lSOL",
  "lPLAY",
];

const perpetualSubcontract = ["LnPerpetual_lBTC", "LnPerpetual_lETH"];

export default class Web3Connector {
  networkId: number;
  wormholeNetworkId: number;
  network: string;
  provider: providers.BaseProvider;
  signer: ethers.Signer | undefined;
  addressList: ChainAddresses;
  contracts: Contracts;
  utils: any;
  isEthereumNetwork: boolean;
  isBinanceNetwork: boolean;
  isMainnetNetwork: boolean;
  isTestnetNetwork: boolean;
  isDevNetwork: boolean;
  othersNetwork: number[];
  blockchainBrowser: string;
  blockchainBrowserApi: string;
  constructor(id: number, signer?: ethers.Signer) {
    const chainData = networksMap.get(id);

    const {
      name,
      networkId,
      wormholeNetworkId,
      networkType,
      chainType,
      rpcUrl,
      addresses,
      blockchainBrowser,
      blockchainBrowserApi,
    } = chainData;
    this.networkId = networkId || 1;
    this.wormholeNetworkId = wormholeNetworkId;
    this.network = name;
    let providerUrl;
    if (this.networkId === 1) {
      providerUrl = `${rpcUrl}${INFURA_PROJECT_ID}`;
    } else {
      providerUrl = rpcUrl;
    }

    this.provider = getDefaultProvider(providerUrl);
    this.signer = signer;
    this.addressList = addresses;
    this.blockchainBrowser = blockchainBrowser;
    this.blockchainBrowserApi = blockchainBrowserApi;
    const utils = new util(this.provider);
    this.utils = { ...utils, ...ethers.utils };
    this.isEthereumNetwork = chainType === ChainType.ETHEREUM;
    this.isBinanceNetwork = chainType === ChainType.BINANCE;
    this.isMainnetNetwork = networkType === NetworkType.MAINNET;
    this.isDevNetwork = networkType === NetworkType.DEV;
    this.isTestnetNetwork = networkType === NetworkType.TEST;

    /**
     * 获取所在网络其他网络id
     */
    this.othersNetwork = [];
    typedConfigs.forEach((object) => {
      if (object.networkType === networkType)
        this.othersNetwork.push(object.networkId);
    });

    function initContracts(
      contractAddress: { [index: string]: any } = {},
      signerOrProvider: providers.BaseProvider | ethers.Signer
    ) {
      return Object.keys(contractAddress).reduce(function (
        result: Contracts,
        key
      ) {
        const factoryKey = `${key}__factory`;
        if (assetUpgradeableSubcontract.includes(key)) {
          result[key] = contracts.LnAssetUpgradeable__factory.connect(
            contractAddress[key],
            signerOrProvider
          );
        } else if (perpetualSubcontract.includes(key)) {
          result[key] = contracts.LnPerpetual__factory.connect(
            contractAddress[key],
            signerOrProvider
          );
        } else {
          if (Contracts[factoryKey] === undefined) {
            console.log(key);
          }
          result[key] = Contracts[factoryKey].connect(
            contractAddress[key],
            signerOrProvider
          );
        }

        return result;
      },
      {});
    }
    // is a signer is not passed, init readable contracts only
    if (signer) {
      this.contracts = initContracts(addresses, signer);
    } else {
      this.contracts = initContracts(addresses, this.provider);
    }
  }
}
