const { ethers } = require("hardhat");

async function main() {
  const vaultAddr = process.env.VAULT_ADDRESS;
  const [user] = await ethers.getSigners();

  const vault = await ethers.getContractAt("Vault", vaultAddr);

  const amount = ethers.parseEther("1");
  const tx = await vault.connect(user).deposit({ value: amount });
  await tx.wait();

  const userBal = await vault.balances(user.address);
  const contractBal = await vault.contractBalance();

  console.log("Deposited:", ethers.formatEther(amount), "ETH");
  console.log("User balance in Vault:", ethers.formatEther(userBal), "ETH");
  console.log("Contract balance:", ethers.formatEther(contractBal), "ETH");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
