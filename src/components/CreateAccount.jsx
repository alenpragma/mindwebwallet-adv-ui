import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { FileCopy, Visibility, VisibilityOff } from "@mui/icons-material";

import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { PiSmiley, PiSmileyXEyes } from "react-icons/pi";

const CreateAccount = () => {
  let navigate = useNavigate();
  let disp = useDispatch();
  let keyData = useSelector((state) => state);

  useEffect(() => {
    if (keyData.key.keyInfo === "") {
      navigate("/");
    }
  }, []);

  const [privateKey, setPrivateKey] = useState(keyData.key.keyInfo.privatekey);
  const [address, setAddress] = useState(keyData.key.keyInfo.address);
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const handleShowPrivateKey = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const handleShowAddress = () => {
    setShowAddress(!showAddress);
  };

  const handleCopyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    toast("Private key copied!");
    setPrivateKey("");
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast("Address copied!");
    setAddress("");
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  let openAccount = () => {
    navigate("/account");
    localStorage.setItem("accountEnter", "done");
  };
  window.onbeforeunload = function () {
    navigate("/createaccount");
  };
  useEffect(() => {
    document.title = "Create Wallet";
  }, [document.title]);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <div className="body !h-[130vh] !md:h-[110vh]">
      <ToastContainer />
      <div className="   px-[10px] max-w-container mx-auto">
        <div className="p-5 mt-5 rounded-md glass-container shadow-lg  w-full mx-auto">
          <h3 className="text-[20px] md:text-[25px] font-semibold text-colorprimary  uppercase mb-4">
            <AccountCircleIcon className="!text-[30px] mb-2" /> Create Account
          </h3>
          <Alert severity="warning" className="!glass-container">
            <AlertTitle className="!font-bold">NOTE:</AlertTitle>
            Once you leave this page, you cannot recover the address or private
            key. -{" "}
            <strong className="text-green-500">
              Please copy this somewhere safe! <CheckIcon />{" "}
            </strong>
          </Alert>

          <div className="md:flex w-full">
            <div className="w-full md:w-[70%]">
              <div className="mt-10">
              <label htmlFor="privatekey" className=" font-josefin text-white font-semibold" >Private Key</label>
                <div className="relative mt-2 w-full cursor-pointer selection:bg-transparent">
                  <div
                    onClick={handleClickShowPassword}
                    className="absolute z-10 right-14 top-[50%] translate-y-[-50%] text-[35px] text-white hover:cursor-pointer"
                  >
                    {showPassword ? <PiSmiley /> : <PiSmileyXEyes />}
                  </div>

                  <FileCopy
                    onClick={handleCopyPrivateKey}
                    className="absolute z-10 right-5 top-[50%] translate-y-[-50%] text-[35px] text-white hover:cursor-pointer"
                  />
                  
                  <input
                    id="privatekey"
                    className="glass-container !pr-[100px]  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                    type={showPassword ? "text" : "password"}
                    value={keyData.key.keyInfo.privatekey}
                    onChange={handlePrivateKeyChange}
                  />
                </div>

              </div>
              

              <div className="mt-10">
              <label htmlFor="address" className=" font-josefin text-white font-semibold" >Address</label>
                <div className="relative mt-2 w-full cursor-pointer selection:bg-transparent">
                

                  <FileCopy
               onClick={handleCopyAddress}
                    className="absolute z-10 right-5 top-[50%] translate-y-[-50%] text-[35px] text-white hover:cursor-pointer"
                  />
                  
                  <input
                    id="address"
                    className="glass-container !pr-[70px]  w-full !p-[15px] !md:p-[30px] border-none outline-none rounded-3xl text-white"
                    type="text"
                    value={keyData.key.keyInfo.address}
                    onChange={handleAddressChange}
                  />
                </div>

              </div>
              
              
              
              
              
              
              
              <div className="mt-10">

                {/* <TextField
                  sx={{ width: "100%" }}
                  id="address-input"
                  variant="standard"
                  label="Address"
                  type="text"
                  value={keyData.key.keyInfo.address}
                  onChange={handleAddressChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyAddress}>
                          <FileCopy />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                /> */}
                <div className="flex mb-5  justify-between mt-5 w-full md:w-[50%]">
                  <Button
                    variant="contained"
                    className="w-[49%] !py-[10px] !md:py-[30px] uppercase !bg-white !border-none border-colorprimary !text-colorprimary hover:text-colorsecondary !rounded-3xl !font-josefin"
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    className="w-[49%]  !py-[10px] !md:py-[30px] uppercase !bg-colorprimary hover:bg-colorsecondary !rounded-3xl !font-josefin"
                    onClick={openAccount}
                  >
                    Use Wallet
                  </Button>
                </div>
              </div>
            </div>
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 64,
                width: "100%",
                display: "flex",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={"www.google.com"}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
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
    </div>
  );
};

export default CreateAccount;
