import { Address } from "@ton/core";

// Raw address in hexadecimal format.
const rawAddress = "a3935861f79daf59a13d6d182e1640210c02f98e3df18fda74b8f5ab141abf18";

/**
 * Converts a raw hexadecimal address into a user-friendly address format for the TON network.
 * @param rawAddress - The unprocessed address in hexadecimal format.
 * @returns A string representing the address in a user-friendly format.
 */
function convertToFriendlyAddress(rawAddress: string): string {
    // Create an Address instance with workchain 0 (default) and the raw address.
    const address = new Address(0, Buffer.from(rawAddress, "hex"));

    // Convert the address to a user-friendly format (readable string).
    return address.toString();
}

// Convert the raw address to a friendly format.
const friendlyAddress = convertToFriendlyAddress(rawAddress);

// Log the friendly address to the console.
console.log("Dirección en formato amigable:", friendlyAddress);
