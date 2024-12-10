import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "ton-core";

/**
 * Type definition for the initial configuration of the main contract.
 * @typedef {Object} MainContractConfig
 * @property {number} number - The initial number configured in the contract.
 * @property {Address} address - The address associated with the contract.
 * @property {Address} owner_address - The owner's address for the contract.
 */
export type MainContractConfig = {
  number: number; 
  address: Address; 
  owner_address: Address; 
};

/**
 * Converts the main contract's configuration into a TON cell.
 * @param {MainContractConfig} config - The configuration object.
 * @returns {Cell} - The resulting cell containing the contract's configuration.
 */
export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32) // Stores the number in 32 bits.
    .storeAddress(config.address) // Stores the contract's address.
    .storeAddress(config.owner_address) // Stores the owner's address.
    .endCell(); // Completes the cell construction.
}

/**
 * Class representing the main contract in TON.
 */
/**
   * Creates an instance of MainContract.
   * @param {Address} address - The address of the contract.
   * @param {{ code: Cell, data: Cell }} [init] - The initial code and data for the contract.
   */
export class MainContract implements Contract {
  constructor(
    readonly address: Address, 
    readonly init?: { code: Cell; data: Cell } 
  ) {}


   /**
   * Creates a contract instance from a configuration.
   * @param {MainContractConfig} config - The configuration object.
   * @param {Cell} code - The contract's code cell.
   * @param {number} [workchain=0] - The workchain ID.
   * @returns {MainContract} - A new instance of the contract.
   */
  static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) { 
    const data = mainContractConfigToCell(config); // Converts config to cell.
    const init = { code, data }; // Initializes with code and data.
    const address = contractAddress(workchain, init); // Computes the contract's address.
    return new MainContract(address, init); // Returns a new contract instance.
  }

  /**
   * Sends a transaction to deploy the contract.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @param {Sender} via - The sender initiating the transaction.
   * @param {bigint} value - The amount of TONs to send.
   */
  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value, // Amount of TONs to send.
      sendMode: SendMode.PAY_GAS_SEPARATELY, // Payment method for gas.
      body: beginCell().storeUint(2, 32).endCell(), // Deploy message body.
    });
  }

  /**
   * Sends a transaction to increment a value in the contract.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @param {Sender} sender - The sender initiating the transaction.
   * @param {bigint} value - The amount of TONs to send.
   * @param {number} increment_by - The value to increment.
   */
  async sendIncrement(provider: ContractProvider, sender: Sender, value: bigint, increment_by: number) {
    const msg_body = beginCell()
      .storeUint(1, 32) // OP code for increment.
      .storeUint(increment_by, 32) // Value to increment by.
      .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  /**
   * Sends a transaction to deposit funds into the contract.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @param {Sender} sender - The sender initiating the transaction.
   * @param {bigint} value - The amount of TONs to send.
   */
  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell()
      .storeUint(2, 32) // OP code for deposit.
      .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  /**
   * Sends a deposit transaction without an operation code.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @param {Sender} sender - The sender initiating the transaction.
   * @param {bigint} value - The amount of TONs to send.
   */
  async sendNoCodeDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell().endCell(); // Empty message body.
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  /**
   * Sends a withdrawal request.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @param {Sender} sender - The sender initiating the transaction.
   * @param {bigint} value - The amount of TONs to send.
   * @param {bigint} amount - The amount to withdraw.
   */
  async sendWithdrawalRequest(provider: ContractProvider, sender: Sender, value: bigint, amount: bigint) {
    const msg_body = beginCell()
      .storeUint(3, 32) // OP code for withdrawal.
      .storeCoins(amount) // Amount to withdraw.
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  /**
   * Retrieves storage data from the contract.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @returns {Promise<{number: number, recent_sender: Address, owner_address: Address}>} - The storage data.
   */
  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_contract_storage_data", []); // Calls GET method.
    return {
      number: stack.readNumber(), // Read a stored number.
      recent_sender: stack.readAddress(), // Most recent sender address.
      owner_address: stack.readAddress(), // Owner address.
    };
  }

  /**
   * Retrieves the contract's balance.
   * @param {ContractProvider} provider - The provider handling the contract.
   * @returns {Promise<{number: number}>} - The balance.
   */
  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);  // Calls GET method for balance.
    return {
      number: stack.readNumber(), 
    };
  }
}
