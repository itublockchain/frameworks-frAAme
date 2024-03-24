// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageContract {
    mapping(bytes => address) public custodyToAA;

    function setData(bytes memory key, address value) public {
        custodyToAA[key] = value;
    }

    function queryData(bytes memory key) public view returns (address) {
        if (custodyToAA[key] == address(0)) {
            return address(0);
        } else {
            return custodyToAA[key];
        }
    }
}
