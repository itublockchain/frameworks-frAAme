const ethers = require("ethers");
var express = require("express");
const app = express();
require("dotenv").config();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const { LOCALHOST_PRIVATE_KEY } = process.env;
const { ENTRYPOINT_ADDRESS } = process.env;
const { ACCOUNT_FACTORY_ADDRESS } = process.env;
const { PORT } = process.env;

const port = PORT || 3001;

const abi = require("./chain/abi");
const accountFactoryAbi = require("./chain/accountFactoryAbi");
const accountAbi = require("./chain/accountAbi");
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

const entryPointInterface = new ethers.utils.Interface(abi);
const entryPointAddress =
  ENTRYPOINT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const entryPoint = new ethers.Contract(
  entryPointAddress,
  entryPointInterface,
  signer0
);

const accountFactoryInterface = new ethers.utils.Interface(accountFactoryAbi);
const accountFactoryAddress = ACCOUNT_FACTORY_ADDRESS || "";
const accountFactory = new ethers.Contract(
  accountFactoryAddress,
  accountFactoryInterface,
  signer0
);

const accountInterface = new ethers.utils.Interface(accountAbi);
const accountAddress = "";
const account = new ethers.Contract(accountAddress, accountInterface, signer0);

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

    console.log("Handling operations", userOps);

    const tx = await entryPoint.handleOps(userOps, signer0.address, {
      gasLimit: 5000000,
    });
    const randomId = Buffer.from(ethers.utils.randomBytes(10)).toString("hex");

    res.send({
      status: true,
      jobId: randomId,
      txHash: tx.hash,
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
app.post("/createAccount", jsonParser, async function (req, res, next) {
  const body = req.body;
  if (body.owner == null) {
    return res.status(400).send({
      status: false,
      error: "Missing body",
    });
  }
  const signature = body.signatureBytes;
  const signatureHash = body.signatureHash;
  const custody = body.custody;

  const accountAddress = ethers.utils.getContractAddress({
    from: ACCOUNT_FACTORY_ADDRESS,
    nonce: await provider.getTransactionCount(ACCOUNT_FACTORY_ADDRESS),
  });

  await entryPoint.connect(signer0).depositTo(accountAddress, {
    value: ethers.utils.parseEther("0.00001"),
  });

  const initCode =
    ACCOUNT_FACTORY_ADDRESS +
    accountFactory.interface
      .encodeFunctionData("createAccount", [ENTRYPOINT_ADDRESS, owner])
      .slice(2);

  const userInitOp = {
    sender: accountAddress,
    nonce: await entryPoint.nonce(accountAddress, 0),
    initCode: initCode,
    callData: "0x",
    callGasLimit: ethers.utils.hexlify(200_000),
    verificationGasLimit: ethers.utils.hexlify(2_000_000),
    preVerificationGas: ethers.utils.hexlify(50_000),
    maxFeePerGas: ethers.utils.parseUnits("10", "gwei")._hex,
    maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")._hex,
    paymasterAndData: "0x",
    signature: 0, //TODO: Ed25519 Signature from Neynar,
  };

  try {
    await fetch("http://localhost:3000/ops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txs: [userInitOp] }),
    }).then(
      res.status(200).send({
        status: true,
        accountAddress: accountAddress,
      })
    );
  } catch (e) {
    res.status(500).send({
      status: false,
      error: e.message,
    });
  }
});

app.post("/test", jsonParser, async function (req, res, next) {
  const body = req.body;
  if (body.signatureBytes == null) {
    return res.status(400).send({
      status: false,
      error: "Missing body",
    });
  }
  const signature = body.signatureBytes;
  const signatureHash = body.signatureHash;
  const custody = body.custody;
  console.log("API SIGN: ", signature);
  console.log("API HASH: ", signatureHash);
  console.log("API CUSTODY: ", custody);
});

app.get("/swap", async function (req, res, next) {});

app.listen(port, () => {
  console.log(`Exıample app listening on port ${port}`);
});
