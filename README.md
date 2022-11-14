# TokenERC20

- A `hadhat` unit tested `ERC20` token that has been 100% covared with `mint/burn` features for contract creator without using libraries.
- The contract conforms to the `ERC-20 standard` as includes all the functions and events described in the standard, while keeping their names.

- Deployed and Verified on [sepolia](https://sepolia.etherscan.io/address/0xa883d9C6F7FC4baB52AcD2E42E51c4c528d7F7D3)

## hardhat tasks:

- `npx hardhat coverage`
- `npx hardhat run scripts/deploy.ts --network sepolia`
- `npx hardhat ACCOUNTS --network sepolia`
- `npx hardhat BALANCE --network sepolia --account 0x741e0608906B74B8754a99413A7374FdE7B9779a`
- `npx hardhat ALLOWANCE --network sepolia --account 0xb5dF6F49291573d8FF3b06E3d8e25B95EDB419EE`
- `npx hardhat IncreaseAllowance --network sepolia --account 0xb5dF6F49291573d8FF3b06E3d8e25B95EDB419EE --amount 100`
- `npx hardhat APPROVE --network sepolia --account 0xb5dF6F4929157`

## coverage

<br/>
<p align="center">
<img src="img/coveage.png" width="625" alt="web3-arch">
</a>
</p>
<br/>
