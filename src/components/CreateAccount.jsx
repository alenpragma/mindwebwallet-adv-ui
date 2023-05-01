import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { FileCopy, Visibility, VisibilityOff } from "@mui/icons-material";

import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

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
    toast("Private key copied!")
    setPrivateKey("");
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    toast("Address copied!")
    setAddress("");
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  let openAccount = () =>{
    navigate("/account")
    localStorage.setItem("accountEnter","done")
  }
  window.onbeforeunload = function() {
    navigate("/createaccount")
  };
  return (
    <>
    <ToastContainer />
      <div className=" mt-5 px-[10px] max-w-container mx-auto">
        <div className="p-5 rounded-md shadow-lg  w-full mx-auto">
          <h3 className="text-[20px] md:text-[25px] font-semibold text-colorprimary  uppercase mb-4">
            <AccountCircleIcon className="!text-[30px] mb-2" /> Create Account
          </h3>
          <Alert severity="warning">
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
                <TextField
                  sx={{ width: "100%" }}
                  id="private-key-input"
                  variant="standard"
                  label="Private Key"
                  type={showPrivateKey ? "text" : "password"}
                  value={keyData.key.keyInfo.privatekey}
                  onChange={handlePrivateKeyChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPrivateKey}>
                          {showPrivateKey ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        <IconButton onClick={handleCopyPrivateKey}>
                          <FileCopy />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mt-10">
                <TextField
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
                />
                <div className="flex mb-10  justify-between mt-5 w-full md:w-[50%]">
                  <Button
                    variant="contained"
                    className="w-[49%] !bg-[#d1d1d1] !text-colorprimary"
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    className="w-[49%] !bg-colorprimary"
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
    </>
  );
};

export default CreateAccount;
