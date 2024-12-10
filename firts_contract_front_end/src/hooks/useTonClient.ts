import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from 'ton';
import { useAsyncInitialize } from './useAsyncInitialize';

/**
 * Custom hook to initialize a TonClient on the TON network.
 * This hook uses `useAsyncInitialize` to set up a TonClient instance 
 * that connects to a TON network endpoint (defaulting to `testnet`).
 * @function useTonClient
 * @returns {TonClient | undefined} 
 * Returns an initialized `TonClient` instance or `undefined` if it's not ready yet.
 */
export function useTonClient() {
   /**
   * Initialization function that creates a TonClient instance.
   * @async
   * @function
   * @returns {Promise<TonClient>} A promise that resolves to a TonClient instance.
   */
  return useAsyncInitialize(
    async () =>
      new TonClient({
        /**
         * TON network endpoint that TonClient will connect to.
         * In this case, the endpoint is obtained for the `testnet` network.
         */
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}