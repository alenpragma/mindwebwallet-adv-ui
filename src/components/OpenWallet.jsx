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
import { Link, useNavigate } from "react-router-dom";
import { keys } from "../sclices/privateKeySlice";
import { ToastContainer, toast } from "react-toastify";
import { providers, ethers } from "ethers";
import { PiSmileyXEyes, PiSmiley } from "react-icons/pi";

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
  useEffect(() => {
    document.title = "Open Wallet";
  }, [document.title]);

  return (
    <div className="flex body selection:bg-transparent">
      <ToastContainer />
      <div className="w-[50%] hidden md:flex justify-center items-center">
        <div className="font-josefin ">
          <h1 className="text-center block text-[50px] md:leading-[80px] lg:leading-[110px] lg:text-[80px] md:mt-[-50px] lg:mt-[-80px] font-bold">
            <span>M</span>
            <span>I</span>
            <span>N</span>
            <span>D</span>
            <span>W</span>
            <span>E</span>
            <span>B</span>
            <br/>
            <span>W</span>
            <span>A</span>
            <span>L</span>
            <span>L</span>
            <span>E</span>
            <span>T</span>
          </h1>
        </div>
      </div>
      <div className="w-full md:w-[50%] mt-[50px] md:mt-0 pl-[10px] pr-[10px] md:pr-[50px] lg:pr-[200px] !font-josefin selection:bg-transparent  flex flex-col md:justify-center">
      <h1 className="text-center !leading-0 md:hidden text-[30px]  font-bold">
            <span>M</span>
            <span>I</span>
            <span>N</span>
            <span>D</span>
            <span>W</span>
            <span>E</span>
            <span>B</span>
            <span>&nbsp; </span>
            <span>W</span>
            <span>A</span>
            <span>L</span>
            <span>L</span>
            <span>E</span>
            <span>T</span>
          </h1>
        <div className="px-[20px] py-[30px] md:p-7 glass-container rounded-2xl shadow-lg w-[100%]">
          <h3 className="text-[20px] font-josefin md:text-[25px] relative z-10 font-semibold text-colorprimary text-center uppercase">
            Open your wallet
          </h3>
          <div className=" justify-center mt-5">
            <div className="relative w-full cursor-pointer selection:bg-transparent">
              <div onMouseDown={handleMouseDownPassword} onClick={handleClickShowPassword} className="absolute z-10 right-5 top-[50%] translate-y-[-50%] text-[35px] text-white hover:cursor-pointer">
                {showPassword ? <PiSmiley /> : <PiSmileyXEyes /> }
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Private Key"
                className="glass-container w-full !p-[15px] !md:p-[30px] !pr-[70px] border-none outline-none rounded-3xl text-white"
                onChange={handleChange}
              />
            </div>
            {/* <FormControl sx={{ width: "100%" }} className="relative z-10">
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
            </FormControl> */}
          </div>
          <div className="flex justify-center mt-5">
            <Button
              variant="contained"
              onClick={openWallet}
              className="w-full !py-[10px] !md:py-[30px] uppercase !bg-colorprimary hover:bg-colorsecondary !rounded-3xl !font-josefin"
            >
              Open Wallet
            </Button>
          </div>
          <div className="flex justify-center mt-5">
            <Button
              variant="outlined"
              onClick={createAccount}
              className="w-full !py-[10px] !md:py-[30px] uppercase !bg-white !border-none border-colorprimary !text-colorprimary hover:text-colorsecondary !rounded-3xl !font-josefin"
            >
              Create a new wallet
            </Button>
          </div>
        </div>
        <p className="text-center mt-5 relative z-20 !text-white text-base md:text-[20px]">Need Help? Contact <Link className="text-colorprimary" to="/mindchain">Mindchain Help.</Link></p>
      </div>
      <style jsx>{`
        .body {
          height: calc(100vh - 80px);
        }
        @import url("https://fonts.googleapis.com/css?family=Luckiest+Guy");
        /* JUMP */
        h1 {
          cursor: default;
          
          width: 100%;
          height: 100px;
       
        }

        h1 span {
          position: relative;
          top: 20px;
          display: inline-block;
          -webkit-animation: bounce 1s ease infinite alternate;

          text-align: center;
          color: #fff;
          text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
            0 5px 0 #ccc, 0 6px 0 transparent, 0 7px 0 transparent,
            0 8px 0 transparent, 0 9px 0 transparent,
            0 10px 10px rgba(0, 0, 0, 0.4);
        }

        h1 span:nth-child(2) {
          -webkit-animation-delay: 0.1s;
        }

        h1 span:nth-child(3) {
          -webkit-animation-delay: 0.2s;
        }

        h1 span:nth-child(4) {
          -webkit-animation-delay: 0.3s;
        }

        h1 span:nth-child(5) {
          -webkit-animation-delay: 0.4s;
        }

        h1 span:nth-child(6) {
          -webkit-animation-delay: 0.5s;
        }

        h1 span:nth-child(7) {
          -webkit-animation-delay: 0.6s;
        }

        h1 span:nth-child(8) {
          -webkit-animation-delay: 0.2s;
        }

        h1 span:nth-child(9) {
          -webkit-animation-delay: 0.3s;
        }

        h1 span:nth-child(10) {
          -webkit-animation-delay: 0.4s;
        }

        h1 span:nth-child(11) {
          -webkit-animation-delay: 0.5s;
        }

        h1 span:nth-child(12) {
          -webkit-animation-delay: 0.6s;
        }

        h1 span:nth-child(13) {
          -webkit-animation-delay: 0.7s;
        }

        h1 span:nth-child(14) {
          -webkit-animation-delay: 0.8s;
        }
        h1 span:nth-child(15) {
          -webkit-animation-delay: 0.9s;
        }
        h1 span:nth-child(16) {
          -webkit-animation-delay: 0.1s;
        }
        /* ANIMATION */
        @-webkit-keyframes bounce {
          100% {
            top: -20px;
            text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
              0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 0 8px 0 #ccc,
              0 9px 0 #ccc, 0 50px 25px rgba(0, 0, 0, 0.2);
          }
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
    </div>
  );
};

export default OpenWallet;
