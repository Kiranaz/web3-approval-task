import React, { useEffect, useCallback, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { initializeWeb3 } from "./web3Functions";

const WalletConnector = () => {
  let [tokenBalance, setTokenBalance] = useState(null);
  let [ethBalance, setEthBalance] = useState(null);
  const web3context = useWeb3React();

  const getErrorMsg = (e) => {
    if (e instanceof UnsupportedChainIdError) {
      return "Unsupported Network";
    } else if (e instanceof NoEthereumProviderError) {
      return "No Wallet Found";
    } else if (e instanceof UserRejectedRequestError) {
      return "Connection request for wallet has been rejected.";
    } else if (e.code === -32002) {
      return "Wallet Connection Request Pending";
    } else {
      return "An Error Occurred";
    }
  };

  const activateWallet = useCallback(
    (connector, onClose = () => {}) => {
      if (
        connector instanceof WalletConnectConnector &&
        connector.walletConnectProvider?.wc?.uri
      ) {
        connector.walletConnectProvider = undefined;
      }

      web3context
        .activate(
          connector
            ? connector
            : new InjectedConnector({
                supportedChainIds: [1, 3, 4, 5, 42, 97, 56],
              }),
          undefined,
          true
        )
        .then(() => {
          console.log("Wallet Activated");
        })
        .catch((e) => {
          console.error("ERROR activateWallet -> ", getErrorMsg(e));
        });
    },
    [web3context]
  );
  const deactivateWallet = async () => {
    await web3context.deactivate();
    if (web3context?.connector instanceof WalletConnectConnector) {
      await web3context.connector.close();
    }
  };

  useEffect(() => {
    if (web3context?.error) {
      deactivateWallet();
    }
      let init = async () => {
      console.log("here1", web3context?.library?.currentProvider);
      if (web3context?.library?.currentProvider) {
        await initializeWeb3(
          "0x031a9dD354B964A90Fd82951119612ADca3EAa82",
          web3context?.library?.currentProvider,
          web3context.account,
          setTokenBalance,
          setEthBalance
        );
      }
    };
    init();
  }, [web3context]);

  useEffect(() => {
    activateWallet();
  }, []);

  return <div></div>;
};
export default WalletConnector;
