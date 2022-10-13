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
    it("Owner should own the initial supply", async function () {
      const { tkn, owner } = await loadFixture(deployTokenERC20);
      expect(await tkn.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });

    it("Should set the right decimals", async function () {
      const { tkn } = await loadFixture(deployTokenERC20);
      expect(await tkn.decimals()).to.equal(DECIMALS);
    });
  });

  describe("TRANSFERS", function () {
    it("Should be able to in-crease allowance correctly", async function () {
      const { tkn, owner, acc1 } = await loadFixture(deployTokenERC20);
      const allowance_0 = await tkn.allowance(owner.address, acc1.address);

      expect(await tkn.increaseAllowance(acc1.address, TOTAL_SUPPLY))
        .emit(tkn, "Approval")
        .withArgs(owner.address, acc1.address, TOTAL_SUPPLY);

      expect(await tkn.allowance(owner.address, acc1.address)).equal(
        allowance_0.add(TOTAL_SUPPLY)
      );

      expect(
        tkn.increaseAllowance(ZERO_ADDRESS, TOTAL_SUPPLY)
      ).to.be.revertedWith("ERC20: zero address");
    });

    it("Should be able to de-crease allowance correctly", async function () {
      const { tkn, owner, acc1 } = await loadFixture(deployTokenERC20);
      const allowance_0 = await tkn.allowance(owner.address, acc1.address);
      const allowance_100 = await tkn.increaseAllowance(acc1.address, 100);

      expect(await tkn.decreaseAllowance(acc1.address, 50))
        .emit(tkn, "Approval")
        .withArgs(owner.address, acc1.address, TOTAL_SUPPLY - 100);

      expect(await tkn.allowance(owner.address, acc1.address)).equal(
        allowance_0.add(50)
      );

      expect(
        tkn.decreaseAllowance(ZERO_ADDRESS, TOTAL_SUPPLY)
      ).to.be.revertedWith("ERC20: zero address");
    });

    it("Should approve correctly", async function () {
      const { tkn, owner, acc1, acc2 } = await loadFixture(deployTokenERC20);
      const allowance = await tkn.allowance(acc1.address, acc2.address);

      // 1. revert for zero address
      await expect(
        tkn.connect(owner).approve(ZERO_ADDRESS, 100)
      ).to.be.revertedWith("ERC20: zero address");

      // 2. approve
      await tkn.connect(acc1).approve(acc2.address, 100);
      expect(await tkn.allowance(acc1.address, acc2.address)).to.equal(
        allowance.add(100)
      );
    });

    it("Should transfer to/from address correctly", async function () {
      const { tkn, owner, acc1 } = await loadFixture(deployTokenERC20);

      // Initial Balances
      const balanceOfOwner = await tkn.balanceOf(owner.address);
      const balanceOfAcc1 = await tkn.balanceOf(acc1.address);

      // Send Tx(100) owner -> acc1
      expect(await tkn.transfer(acc1.address, 100))
        .emit(tkn, "Transfer")
        .withArgs(owner.address, acc1.address, 100);

      // check new balances
      expect(await tkn.balanceOf(owner.address)).to.equal(
        balanceOfOwner.sub(100)
      );
      expect(await tkn.balanceOf(acc1.address)).to.equal(
        balanceOfAcc1.add(100)
      );

      // zero reverts
      await expect(
        tkn.connect(owner).transfer(ZERO_ADDRESS, 100)
      ).to.be.revertedWith("ERC20: zero address");

      // insufficient funds reverts
      await expect(
        tkn.connect(acc1).transfer(owner.address, 200)
      ).to.be.revertedWith("sender's funds insufficient");
    });

    it("Should transfer from address to address correctly", async function () {
      const { tkn, owner, acc1, acc2 } = await loadFixture(deployTokenERC20);

      // Initial Balances
      const balanceOfOwner = await tkn.balanceOf(owner.address);
      const balanceOfAcc1 = await tkn.balanceOf(acc1.address);
      const balanceOfAcc2 = await tkn.balanceOf(acc2.address);

      // revert -> allowance too low
      await expect(
        tkn.connect(acc1).transferFrom(owner.address, acc2.address, 100)
      ).to.be.revertedWith("receipient's allowance insufficient");

      // increase allowance -> same tx but revert again as senders balance insuffient
      tkn.connect(owner).increaseAllowance(acc1.address, 200);
      await expect(
        tkn.connect(acc1).transferFrom(owner.address, acc2.address, 1000)
      ).to.be.revertedWith("sender's balance insufficient");

      // lower amount -> now transfer should be success with event
      expect(
        await tkn.connect(acc1).transferFrom(owner.address, acc2.address, 100)
      )
        .emit(tkn, "Transfer")
        .withArgs(owner.address, acc1.address, 100);

      // now check balances if correct
      expect(await tkn.balanceOf(owner.address)).to.equal(
        balanceOfOwner.sub(100)
      );

      expect(await tkn.balanceOf(acc2.address)).to.equal(
        balanceOfAcc2.add(100)
      );
    });
  });

  describe("MINT-BURN", function () {
    it("Should mint correctly", async function () {
      const { tkn, owner, acc1 } = await loadFixture(deployTokenERC20);

      const acc1Balance = await tkn.balanceOf(acc1.address);
      const totalSupply = await tkn.totalSupply();

      // 1. revert for zero-address
      await expect(tkn.mint(ZERO_ADDRESS, 100)).to.be.revertedWith(
        "ERC20: zero address"
      );

      await expect(
        tkn.connect(acc1).mint(acc1.address, 100)
      ).to.be.revertedWith("only owner");

      // 2. Mint Event
      await expect(tkn.mint(acc1.address, 100))
        .to.emit(tkn, "Transfer")
        .withArgs(ZERO_ADDRESS, acc1.address, 100);

      // 3. compare balances: before and after
      expect(await tkn.balanceOf(acc1.address)).to.equal(acc1Balance.add(100));
      expect(await tkn.totalSupply()).to.equal(totalSupply.add(100));
    });

    it("Should burn correctly", async function () {
      const { tkn, acc1, acc2, owner } = await loadFixture(deployTokenERC20);

      const ownerBalance = await tkn.balanceOf(owner.address);
      const totalSupply = await tkn.totalSupply();

      // 1. revert with errors

      await expect(
        tkn.connect(owner).burn(owner.address, 100000)
      ).to.be.revertedWith("insufficient balance");

      await expect(tkn.connect(acc2).burn(acc2.address, 10)).to.be.revertedWith(
        "only owner"
      );

      // 2. burn and event
      await expect(tkn.connect(owner).burn(owner.address, 10))
        .to.emit(tkn, "Transfer")
        .withArgs(owner.address, ZERO_ADDRESS, 10);

      // 3. compare balances: before and after
      expect(await tkn.balanceOf(owner.address)).to.equal(ownerBalance.sub(10));
      expect(await tkn.totalSupply()).to.equal(totalSupply.sub(10));
    });
  });
});
