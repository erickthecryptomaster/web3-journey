# 🏦 Vault Smart Contract (Hardhat Project)

This project implements a secure ETH Vault smart contract built with Solidity and Hardhat.

## 🔐 Security Features

- Reentrancy protection (ReentrancyGuard)
- Emergency stop mechanism (Pausable)
- Ownership control (Ownable)
- Checks-Effects-Interactions pattern
- Event logging for transparency

## 📦 Contract Features

Users can:
- Deposit ETH
- Withdraw ETH up to their balance
- Check their balance
- View total contract balance

Owner can:
- Pause deposits and withdrawals
- Unpause the contract

---

## 🛠 Tech Stack

- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Mocha + Chai (Testing)
- Ethers.js

---

## 🧪 Run Tests

```bash
npx hardhat test