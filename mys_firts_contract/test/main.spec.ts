import { Cell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"; 
import { MainContract } from "../wrappers/MainContract";
import "@ton/test-utils"; 
import { compile } from "@ton/blueprint"; 


/**
 * Test suite for the `main.fc` contract.
 */
/**
 *  @type {Blockchain} Blockchain instance for testing.
 *  @type {SandboxContract<MainContract>} The main contract deployed in the sandbox.
 *  @type {SandboxContract<TreasuryContract>} Initial wallet for testing.
 *  @type {SandboxContract<TreasuryContract>} Owner's wallet.
 *  @type {Cell} Compiled contract code.
 */

describe("main.fc contract tests", () => {
  let blockchain: Blockchain;
  let myContract: SandboxContract<MainContract>;
  let initWallet: SandboxContract<TreasuryContract>; 
  let ownerWallet: SandboxContract<TreasuryContract>; 
  let codeCell: Cell; 

  /**
   * Compiles the contract before starting the test suite.
   */
  beforeAll(async () => {
    codeCell = await compile("MainContract");
  });

  /**
   * Sets up the test environment before each test case.
   */
  beforeEach(async () => {
    blockchain = await Blockchain.create(); // Creates a new blockchain instance.
    initWallet = await blockchain.treasury("initWallet"); // Creates an initialization wallet.
    ownerWallet = await blockchain.treasury("ownerWallet"); // Creates an owner wallet.

    // Opens the contract in the blockchain using the initial configuration.
    myContract = blockchain.openContract(
      await MainContract.createFromConfig(
        {
          number: 0, // Initial number for the contract.
          address: initWallet.address, // Initial contract address.
          owner_address: ownerWallet.address, // Owner's address.
        },
        codeCell  // Compiled contract code.
      )
    );
  });

  /**
   * Verifies the most recent sender address in the contract's storage.
   */
  it("should get the proper most recent sender address", async () => {
    const senderWallet = await blockchain.treasury("sender"); // Creates a sender wallet.

    // Sends an increment request from the sender wallet.
    const sentMessageResult = await myContract.sendIncrement(
      senderWallet.getSender(), // Sender's address.
      toNano("0.05"), // Transaction value.
      5 // Increment value.
    );

    // Verifies the transaction was successful.
    expect(sentMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    // Retrieves the contract data to validate.
    const data = await myContract.getData();

    expect(data.recent_sender.toString()).toBe(senderWallet.address.toString()); // Checks the correct address.
    expect(data.number).toEqual(1); // Verifies the incremented number.
  });

  /**
   * Tests successful deposit of funds.
   */
  it("successfully deposits funds", async () => {
    const senderWallet = await blockchain.treasury("sender"); // Creates a sender wallet.

    // Sends a deposit to the contract.
    const depositMessageResult = await myContract.sendDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    // Verifies the transaction was successful.
    expect(depositMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    // Retrieves the contract's balance.
    const balanceRequest = await myContract.getBalance();

    expect(balanceRequest.number).toBeGreaterThan(toNano("4.99")); // Verifies the correct balance.
  });

  /**
   * Ensures deposits without a command are refunded.
   */
  it("should return deposit funds as no command is sent", async () => {
    const senderWallet = await blockchain.treasury("sender"); // Creates a sender wallet.

    // Envía un depósito sin comando específico.
    const depositMessageResult = await myContract.sendNoCodeDeposit(
      senderWallet.getSender(),
      toNano("5")
    );

    // Verifies the funds were refunded.
    expect(depositMessageResult.transactions).toHaveTransaction({
      from: myContract.address,
      to: senderWallet.address,
      success: true,
    });

    // Checks the contract balance to ensure it is empty.
    const balanceRequest = await myContract.getBalance();

    expect(balanceRequest.number).toEqual(0); // Verifies the correct balance after refund.
  });

   /**
   * Tests successful withdrawal by the owner.
   */
  it("successfully withdraws funds on behalf of owner", async () => {
    const senderWallet = await blockchain.treasury("sender"); // Creates a sender wallet.

    // Sends a preliminary deposit.
    await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

    // Sends a withdrawal request as the owner.
    const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
      ownerWallet.getSender(), // Owner's address.
      toNano("0.05"), // Gas fee.
      toNano(1) // Amount to withdraw.
    );

    // Verifies the transaction was successful.
    expect(withdrawalRequestResult.transactions).toHaveTransaction({
      from: myContract.address,
      to: ownerWallet.address,
      success: true,
      value: toNano(1),
    });
  });

  /**
   * Ensures withdrawals by non-owners are rejected.
   */
  it("fails to withdraw funds on behalf of non-owner", async () => {
    const senderWallet = await blockchain.treasury("sender"); // Creates a sender wallet.

    // Sends a preliminary deposit.
    await myContract.sendDeposit(senderWallet.getSender(), toNano("5"));

    // Attempts a withdrawal from an unauthorized wallet.
    const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
      senderWallet.getSender(),
      toNano("0.5"),
      toNano("1")
    );

    // Verifies the transaction was rejected.
    expect(withdrawalRequestResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: false,
      exitCode: 103, // Error code for "unauthorized"
    });
  });

  /**
   * Ensures withdrawals fail due to insufficient balance.
   */
  it("fails to withdraw funds because lack of balance", async () => {
    // Attempts a withdrawal without sufficient balance.
    const withdrawalRequestResult = await myContract.sendWithdrawalRequest(
      ownerWallet.getSender(),
      toNano("0.5"),
      toNano("1")
    );

    // Verifies the transaction was rejected.
    expect(withdrawalRequestResult.transactions).toHaveTransaction({
      from: ownerWallet.address,
      to: myContract.address,
      success: false,
      exitCode: 104, // Error code for "insufficient funds".
    });
  });
});
