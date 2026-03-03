// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVault {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract Rejector {
    IVault public vault;

    constructor(address vaultAddr) {
        vault = IVault(vaultAddr);
    }

    // Deposita ETH al Vault desde ESTE contrato (msg.sender = Rejector)
    function depositToVault() external payable {
        vault.deposit{value: msg.value}();
    }

    function withdrawFromVault(uint256 amount) external {
        vault.withdraw(amount);
    }

    // 🔥 Rechaza cualquier ETH entrante (esto hace que call() falle)
    receive() external payable {
        revert("I do not accept ETH");
    }
}