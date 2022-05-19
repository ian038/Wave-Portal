import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("")

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert("Make sure you have metamask installed!");
      }

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account)
      } else {
        alert("No authorized account found")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = () => {

  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Wassup!
        </div>

        <div className="bio">
          I am Ian and I develop web3 projects. Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
