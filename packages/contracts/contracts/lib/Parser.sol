// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Parser {
    function parseData(bytes memory data)
        public
        pure
        returns (
            bytes32 accountAddress,
            bytes memory hash,
            bytes32 r,
            bytes32 s
        )
    {
        require(data.length == 32 + 20 + 64, "Invalid data length");

        // Extract the account address (32 bytes)
        accountAddress = bytesToBytes32(slice(data, 0, 32), 0);

        // Extract the hash (20 bytes)
        hash = slice(data, 32, 20);

        // Extract r and s values from the signature (each 32 bytes)
        r = bytesToBytes32(slice(data, 52, 32), 0);
        s = bytesToBytes32(slice(data, 84, 32), 0);
    }

    function slice(bytes memory data, uint256 start, uint256 length) private pure returns (bytes memory) {
        bytes memory part = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            part[i] = data[i + start];
        }
        return part;
    }

    function bytesToBytes32(bytes memory b, uint256 offset) private pure returns (bytes32) {
        require(b.length >= offset + 32, "bytesToBytes32 out-of-bounds");
        bytes32 temp;
        assembly {
            temp := mload(add(add(b, 32), offset))
        }
        return temp;
    }

    function bytesToBytes20(bytes memory b, uint256 offset) private pure returns (bytes20) {
        require(b.length >= offset + 20, "bytesToBytes20 out-of-bounds");
        bytes20 temp;
        assembly {
            temp := mload(add(add(b, 32), offset))
        }
        return temp;
    }
}
