import React, { useState, useEffect } from "react";

const Navbar = () => {
 



  return (
    <>
      <div className="w-full h-[80px] relative  nav shadow-lg flex items-center rounded-b-[50px] nav-glass-container">
        <div className="logo flex max-w-container mx-auto px-[10px]">
         
        <span className="flex items-center gap-x-2 font-josefin text-[40px] h-auto md:text-[30px] ">
          <img
              src="https://i.postimg.cc/d32413mk/MNDWALET-LOGO.png"
              className="   w-[250px] h-auto md:w-[300px] "
              alt=""
            />
             {/* <span className="text-[30px]  md:text-[40px] font-bold mt-2 text-colorprimary">MINDCHAIN</span>  */}
            </span>
        </div>
      </div>

      <style jsx>{`
        .nav-glass-container {
          background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
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
        .logo {
       
          animation: logoAnimation 0.5s ease-in-out;
        }
        
        @keyframes logoAnimation {
          0% {
            transform: translateY(-150px);
          }
        
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
