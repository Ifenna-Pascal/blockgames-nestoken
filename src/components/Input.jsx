import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { distributeToken, getRewarded, balanceOf } from "../utils/contract";
import Error from "./Error";

function Input() {
  const [excelFile, setExcelFile] = useState(null);
  const [bal, setBal] = useState("");
  const [error, setError] = useState({ err: "", excelErr: "", input: "" });
  const [rewarded, setRewarded] = useState([]);

  export const Rewards = () => {
     getRewarded().then((res) => setRewarded(res));
  }
  
  useEffect(() => {
    Rewards()
  }, [])
  
  const handleDistributeSubmit = (e) => {
    e.preventDefault();

    //this is your input value
    const arrayInput = e.target.arrayInput.value;

    if (!arrayInput) {
      setError({ ...error, input: "An address array is required" });
      setTimeout(() => {
        setError({ ...error, input: "" });
      }, 1500);
      return;
    }

    const addresses = arrayInput.split(",");
    distributeToken(addresses);
    getRewarded().then((res) => setRewarded(res));

    //this set your input value to empty after clicking
    e.target.arrayInput.value = "";
  };

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();

    //this is your input value
    const balanceInput = e.target.balance.value;

    if (balanceInput === "") {
      setError({ ...error, err: "An address is required" });
      setTimeout(() => {
        setError({ ...error, err: "" });
      }, 1000);
    } else if (balanceInput.length !== 42) {
      setError({ ...error, err: "Please put a valid address" });
      setTimeout(() => {
        setError({ ...error, err: "" });
      }, 1000);
    }

    const balance = await balanceOf(balanceInput);

    //this set your input value to empty after clicking
    e.target.balance.value = "";
    setBal(balance * 10 ** 18);
  };

  // handle File
  const handleFile = (e) => {
    const fileType = ["application/vnd.ms-excel"];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setError({ ...error, excelErr: "" });
          setExcelFile(e.target.result);
        };
      } else {
        setError({ ...error, excelErr: "Please select only excel file types" });

        setExcelFile(null);
      }
    }
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const addresses=[]
      data.forEach(address=>{
        addresses.push(address.customer_address)
      })
      distributeToken(addresses)
      getRewarded().then((res) => setRewarded(res));
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto overflow-auto px-4">
      {bal && (
        <h2 className="text-center text-2xl my-2 text-blue-900 ">
          Your balance is {bal}
        </h2>
      )}

      <form className="form text-center " onSubmit={handleDistributeSubmit}>
        {error.input && <Error error={error.input} />}
        <input
          className="input"
          placeholder="Seperate address with a comma but without space..."
          name="arrayInput"
        />
        <button className="button">Distribute Token</button>
      </form>

      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <h1>Upload the list of addresses</h1>
        {error.excelErr && <Error error={error.excelErr} />}
        <div className="w-full border-grey border-2 p-3 mt-1 flex items-center">
          <input type="file" onChange={handleFile} id="fle" />
        </div>
        <button className="button">Distribute Token</button>
      </form>

      <form className="form text-center mb-4" onSubmit={handleBalanceSubmit}>
        {error.err && <Error error={error.err} />}
        <input
          className="input"
          placeholder="Enter your address to view your balance"
          name="balance"
        />

        <button className="button">View Balance</button>
      </form>

      <div className="relative shadow-md sm:rounded-lg overflow-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                S/N
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {rewarded && rewarded.map((x, i) => (
              <tr
                key={i}
                className="bg-white border-b hover:cursor-pointer hover:bg-gray-200 "
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {i + 1}
                </th>
                <td className="px-6 py-4">{x._address}</td>
                <td className="px-6 py-4">
                  {ethers.utils.formatUnits(x.amount) * 10 ** 18}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Input;
