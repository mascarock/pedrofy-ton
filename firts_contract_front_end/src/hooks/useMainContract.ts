import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

/**
 * Custom hook to interact with the main contract (`MainContract`) on the TON network.
 * 
 * This hook provides:
 * - Fetching contract data (counter value, recent sender, owner address).
 * - Checking the contract's balance.
 * - Sending specific transactions to the contract (increment, deposit, withdrawal request).
 * - Continuously monitoring contract data.
 * 
 * @function useMainContract
 * @returns {Object} An object with the following values and methods:
 * - `contract_address` {string | undefined}: The contract address.
 * - `contract_balance` {number | null}: The contract balance.
 * - `counter_value` {number | undefined}: The current counter value in the contract.
 * - `recent_sender` {Address | undefined}: The address of the most recent sender.
 * - `owner_address` {Address | undefined}: The owner address of the contract.
 * - `sendIncrement` {Function}: A method to send a transaction to increment the counter.
 * - `sendDeposit` {Function}: A method to send a deposit transaction.
 * - `sendWithrawalRequest` {Function}: A method to send a withdrawal request.
 */
export function useMainContract() {
  const client = useTonClient(); // TON client to interact with the network.
  const { sender } = useTonConnect(); // `sender` object to execute transactions.

  const sleep = (time: number) => 
    new Promise((resolve) => setTimeout(resolve, time));

  // State to store the contract data.
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  // State to store the contract balance.
  const [balance, setBalance] = useState<null | number>(0);

  // Initialize the main contract using the TON client.
  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQCS7PUYXVFI-4uvP1_vZsMVqLDmzwuimhEPtsyQKIcdeNPu") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  // Effect to continuously fetch and update contract data.
  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData(); // Fetch contract data.
      const balance  = await mainContract.getBalance(); // Fetch contract balance
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance.number);
      await sleep(5000); // Wait 5 seconds before the next query.
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      // Sends a transaction to increment the counter in the contract.
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
    sendDeposit: async ( ) => {
      // Sends a transaction to deposit funds into the contract.
      return mainContract?.sendDeposit(sender, toNano("1")) 
    },
    sendWithrawalRequest: async ()=>{
      // Sends a withdrawal request to the contract.
      return mainContract?.sendWithdrawalRequest(sender, toNano("0.05"), toNano("0.7"))
    }
  };
}