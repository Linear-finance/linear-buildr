import {
  getEthereumNetwork,
  getBinanceNetwork,
  SUPPORTED_WALLETS,
  INFURA_PROJECT_ID,
  onMetamaskAccountChange,
  onBinanceAccountChange,
  onWalletConnectAccountChange,
  onBinanceChainChange,
  onMetamaskChainChange,
  onWalletConnectChainChange,
  onWalletConnectDisconnect,
  CHAIN_CHANGE_TYPE,
  INFURA_JSON_RPC_URLS,
  RPC_URL,
  SUPPORTED_NETWORKS,
} from "./network";
import Web3Connector from "../linearJs/web3Connector";
import $pub from "pubsub-js";
import signers from "../linearJs/lib/signers";
import { storeDetailsData } from "./request";
import { UpdateWalletConnectSigner } from "../linearJs/lib/signers/walletConnectSigner";
import { ethers } from "ethers";

let lnrJSConnector: any = {
  signers,
  setContractSettings: function (networkId: number, signer?: ethers.Signer) {
    this.Web3 = new Web3Connector(networkId, signer);
    this.lnrJS = this.Web3.contracts;
    this.signer = this.Web3.signer;
    this.provider = this.Web3.provider;
    this.utils = this.Web3.utils;
    this.addressList = this.Web3.addressList;
  },
};

export const defaultNetwork = {
  name: "MAINNET",
  networkId: 1,
};

export const connectToWallet = async (walletType: SUPPORTED_WALLETS) => {
  try {
    let wallet;
    switch (walletType) {
      case SUPPORTED_WALLETS.METAMASK:
        return (wallet = await connectToMetamask());

      case SUPPORTED_WALLETS.BINANCE_CHAIN:
        return (wallet = await connectToBinance());

      case SUPPORTED_WALLETS.WALLET_CONNECT:
        return (wallet = await connectToWalletConnect());
    }
  } catch (error) {
    console.log(error, "connectToWallet error");
  }
};

const connectToMetamask = async () => {
  const walletState = {
    walletType: SUPPORTED_WALLETS.METAMASK,
  };
  try {
    if (window.ethereum) {
      // window.ethereum.autoRefreshOnNetworkChange = true;
      await window.ethereum.enable();
    }
    const signer = await signers.MetaMask();
    const provider = signer.provider;
    const accounts = await provider.listAccounts();
    if (accounts && accounts.length > 0) {
      let network = await provider.getNetwork();
      lnrJSConnector.setContractSettings(network.chainId, signer.signer);
      return {
        ...walletState,
        currentWallet: accounts[0],
        networkId: network.chainId,
        networkName: network.name.toLowerCase(),
      };
    }
  } catch (e) {
    console.log(e);
  }
};

const connectToBinance = async () => {
  const walletState = {
    walletType: SUPPORTED_WALLETS.BINANCE_CHAIN,
  };
  try {
    if (window.BinanceChain) {
      // window.BinanceChain.autoRefreshOnNetworkChange = true;
      await window.BinanceChain.enable();
    }
    let signer = await signers.BinanceChain();
    let provider = signer.provider;
    const accounts = await provider.listAccounts();
    if (accounts && accounts.length > 0) {
      let network = await provider.getNetwork();
      lnrJSConnector.setContractSettings(network.chainId, signer.signer);
      return {
        ...walletState,
        currentWallet: accounts[0],
        networkId: network.chainId,
        networkName: network.name.toLowerCase(),
      };
    }
  } catch (e) {
    console.log(e);
  }
};

const connectToWalletConnect = async () => {
  const walletState = {
    walletType: SUPPORTED_WALLETS.WALLET_CONNECT,
  };

  let registeredWalletConnectEvents =
    window.$nuxt.$store.state?.registeredWalletConnectEvents;

  try {
    //启动

    // if (lnrJSConnector.signers.WalletConnect().connected) {
    //   //每次刷新界面的时候断开walletConnect 连接
    //   await lnrJSConnector.signers.WalletConnect().provider.disconnect();
    //   window.$nuxt.$store.commit("setWalletConnect", {
    //     qrcode: false,
    //   });
    // }

    // 当连接方式为wallet_connect 且已经设置监听方式时,不要再去重新生成signer，改用updateWalletConnectWeb3Provider去更新provider
    if (registeredWalletConnectEvents) {
      console.log("registerconnect");
      let networkId = window.$nuxt.$store.state?.walletNetworkId;
      setSigner({ type: walletState.walletType, networkId });
      return {
        walletType: SUPPORTED_WALLETS.WALLET_CONNECT,
        currentWallet: window.$nuxt.$store.state?.wallet.address,
        networkId: networkId,
        networkName: SUPPORTED_NETWORKS[networkId],
      };
    } else {
      const walletConfig = getSignerConfig({
        type: walletState.walletType,
        networkId: 1,
      });
      let signer = await signers.WalletConnect(walletConfig);
      if (signer) {
        let provider = signer.provider;
        const accounts = await provider.listAccounts();
        if (accounts && accounts.length > 0) {
          let network = await provider.getNetwork();
          lnrJSConnector.setContractSettings(network.chainId, signer.signer);
          return {
            ...walletState,
            currentWallet: accounts[0],
            networkId: network.chainId,
            networkName: network.name.toLowerCase(),
          };
        }
      }
      //这里存在的原因是当enable时会改变chainId
      // let networkId = (await provider.getNetwork()).chainId;
      // 更新web3Provider,不然会出现调用合约方法出错的问题
      //  updateWalletConnectWeb3Provider({
      //     type: walletState.walletType,
      //     networkId,
      //   });
    }
  } catch (e) {
    console.log(e);
  }
};

interface Iprops {
  type: SUPPORTED_WALLETS;
  networkId: number;
}

//更新wallect connect signer
const updateWalletConnectWeb3Provider = (props: Iprops) => {
  if (props.type !== SUPPORTED_WALLETS.WALLET_CONNECT) {
    return;
  }
  let signer = UpdateWalletConnectSigner({
    provider: lnrJSConnector.provider,
  });
  lnrJSConnector.setContractSettings(props.networkId, signer.signer);
};

export const setSigner = async (props: Iprops) => {
  const walletConfig = getSignerConfig(props);
  const signer = await signers.WalletConnect(walletConfig);
  lnrJSConnector.setContractSettings(Number(props.networkId), signer?.provider);
};

const getSignerConfig = (props: Iprops) => {
  if (props.type === SUPPORTED_WALLETS.WALLET_CONNECT) {
    let rpc = { ...INFURA_JSON_RPC_URLS, ...RPC_URL };
    return {
      chainId: props.networkId,
      infuraId: INFURA_PROJECT_ID,
      rpc,
    };
  }
  return {};
};

/**
 * 选择钱包
 * @param walletType 钱包类型
 * @param waitStore  是否等待数据获取完成
 */
export const selectedWallet = async (
  walletType: SUPPORTED_WALLETS,
  waitStore = true
) => {
  //walletType = SUPPORTED_WALLETS.WALLET_CONNECT;
  try {
    //连接钱包
    const walletStatus = await connectToWallet(walletType);
    if (
      walletStatus === undefined ||
      !SUPPORTED_NETWORKS[walletStatus?.networkId]
    ) {
      window.$nuxt.$store.commit("setAutoConnect", false);
      window.$nuxt.$store.commit("setWalletType", "");
      await lnrJSConnector?.signer?.provider?.provider?.disconnect();
      // location.reload();
      throw new Error("not support network");
    }
    window.$nuxt.$Spin.show();
    const store = window.$nuxt.$store;

    //连接成功
    if (walletStatus && walletStatus.currentWallet) {
      store.commit(
        "setWalletNetworkName",
        SUPPORTED_NETWORKS[walletStatus.networkId]
      );
      store.commit("setWalletNetworkId", walletStatus.networkId.toString());

      store.commit("setAutoConnect", true);

      //防止onWalletAccountChange内数据未更新时,太快进入功能子页获取不到wallet的问题
      store.commit("mergeWallet", {
        address: walletStatus?.currentWallet,
      });

      store.commit("setWalletType", walletType);

      //不重复注册事件,防止事件叠加
      let registeredMetamaskWalletEvents =
        store.state?.registeredMetamaskWalletEvents;
      let registeredBinanceWalletEvents =
        store.state?.registeredBinanceWalletEvents;
      let registeredWalletConnectEvents =
        store.state?.registeredWalletConnectEvents;

      //绑定事件
      if (
        walletType == SUPPORTED_WALLETS.METAMASK &&
        !registeredMetamaskWalletEvents
      ) {
        onMetamaskAccountChange(async () => {
          //当前链的钱包切换时才执行更新
          if (store.state.walletType == SUPPORTED_WALLETS.METAMASK) {
            window.$nuxt.$Spin.show();
            let network = await getEthereumNetwork();
            let { networkId } = network!;
            const signer = lnrJSConnector.signers.MetaMask().signer;

            if (networkId === undefined) return;
            const address = await lnrJSConnector.signers
              .MetaMask()
              .provider.listAccounts();

            lnrJSConnector.setContractSettings(networkId, signer.signer);

            store.commit("mergeWallet", {
              address: address[0],
            });

            store.commit("setWalletDetails", {}); //清理数据
            await storeDetailsData();
            $pub.publish("onWalletAccountChange");
            window.$nuxt.$Spin.hide();
          }
        });

        //切换网络刷新页面
        onMetamaskChainChange(async () => {
          if (store.state.walletType == SUPPORTED_WALLETS.METAMASK) {
            store.commit("setWalletDetails", {}); //清理数据
            const status = await selectedWallet(SUPPORTED_WALLETS.METAMASK);
            status &&
              $pub.publish("onWalletChainChange", CHAIN_CHANGE_TYPE.NETWORK);
          }
        });

        store.commit("setRegisteredMetamaskWalletEvents", true);
      } else if (
        walletType == SUPPORTED_WALLETS.BINANCE_CHAIN &&
        !registeredBinanceWalletEvents
      ) {
        onBinanceAccountChange(async () => {
          //当前链的钱包切换时才执行更新
          if (store.state.walletType == SUPPORTED_WALLETS.BINANCE_CHAIN) {
            window.$nuxt.$Spin.show();

            const address = await lnrJSConnector.signers
              .BinanceChain()
              .provider.listAccounts();
            const signer = lnrJSConnector.signers.BinanceChain().signer;

            lnrJSConnector.setContractSettings(
              walletStatus.networkId,
              signer.signer
            );

            store.commit("mergeWallet", {
              address: address[0],
            });

            await storeDetailsData();
            $pub.publish("onWalletAccountChange");
            window.$nuxt.$Spin.hide();
          }
        });

        //切换网络刷新页面
        onBinanceChainChange(() => {
          if (store.state.walletType == SUPPORTED_WALLETS.BINANCE_CHAIN) {
            location.reload();
            // $pub.publish("onBinanceChainChange");
          }
        });

        store.commit("setRegisteredBinanceWalletEvents", true);
      } else if (
        walletType == SUPPORTED_WALLETS.WALLET_CONNECT &&
        !registeredWalletConnectEvents
      ) {
        onWalletConnectAccountChange(
          lnrJSConnector.provider,
          async (accounts: string[]) => {
            //当前链的钱包切换时才执行更新
            if (
              store.state.walletType == SUPPORTED_WALLETS.WALLET_CONNECT &&
              store.state?.wallet.address != accounts[0]
            ) {
              window.$nuxt.$Spin.show();
              let networkId = (await lnrJSConnector.provider.getNetwork())
                .chainId;

              updateWalletConnectWeb3Provider({
                type: SUPPORTED_WALLETS.WALLET_CONNECT,
                networkId,
              });
              const address =
                await await lnrJSConnector.provider.listAccounts();

              store.commit("mergeWallet", {
                address: address[0],
              });

              store.commit("setWalletDetails", {}); //清理数据
              await storeDetailsData();
              $pub.publish("onWalletAccountChange");
              window.$nuxt.$Spin.hide();
            }
          }
        );

        //切换网络刷新页面
        onWalletConnectChainChange(
          lnrJSConnector.signers.PrivateKey().provider,
          async () => {
            if (store.state.walletType == SUPPORTED_WALLETS.WALLET_CONNECT) {
              store.commit("setWalletDetails", {}); //清理数据

              const status = await selectedWallet(
                SUPPORTED_WALLETS.WALLET_CONNECT
              );
              status &&
                $pub.publish("onWalletChainChange", CHAIN_CHANGE_TYPE.NETWORK);
            }
          }
        );

        //断开连接
        onWalletConnectDisconnect(
          lnrJSConnector.signers.PrivateKey().provider,
          async () => {
            if (store.state.walletType == SUPPORTED_WALLETS.WALLET_CONNECT) {
              store.commit("setAutoConnect", false);
              if (registeredWalletConnectEvents) {
                store.commit("setRegisteredWalletConnectEvents", false);
              }
              location.reload();
            }
          }
        );

        store.commit("setRegisteredWalletConnectEvents", true);
      }

      waitStore ? await storeDetailsData() : storeDetailsData();

      return true;
    } else {
      console.log("Connect wallet fail");
    }

    return false;
  } catch (error) {
    console.log(error, "selectedWallet error");
    return false;
  } finally {
    window.$nuxt.$Spin.hide();
  }
};

export default lnrJSConnector;
