const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fetch = require("node-fetch");
const cron = require("node-cron");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const botToken = "YOUR_TELEGRAM_BOT_TOKEN";
// GraphQL endpoint (Fraxlend Subgraph)
const apiUrl =
  "https://api.thegraph.com/subgraphs/name/frax-finance-data/fraxlend-subgraph---mainnet";
const bot = new TelegramBot(botToken, {
  polling: true,
  parse_mode: "MarkdownV2",
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const imageCaption =
    "Welcome to the Fraxlend Checker Bot!\n/help - Show available commands";

  bot.sendPhoto(
    chatId,
    "https://www.tbstat.com/wp/uploads/2022/09/20220913_FraxFinance3-1200x675.jpg",
    {
      caption: imageCaption,
    }
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Here are the available commands:
/start - Start the bot
/help - Show available commands
/position {wallet address} - Fetch the fraxlend position for a wallet address
/transaction {wallet address} - Fetch the Last 5 fraxlend transactions for a wallet address
/scan {wallet address} - Fetch the frax balance for a wallet address
/alert - Set up an alert for a wallet address`
  );
});

bot.onText(/\/scan (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const walletAddress = match[1].trim();
  bot.sendMessage(chatId, `🔍 Fetching the balances .....`);

  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x853d955aCEf822Db058eb8505911ED77F175b99e&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balance = response.data.result;
    const balanceInfrax = balance / 1e18;

    const responses = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balances = responses.data.result;
    const balanceInfraxs = balances / 1e18;

    const responsess = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balancess = responsess.data.result;
    const balanceInfr = balancess / 1e18;

    const respons = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x5E8422345238F34275888049021821E8E08CAa1f&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balanc = respons.data.result;
    const balan = balanc / 1e18;

    const polyresponse = await axios.get(
      `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89&address=${walletAddress}&tag=latest&apikey=YXY6D6M6QRG8IKPFE8ND8IUNQ2C69YZDMS`
    );
    const polybalance = polyresponse.data.result;
    const polybalanceInfrax = polybalance / 1e18;

    const polyresponses = await axios.get(
      `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=0x1a3acf6D19267E2d3e7f898f42803e90C9219062&address=${walletAddress}&tag=latest&apikey=YXY6D6M6QRG8IKPFE8ND8IUNQ2C69YZDMS`
    );
    const polybalances = polyresponses.data.result;
    const polybalanceInfraxs = polybalances / 1e18;

    const polyrespons = await axios.get(
      `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=0xEe327F889d5947c1dc1934Bb208a1E792F953E96&address=${walletAddress}&tag=latest&apikey=YXY6D6M6QRG8IKPFE8ND8IUNQ2C69YZDMS`
    );
    const polybalanc = polyrespons.data.result;
    const polybalan = polybalanc / 1e18;
    

    bot
      .sendMessage(
        chatId,
        `🔍 Wallet Address: ${walletAddress}\n\n💰 Balance (in Ethereum): ${balanceInfrax} FRAX\n Frax Share Balance: ${balanceInfraxs} FXS \n Frax Price Index: ${balanceInfr} FPI \n Frax Ether Balance: ${balan} frxETH \n\n💰 Balance (in Polygon): ${polybalanceInfrax} FRAX\n Frax Share Balance: ${polybalanceInfraxs} FXS  \n Frax Ether Balance: ${polybalan} frxETH`
      )
      .then(() => {
        // Generate the etherscan.io tokenholdings link
        const etherscanLink =
          "https://etherscan.io/token/0x853d955acef822db058eb8505911ed77f175b99e?a=" +
          walletAddress;

        // Create the button and link markup
        const inlineKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "View Token Holdings",
                  url: etherscanLink,
                },
              ],
            ],
          },
        };

        bot.sendMessage(
          chatId,
          "Click the button below to view your token holdings:",
          inlineKeyboard
        );
      })
      .catch((error) => {
        bot.sendMessage(
          chatId,
          "❌ An error occurred while fetching the balance. Please try again later."
        );
      });
  } catch (error) {
    bot.sendMessage(
      chatId,
      "❌ An error occurred while fetching the balance. Please try again later."
    );
  }
});

const fetchAndSendPositions = (chatId, walletAddress) => {
  const variables = {
    user: { id: walletAddress },
  };

  const query = `
    query fraxlendUsers($user: User_filter) {
      users( where: $user) {
        id
        actions(orderBy: timestamp, orderDirection: desc) {
          ...fraxlendUserActions
        }
        positions {
          ...fraxlendPositionSummary
          dailyHistory(orderBy: timestamp, orderDirection: desc) {
            lentAssetShare
            lentAssetValue
            lendDepositedAsset
            lendProfitTaken
            borrowedAssetShare
            borrowedAssetValue
            borrowPaidInterest
            borrowWithdrawnAsset
            depositedCollateralValue
            depositedCollateralAmount
            timestamp
          }
        }
        roleUpdates(orderBy: timestamp, orderDirection: desc) {
          pair {
            id
            name
          }
          setTo
          type
          timestamp
        }
      }
    }
    
    fragment fraxlendUserActions on Action {
      pair {
        id
        name
      }
      type
      amount
      share
      token {
        symbol
        decimals
      }
      timestamp
    }
    
    fragment fraxlendPositionSummary on Position {
      borrowedAssetShare
      lentAssetShare
      depositedCollateralAmount
      timestamp
      pair {
        address
        name
        pauseStatus
        maxLTV
        asset {
          id
          symbol
          decimals
        }
        collateral {
          id
          symbol
          decimals
        }
        oracleDivideAddress {
          id
          decimals
        }
        oracleMultiplyAddress {
          id
          decimals
        }
        dailyHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
          totalAssetShare
          totalAssetAmount
          totalBorrowShare
          totalBorrowAmount
          totalBorrowValue
          totalAssetValue
          totalCollateral
          totalCollateralValue
          exchangeRate
          interestPerSecond
          utilization
          timestamp
        }
      }
    }
  `;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Check if response data contains the expected structure
      const users = data.data.users;
      if (!users || users.length === 0) {
        console.error("Invalid response data structure:", data);
        bot.sendMessage(chatId, "❌ No Positions found.");
        return;
      }
      const positions = users[0].positions;

      if (positions.length === 0) {
        bot.sendMessage(chatId, "❌ No Positions found.");
        return;
      }

      // Build the message with position details
      let message = "";
      positions.forEach((position, index) => {
        const pair = position.pair;
        const latestDailyHistory = position.dailyHistory[0];

        // Extract relevant details
        const pairName = pair.name;
        const depositedCollateralAmount = position.depositedCollateralAmount;
        const lentAssetValue = latestDailyHistory.lentAssetValue;
        const lentAssetShare = latestDailyHistory.lentAssetShare;
        const lendDepositedAsset = latestDailyHistory.lendDepositedAsset;
        const lendProfitTaken = latestDailyHistory.lendProfitTaken;
        // Extract the borrowed asset details
        const borrowedAssetShare = latestDailyHistory.borrowedAssetShare;
        const borrowedAssetValue = latestDailyHistory.borrowedAssetValue;
        const borrowPaidInterest = latestDailyHistory.borrowPaidInterest;
        const borrowWithdrawnAsset = latestDailyHistory.borrowWithdrawnAsset;

        // Check if there is no lending position for the pair
        if (lentAssetValue == 0) {
          // Add the borrowing position details
          message += `Pair: ${pairName}\n`;
          message += `Deposited Collateral Amount: ${
            depositedCollateralAmount / 1e18
          } FRAX\n`;
          message += `Borrowed Asset Value: ${
            borrowedAssetValue / 1e18
          } FRAX\n`;
          message += `Borrow Paid Interest: ${
            borrowPaidInterest / 1e18
          } FRAX\n`;
          message += `Daily History:\n`;
          message += `Borrowed Asset Share: ${
            borrowedAssetShare / 1e18
          } FRAX\n`;
          message += `Borrowed Asset Value: ${
            borrowedAssetValue / 1e18
          } FRAX\n`;
          message += `Borrow Withdraw Asset: ${
            borrowWithdrawnAsset / 1e18
          } FRAX\n\n`;
        } else {
          // Add the lending position details
          message += `Lending Position ${index + 1}:\n\n`;
          message += `Pair: ${pairName}\n`;
          message += `Deposited Collateral Amount: ${
            depositedCollateralAmount / 1e18
          } FRAX\n`;
          message += `Lent Asset Value: ${lentAssetValue / 1e18} FRAX\n`;
          message += `Lend Profit Taken: ${lendProfitTaken / 1e18} FRAX\n`;
          message += `Daily History:\n`;
          message += `Lent Asset Share: ${lentAssetShare / 1e18} FRAX\n`;
          message += `Lent Asset Value: ${lentAssetValue / 1e18} FRAX\n`;
          message += `Lend Deposited Asset: ${
            lendDepositedAsset / 1e18
          } FRAX\n\n`;
        }
      });
      // Send the positions to the desired chat ID
      bot.sendMessage(chatId, message);
    })
    .catch((error) => {
      console.error("Error:", error);
      bot.sendMessage(chatId, "An error occurred while fetching positions.");
    });
};

bot.onText(/\/position (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const walletAddress = match[1].trim();

  // Fetch and send the positions immediately
  fetchAndSendPositions(chatId, walletAddress);
});

const fetchTransactionDetails = async (walletAddress) => {
  const query = `
    query fraxlendUsers($user: User_filter) {
      users( where: $user) {
        id
        actions(orderBy: timestamp, orderDirection: desc) {
          ...fraxlendUserActions
        }
        positions {
          ...fraxlendPositionSummary
          dailyHistory(orderBy: timestamp, orderDirection: desc) {
            lentAssetShare
            lentAssetValue
            lendDepositedAsset
            lendProfitTaken
            borrowedAssetShare
            borrowedAssetValue
            borrowPaidInterest
            borrowWithdrawnAsset
            depositedCollateralValue
            depositedCollateralAmount
            timestamp
          }
        }
        roleUpdates(orderBy: timestamp, orderDirection: desc) {
          pair {
            id
            name
          }
          setTo
          type
          timestamp
        }
      }
    }
    
    fragment fraxlendUserActions on Action {
      pair {
        id
        name
      }
      type
      amount
      share
      token {
        symbol
        decimals
      }
      timestamp
    }
    
    fragment fraxlendPositionSummary on Position {
      borrowedAssetShare
      lentAssetShare
      depositedCollateralAmount
      timestamp
      pair {
        address
        name
        pauseStatus
        maxLTV
        asset {
          id
          symbol
          decimals
        }
        collateral {
          id
          symbol
          decimals
        }
        oracleDivideAddress {
          id
          decimals
        }
        oracleMultiplyAddress {
          id
          decimals
        }
        dailyHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
          totalAssetShare
          totalAssetAmount
          totalBorrowShare
          totalBorrowAmount
          totalBorrowValue
          totalAssetValue
          totalCollateral
          totalCollateralValue
          exchangeRate
          interestPerSecond
          utilization
          timestamp
        }
      }
    }
  `;

  const variables = {
    user: { id: walletAddress },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  const transactions = data.data.users[0].actions;
  return transactions;
};

const formatTransactionDetails = (transactions) => {
  return transactions.slice(0, 5).map((transaction) => {
    const { pair, type, amount, token, timestamp } = transaction;
    const { symbol, decimals } = token;
    const formattedAmount = Number(amount) / Math.pow(10, Number(decimals));
    const formattedTimestamp = new Date(
      Number(timestamp) * 1000
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let formattedTransaction = `${formattedTimestamp}\n`;
    formattedTransaction += `${type}\n`;
    formattedTransaction += `${formattedAmount} ${symbol}\n`;
    formattedTransaction += `${pair.name}\n`;

    return formattedTransaction;
  });
};

// Listen for '/transaction' command
bot.onText(/\/transaction (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const walletAddress = match[1].trim();

  // Fetch transaction details for the provided wallet address
  fetchTransactionDetails(walletAddress)
    .then((transactions) => {
      const formattedTransactions = formatTransactionDetails(transactions);
      if (formattedTransactions.length === 0) {
        bot.sendMessage(chatId, "No transactions found.");
        return;
      }

      const message =
        "Recent Transactions:\n\n" + formattedTransactions.join("\n\n");
      // Send the message through the Telegram bot
      bot.sendMessage(chatId, message);
    })
    .catch((error) => {
      console.error("Error:", error);
      bot.sendMessage(
        chatId,
        "An error occurred while fetching transaction details."
      );
    });
});

// Create an object to store the chatId and wallet address pairs
const userWallets = {};

// Function to save user data to Firebase Realtime Database
const saveUserDataToFirebase = () => {
  const firebaseDatabaseUrl =
    "https://telegram-fraxlend-tracker-bot-default-rtdb.firebaseio.com/wallet.json";
  fetch(firebaseDatabaseUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userWallets),
  })
    .then(() => {
      console.log("Data saved to Firebase Realtime Database.");
    })
    .catch((error) => {
      console.error("Error saving data to Firebase Realtime Database:", error);
    });
};

// ... Rest of the code remains the same ...

// Listen for '/alert' command
bot.onText(/\/alert/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Please provide your wallet address to set up the alert:"
  );

  // Listen for the next message (wallet address)
  bot.once("message", (walletMsg) => {
    const walletAddress = walletMsg.text.trim();
    if (walletAddress) {
      userWallets[chatId] = { walletAddress };
      saveUserDataToFirebase(); // Save user data to Firebase Realtime Database
      bot.sendMessage(chatId, `Alert set for wallet address: ${walletAddress}`);
      // Start the cron job to send position details every 10 minutes
      startAlertCron(chatId, walletAddress);
    } else {
      bot.sendMessage(chatId, "Invalid wallet address. Please try again.");
    }
  });
});

// Function to fetch saved data from the Firebase Realtime Database
const fetchSavedDataFromFirebase = () => {
  const firebaseDatabaseUrl = "https://telegram-fraxlend-tracker-bot-default-rtdb.firebaseio.com/wallet.json";
  fetch(firebaseDatabaseUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // Fetch positions for each saved wallet address
        Object.entries(data).forEach(([chatId, { walletAddress }]) => {
          fetchAndSendPositions(chatId, walletAddress);
        });
      } else {
        console.log('No data found in Firebase.');
      }
    })
    .catch((error) => {
      console.error('Error fetching data from Firebase:', error);
    });
};

// Schedule the function to fetch and send positions every 1 minute
cron.schedule('0 */12 * * *', () => {
  console.log('Fetching and sending positions...');
  fetchSavedDataFromFirebase();
});

// Listen for messages
// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;

//   // Check if the message is a command
//   if (msg.text && msg.text.startsWith("/")) {
//     // Process the command
//     // ...
//   } else {
//     // Send a reply for invalid commands
//     bot.sendMessage(
//       chatId,
//       "This is not a valid command. Please enter a valid command.( /help for all available commands.)"
//     );
//   }
// });
