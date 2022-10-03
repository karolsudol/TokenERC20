import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CONTRACT:TokenERC20", function () {
  const NAME = "Kinky";
  const SYMBOL = "KNK";
  const DECIMALS = 18;
  const TOTAL_SUPPLY = 1000;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  async function deployTokenERC20() {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const TokenERC20 = await ethers.getContractFactory("TokenERC20");
    const tkn = await TokenERC20.deploy(NAME, SYMBOL);

    return { owner, acc1, acc2, tkn };
  }

  describe("DEPLOYMENT", function () {
    it("Should set the right token name", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.name()).to.equal(NAME);
    });

    it("Should set the righ token symbol", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.symbol()).to.equal(SYMBOL);
    });
    it("Should set the right owner", async function () {
      const { tkn, owner } = await loadFixture(deployTokenERC20);
      expect(await tkn._contractOwner()).to.equal(owner.address);
    });
    it("Should set the right supply", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.totalSupply()).to.equal(TOTAL_SUPPLY);
    });

    it("Should set the right decimals", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.decimals()).to.equal(DECIMALS);
    });
  });

  // describe("TRANSFERS", function () {
  //   it("Should be able to transfer tokens successfully to an address", async function () {
  //     const tokensToSend = ethers.utils.parseEther("10");
  //     const { tkn, acc1 } = await loadFixture(deployTokenERC20);
  //     tkn.transfer(acc1.address, tokensToSend);
  //     expect(await tkn.balanceOf(acc1.address)).to.equal(tokensToSend);
  //   });

  //   it("emits a transfer event, when an transfer occurs", async function () {
  //     const tokensToSend = ethers.utils.parseEther("10");
  //     const { tkn, acc1, owner } = await loadFixture(deployTokenERC20);

  //     expect(await tkn.transfer(acc1.address, tokensToSend))
  //       .to.emit(tkn, "Transfer")
  //       .withArgs(owner.address, acc1.address, tokensToSend);
  //   });
  // });
});

// describe("DECREASE-ALLOWANCE", function () {
//   describe("1. when the spender is not the zero address", function () {
//     it("when there was no approved amount before", async function () {
//       const tokensToSend = ethers.utils.parseEther("10");
//       const { tkn, acc1, acc2 } = await loadFixture(deployTokenERC20);

//       // tkn.transfer(acc1.address, tokensToSend);
//       expect(await tkn.allowance()).to.equal(tokensToSend);
//     });
//   });
// });
