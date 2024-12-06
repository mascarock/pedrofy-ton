import { Address } from "@ton/core";

const rawAddress = "a3935861f79daf59a13d6d182e1640210c02f98e3df18fda74b8f5ab141abf18";

function convertToFriendlyAddress(rawAddress: string): string {
    // Crear una instancia de Address con el workchain 0 y la dirección sin procesar
    const address = new Address(0, Buffer.from(rawAddress, "hex"));

    // Convertir la dirección al formato amigable
    return address.toString(); // Formato amigable
}

const friendlyAddress = convertToFriendlyAddress(rawAddress);

console.log("Dirección en formato amigable:", friendlyAddress);
