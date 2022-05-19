import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { networks } from './networks'
import './App.css';
import abi from './WavePortal.json'

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [network, setNetwork] = useState('')
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [allWaves, setAllWaves] = useState([]);
  const [msg, setMsg] = useState('')
  const contractAddress = '0x4a750228475CAf6dF74Db362B74964f4510b9Ee3'
  const contractABI = abi.abi

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert("Make sure you have metamask installed!");
      }

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0])
        getAllWaves()
        getTotalWavesCount()
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

  const getTotalWavesCount = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, provider);
        let waves = await wavePortalContract.getTotalWaves();
        setCount(waves.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      alert('Error getting total waves count')
      console.log('Error getting total waves count ', error)
    }
  }

  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      alert('Error getting all waves')
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        setLoading(true)
        const waveTxn = await wavePortalContract.wave(msg);
        setMsg('')
        await waveTxn.wait();
        setLoading(false)

        let waves = await wavePortalContract.getTotalWaves();
        setCount(waves.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      alert('Please make sure your account is connected!')
      setLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [currentAccount, count])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Wassup!
        </div>

        <div className="bio">
          I am Ian and I develop web3 projects. Connect your Ethereum wallet and wave at me!
        </div>

        <div className="bio">
          Total wave count: {count}
        </div>

        <div className="bio">
          <textarea
            value={msg}
            onChange={(e) => {
              e.preventDefault();
              setMsg(e.target.value);
            }}
            placeholder='Drop me a message here!'
          />
        </div>

        <button className="waveButton" onClick={wave}>
          {loading ? 'Loading...' : 'Wave at Me'}
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}


        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

        {currentAccount && network !== 'Rinkeby' && (
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
