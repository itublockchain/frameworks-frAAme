/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

export const frames = createFrames({
  basePath: "/frames",
  initialState: {
    pageIndex: 0,
  },
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  console.log(pageIndex);

  if (pageIndex === 1) {
    // RECEIVE PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Your Address:`}</a>
          <a>QR CODE</a>
        </div>
      ),
      buttons: [
        <Button action="post" target="http://localhost:3001/frames">
          Back to Home
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
        <Button action="post" target="http://localhost:3001/frames">
          Back To Home
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=3">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=2">
          Back
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=4">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=3">
          Back
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=5">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=4">
          Back
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=6">
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=8">
          SWAP
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=13"
        >
          LEND
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=18"
        >
          BORROW
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=23"
        >
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=7">
          Back
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=9">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=8">
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=10"
        >
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=9">
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=11"
        >
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
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=10"
        >
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=12"
        >
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=7">
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=14"
        >
          Unlend
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=15"
        >
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=7">
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=27"
        >
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
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=13"
        >
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=16"
        >
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
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=15"
        >
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=17"
        >
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=7">
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=19"
        >
          Borrow
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=21"
        >
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
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=18"
        >
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=20"
        >
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=18"
        >
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=22"
        >
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=7">
          Back
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=24"
        >
          Mint on Base
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=25"
        >
          Mint on OP
        </Button>,
        <Button
          action="post"
          target="http://localhost:3001/frames?pageIndex=26"
        >
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames">
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
        <Button action="post" target="http://localhost:3001/frames">
          Back To Home
        </Button>,
        <Button action="link" target={`https://basescan.org/tx/"${"txid"}`}>
          View Transaction
        </Button>,
      ],
    };
  } else {
    // HOME PAGE
    return {
      image: (
        <div tw="flex flex-col">
          <a>{`Welcome to frAAme`}</a>
          <a>{`@username`}</a>
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
        <Button action="post" target="http://localhost:3001/frames?pageIndex=1">
          Receive
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=2">
          Send
        </Button>,
        <Button action="post" target="http://localhost:3001/frames?pageIndex=7">
          Next
        </Button>,
      ],
    };
  }
});
export const GET = handleRequest;
export const POST = handleRequest;
