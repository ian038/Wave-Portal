import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { networks } from './networks'
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [network, setNetwork] = useState('')

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert("Make sure you have metamask installed!");
      }

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
      } else {
        alert("No authorized account found")
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      setNetwork(networks[chainId])

      window.ethereum.on('chainChanged', handleChainChanged)
      function handleChainChanged(_chainId) {
        window.location.reload()
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
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }]
        })
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x4',
                  chainName: 'Rinkeby Testnet',
                  rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
                  nativeCurrency: {
                    name: 'Rinkeby Ether',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://rinkeby.etherscan.io/']
                }
              ]
            })
          } catch (error) {
            console.log('Add chain to metamask error ', error)
          }
        }
        console.log(error)
      }
    } else {
      alert('Please install metamask')
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

        {network !== 'Rinkeby' && (
          <div>
            <p>Please connect to the Rinkeby Testnet</p>
            <button className="waveButton" onClick={switchNetwork}>
              Click here to switch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
