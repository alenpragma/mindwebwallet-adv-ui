import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { abi } from './abi';

const provider = new Web3.providers.HttpProvider('https://mainnet-rpc.metaviralscan.com');
const web3 = new Web3(provider);

const privateKey = '0xf488da6cc08f8e12d714d74e50c0bf886595e554598da3e2f99d9c36979b9741';

const App = () => {
  const [importedTokens, setImportedTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');

  useEffect(() => {
    const storedTokens = localStorage.getItem('importedTokens');
    if (storedTokens) {
      setImportedTokens(JSON.parse(storedTokens));
    }
  }, []);

  useEffect(() => {
    updateTokenBalance();
    localStorage.setItem('importedTokens', JSON.stringify(importedTokens));
  }, [selectedToken, importedTokens]);

  const updateTokenBalance = async () => {
    if (selectedToken) {
      try {
        const tokenContract = new web3.eth.Contract(abi, selectedToken);
        const balance = await tokenContract.methods.balanceOf(web3.eth.accounts.privateKeyToAccount(privateKey).address).call();
        setTokenBalance(balance);
      } catch (error) {
        console.error('Failed to update token balance:', error);
      }
    }
  };

  const importToken = async (contractAddress) => {
    const formattedAddress = contractAddress.trim();

    const existingToken = importedTokens.find((token) => token.contractAddress === formattedAddress);
    if (existingToken) {
      console.log('Token is already imported.');
      return;
    }

    try {
      const tokenContract = new web3.eth.Contract(abi, formattedAddress);
      if (!tokenContract.methods.name) {
        throw new Error('Invalid token contract ABI.');
      }

      const name = await tokenContract.methods.name().call();
      const symbol = await tokenContract.methods.symbol().call();
      const balance = await tokenContract.methods.balanceOf(web3.eth.accounts.privateKeyToAccount(privateKey).address).call();

      const newToken = {
        contractAddress: formattedAddress,
        name,
        symbol,
        selected: false,
      };

      const updatedTokens = [...importedTokens, newToken];
      setImportedTokens(updatedTokens);
      setSelectedToken(formattedAddress);
    } catch (error) {
      console.error('Failed to import token:', error);
    }
  };

  const sendToken = async () => {
    const token = importedTokens.find((token) => token.contractAddress === selectedToken);
    if (!token) {
      console.log('Please select a token.');
      return;
    }

    try {
      const tokenContract = new web3.eth.Contract(abi, token.contractAddress);
      const amount = web3.utils.toWei(sendAmount);
      const recipient = recipientAddress.trim();

      const transaction = tokenContract.methods.transfer(recipient, amount);
      const encodedTransaction = transaction.encodeABI();
      const gas = await transaction.estimateGas({ from: web3.eth.accounts.privateKeyToAccount(privateKey).address });
      const signedTransaction = await web3.eth.accounts.signTransaction(
        {
          to: token.contractAddress,
          data: encodedTransaction,
          gas: gas,
        },
        privateKey
      );

      const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
      console.log('Transaction successful:', receipt);

      updateTokenBalance();
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const handleTokenSelection = (e) => {
    setSelectedToken(e.target.value);
  };

  return (
    <div>
      <h1>ERC20 Token Wallet</h1>

      <div>
        <label>Token Contract Address:</label>
        <input
          type="text"
          value={selectedToken}
          onChange={handleTokenSelection}
          placeholder="Enter ERC20 token contract address"
        />
        <button onClick={() => importToken(selectedToken)}>Import Token</button>
      </div>

      <h2>Imported Tokens</h2>
      {importedTokens.map((token) => (
        <div key={token.contractAddress}>
          <h3>{token.name}</h3>
          <p>Symbol: {token.symbol}</p>
          <p>Balance: {web3.utils.fromWei(tokenBalance)}</p>
          <label>
            <input
              type="checkbox"
              checked={token.contractAddress === selectedToken}
              onChange={() => setSelectedToken(token.contractAddress)}
            />
            Select
          </label>
        </div>
      ))}

      <h2>Send Token</h2>
      <div>
        <label>Amount to Send:</label>
        <input
          type="text"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <div>
        <label>Recipient Address:</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Enter recipient address"
        />
      </div>
      <button onClick={sendToken}>Send</button>
    </div>
  );
};

export default App;
