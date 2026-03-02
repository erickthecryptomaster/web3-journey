const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
  async function deployVault() {
    const [owner, user] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy();
    await vault.waitForDeployment();

    return { vault, owner, user };
  }

  it("should let a user deposit ETH and update their balance", async function () {
    const { vault, user } = await deployVault();

    const oneEth = ethers.parseEther("1");
    await vault.connect(user).deposit({ value: oneEth });

    const stored = await vault.balances(user.address);
    expect(stored).to.equal(oneEth);

    const contractBal = await vault.contractBalance();
    expect(contractBal).to.equal(oneEth);
  });

  it("should revert if user withdraws more than their balance", async function () {
    const { vault, user } = await deployVault();

    const oneEth = ethers.parseEther("1");
    await vault.connect(user).deposit({ value: oneEth });

    const twoEth = ethers.parseEther("2");
    await expect(vault.connect(user).withdraw(twoEth)).to.be.revertedWith(
      "Insufficient balance"
    );
  });

  it("should allow withdraw and reduce balances correctly", async function () {
    const { vault, user } = await deployVault();

    const oneEth = ethers.parseEther("1");
    const halfEth = ethers.parseEther("0.5");

    await vault.connect(user).deposit({ value: oneEth });
    await vault.connect(user).withdraw(halfEth);

    const remaining = await vault.balances(user.address);
    expect(remaining).to.equal(halfEth);

    const contractBal = await vault.contractBalance();
    expect(contractBal).to.equal(halfEth);
  });

  it("should emit Deposit event on deposit", async function () {
    const { vault, user } = await deployVault();
    const amount = ethers.parseEther("1");

    await expect(vault.connect(user).deposit({ value: amount }))
      .to.emit(vault, "Deposit")
      .withArgs(user.address, amount);
  });

  it("owner can pause and unpause; deposits revert while paused", async function () {
  const { vault, owner, user } = await deployVault();

  // pause by owner
  await vault.connect(owner).pause();

  const amount = ethers.parseEther("1");
  await expect(
    vault.connect(user).deposit({ value: amount })
  ).to.be.reverted; // Pausable revert (no dependemos del texto exacto)

  // unpause by owner
  await vault.connect(owner).unpause();

  await vault.connect(user).deposit({ value: amount });

  const stored = await vault.balances(user.address);
  expect(stored).to.equal(amount);
});

it("non-owner cannot pause", async function () {
  const { vault, user } = await deployVault();

  await expect(vault.connect(user).pause()).to.be.reverted;
});
});
