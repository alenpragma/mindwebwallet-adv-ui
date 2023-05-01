import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { keys } from "../sclices/privateKeySlice";
import { ToastContainer, toast } from "react-toastify";
import { providers, ethers } from "ethers";

const OpenWallet = () => {
  let navigate = useNavigate();
  let disp = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState("");
  const [wallet, setWallet] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  let [address, setAddress] = useState("");

  // useEffect(() => {
  //   const connectProvider = async () => {
  //    try {
  //     const provider = new ethers.providers.JsonRpcProvider("https://mainnet-rpc.metaviralscan.com");
  //     setProvider(provider);
  //     if (localStorage.getItem("privateKey")) {
  //      const wallet = new ethers.Wallet(localStorage.getItem("privateKey"), provider);
  //      setWallet(wallet);
  //      setAddress(wallet.address);
  //    }
  //   } catch (error) {
  //     console.log(error);
  //  }
  //  };
  //   connectProvider();
  //}, []);

  useEffect(() => {
    if (localStorage.getItem("accountEnter")) {
      navigate("/account");
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  let keyData = useSelector((state) => state);

  // create account
  async function createAccount() {
    let privatekey = ethers.Wallet.createRandom();

    try {
      localStorage.setItem(
        "key",
        JSON.stringify({
          privatekey: privatekey.privateKey,
          address: privatekey.address,
        })
      );
      disp(
        keys({
          privatekey: privatekey.privateKey,
          address: privatekey.address,
        })
      );
      setBalance(0);
      navigate("/createaccount");
    } catch (error) {
      console.log(error);
      toast("Invalid private key");
    }
  }

  let handleChange = (e) => {
    setPrivateKey(e.target.value);
    console.log(privateKey);
  };

  //let openWallet = () => {

  //   try {
  //   const wallet = new ethers.Wallet(privateKey, provider);
  //    localStorage.setItem(privateKey, wallet.privateKey);
  //   console.log('====================================');
  //   console.log("hhhhh",wallet);
  //  console.log('====================================');
  //    setWallet(wallet);
  //    setAddress(wallet.address);
  //    setBalance(0);
  //    navigate("/account");
  //   } catch (error) {
  //     console.log(error);
  //     alert("Invalid private key");
  //   }

  // };

  const openWallet = () => {
    const input = privateKey;
    if (input === null) {
      return toast("invalid private key");
    }
    try {
      const wallet = new ethers.Wallet(privateKey, provider);
      console.log("====================================");
      console.log(new ethers.Wallet(privateKey, provider));
      console.log("====================================");
      // localStorage.setItem(privateKey, wallet.privateKey);
      setWallet(wallet);
      // setAddress(wallet.address);
      localStorage.setItem(
        "key",
        JSON.stringify({
          privatekey: wallet.privateKey,
          address: wallet.address,
        })
      );
      disp(
        keys({
          privatekey: wallet.privateKey,
          address: wallet.address,
        })
      );
      
      navigate("/account");
    } catch (error) {
      console.log(error);
      toast("Invalid private key");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className=" mt-5 px-[10px]">
        <div className="p-5 rounded-md shadow-lg max-w-[400px] mx-auto">
          <h3 className="text-[20px] md:text-[25px] font-semibold text-colorprimary text-center uppercase">
            Open your wallet
          </h3>
          <div className="flex justify-center mt-5">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel htmlFor="outlined-adornment-password">
                Private Key
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                // value={privateKey}
                onChange={handleChange}
                variant="standard"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </div>
          <div className="flex justify-center mt-5">
            <Button
              variant="contained"
              onClick={openWallet}
              className="w-full py-2 uppercase bg-colorprimary hover:bg-colorsecondary"
            >
              Open Wallet
            </Button>
          </div>
          <div className="flex justify-center mt-5">
            <Button
              variant="outlined"
              onClick={createAccount}
              className="w-full py-2 uppercase border-colorprimary text-colorprimary hover:text-colorsecondary"
            >
              Create a new wallet
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenWallet;
