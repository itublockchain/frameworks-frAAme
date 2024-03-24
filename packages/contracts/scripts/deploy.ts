import { ethers } from "hardhat";
import { Bytes, BytesLike } from "ethers";
import { getUserOpHash } from "../utils";
import { run } from "hardhat";

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

  /////////////////////////////////////////////////////////////
  //                ENVIRONMENT INITIALIZATION              ///

  // const entryPointAddress = ethers.utils.getContractAddress({
  //   from: signer0.address,
  //   nonce: 0,
  // });

  // console.log("EntryPoint address:", entryPointAddress);

  // const EntryPoint = await ethers.getContractFactory("EntryPoint");
  // const entryPoint = await EntryPoint.deploy();

  // await entryPoint.deployed();

  const Ed25519_pow = await ethers.getContractFactory("Ed25519_pow");
  const ed25519_pow = await Ed25519_pow.deploy();

  const Sha512 = await ethers.getContractFactory("Sha512");
  const sha512 = await Sha512.deploy();

  const Ed25519 = await ethers.getContractFactory("Ed25519", {
    libraries: {
      Ed25519_pow: ed25519_pow.address,
      Sha512: sha512.address
    }
  });
  const ed25519 = await Ed25519.deploy();
  await ed25519.deployed();

  console.log("Ed25519 deployed to:", ed25519.address);

  const AccountFactory = await ethers.getContractFactory("AccountFactory", {
    libraries: {
      Ed25519: ed25519.address,
    },
  });
  const accountFactory = await AccountFactory.deploy();

  await accountFactory.deployed();

  console.log("Account Factory: ", accountFactory.address);

  // const MockERC20 = await ethers.getContractFactory("MyToken");
  // const mockERC20 = await MockERC20.deploy();

  // await mockERC20.deployed();

  // const sender = ethers.utils.getContractAddress({
  //   from: accountFactory.address,
  //   nonce: await accountFactory.provider.getTransactionCount(
  //     accountFactory.address
  //   ),
  // });

  // console.log("AccountFactory deployed to:", accountFactory.address);

  // const initCode =
  //   accountFactory.address +
  //   accountFactory.interface
  //     .encodeFunctionData("createAccount", [
  //       entryPoint.address,
  //       signer0.address,
  //     ])
  //     .slice(2);

  // const initUserOp: UserOperation = {
  //   sender: sender,
  //   nonce: (await entryPoint.getNonce(sender, 0))._hex,
  //   initCode: initCode,
  //   callData: "0x",
  //   callGasLimit: ethers.utils.hexlify(200_000),
  //   verificationGasLimit: ethers.utils.hexlify(2_000_000),
  //   preVerificationGas: ethers.utils.hexlify(50_000),
  //   maxFeePerGas: ethers.utils.parseUnits("10", "gwei")._hex,
  //   maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")._hex,
  //   paymasterAndData: "0x",
  //   signature: "0x",
  // };

  // await entryPoint.depositTo(sender, { value: ethers.utils.parseEther("1") });

  // const userOpHash = getUserOpHash(initUserOp);
  // const signature = await signer0.signMessage(userOpHash);

  // initUserOp.signature = signature;

  // await fetch("http://localhost:3000/ops", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     txs: [initUserOp],
  //   }),
  // })
  //   // .then((res) => res.json().then((data) => console.log(data)))
  //   // .catch((err) => console.log("Err: " + err));

  // //                ENVIRONMENT INITIALIZATION              ///
  // /////////////////////////////////////////////////////////////

  // /////////////////////////////////////////////////////////////
  // //                        MINTING                         ///

  // const mintCode =
  //   mockERC20.address +
  //   mockERC20.interface.encodeFunctionData("mint", [
  //     sender,
  //     ethers.utils.parseEther("1"),
  //   ]).slice(2);

  // const mintUserOp: UserOperation = {
  //   sender: sender,
  //   nonce: (await entryPoint.getNonce(sender, 0))._hex,
  //   initCode: "0x",
  //   callData: mintCode,
  //   callGasLimit: ethers.utils.hexlify(200_000),
  //   verificationGasLimit: ethers.utils.hexlify(2_000_000),
  //   preVerificationGas: ethers.utils.hexlify(50_000),
  //   maxFeePerGas: ethers.utils.parseUnits("10", "gwei")._hex,
  //   maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")._hex,
  //   paymasterAndData: "0x",
  //   signature: "0x",
  // };

  // const mintUserOpHash = getUserOpHash(mintUserOp);
  // const mintSignature = await signer0.signMessage(mintUserOpHash);

  // mintUserOp.signature = mintSignature;

  // await fetch("http://localhost:3000/ops", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     txs: [mintUserOp],
  //   }),
  // })
  //   // .then((res) => res.json().then((data) => console.log(data)))
  //   // .catch((err) => console.log("Err: " + err));

  // const balance = await mockERC20.balanceOf(sender)
  // console.log(balance)

  // //                        MINTING                         ///
  // /////////////////////////////////////////////////////////////
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
