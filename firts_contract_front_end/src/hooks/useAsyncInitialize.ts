import { useEffect, useState } from "react";

/**
 * Custom hook to initialize a resource asynchronously.
 * This hook executes an asynchronous function when dependencies change and stores the result in its internal state.
 * @template T The type of the resource to be initialized.
 * @param {() => Promise<T>} func - An asynchronous function that returns the resource to initialize.
 * @param {Array<any>} [deps=[]] - An array of dependencies that determines when the function should be re-executed.
 * @returns {T | undefined} The initialized resource or `undefined` while initialization is in progress.
 */

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: any[] = []
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}