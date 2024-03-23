import { ethers } from "hardhat";
import { Bytes, BytesLike } from "ethers";
import { getUserOpHash } from "../utils";
import axios from "axios";

type UserOperation = {
  sender: string;
  nonce: string;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

async function main() {
  const [signer0, signer1] = await ethers.getSigners();

  const entryPointAddress = ethers.utils.getContractAddress({
    from: signer0.address,
    nonce: 0,
  });

  console.log("EntryPoint address:", entryPointAddress);

  const EntryPoint = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.deploy();

  await entryPoint.deployed();

  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const accountFactory = await AccountFactory.deploy();

  await accountFactory.deployed();

  const sender = ethers.utils.getContractAddress({
    from: accountFactory.address,
    nonce: await accountFactory.provider.getTransactionCount(
      accountFactory.address
    ),
  });

  console.log("AccountFactory deployed to:", accountFactory.address);

  const initCode =
    accountFactory.address +
    accountFactory.interface
      .encodeFunctionData("createAccount", [
        entryPoint.address,
        signer0.address,
      ])
      .slice(2);

  const initUserOp: UserOperation = {
    sender: sender,
    nonce: (await entryPoint.getNonce(sender, 0))._hex,
    initCode: initCode,
    callData: "0x",
    callGasLimit: ethers.utils.hexlify(200_000),
    verificationGasLimit: ethers.utils.hexlify(2_000_000),
    preVerificationGas: ethers.utils.hexlify(50_000),
    maxFeePerGas: ethers.utils.parseUnits("10", "gwei")._hex,
    maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")._hex,
    paymasterAndData: "0x",
    signature: "0x",
  };

  await entryPoint.depositTo(sender, { value: ethers.utils.parseEther("1") });

  const userOpHash = getUserOpHash(initUserOp);
  const signature = await signer0.signMessage(userOpHash);

  initUserOp.signature = signature;

  fetch("http://localhost:3000/ops", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      txs: [initUserOp],
    }),
  })
    .then((res) => res.json().then((data) => console.log(data)))
    .catch((err) => console.log("Err: " + err));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
