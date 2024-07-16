import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");


describe("ZodiX", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const zdxToken = await ethers.deployContract("ZodiX");

    await zdxToken.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { zdxToken, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {

    it("Should assign the total supply of tokens to the owner", async function () {
      const { zdxToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await zdxToken.balanceOf(owner.address);
      expect(await zdxToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { zdxToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        zdxToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(zdxToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        zdxToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(zdxToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { zdxToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(zdxToken.transfer(addr1.address, 50))
        .to.emit(zdxToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(zdxToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(zdxToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { zdxToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await zdxToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        zdxToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(zdxToken, "ERC20InsufficientBalance");

      // Owner balance shouldn't have changed.
      expect(await zdxToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

  });
  describe("Burning", function () {

    it("Burn should burn the specified amount of tokens", async function () {
      const zdxToken = await ethers.deployContract("ZodiX");
      const [owner, addr1] = await ethers.getSigners();

      await zdxToken.transfer(addr1.address, 314);

      const initialSupply = await zdxToken.totalSupply();
      const initialBalance = await zdxToken.balanceOf(addr1.address);
      const burnAmount = 300n;


      // Burn too much tokens
      await expect(
        zdxToken.connect(addr1).burn(1024n)
      ).to.be.revertedWithCustomError(zdxToken, "ERC20InsufficientBalance");


      // Burn some tokens
      await zdxToken.connect(addr1).burn(burnAmount);


      // Check if the total supply decreased 
      // expect(await zdxToken.totalSupply()).to.equal(initialSupply - burnAmount);
      // Check if the user's balance decreased 
      // expect(await zdxToken.balanceOf(addr1.address)).to.equal(14);
      expect(await zdxToken.balanceOf(addr1.address)).to.equal(initialBalance - burnAmount);
    });    
  });
  
});
