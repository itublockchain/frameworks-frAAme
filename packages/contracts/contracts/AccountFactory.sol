//SPDX-License-Idetifier: MIT
pragma solidity ^0.8.0;
import "./Account.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/samples/callback/TokenCallbackHandler.sol";

import "./lib/Ed25519.sol";
import "./lib/Parser.sol";

contract AccountFactory {
    IStorageContract storageContract =
        IStorageContract(0x21c12A8A12240417ECcFCe47645152EEbaaB8035);

    function createAccount(
        address _entryPoint,
        address _owner,
        string memory _custody
    ) external returns (address) {
        address newAccount = address(new Account(IEntryPoint(_entryPoint), _owner, _custody));
        callSetData(_custody, newAccount);
        return newAccount;
    }

    function callSetData(string memory key, address value) public {
        storageContract.setData(key, value);
    }
}

interface IStorageContract {
    function setData(string memory key, address value) external;
}
