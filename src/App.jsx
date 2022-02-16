import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import WalletConnector from "./WalletConnector";

function App() {
  let [isOpen, setIsOpen] = useState(false);
  let [buttonText, setButtonText] = useState("");
  const web3context = useWeb3React();

  useEffect(() => {
    isOpen
      ? setButtonText("Disconnect")
      : setButtonText("Connect to MetaMask Wallet");
  }, [isOpen]);


  const connectWallet = (e) => {
    e.preventDefault();
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div>
      <Button variant="contained" onClick={connectWallet}>
        {buttonText}
      </Button>
      {!isOpen ? <WalletConnector /> : null}
      {isOpen ? <p>{web3context.account}</p> : null}
    </div>
  );
}

export default App;
