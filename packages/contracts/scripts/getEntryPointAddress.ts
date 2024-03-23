import { ethers } from "hardhat";

async function main() {
  const [signer0] = await ethers.getSigners();

  const entryPointAddress = ethers.utils.getContractAddress({
    from: signer0.address,
    nonce: 0, 
  })

  console.log("EntryPoint address:", entryPointAddress);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
