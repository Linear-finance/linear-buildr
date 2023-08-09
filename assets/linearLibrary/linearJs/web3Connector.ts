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
  chainType: string;
  networkType: string;
  isLiquidationEnable: boolean;
  isRewardable: boolean;
  rpcUrl: string;
  blockchainBrowser: string;
  blockchainBrowserApi: string;
  rewardApiBase: string;
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

interface MultiCollateralSystem {
  [k: string]: {
    LinearFinance: ethers.Contract;
    LnDebtSystem: ethers.Contract;
    LnCollateralSystem: ethers.Contract;
    LnBuildBurnSystem: ethers.Contract;
    LnLiquidation: ethers.Contract;
    LnRewardSystem: ethers.Contract;
  };
}

export interface ChainAddresses {
  system: {
    LinearFinance: string;
    LnAssetSystem: string;
    LnConfig: string;
    LnAccessControl: string;
    LnOracleRouter: string;
    LnRewardLocker: string;
    LnErc20Bridge: string;
    LnExchangeSystem: string;
    LnPerpExchange: string;
    LnPerpPositionToken: string;
  };
  asset: {
    [k: string]: string;
  };
  perpetual?: {
    [k: string]: string;
  };
  collateral?: {
    [k: string]: {
      LinearFinance: string;
      LnDebtSystem: string;
      LnCollateralSystem: string;
      LnBuildBurnSystem: string;
      LnLiquidation: string;
      LnRewardSystem: string;
    };
  };
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
  "lX30",
  "lWTI",
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
  multiCollateral: MultiCollateralSystem | undefined;
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
      const perpetualContracts = contractAddress.perpetual
        ? Object.keys(contractAddress.perpetual).reduce(function (
            result: Contracts,
            key
          ) {
            result[key] = contracts.LnPerpetual__factory.connect(
              contractAddress.perpetual[key],
              signerOrProvider
            );
            return result;
          },
          {})
        : undefined;

      const assetsContracts = Object.keys(contractAddress.asset).reduce(
        function (result: Contracts, key) {
          result[key] = contracts.LnAssetUpgradeable__factory.connect(
            contractAddress.asset[key],
            signerOrProvider
          );
          return result;
        },
        {}
      );
      const systemContracts = Object.keys(contractAddress.system).reduce(
        function (result: Contracts, key) {
          const factoryKey = `${key}__factory`;
          if (Contracts[factoryKey] === undefined) {
            console.log(key);
          }
          result[key] = Contracts[factoryKey].connect(
            contractAddress.system[key],
            signerOrProvider
          );
          return result;
        },
        {}
      );

      const multicollateral = contractAddress.collateral
        ? Object.keys(contractAddress.collateral).reduce(function (
            result: MultiCollateralSystem,
            key
          ) {
            result[key] = {
              // Collateral token contract, keep nameing as "LinearFinance" for backward compatibility
              LinearFinance: contracts["Erc20__factory"].connect(
                contractAddress.collateral[key].LinearFinance,
                signerOrProvider
              ),
              LnDebtSystem: contracts["LnDebtSystem__factory"].connect(
                contractAddress.collateral[key].LnDebtSystem,
                signerOrProvider
              ),
              LnCollateralSystem: contracts[
                "LnCollateralSystem__factory"
              ].connect(
                contractAddress.collateral[key].LnCollateralSystem,
                signerOrProvider
              ),
              LnBuildBurnSystem: contracts[
                `LnBuildBurnSystem__factory`
              ].connect(
                contractAddress.collateral[key].LnBuildBurnSystem,
                signerOrProvider
              ),
              LnLiquidation: contracts[`LnLiquidation__factory`].connect(
                contractAddress.collateral[key].LnLiquidation,
                signerOrProvider
              ),
              LnRewardSystem: contracts[`LnRewardSystem__factory`].connect(
                contractAddress.collateral[key].LnRewardSystem,
                signerOrProvider
              ),
            };
            return result;
          },
          {})
        : undefined;

      return {
        generalContracts: {
          ...perpetualContracts,
          ...assetsContracts,
          ...systemContracts,
        },
        multiCollateral: multicollateral,
      };
    }
    // is a signer is not passed, init readable contracts only
    if (signer) {
      const constracts = initContracts(addresses, signer);
      this.contracts = constracts.generalContracts;
      this.multiCollateral = constracts.multiCollateral;
    } else {
      const constracts = initContracts(addresses, this.provider);

      this.contracts = constracts.generalContracts;
      this.multiCollateral = constracts.multiCollateral;
    }
  }
}
