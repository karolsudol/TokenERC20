import { TokenERC20 } from "../typechain-types";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenERC20", function () {
  async function deployTokenERC20() {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const TokenERC20 = await ethers.getContractFactory("TokenERC20");
    const tkn = await TokenERC20.deploy("KinkyToken", "KNK");

    return { owner, acc1, acc2, tkn };
  }

  describe("Deployment", function () {
    it("Should set the right token name", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.name()).to.equal("KinkyToken");
    });

    it("Should set the righ token symbol", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.symbol()).to.equal("KNK");
    });
    it("Should set the right owner", async function () {
      const { tkn, owner } = await loadFixture(deployTokenERC20);
      expect(await tkn.contractowner()).to.equal(owner.address);
    });
    it("Should set the right supply", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.totalSupply()).to.equal(0);
    });

    it("Should set the right decimals", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.decimals()).to.equal(18);
    });
  });
});
