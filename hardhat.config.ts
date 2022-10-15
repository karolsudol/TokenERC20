import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/ERC20-tasks.ts";
import * as dotenv from "dotenv";
dotenv.config();

const SEPOLIA_URL = `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`;
const PRIVATE_KEY_ACC1 = process.env.PRIVATE_KEY_ACC1;
const PRIVATE_KEY_ACC2 = process.env.PRIVATE_KEY_ACC2;
const PRIVATE_KEY_ACC3 = process.env.PRIVATE_KEY_ACC3;
const PRIVATE_KEY_ACC4 = process.env.PRIVATE_KEY_ACC4;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: SEPOLIA_URL || "",
      accounts: [
        PRIVATE_KEY_ACC1 as string,
        PRIVATE_KEY_ACC2 as string,
        PRIVATE_KEY_ACC3 as string,
        PRIVATE_KEY_ACC4 as string,
      ],
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

// console.log(process.env.PRIVATE_KEY);
