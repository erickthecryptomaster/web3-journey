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
  it("should block reentrancy with nonReentrant", async function () {
  const { vault, user } = await deployVault();

  const Reenter = await ethers.getContractFactory("Reenter");
  const reenter = await Reenter.deploy(await vault.getAddress());
  await reenter.waitForDeployment();

  const oneEth = ethers.parseEther("1");
  await reenter.connect(user).depositToVault({ value: oneEth });

  await expect(
    reenter.connect(user).attack(oneEth)
  ).to.be.reverted;
});

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
it("should revert if deposit is 0", async function () {
  const { vault, user } = await deployVault();

  await expect(vault.connect(user).deposit({ value: 0 })).to.be.revertedWith(
    "Must send ETH"
  );
});

it("should revert withdraw when contract is paused", async function () {
  const { vault, owner, user } = await deployVault();

  const amount = ethers.parseEther("1");
  await vault.connect(user).deposit({ value: amount });

  await vault.connect(owner).pause();

  await expect(vault.connect(user).withdraw(ethers.parseEther("0.5"))).to.be
    .reverted; // Pausable revert (no dependemos del mensaje exacto)
});

it("non-owner cannot unpause", async function () {
  const { vault, owner, user } = await deployVault();

  await vault.connect(owner).pause();
  await expect(vault.connect(user).unpause()).to.be.reverted;
});

it("should revert if ETH transfer fails (covers call success=false branch)", async function () {
  const { vault, user } = await deployVault();

  // Deploy Rejector pointing to the Vault
  const Rejector = await ethers.getContractFactory("Rejector");
  const rejector = await Rejector.deploy(await vault.getAddress());
  await rejector.waitForDeployment();

  // user funds Rejector by calling its function with ETH
  const oneEth = ethers.parseEther("1");
  await rejector.connect(user).depositToVault({ value: oneEth });

  // Now Rejector tries to withdraw to itself; its receive() reverts -> Vault call fails
  await expect(rejector.connect(user).withdrawFromVault(oneEth)).to.be.revertedWith(
    "ETH transfer failed"
  );
});
it("owner can pause; calling pause twice should revert", async function () {
  const { vault, owner } = await deployVault();
  await vault.connect(owner).pause();
  await expect(vault.connect(owner).pause()).to.be.reverted;
});

it("calling unpause when not paused should revert", async function () {
  const { vault, owner } = await deployVault();
  await expect(vault.connect(owner).unpause()).to.be.reverted;
});
it("should revert deposit when paused", async function () {
  const { vault, owner, user } = await deployVault();

  await vault.connect(owner).pause();

  await expect(
    vault.connect(user).deposit({ value: ethers.parseEther("1") })
  ).to.be.reverted;
});
it("should revert withdraw when paused even with balance", async function () {
  const { vault, owner, user } = await deployVault();

  const amount = ethers.parseEther("1");
  await vault.connect(user).deposit({ value: amount });

  await vault.connect(owner).pause();

  await expect(
    vault.connect(user).withdraw(amount)
  ).to.be.reverted;
});


});
