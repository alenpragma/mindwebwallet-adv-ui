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
      <Route index element={<OpenWallet />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/account" element={<Account />} />
    </Route>
  )
);

const App = () => {
  return (
    <div className="app relative">
      <div className=" fixed w-[100%] !h-[100vh] bg-[#000000bc]"></div>
      <RouterProvider router={router} />
      <style jsx>{`
        .app {
          background-image: url("https://media.giphy.com/media/W5UoBN0YMdT1QP8Yfr/giphy.gif");
          background-repeat: no-repeat;
          background-size: cover;
        }
      `}</style>
    </div>
  );
};

export default App;