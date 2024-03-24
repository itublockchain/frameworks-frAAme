/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { getUserDataForFid, getAddressesForFid } from "frames.js";
import { ValidatedFrameAction, returnFrameAction } from "../frames/handle";
import { STORAGE_ABI } from "../abi/storage";
import { ethers } from "ethers";
import { Message } from "@farcaster/hub-nodejs";
import { BigNumberish } from "ethers";
const frAAmeAPI = "https://fraame.onrender.com";
const devAPI = "http://localhost:3001";

export async function sendInitPostRequest(values: any) {
  let custody;

  const UserAddresses = await getAddressesForFid({
    fid: values?.untrustedData?.fid as number,
  });

  const custodyAddressObj = UserAddresses.find(
    (addressObj) => addressObj.type === "custody"
  );

  if (custodyAddressObj) {
    console.log("Custody Address: ", custodyAddressObj.address);
    custody = custodyAddressObj.address;
  } else {
    console.log("No custody address found.");
  }

  const encodedBytes = Message.encode(values?.message as Message).finish();
  const signatureBytes = Buffer.from(encodedBytes).toString("hex");

  const requestBody = {
    messageBytes: signatureBytes,
    custody: custody,
  };

  try {
    const response = await fetch(`${frAAmeAPI}/create-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Handle server errors (response status is not 2xx)
      const errorData = await response.json();
      console.error("Server responded with an error:", errorData);
      return;
    }

    const responseData = await response.json();
    console.log("Response from server:", responseData);
  } catch (error) {
    // Handle network errors
    console.error("Failed to send request:", error);
  }
}
export async function sendTestPostRequest(values: any) {
  let custody;

  const UserAddresses = await getAddressesForFid({
    fid: values?.untrustedData?.fid as number,
  });

  const custodyAddressObj = UserAddresses.find(
    (addressObj) => addressObj.type === "custody"
  );

  if (custodyAddressObj) {
    console.log("Custody Address: ", custodyAddressObj.address);
    custody = custodyAddressObj.address;
  } else {
    console.log("No custody address found.");
  }

  const encodedBytes = Message.encode(values?.message as Message).finish();
  const signatureBytes = Buffer.from(encodedBytes).toString("hex");

  const requestBody = {
    signatureBytes: signatureBytes,
    custody: custody,
  };

  try {
    const response = await fetch(`${frAAmeAPI}/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Handle server errors (response status is not 2xx)
      const errorData = await response.json();
      console.error("Server responded with an error:", errorData);
      return;
    }

    const responseData = await response.json();
    console.log("Response from server:", responseData);
  } catch (error) {
    // Handle network errors
    console.error("Failed to send request:", error);
  }
}

export async function sendSwapPostRequest(values: any) {
  let custody;

  const UserAddresses = await getAddressesForFid({
    fid: values?.untrustedData?.fid as number,
  });

  const custodyAddressObj = UserAddresses.find(
    (addressObj) => addressObj.type === "custody"
  );

  if (custodyAddressObj) {
    console.log("Custody Address: ", custodyAddressObj.address);
    custody = custodyAddressObj.address;
  } else {
    console.log("No custody address found.");
  }

  const encodedBytes = Message.encode(values?.message as Message).finish();
  const signatureBytes = Buffer.from(encodedBytes).toString("hex");

  const requestBody = {
    signatureBytes: signatureBytes,
    custody: custody,
    coin1: "ETH",
    coin2: "UNI",
    amount1: 0.1,
  };

  try {
    const response = await fetch(`${frAAmeAPI}/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Handle server errors (response status is not 2xx)
      const errorData = await response.json();
      console.error("Server responded with an error:", errorData);
      return;
    }

    const responseData = await response.json();
    console.log("Response from server:", responseData);
  } catch (error) {
    // Handle network errors
    console.error("Failed to send request:", error);
  }
}

export async function sendMintPostRequest(values: any) {
  let custody;

  const UserAddresses = await getAddressesForFid({
    fid: values?.untrustedData?.fid as number,
  });

  const custodyAddressObj = UserAddresses.find(
    (addressObj) => addressObj.type === "custody"
  );

  if (custodyAddressObj) {
    console.log("Custody Address: ", custodyAddressObj.address);
    custody = custodyAddressObj.address;
  } else {
    console.log("No custody address found.");
  }

  const encodedBytes = Message.encode(values?.message as Message).finish();
  const signatureBytes = Buffer.from(encodedBytes).toString("hex");

  const requestBody = {
    signatureBytes: signatureBytes,
    custody: custody,
    network: "BASE",
  };

  try {
    const response = await fetch(`${frAAmeAPI}/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Handle server errors (response status is not 2xx)
      const errorData = await response.json();
      console.error("Server responded with an error:", errorData);
      return;
    }

    const responseData = await response.json();
    console.log("Response from server:", responseData);
  } catch (error) {
    // Handle network errors
    console.error("Failed to send request:", error);
  }
}
const contractAddress = "0x21c12A8A12240417ECcFCe47645152EEbaaB8035";
const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
// Localhost private key safe to push.
const wallet = new ethers.Wallet(
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);
const storageInterface = new ethers.Interface(STORAGE_ABI as any);
const storageContract = new ethers.Contract(
  contractAddress,
  storageInterface,
  wallet
);

export async function getUserAA(values: any) {
  let custody;

  const UserAddresses = await getAddressesForFid({
    fid: values?.untrustedData?.fid as number,
  });

  const custodyAddressObj = UserAddresses.find(
    (addressObj) => addressObj.type === "custody"
  );

  if (custodyAddressObj) {
    console.log("Custody Address: ", custodyAddressObj.address);
    custody = custodyAddressObj.address;
  } else {
    console.log("No custody address found.");
  }
  try {
    const result = await storageContract.queryData(custody);
    console.log("Result: ", result);
    if (result === "0x0000000000000000000000000000000000000000") {
      console.log("Not Found the Address");
      return "Not Deployed";
    } else {
      console.log("Address: ", result);
      return result;
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
export async function getUserBaseBalance(address: any) {
  if (address === "Not Deployed") {
    return "0";
  }
  const balance = await provider.getBalance(address);
  const newBalance = balance.toString();
  const newNewBalance = ethers.formatEther(newBalance);
  return newNewBalance;
}
