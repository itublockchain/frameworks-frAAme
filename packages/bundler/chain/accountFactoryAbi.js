const ACCOUNTFACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "key",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "value",
        "type": "address"
      }
    ],
    "name": "callSetData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_entryPoint",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "_custody",
        "type": "bytes"
      }
    ],
    "name": "createAccount",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

module.exports = ACCOUNTFACTORY_ABI;
