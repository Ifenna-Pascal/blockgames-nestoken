import React, { useState } from "react";
import { HandleConnect } from "../utils/contract";

const Nav = () => {
  const [account, setAccount] = useState("");
  HandleConnect().then((token) => {
    setAccount(token);
  });

  return (
    <nav className="flex justify-between items-center  mb-6 px-4 bg-yellow-300">
      <h1 className="text-gray-600 font-bold text-2xl font-sans lg:text-4xl">
        Nest_Reward
      </h1>

      {account ? (
        <button disabled className="button">{account}</button>
      ) : (
        <button className="button" onClick={HandleConnect}>
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Nav;
