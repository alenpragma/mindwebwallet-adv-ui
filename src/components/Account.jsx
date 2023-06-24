import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, IconButton, TextField } from "@mui/material";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { keys } from "../sclices/privateKeySlice";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { providers, ethers } from "ethers";
//import Web3 from "web3";
import USDTABI from "./abi/usdt.json";
import USDCABI from "./abi/usdc.json";
import { ToastContainer, toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { FileCopy } from "@mui/icons-material";
import { provider, w3, switchProvider } from "./rpc";
import { abi } from "./abi/erc20";
import { HiLogout } from "react-icons/hi";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  const [tokenBalance, setTokenBalance] = useState(0);
  const [rcvAddress, setrcvAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [tnx, settnx] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchTokenBalance = async () => {
      const signer = keyData.key.keyInfo.privatekey;
      const addr = keyData.key.keyInfo.address;
      const usdtContract = new ethers.Contract(
        "0x4855d5918621b0cCF80660A7735E363765493373",
        USDTABI,
        provider
      );
      const usdcContract = new ethers.Contract(
        "0x566189880aCa09BA7aA696D9b6630A4Eb2Bb043f",
        USDCABI,
        provider
      );
      const usdtBalance = await usdtContract.balanceOf(addr);
      const usdtBalanceFormatted = ethers.utils.formatUnits(
        usdtBalance.toString(),
        18
      ); // 6 decimal places for USDT
      const usdcBalance = await usdcContract.balanceOf(addr);
      const usdcBalanceFormatted = ethers.utils.formatUnits(
        usdcBalance.toString(),
        18
      ); // 18 decimal places for USDC
      setTokenBalance({
        usdt: usdtBalanceFormatted,
        usdc: usdcBalanceFormatted,
      });
    };

    fetchTokenBalance();
  }, [keyData]);

  const sendToken = async () => {
    const web3 = w3;

    const privateKey = keyData.key.keyInfo.privatekey;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const amountInput = document.getElementById("amount");
    if (!amountInput || !amountInput.value) {
      toast("Please enter a valid amount");
      return;
    }
    const amountToSend = parseFloat(amountInput.value);
    if (isNaN(amountToSend) || amountToSend <= 0) {
      toast("Please enter a valid amount");
      return;
    }

    if (amountInput) {
      amountInput.addEventListener("change", () => {
        setAmountToSend(amountInput.value);
      });
    }

    let tokenContract, tokenSymbol;
    if (document.getElementById("usdt").checked) {
      tokenContract = new web3.eth.Contract(
        USDTABI,
        "0x4855d5918621b0cCF80660A7735E363765493373"
      );
      tokenSymbol = "USDT";
    } else if (document.getElementById("usdc").checked) {
      tokenContract = new web3.eth.Contract(
        USDCABI,
        "0x566189880aCa09BA7aA696D9b6630A4Eb2Bb043f"
      );
      tokenSymbol = "USDC";
    } else {
      toast("Please select a token");
      return;
    }

    const gasPrice = await web3.eth.getGasPrice();
    const recipientAddress = rcvAddress;
    const amountInWei = web3.utils.toWei(amountToSend.toString(), "ether");
    const gasLimit = await tokenContract.methods
      .transfer(recipientAddress, amountInWei)
      .estimateGas({ from: account.address });

    const nonce = await web3.eth.getTransactionCount(account.address);
    const tx = {
      from: account.address,
      to: tokenContract.options.address,
      value: 0,
      data: tokenContract.methods
        .transfer(recipientAddress, amountInWei)
        .encodeABI(),
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const txReceipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log(txReceipt);
  };

  const handleRecipientAddressChange = (event) => {
    setrcvAddress(event.target.value);
  };

  const handleAmountToSendChange = (event) => {
    setAmountToSend(event.target.value);
  };

  useEffect(() => {
    const connectProvider = async () => {
      try {
        await provider.getBlockNumber().then((blockNumber) => {
          // console.log(`Connected to RPC');
          console.log("connected");
        });
        provider;
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
        const balance = await provider.getBalance(keyData.key.keyInfo.address);
        setBalance(ethers.utils.formatEther(balance));
        localStorage.setItem("balance", balance.toString());
      }
    };

    updateBalance();
  }, [keyData.key.keyInfo.address]);
  let [youprivateKey, setYourPrivayteKey] = useState("");
  const [dialopen, setDialOpen] = useState(false);
  const handleClose = (youprivateKey) => {
    navigator.clipboard.writeText(youprivateKey);
    toast("You private key copied!");
    setYourPrivayteKey("");
  };
  const handleExportPrivateKey = () => {
    const wallet = new ethers.Wallet(keyData.key.keyInfo.privatekey);
    setYourPrivayteKey(wallet.privateKey);
  };

  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const handleSend = async () => {
    try {
      setTransactionStatus("Pending");
      const web3 = w3;
      const account = web3.eth.accounts.privateKeyToAccount(
        keyData.key.keyInfo.privatekey
      );
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

  const [tList, setTList] = useState(() => {
    const storedTokens = localStorage.getItem("importedTokens");
    return storedTokens ? JSON.parse(storedTokens) : [];
  });
  const [sTokenAddress, setSTokenAddress] = useState("");
  const [sAmount, setSAmount] = useState("");
  const [rAddress, setRAddress] = useState("");
  const [tBalance, setTBalance] = useState("");

  const privateKey = keyData.key.keyInfo.privatekey;
  const web3 = w3;

  useEffect(() => {
    localStorage.setItem("importedTokens", JSON.stringify(tList));
  }, [tList]);

  useEffect(() => {
    utb();
  }, [sTokenAddress]);

  const utb = async () => {
    if (sTokenAddress) {
      try {
        const tokenContract = new web3.eth.Contract(abi, sTokenAddress);
        const balance = await tokenContract.methods
          .balanceOf(web3.eth.accounts.privateKeyToAccount(privateKey).address)
          .call();
        setTBalance(balance);
      } catch (error) {
        console.error("Failed to update token balance:", error);
      }
    }
  };

  const importToken = async (contractAddress) => {
    const formattedAddress = contractAddress.trim();

    const existingToken = tList.find(
      (token) => token.contractAddress === formattedAddress
    );
    if (existingToken) {
      console.log("Token is already imported.");
      return;
    }

    try {
      const tokenContract = new web3.eth.Contract(abi, formattedAddress);
      if (!tokenContract.methods.name) {
        throw new Error("Invalid token contract ABI.");
      }

      const name = await tokenContract.methods.name().call();
      const symbol = await tokenContract.methods.symbol().call();
      const balance = await tokenContract.methods
        .balanceOf(web3.eth.accounts.privateKeyToAccount(privateKey).address)
        .call();

      const newToken = {
        contractAddress: formattedAddress,
        name,
        symbol,
        selected: false,
      };

      const updatedTokens = [...tList, newToken];
      setTList(updatedTokens);
      setSTokenAddress(formattedAddress);
    } catch (error) {
      console.error("Failed to import token:", error);
    }
  };

  const st = async () => {
    const token = tList.find(
      (token) => token.contractAddress === sTokenAddress
    );
    if (!token) {
      console.log("Please select a token.");
      return;
    }

    try {
      const tokenContract = new web3.eth.Contract(abi, token.contractAddress);
      const amount = web3.utils.toWei(sAmount);
      const recipient = rAddress.trim();

      const transaction = tokenContract.methods.transfer(recipient, amount);
      const encodedTransaction = transaction.encodeABI();
      const gas = await transaction.estimateGas({
        from: web3.eth.accounts.privateKeyToAccount(privateKey).address,
      });
      const signedTransaction = await web3.eth.accounts.signTransaction(
        {
          to: token.contractAddress,
          data: encodedTransaction,
          gas: gas,
        },
        privateKey
      );

      const receipt = await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction
      );
      console.log("Transaction successful:", receipt);

      utb();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleTokenSelection = (e) => {
    setSTokenAddress(e.target.value);
  };
  useEffect(() => {
    document.title = "Account";
  }, [document.title]);

  return (
    <>
      <ToastContainer />
      {youprivateKey && (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="p-4">
            <div className="text-center">
              <span className="text-[20px] font-bold text-colorprimary md:text-[26px]">
                Your private key
              </span>
            </div>
            <div className="text-center">
              <span className="text-[12px] md:text-[18px]">
                {youprivateKey}
              </span>
            </div>
            <DialogActions className="flex">
              Copy{" "}
              <IconButton onClick={() => handleClose(youprivateKey)}>
                <FileCopy />
              </IconButton>
            </DialogActions>
          </div>
        </Dialog>
      )}
      <div className=" mt-5 px-[10px] max-w-container mx-auto pb-4">
        <div className="p-5 glass-container text-white !font-josefin rounded-md shadow-lg  w-full mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] md:text-[25px] font-semibold text-colorprimary  uppercase mb-4">
              <AccountCircleIcon className="!text-[30px] mb-2" /> Account
            </h3>

            <Button
              onClick={logout}
              variant="contained"
              className=" !bg-colorprimary !text-[18px] md:!text-[25px] !rounded-3xl"
            >
              <HiLogout />
            </Button>
          </div>
          <p className="mt-5 text-[12px] sm:text-[18px]">
            Address: <span>{keyData.key.keyInfo.address}</span>
          </p>
          <Typography className="" variant="h6" gutterBottom>
            <h2 className="text-[12px] sm:text-[18px]">
              Balance: {balance} MIND
            </h2>
          </Typography>
          <div className="flex items-center !mt-5 gap-x-3">
            <Button
              onClick={handleExportPrivateKey}
              variant="contained"
              className=" !py-[10px] !md:py-[30px] uppercase !bg-colorprimary !border-none border-colorprimary !text-white hover:text-colorsecondary !rounded-3xl !font-josefin"
            >
              ExportWallet
            </Button>
            <Button
              onClick={switchProvider}
              variant="contained"
              className=" !py-[10px] !md:py-[30px] uppercase !bg-colorprimary !border-none border-colorprimary !text-white hover:text-colorsecondary !rounded-3xl !font-josefin"
            >
              Swich Network
            </Button>
          </div>
        </div>
        <div className="p-0 md:p-5 mt-10 rounded-md shadow-lg  w-full mx-auto text-">
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
            }}
            className="glass-container !font-josefin "
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab
                className=" !text-[12px] md:!text-[15px] text-white !font-josefin"
                label="Send MIND"
                {...a11yProps(0)}
              />
              <Tab
                className="!text-[12px] md:!text-[15px] text-white !font-josefin"
                label="Send token"
                {...a11yProps(1)}
              />
              <Tab
                className="!text-[12px] md:!text-[15px] text-white !font-josefin"
                label="import erc20"
                {...a11yProps(2)}
              />
            </Tabs>
            <TabPanel
              value={value}
              index={0}
              className="!w-full  !text-[12px] md:!text-[15px]"
            >
              <div className="flex flex-col gap-y-5 w-full">
                <div className="text-colorprimary text-center font-semibold text-[14px] md:text-[18px] font-josefin">
                  Perform a regular transaction, send MIND to another account
                </div>
                <input
                  placeholder="Recipient Address"
                  className="glass-container font-josefin  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                  label="Recipient Address"
                  variant="outlined"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                {/* <TextField
                  id="outlined-basic"
                  label="Recipient Address"
                  className="!w-full"
                  variant="outlined"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                /> */}
                <input
                  placeholder="Amount"
                  className="glass-container font-josefin  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                  type="number"
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {/* <TextField
                  id="outlined-basic"
                  type="number"
                  label="Amount"
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                /> */}
                <div className="flex gap-x-3">
                  <Button
                    onClick={() => {
                      setRecipientAddress("");
                      setAmount("");
                    }}
                    variant="contained"
                    className=" !bg-white !rounded-2xl !font-josefin !text-colorprimary !text-[12px] md:!text-[15px]"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSend}
                    variant="contained"
                    className=" !bg-colorprimary !rounded-2xl !font-josefin !text-[12px] md:!text-[15px]"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              className="!w-full   !text-[12px] md:!text-[15px]"
            >
              <div className="flex flex-col gap-y-2 w-full font-josefin text-white !text-[12px] md:!text-[15px]">
                <h1>
                  USDT Balance: <span>{tokenBalance.usdt}</span>
                </h1>
                <h1>
                  USDC Balance: <span>{tokenBalance.usdc}</span>
                </h1>
                <label>
                  <input type="radio" id="usdt" name="token" value="usdt" />{" "}
                  USDT
                </label>

                <label>
                  <input type="radio" id="usdc" name="token" value="usdc" />{" "}
                  USDC
                </label>
              </div>
              <div className="flex gap-y-5 flex-col mt-4 w-full">
                {/* <TextField
                  id="outlined-basic"
                  label="Recipient Address"
                  variant="outlined"
                  onChange={(e) => setrcvAddress(e.target.value)}
                  className="!w-full"
                /> */}
                <input
                  placeholder="Recipient Address"
                  className="glass-container font-josefin  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                  label="Amount"
                  onChange={(e) => setrcvAddress(e.target.value)}
                />
                <input
                  placeholder="Amount"
                  className="glass-container font-josefin  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                  id="amount"
                  type="number"
                  onChange={(e) => setAmountToSend(e.target.value)}
                />

                {/* <TextField
                  id="amount"
                  type="number"
                  label="Amount"
                  variant="outlined"
                  onChange={(e) => setAmountToSend(e.target.value)}
                  className="!w-full "
                /> */}
                <div className="">
                  <Button
                    onClick={sendToken}
                    variant="contained"
                    className=" !bg-colorprimary !text-[12px] md:!text-[15px] !font-josefin !rounded-2xl"
                  >
                    Send
                  </Button>
                </div>
                <p className="!text-[12px] md:!text-[15px] !font-josefin text-white">
                  Transaction Hash: {transactionHash}
                </p>
              </div>
            </TabPanel>
            <TabPanel
              value={value}
              index={2}
              className="!w-full   !text-[12px] md:!text-[15px]"
            >
              <div>
                <div className="flex flex-col w-full">
                  <input
                    id="token-address"
                    value={sTokenAddress}
                    placeholder="Enter ERC20 token contract address"
                    className="glass-container font-josefin   w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                    onChange={handleTokenSelection}
                   
                  />

                  {/* <TextField
                    id="token-address"
                    value={sTokenAddress}
                    label="Enter ERC20 token contract address"
                    variant="outlined"
                    onChange={handleTokenSelection}
                    className="!w-full"
                  /> */}

                  <div className="mt-5">
                    <Button
                      onClick={() => importToken(sTokenAddress)}
                      variant="contained"
                      className="import-token-btn !font-josefin !bg-colorprimary !rounded-2xl  !text-[12px] md:!text-[15px]"
                    >
                      Import Token
                    </Button>
                  </div>
                </div>

                <h2 className="text-colorprimary font-josefin  font-semibold text-[14px] md:text-[18px] mt-3">
                  Imported Tokens
                </h2>
                {tList.map((token) => (
                  <div key={token.contractAddress}>
                    <h3>{token.name}</h3>
                    <p>Symbol: {token.symbol}</p>
                    <p>Balance: {web3.utils.fromWei(tBalance)}</p>
                    <label>
                      <input
                        type="checkbox"
                        checked={token.contractAddress === sTokenAddress}
                        onChange={() => setSTokenAddress(token.contractAddress)}
                      />
                      Select
                    </label>
                  </div>
                ))}

                <h2 className="text-colorprimary font-josefin font-semibold text-[14px] md:text-[18px] mt-3">
                  Send Token
                </h2>
                <div className="flex flex-col  gap-x-3 mt-7 w-full ">
                  <label htmlFor="amount-input" className="font-semibold mb-2 font-josefin text-white">
                    Amount to Send:
                  </label>
                  <input
                    id="amount-input"
                    type="number"
                    placeholder="Amount"
                    variant="outlined"
                    onChange={(e) => setSAmount(e.target.value)}
                
                    className="glass-container font-josefin  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                  />
                  {/* <TextField
                    id="amount-input"
                    type="number"
                    label="Amount"
                    variant="outlined"
                    onChange={(e) => setSAmount(e.target.value)}
                    className="!w-full"
                  /> */}
                </div>
                <div className="flex flex-col  gap-x-3 mt-3 w-full">
                  <label
                    htmlFor="recipient-input"
                    className="font-semibold mb-2 font-josefin text-white"
                  >
                    Recipient Address:
                  </label>
                  <input
                   id="recipient-input"
                   value={rAddress}
                   placeholder="Recipient Address"
      
                   onChange={(e) => setRAddress(e.target.value)}
                    className="glass-container font-josefin   w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                  />
                  {/* <TextField
                    id="recipient-input"
                    value={rAddress}
                    label="Recipient Address"
                    variant="outlined"
                    onChange={(e) => setRAddress(e.target.value)}
                    className="!w-full"
                  /> */}
                </div>
                <Button
                  onClick={st}
                  variant="contained"
                  className="send-token-btn !mt-4 !text-[12px] md:!text-[15px] !font-josefin !bg-colorprimary !rounded-2xl"
                >
                  Send
                </Button>
              </div>
            </TabPanel>
          </Box>
        </div>
      </div>
      <style jsx>{`
        .MuiTab-textColorPrimary {
          color: #fff;
        }
        .Mui-selected {
          color: #ff971d !important;
        }
        .MuiTabs-indicator {
          background-color: #ff971d;
        }
        .body {
          height: calc(110vh - 100px);
        }
        .glass-container {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0)
          );
          backdrop-filter: blur(10px);

          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          animation: shine 1.5s infinite alternate;
        }

        @keyframes shine {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </>
  );
};

export default Account;
