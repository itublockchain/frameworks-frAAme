/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { getUserDataForFid } from "frames.js";
import { returnFrameAction } from "./handle";

const frames = createFrames({
  basePath: "/frames",
  initialState: {
    pageIndex: 0,
  },
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  console.log(pageIndex);
  let values = null;
  if (ctx.pressedButton) {
    const result = await returnFrameAction(ctx.request);
    values = result.match(
      (returnFrameAction) => {
        console.log("FID: ", returnFrameAction.untrustedData.fid);
        return returnFrameAction;
      },
      (error) => {
        console.error("Validation error: ", error);
        return null;
      }
    );
  }
  console.log("Values: ", values);
  const userData = await getUserDataForFid({
    fid: (values?.untrustedData?.fid as number) || 0,
  });
  console.log("UserData: ", userData);

  if (pageIndex === 1) {
    // RECEIVE PAGE
    return {
      image: (
        <div tw="flex flex-col justify-center items-center h-full w-full">
          <a>{`Your Address: ${userData?.displayName}`}</a>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=ethereum:${userData?.displayName}`}
            tw="w-1/4 mt-12"
          ></img>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back to Home
        </Button>,
        <Button
          action="link"
          target={`https://blockscan.com/address/${userData?.displayName}`}
        >
          View on Blockscan
        </Button>,
      ],
    };
  } else if (pageIndex === 2) {
    // FIRST SEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type an address that you want to send:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="post" target="?pageIndex=3">
          Next
        </Button>,
      ],
      textInput: "0xABCABCABCABC",
    };
  } else if (pageIndex === 3) {
    // SECOND SEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type the abbreviation of the coin that you want to send: `}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=2">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=4">
          Next
        </Button>,
      ],
      textInput: "ETH,DAI,USDC,USDT etc.",
    };
  } else if (pageIndex === 4) {
    // THIRD SEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type the amount that you want to send:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=3">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=5">
          Next
        </Button>,
      ],
      textInput: "0.1, 0.01, 10, 20 , 50 etc.",
    };
  } else if (pageIndex === 5) {
    // FINAL SEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Are you sure you want to send this amount of coin to this address?`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=4">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=6">
          Confirm
        </Button>,
      ],
    };
  } else if (pageIndex === 6) {
    // CONFIRMATION PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Transaction sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 7) {
    // ACTIONS PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Welcome to frAAme`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=8">
          SWAP
        </Button>,
        <Button action="post" target="?pageIndex=13">
          LEND
        </Button>,
        <Button action="post" target="?pageIndex=18">
          BORROW
        </Button>,
        <Button action="post" target="?pageIndex=23">
          MINT
        </Button>,
      ],
    };
  } else if (pageIndex === 8) {
    // FIRST SWAP PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type your first coin that you want to swap.`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=7">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=9">
          Next
        </Button>,
      ],
      textInput: "ETH,DAI,USDC,USDT etc.",
    };
  } else if (pageIndex === 9) {
    // SECOND SWAP PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type your second coin that you want to swap.`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=8">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=10">
          Next
        </Button>,
      ],
      textInput: "ETH,DAI,USDC,USDT etc.",
    };
  } else if (pageIndex === 10) {
    // THIRD SWAP PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type the amount that you want to swap:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=9">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=11">
          Next
        </Button>,
      ],
      textInput: "0.1, 0.01, 10, 20 , 50 etc.",
    };
  } else if (pageIndex === 11) {
    // FINAL SWAP PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Please confirm the amount and tokens`}</a>
          <a>{`${"0.1"} ETH -->> ${"35"} USDC`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=10">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=12">
          Confirm
        </Button>,
      ],
    };
  } else if (pageIndex === 12) {
    // CONFIRMATION SWAP PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Swap sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 13) {
    // FIRST LEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Current lending ETH amount: `}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=7">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=14">
          Unlend
        </Button>,
        <Button action="post" target="?pageIndex=15">
          Lend
        </Button>,
      ],
    };
  } else if (pageIndex === 14) {
    // FIRST UNLEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Current lending ETH amount: `}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=7">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=27">
          Unlend
        </Button>,
      ],
    };
  } else if (pageIndex === 15) {
    // FIRST LEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Type the amount of ETH that you want to lend:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=13">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=16">
          Next
        </Button>,
      ],
      textInput: "0.1, 0.01, 10, 20 , 50 etc.",
    };
  } else if (pageIndex === 16) {
    // SECOND LEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Please confirm the amount of ETH that you want to lend:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=15">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=17">
          Confirm
        </Button>,
      ],
    };
  } else if (pageIndex === 17) {
    // CONFIRMATION LEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Lend sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 18) {
    // FIRST BORROW PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Current lending ETH amount: `}</a>
          <a>{`Max cap to borrow ${"x"} USDC`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=7">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=19">
          Borrow
        </Button>,
        <Button action="post" target="?pageIndex=21">
          Repay
        </Button>,
      ],
    };
  } else if (pageIndex === 19) {
    // SECOND BORROW PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Current lending ETH amount: `}</a>
          <a>{`Max cap to borrow ${"x"} USDC`}</a>
          <a>{`Type the amount of USDC that you want to borrow:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=18">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=20">
          Borrow
        </Button>,
      ],
      textInput: "0.1, 0.01, 10, 20 , 50 etc.",
    };
  } else if (pageIndex === 20) {
    // CONFIRMATION BORROW PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Borrow sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 21) {
    // FIRST REPAY PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Current lending ETH amount: `}</a>
          <a>{`Current borrowed USDC amount: ${"x"}`}</a>
          <a>{`Type the amount of USDC that you want to repay:`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=18">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=22">
          Repay
        </Button>,
      ],
      textInput: "0.1, 0.01, 10, 20 , 50 etc.",
    };
  } else if (pageIndex === 22) {
    // CONFIRMATION REPAY PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Repay sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 23) {
    // FIRST MINT PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>NFT IMAGE</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="?pageIndex=7">
          Back
        </Button>,
        <Button action="post" target="?pageIndex=24">
          Mint on Base
        </Button>,
        <Button action="post" target="?pageIndex=25">
          Mint on OP
        </Button>,
        <Button action="post" target="?pageIndex=26">
          Mint on ARB
        </Button>,
      ],
    };
  } else if (pageIndex === 24) {
    // CONFIRMATION MINT ON BASE PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Mint sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 25) {
    // CONFIRMATION MINT ON OP PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Mint sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 26) {
    // CONFIRMATION MINT ON ARB PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Mint sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else if (pageIndex === 27) {
    // CONFIRMATION UNLEND PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Unlend sent!`}</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="/">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else {
    if (!userData) {
      //ACCOUNT CREATE PAGE
      return {
        image: (
          <div tw="flex flex-col justify-center items-center h-full w-full">
            <a>{`Welcome to frAAme `}</a>
            <a>{`Create an account or fetch your account to continue`}</a>
          </div>
        ),
        buttons: [
          <Button action="post" target="/">
            Create Account
          </Button>,
          <Button action="post" target="?pageIndex=1">
            Fetch My Account
          </Button>,
        ],
      };
    } else {
      // HOME PAGE
      return {
        image: (
          <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex flex-col">
            <a>{`Welcome to frAAme`}</a>
            <a>{`${userData.username}`}</a>
            <a>{`Your Address:`}</a>
            <a>Balances:</a>
            <a>ETH:</a>
            <a>USDC:</a>
            <a>DAI:</a>
          </div>
        ),
        buttons: [
          <Button
            action="link"
            target={`https://basescan.org/address${"address"}`}
          >
            Scanner
          </Button>,
          <Button action="post" target="?pageIndex=1">
            Receive
          </Button>,
          <Button action="post" target="?pageIndex=2">
            Send
          </Button>,
          <Button action="post" target="?pageIndex=7">
            Next
          </Button>,
        ],
      };
    }
  }
});
export { handleRequest as GET, handleRequest as POST };
