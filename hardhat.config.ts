import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/ERC20-tasks.ts";
import * as dotenv from "dotenv";
dotenv.config();

const SEPOLIA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: SEPOLIA_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;

console.log(process.env.PRIVATE_KEY);
