import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { keys } from "../sclices/privateKeySlice";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { providers, ethers } from "ethers";
import Web3 from "web3";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Account = () => {
  let disp = useDispatch();
  let keyData = useSelector((state) => state);
  let navigate = useNavigate();
  useEffect(() => {
    if (keyData.key.keyInfo === "") {
      navigate("/");
    }
  }, []);



  window.onpopstate = function (event) {
    // Code to handle back button click
    navigate("/account");
  };

  let logout = () => {
    localStorage.clear("key");
    disp(keys(null));
    navigate("/");
  };

  //   tab

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let [wallet, setWallet] = useState("");
  let [balance, setBalance] = useState("");
  let [provider, setProvider] = useState("");
 
  const [walletAddress, setWalletAddress] = useState("");
 



  useEffect(() => {
    const connectProvider = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://mainnet-rpc.metaviralscan.com"
        );
        await provider.getBlockNumber().then((blockNumber) => {
       // console.log(`Connected to RPC');
       console.log("connected")
        });
        setProvider(provider);
        if (localStorage.getItem("privateKey")) {
          const wallet = new ethers.Wallet(
            localStorage.getItem("privateKey"),
            provider
          );
          setWallet(wallet);
          setWalletAddress(wallet.address);
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectProvider();
  }, []);
  
 //const updateBalance = async () => {
   // if (keyData.key.keyInfo.address) {
   //   const provider = new ethers.providers.JsonRpcProvider("https://mainnet-rpc.metaviralscan.com");
   //   const balance = await provider.getBalance(keyData.key.keyInfo.address);
   //   setBalance(ethers.utils.formatEther(balance));
   //   localStorage.setItem("balance", balance.toString());
 //   }
 // };

 useEffect(() => {
  const updateBalance = async () => {
    if (keyData.key.keyInfo.address) {
      const provider = new ethers.providers.JsonRpcProvider('https://mainnet-rpc.metaviralscan.com');
      const balance = await provider.getBalance(keyData.key.keyInfo.address);
      setBalance(ethers.utils.formatEther(balance));
      localStorage.setItem('balance', balance.toString());
    }
  };

  updateBalance();
}, [keyData.key.keyInfo.address]);
  
const handleExportPrivateKey = () => {
  const wallet = new ethers.Wallet(keyData.key.keyInfo.privatekey);
  alert(`Your private key is: ${wallet.privateKey}`);
};
 

  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const handleSend = async () => {
    try {
      setTransactionStatus("Pending");
      const web3 = new Web3("https://mainnet-rpc.metaviralscan.com"); 
      const account = web3.eth.accounts.privateKeyToAccount(keyData.key.keyInfo.privatekey); 
      const gasPrice = await web3.eth.getGasPrice(); 
      const nonce = await web3.eth.getTransactionCount(account.address); 
      const txParams = {
        to: recipientAddress,
        value: web3.utils.toWei(amount, "ether"),
        gasLimit: 21000,
        gasPrice: gasPrice,
        nonce: nonce,
      };
      const signedTx = await account.signTransaction(txParams);
      const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction); 
      setTransactionHash(tx.transactionHash);
      await web3.eth.waitForTransactionReceipt(tx.transactionHash); 
      setTransactionStatus("Success");
      updateBalance();
      setAddress(""); 
    } catch (error) {
      console.log(error);
      setTransactionStatus("Failed");
    }
  };
  
  return (
    <>
      <div className=" mt-5 px-[10px] max-w-container mx-auto">
        <div className="p-5 rounded-md shadow-lg  w-full mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] md:text-[25px] font-semibold text-colorprimary  uppercase mb-4">
              <AccountCircleIcon className="!text-[30px] mb-2" /> Account
            </h3>
            <Button
              onClick={handleExportPrivateKey}
              variant="contained"
              className=" !bg-colorprimary"
            >
              ExportWallet
            </Button>
            <Button
              onClick={logout}
              variant="contained"
              className=" !bg-colorprimary"
            >
              Logout
            </Button>

           
          </div>
          <p className="mt-5">Address: {keyData.key.keyInfo.address}</p>
          <Typography variant="h6" gutterBottom>
          <h2>Balance: {balance} MIND</h2>
</Typography>

        </div>
        <div className="p-5 mt-10 rounded-md shadow-lg  w-full mx-auto">
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              height: 224,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Send MIND" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
              <Tab label="Item Four" {...a11yProps(3)} />
              <Tab label="Item Five" {...a11yProps(4)} />
              <Tab label="Item Six" {...a11yProps(5)} />
              <Tab label="Item Seven" {...a11yProps(6)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="flex gap-x-5">
                <TextField
                  id="outlined-basic"
                  label="Recipient Address"
                  variant="outlined"
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <TextField
                  id="outlined-basic"
                  type="number"
                  label="Amount"
                  variant="outlined"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                  onClick={handleSend}
                  variant="contained"
                  className=" !bg-colorprimary"
                >
                  Send
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
              Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
              Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
              Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
              Item Seven
            </TabPanel>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Account;
