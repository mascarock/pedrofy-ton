import { Address, Cell, contractAddress, toNano } from "@ton/core";
import { hex } from "../build/main.compiled.json"; 
import { getHttpV4Endpoint } from "@orbs-network/ton-access"; 
import { TonClient4 } from "@ton/ton"; 
import qs from "qs"; 
import qrcode from "qrcode-terminal"; 
import dotenv from "dotenv"; 
dotenv.config(); 

/**
 * Main script to interact with a smart contract on the TON blockchain.
 * This script performs the following actions:
 * 1. Calculates the smart contract's address.
 * 2. Checks the contract's status on the network.
 * 3. Generates a transfer link with a QR code.
 * 4. Continuously monitors the "latest sender" value from the contract.
 */
async function onchainTestScript() {
  // Decode the smart contract's code from its hexadecimal format.
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];

  // Create an empty data cell for the contract (no initial configuration).
  const dataCell = new Cell();

  // Compute the smart contract address using the code and data cells.
  const address = contractAddress(0, {
    code: codeCell,
    data: dataCell,
  });

  // Retrieve the appropriate HTTP endpoint for interacting with the TON network.
  const endpoint = await getHttpV4Endpoint({
    network: process.env.TESTNET ? "testnet" : "mainnet",
  });

  // Initialize the TON client for network interaction.
  const client4 = new TonClient4({ endpoint });

  // Get the latest block data from the network.
  const latestBlock = await client4.getLastBlock();

  // Check the smart contract's state on the blockchain.
  let status = await client4.getAccount(latestBlock.last.seqno, address);

  if (status.account.state.type !== "active") {
    console.log("Contract is not active"); // Stop execution if the contract is inactive.
    return;
  }

  // Generate a transfer link to send funds to the contract.
  let link =
    `https://tonhub.com/transfer/` +
    address.toString({
      testOnly: process.env.TESTNET ? true : false, // Specify testnet or mainnet.
    }) +
    "?" +
    qs.stringify({
      text: "Simple test transaction", // Message for the transaction.
      amount: toNano(0.05).toString(10), // Transaction amount in nanotons.
    });

  // Generate a QR code for the transfer link in the terminal.
  qrcode.generate(link, { small: true }, (code) => {
    console.log(code); // Print the QR code
  });

  // Variable to store the last known sender.
  let recent_sender_archive: Address;

  // Set up a periodic task to monitor the contract every 2 seconds.
  setInterval(async () => {
    const latestBlock = await client4.getLastBlock();

    // Call the `get_the_latest_sender` method from the contract.
    const { exitCode, result } = await client4.runMethod(
      latestBlock.last.seqno,
      address,
      "get_the_latest_sender"
    );

    if (exitCode !== 0) {
      console.log("Running getter method failed"); // Log an error if the method fails.
      return;
    }

    if (result[0].type !== "slice") {
      console.log("Unknown result type"); // Log an error if the result type is unexpected
      return;
    }

    // Extract the most recent sender's address from the result.
    let most_recent_sender = result[0].cell.beginParse().loadAddress();

    // Check if a new sender is detected and log it.
    if (
      most_recent_sender &&
      most_recent_sender.toString() !== recent_sender_archive?.toString()
    ) {
      console.log(
        "New recent sender found: " +
          most_recent_sender.toString({ testOnly: true })
      );
      recent_sender_archive = most_recent_sender;
    }
  }, 2000); // Interval set to 2 seconds..
}

// Execute the main script.
onchainTestScript();
