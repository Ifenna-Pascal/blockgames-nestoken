import { ethers } from "ethers";
import abi from "./abi";

const HandleConnect = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.log(error);
  }
};

const fetchNestCoinToken = () => {
  try {
    let contractAddress = "0x317774A893393577D4B6dAf2592d62d9D2C18b2e";
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    return { contract };
  } catch (err) {
    console.log(err);
  }
};

const distributeToken = async (addresses) => {
  try {
    const token = fetchNestCoinToken();
    const contract = (await token).contract;

    await contract.distributeRewards(addresses);
    console.log("success");
  } catch (err) {
    console.log(err);
  }
};

const balanceOf = async (address) => {
  try {
    const token = fetchNestCoinToken();
    const contract = (await token).contract;

    const balance = await contract.balanceOf(address);
    console.log("success");
    return ethers.utils.formatUnits(balance);
  } catch (err) {
    console.log(err);
  }
};

const getRewarded = async () => {
  try {
    const token = fetchNestCoinToken();
    const contract = (await token).contract;

    const rewarded = await contract.getRewarded();
    return rewarded;
  } catch (err) {
    console.log(err);
  }
};

export {
  HandleConnect,
  fetchNestCoinToken,
  distributeToken,
  balanceOf,
  getRewarded,
};
