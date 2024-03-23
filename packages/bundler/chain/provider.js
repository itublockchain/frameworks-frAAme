const ethers = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const signer0 = new ethers.Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", provider);

module.exports = {signer0, provider};