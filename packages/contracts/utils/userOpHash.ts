import { ethers } from "ethers";
import { BytesLike } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const EP_ADDRESS = process.env.EP_ADDRESS!;

type UserOperation = {
    sender: string,
    nonce: string,
    initCode: BytesLike,
    callData: BytesLike,
    callGasLimit: string,
    verificationGasLimit: string,
    preVerificationGas: string,
    maxFeePerGas: string,
    maxPriorityFeePerGas: string
    paymasterAndData: BytesLike,
    signature: BytesLike
  }

export default function getUserOpHash({
    sender,
    nonce,
    initCode,
    callData,
    callGasLimit,
    verificationGasLimit,
    preVerificationGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    paymasterAndData
  } : Omit<UserOperation, "signature">) {
    const packed = ethers.utils.defaultAbiCoder.encode(
      [
        "address",
        "uint256",
        "bytes32",
        "bytes32",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "bytes32",
      ],
      [
        sender,
        nonce,
        ethers.utils.keccak256(initCode), // initCode is kept 0x because I called createAccount method of Smart Wallet Factory before sending the user operation , if the smart account is not onchain we have to calculate initCode
        ethers.utils.keccak256(callData),
        callGasLimit,
        verificationGasLimit,
        preVerificationGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        ethers.utils.keccak256(paymasterAndData),
      ]
    );
  
    const enc = ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "address", "uint256"],
      [ethers.utils.keccak256(packed), EP_ADDRESS, "31337"]
    );
  
    const userOpHash = ethers.utils.keccak256(enc);
    const arrayifiedHash = ethers.utils.arrayify(userOpHash);
  
    return arrayifiedHash;
  };
  