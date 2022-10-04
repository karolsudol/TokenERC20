import { task, types } from "hardhat/config";

task("verify-etherscan", "Verify deployed contract on Etherscan")
  .addParam(
    "contractAddress",
    "Contract address deployed",
    undefined,
    types.string
  )
  .setAction(async ({ contractAddress }: { contractAddress: string }, hre) => {
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        contract: "contracts/TokenERC20.sol:TokenERC20", // <path-to-contract>:<contract-name>
      });
    } catch ({ message }) {
      console.error(message);
    }
  });
