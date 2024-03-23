const ethers = require("ethers");
var express = require("express");
const app = express();
require("dotenv").config();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

app.post("/ops", jsonParser, async function (req, res, next) {
  console.log(req.body);
  try {
    if (req.body.txs == null) {
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

// CLIENT SIDE API
app.post("/getSignerAddress", jsonParser, async function (req, res, next) {
  const body = req.body;
  if (body.signerAddress == null) {
    return res.status(400).send({
      status: false,
      error: "Missing body",
    });
  }
  const signerAddress = body.signerAddress;
  res.status(200).send({
    status: true,
    signerAddress: signerAddress,
  });
});

app.post("/giveAccountAddress", async function (req, res, next) {
  const accountFactory = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const sender = ethers.utils.getContractAddress({
    from: accountFactory,
    nonce: await accountFactory.provider.getTransactionCount(accountFactory),
  });
  res.send({
    status: true,
    address: sender,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
