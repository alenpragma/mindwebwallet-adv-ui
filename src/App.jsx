import React from "react";
import OpenWallet from "./components/OpenWallet";
import Navbar from "./components/Navbar";
import CreateAccount from "./components/CreateAccount";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Rootlayout from "./components/Rootlayout";
import Account from "./components/Account";

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Rootlayout />}>
      <Route index element={<OpenWallet />}></Route>
      <Route path="/createaccount" element={<CreateAccount />}></Route>
      <Route path="/account" element={<Account />}></Route>
    </Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
