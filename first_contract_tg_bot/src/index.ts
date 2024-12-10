import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { beginCell, toNano } from "ton-core";
import qs from "qs"
import { message } from "telegraf/filters";

dotenv.config()

/**
 * Telegram bot that interacts with a smart contract on the TON blockchain.
 * Provides options to increment a counter, deposit, and withdraw funds.
 */
const bot = new Telegraf(process.env.TG_BOT_TOKEN!);

/**
 * Smart contract address on the TON blockchain.
 * @constant {string}
 */
​​const SC_ADDRESS = "EQCS7PUYXVFI-4uvP1_vZsMVqLDmzwuimhEPtsyQKIcdeNPu";

/**
* Configures the `/start` command of the bot. Sends a welcome message with a custom keyboard.
*/
bot.start((ctx) =>
    ctx. reply ("Welcome to our counter app!", {
      reply_markup: {
        keyboard: [
          ["Increment by 5"],
          ["Deposit 1 TON"],
          ["Withdraw 0.7 TON"],
        ],
      },
    })
  );

  /**
  * Handles events for data received from web apps connected to the bot.
  */
  bot.on(message("web_app_data"), (ctx) => ctx.reply("ok"));

  /**
  * Handles the "Increment by 5" option.
  * Generates a transaction link to increment a counter in the smart contract.
  */
  bot.hears("Increment by 5", (ctx) => {
    const msg_body = beginCell().storeUint(1, 32).storeUint(5, 32).endCell();

    let link = `https://test.tonhub.com/transfer/${
      process.env.SC_ADDRESS
    }?${qs.stringify({
          text: "Increment by 5",
          amount: toNano ("0.05") . toString (10) ,
          bin: msg_body.toBoc({ idx: false }). toString ("base64"),
      })}`;

      ctx.reply("To increment counter by 5, please sign a transaction:", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Sign transaction",
                    url: link,
                }]
            ]
        }
  });
  
});

  /**
 * Handles the "Deposit 1 TON" option.
 * Generates a transaction link to deposit funds into the smart contract.
 */
  bot.hears("Deposit 1 TON", (ctx) => {
    const msg_body = beginCell().storeUint(2, 32).endCell();

    let link = `https://test.tonhub.com/transfer/${
      process.env.SC_ADDRESS
    }?${qs.stringify({
          text: "Deposit 1 TON",
          amount: toNano (1) . toString (10) ,
          bin: msg_body.toBoc({ idx: false }). toString ("base64"),
      })}`;

      ctx.reply("To deposir one TON, please sign a transaction:", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Sign transaction",
                    url: link,
                }]
            ]
        }
  });
  });

  /**
 * Handles the "Withdraw 0.7 TON" option.
 * Generates a transaction link to withdraw funds from the smart contract.
 */
  bot.hears("Withdraw 0.7 TON", (ctx) => {
    const msg_body = beginCell().storeUint(2, 32).storeCoins(toNano("0.7")).endCell();

    let link = `https://test.tonhub.com/transfer/${
      process.env.SC_ADDRESS
    }?${qs.stringify({
          text: "Withdraw 0.7 TON",
          amount: toNano ("0.07") . toString (10) ,
          bin: msg_body.toBoc({ idx: false }). toString ("base64"),
      })}`;

      ctx.reply("To Withdraw 0.7 TON, please sign a transaction:", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Sign transaction",
                    url: link,
                }]
            ]
        }
  });

  });

/**
 * Starts the Telegram bot.
 */
bot.launch();

  // Handles safe shutdown of the bot in case of system signals
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop ("SIGTERM"));
  