const ethers = require("ethers");
var express = require("express");
const app = express();
require("dotenv").config();

const { LOCALHOST_PRIVATE_KEY } = process.env;
const { ENTRYPOINT_ADDRESS } = process.env;
const { PORT } = process.env;

const port = PORT || 3000;

const abi = require("./chain/abi");
const { signer0, provider } = require("./chain/provider");

const USEROP_REQUIRED_FIELDS = [
  "sender",
  "nonce",
  "initCode",
  "callData",
  "callGasLimit",
  "verificationGasLimit",
  "preVerificationGas",
  "maxFeePerGas",
  "maxPriorityFeePerGas",
  "paymasterAndData",
  "signature",
];

app.post("/ops", async function (req, res, next) {
    console.log(req.body);
  try {
    if (req.body?.txs == null) {
      return res.status(400).send({
        status: false,
        error: "Missing field txs",
      });
    }

    for (const txIdx in req.body.txs) {
      const tx = req.body.txs[txIdx];
      for (const field of USEROP_REQUIRED_FIELDS) {
        if (tx[field] == undefined) {
          return res.status(400).send({
            status: false,
            error: `Missing field ${field} on tx #${txIdx}`,
          });
        }
      }
    }

    const userOps = req.body.txs;

    const entryPointInterface = new ethers.utils.Interface(abi);
    const entryPointAddress =
      ENTRYPOINT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const entryPoint = new ethers.Contract(
      entryPointAddress,
      entryPointInterface,
      signer0
    );

    console.log("Handling operations", userOps);

    await entryPoint.handleOps(userOps, signer0.address, {
      gasLimit: 5000000,
    });
    const randomId = Buffer.from(ethers.utils.randomBytes(10)).toString("hex");

    console.log(`Handle transaction complete: ${handleTx.hash}`);

    res.send({
      status: true,
      jobId: randomId,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: false,
      error: e.message,
    });
  }
});

app.post("/ops2", async function (req, res, next) {
    console.log("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
