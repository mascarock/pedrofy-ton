# Smart Contract on TON Blockchain

This project implements a smart contract for the TON (The Open Network) blockchain. It allows managing storage, balance, and withdrawal requests of funds on the TON network.

---

## Table of Contents

- [Installation](#installation)
- [Main Methods](#main-methods)
- [Frontend for Smart Contract](#frontend-for-smart-contract-on-ton)
- [Telegram Bot for Smart Contract Interaction](#telegram-bot-for-ton-blockchain-smart-contract-interaction)

---

## Installation

### Backend (Smart Contract on TON)

1. Clone this repository:
   ```bash
   git clone https://github.com/your_user/contract-ton.git
   cd contract-ton
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Deploy the contract:
   ```bash
   yarn build
   ```

4. Test the contract:
   ```bash
   yarn test
   ```

> **Note**: If you need to create a contract from scratch, you can implement a deployment script using `ton-core`. Make sure to have the specific TON tools correctly installed.

---

## Main Methods

1. **getData(provider: ContractProvider)**
   - Retrieves contract storage data.
   
   **Parameters:**
   - `provider`: Instance of `ContractProvider`.
   
   **Returns:**
   - An object with:
     - `number`: Stored number.
     - `recent_sender`: Most recent sender address.
     - `owner_address`: Owner's address.

2. **getBalance(provider: ContractProvider)**
   - Gets the current contract balance.
   
   **Parameters:**
   - `provider`: Instance of `ContractProvider`.
   
   **Returns:**
   - An object with:
     - `number`: Current contract balance.

3. **sendWithdrawalRequest(provider: ContractProvider, sender: Sender, value: bigint, amount: bigint)**
   - Sends a withdrawal request from the contract.

   **Parameters:**
   - `provider`: Instance of `ContractProvider`.
   - `sender`: Sender's address.
   - `value`: Amount of TON to send as a transaction fee.
   - `amount`: Amount to withdraw.

---

## Frontend for Smart Contract on TON

This project is a frontend interface to interact with a smart contract deployed on the TON network. It uses the `tonconnect` library to interact with users and perform transactions such as counter increments, deposits, and fund withdrawals.

### Features

- **Connection with TON**: Uses the `tonconnect` library to connect users to the TON network.
- **Interaction with the smart contract**: Allows users to interact with the smart contract, including:
  - Viewing the contract balance and address.
  - Viewing the current counter value.
  - Sending transactions to update the counter.
  - Requesting deposits into the contract.
  - Requesting withdrawals from the contract.
- **Simple user interface**: Displays the contract status and available actions in a clear and accessible manner.
- **Interactive alerts**: Uses WebApp to show alerts to users.

### Installation

1. Clone the repository:
   ```bash
   git clone <REPOSITORY_URL>
   cd first_contract_front_end
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the Project

1. Run the development environment:
   ```bash
   yarn dev
   ```

2. To build a production version:
   ```bash
   yarn build
   ```

### Functionality

- **Connection to the contract**: The project uses `useMainContract` to interact with the smart contract, retrieving information about the contract address, balance, and counter value.
- **TonConnect**: With `useTonConnect`, a connection is established with users to send and receive transactions, such as counter increments and deposits.
- **Interaction with the TON platform**: Uses the `@twa-dev/sdk` to show alerts to users when interacting with the contract.
- **Incrementing the counter**: Users can click a link to increment the counter in the contract.
- **Deposits and withdrawals**: Users can make 1 TON deposits and 0.7 TON withdrawal requests.

---

## Telegram Bot for Smart Contract Interaction

This project is a Telegram bot that interacts with a smart contract on the TON blockchain. The bot allows users to perform operations such as incrementing a counter, depositing, and withdrawing funds from the TON smart contract.

### Features

This bot provides three main options to users:

1. **Increment counter by 5**:
   - When selecting this option, the bot generates a transaction link to increment the counter in the smart contract. The transaction link is provided by Tonhub, which facilitates interaction with the TON blockchain.

2. **Deposit 1 TON**:
   - Users can deposit 1 TON into the smart contract. The bot generates a transaction link to sign and send the deposit.

3. **Withdraw 0.7 TON**:
   - Users can withdraw 0.7 TON from the contract. Similar to the other options, the bot generates a link to perform the withdrawal transaction.

### Requirements

- **Telegram Bot Token**: You will need a Telegram bot created with BotFather and its token to interact with the Telegram API.
- **.env**: The `.env` file must contain your Telegram bot token and the address of the TON smart contract.

### Installing Dependencies

1. Install dependencies:
   ```bash
   yarn install
   ```

### Creating a Bot on Telegram

1. Open Telegram and search for BotFather.
2. Start a conversation and use the `/newbot` command to create a new bot.
3. Follow the instructions to name your bot and get the authentication token.
4. Copy the bot token provided by BotFather.

### Creating a Web Application with the Bot

After creating the bot, you need to set up a Web Application in Telegram that is linked to the bot. This will allow users to interact with the bot through the web, especially for "Web App" options like deposit and withdrawal.

1. Create a new application for the bot:
   - Open Telegram and search for BotFather.
   - Start a conversation with BotFather.
   - Use the `/newapp` command to create a new web application linked to the bot.
   - BotFather will ask you to enter the application's name. This name will be visible to users.
   - Then, it will ask you to enter the URL of your web application. This URL must be HTTPS, as Telegram requires this security for Web Apps.

### Configuring the `.env` File

Create a `.env` file in the root of the project and add the following variables:

```bash
TG_BOT_TOKEN=your-telegram-bot-token
SC_ADDRESS=your-smart-contract-address-on-ton
```

Make sure to replace the values with your Telegram token and the address of your TON smart contract.

---

 
