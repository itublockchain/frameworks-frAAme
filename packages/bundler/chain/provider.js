const ethers = require("ethers");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const api = process.env.BASE_SEPOLIA_API_KEY;

const provider = new ethers.providers.JsonRpcProvider(api);
const signer0 = new ethers.Wallet(privateKey, provider);

module.exports = {signer0, provider};