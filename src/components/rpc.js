import { providers, ethers } from "ethers";
import Web3 from "web3";

let rpc1 ="https://rpc-msc.mindchain.info/";
let rpc2 = "https://testnet-msc.mindchain.info/";

let provider = new ethers.providers.JsonRpcProvider(rpc1);
let w3 = new Web3(rpc1);

async function switchProvider() {
  let rpc;
  if (provider.connection.url === rpc1) {
    rpc = rpc2;
  } else {
    rpc = rpc1;
  }
  provider = new ethers.providers.JsonRpcProvider(rpc);
  w3 = new Web3.providers.HttpProvider(rpc);
  const blockNumber = await provider.getBlockNumber();
  console.log(`Current block number: ${blockNumber}`);
  localStorage.setItem('network', rpc); // store the current network URL in localStorage
  window.location.reload();
}

// on app load, check if the current network URL is stored in localStorage and use it if it exists
const storedNetwork = localStorage.getItem('network');
if (storedNetwork) {
  provider = new ethers.providers.JsonRpcProvider(storedNetwork);
  w3 = new Web3(storedNetwork);
  provider.getBlockNumber().then((blockNumber) => {
    console.log(`Current block number: ${blockNumber}`);
  });
}


export { provider, w3, switchProvider };


//import { providers, ethers } from "ethers";
//import Web3 from "web3";

//const rpc1 = "https://mainnet-rpc.metaviralscan.com"
//const rpc2 = "https://mainnet-rpc.metaviralscan.com"
//const provider = new ethers.providers.JsonRpcProvider(rpc);

//const w3 = new Web3(rpc);

//export { provider, w3 };
