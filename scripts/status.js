require("dotenv").config();
const { ethers } = require("hardhat");


async function main() {
  const addr = process.env.VAULT_ADDRESS;
  const [user] = await ethers.getSigners();
  const vault = await ethers.getContractAt("Vault", addr);

  const userBal = await vault.balances(user.address);
  const contractBal = await vault.contractBalance();

  console.log("Vault:", addr);
  console.log("User:", user.address);
  console.log("User balance in Vault:", ethers.formatEther(userBal), "ETH");
  console.log("Contract balance:", ethers.formatEther(contractBal), "ETH");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
