const ethers = require("ethers");
var express = require("express");
const app = express();
require("dotenv").config();
var bodyParser = require("body-parser");
var { NeynarAPIClient } = require("@neynar/nodejs-sdk");
var jsonParser = bodyParser.json();

const { LOCALHOST_PRIVATE_KEY } = process.env;
const { NEYNAR_API_KEY } = process.env;
const { ENTRYPOINT_ADDRESS } = process.env;
const { ACCOUNT_FACTORY_ADDRESS } = process.env;
const { PORT } = process.env;

const client = new NeynarAPIClient(NEYNAR_API_KEY);

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
  ENTRYPOINT_ADDRESS || "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const entryPoint = new ethers.Contract(
  entryPointAddress,
  entryPointInterface,
  signer0
);

const accountFactoryInterface = new ethers.utils.Interface(accountFactoryAbi);
const accountFactoryAddress = ACCOUNT_FACTORY_ADDRESS || "0x255bcF4EfA363066c72c51A55FBB518390242a36";
const accountFactory = new ethers.Contract(
  accountFactoryAddress,
  accountFactoryInterface,
  signer0
);

const accountInterface = new ethers.utils.Interface(accountAbi);
const accountAddress = "";
const account = new ethers.Contract(accountAddress, accountInterface, signer0);

app.post("/ops", jsonParser, async function (req, res, next) {
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
app.post("/create-account", jsonParser, async function (req, res, next) {
  const body = req.body;

  if (body.messageBytes == null) {
    return res.status(400).send({
      status: false,
      error: "Missing Message Bytes",
    });
  }

  const messageBytes = body.messageBytes;
  const custody = body.custody;
  
  const result1 = await client.validateFrameAction(messageBytes);

  const result = result1.signature_temporary_object
  const signature = new Uint8Array(
    Buffer.from(result.signature, "base64")
  );
  const mainSignature =
    result.signer +
    result.hash.slice(2) +
    Buffer.from(signature).toString("hex");

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
      .encodeFunctionData("createAccount", ["0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", custody, result.signer])
      .slice(2);

  const userInitOp = {
    sender: accountAddress,
    nonce: "0x00",
    initCode: initCode,
    callData: "0x",
    callGasLimit: ethers.utils.hexlify(200_000),
    verificationGasLimit: ethers.utils.hexlify(2_000_000),
    preVerificationGas: ethers.utils.hexlify(50_000),
    maxFeePerGas: ethers.utils.parseUnits("10", "gwei")._hex,
    maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei")._hex,
    paymasterAndData: "0x",
    signature: mainSignature, //TODO: Ed25519 Signature from Neynar,
  };

  try {
    await fetch("/ops", {
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

  const messageBytes = "0a52080d10a6a11418e6fec63020018201420a2268747470733a2f2f66722d61612d6d652e76657263656c2e6170702f6672616d657310021a1a08a6a114121400000000000000000000000000000000000000011214c7cd7befa6c09ba2fa183bbf3b49ccc4c094a88918012240162e5cfbe788c25407e82171e133a2eff62b5de7222569dd554c030a589299b79358af0b2b384ae36cf42f3db5fe36976eb96510dfde6f340f9dbf6f88d119082801322016ec954c232687c1b569534cf0d8f37b6f6302c8e4a91ce51dff4ef594efc36b";
  const custody = body.custody;

  const result = await client.validateFrameAction(messageBytes);

  console.log("API CUSTODY: ", custody);
  console.log(result)
});

app.get("/swap", async function (req, res, next) {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
