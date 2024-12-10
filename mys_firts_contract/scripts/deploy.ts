import { address, toNano } from "@ton/core"; 
import { MainContract } from "../wrappers/MainContract"; 
import { compile, NetworkProvider } from "@ton/blueprint";


/**
 * Deploys the MainContract on the TON network and initializes its configuration.
 * @param provider - The network provider used to interact with the TON blockchain.
 */
export async function run(provider: NetworkProvider) {
  // Configure the contract with initial values and addresses.
  const myContract = MainContract.createFromConfig(
    {
      number: 0, // Initial value for a property called `number` in the contract.
      address: address("kQDU69xgU6Mj-iNDHYsWWuNx7yRPQC_bNZNCpq5yVc7LiE7D"), // Deployment address of the contract.
      owner_address: address(
        "kQDU69xgU6Mj-iNDHYsWWuNx7yRPQC_bNZNCpq5yVc7LiE7D" // Owner address of the contract.
      ),
    },
    await compile("MainContract") // Compile the "MainContract" to obtain its code.
  );

  // Open the contract in the network provider to enable interactions.
  const openedContract = provider.open(myContract);

  // Send a transaction to deploy the contract with a small amount of TON (0.05 TON).
  openedContract.sendDeploy(provider.sender(), toNano("0.05"));

  // Wait until the contract has been deployed on the network.
  await provider.waitForDeploy(myContract.address);
}
