// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is ReentrancyGuard, Pausable, Ownable {
    mapping(address => uint256) public balances;
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function pause() external onlyOwner {
    _pause();
}

function unpause() external onlyOwner {
    _unpause();
}


    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);

    }

    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // ✅ Effects before interaction (evita reentrancy simple)
        balances[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH transfer failed");
        emit Withdraw(msg.sender, amount);

    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
