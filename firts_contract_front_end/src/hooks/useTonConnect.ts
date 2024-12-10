import { useTonConnectUI } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from 'ton-core';

/**
 * Custom hook for interacting with TonConnect.
 * 
 * This hook provides an object that allows you to:
 * - Send transactions using `TonConnectUI`.
 * - Determine if a user is connected to TonConnect.
 * 
 * @returns {Object} Returns an object with the following properties:
 * - `sender` {Sender}: Object to send transactions.
 * - `connected` {boolean}: Indicates if the user is connected.
 */
export function useTonConnect(): { sender: Sender; connected: boolean } {
  /**
   * Access the TonConnectUI instance.
   * 
   * @type {TonConnectUIInstance} 
   */
  const [tonConnectUI] = useTonConnectUI();

  /**
   * Sends a transaction using TonConnectUI.
   * 
   * @async
   * @function send
   * @param {SenderArguments} args - Transaction arguments.
   * @param {Address} args.to - Recipient's address.
   * @param {bigint} args.value - Amount in nanotons.
   * @param {Cell} [args.body] - Optional payload in BOC cell format.
   * @returns {Promise<void>} A promise that resolves when the transaction is sent.
   */
  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(), // Recipient's address as a string.
              amount: args.value.toString(), // Amount as a string.
              payload: args.body?.toBoc().toString('base64'),  // Payload in base64, if present.
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // Approval deadline: 5 minutes.
        });
      },
    },
    connected: tonConnectUI.connected,
  };
}