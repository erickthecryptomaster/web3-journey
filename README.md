# 🏦 Web3 Security Vault

A secure ETH Vault smart contract built with Solidity and Hardhat.

This project demonstrates secure smart contract design using modern best practices in Web3 development.

---

## 🔐 Security Features

- Reentrancy protection (OpenZeppelin ReentrancyGuard)
- Emergency stop mechanism (Pausable)
- Ownership control (Ownable)
- Checks-Effects-Interactions pattern
- Event logging for transparency

---

## 📦 Contract Capabilities

Users can:
- Deposit ETH
- Withdraw ETH up to their balance
- Check their balance
- View total contract balance

Owner can:
- Pause deposits and withdrawals
- Resume contract operations

---

## 🛠 Tech Stack

- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Ethers.js
- Mocha & Chai
- Node.js

---

## 🧪 Run Tests

```bash
npx hardhat test

## Test Coverage

✔ High coverage on core contract logic