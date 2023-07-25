## Fraxlend Checker Bot

The **Fraxlend Checker Bot** is a Telegram bot designed to provide users with various functionalities related to Fraxlend, a lending platform that offers lending markets between a pair of ERC-20 assets. Each pair serves as an isolated market, enabling users to participate in lending and borrowing activities seamlessly.

### Fraxlend Overview:

Fraxlend is a lending platform that provides isolated lending markets between a pair of ERC-20 assets. It allows users to lend their ERC-20 assets and receive yield-bearing fTokens in return. These fTokens represent the users' share of the deposited assets and the generated interest. As interest is earned, the value of fTokens increases, providing an incentive for users to hold and accumulate them. Fraxlend's lending markets operate independently, offering users diverse opportunities to participate in decentralized finance (DeFi) activities.

### Features:

1. **Start Command**:
   Upon receiving the `/start` command, the bot welcomes the user with an image and displays available commands with the `/help` command.

2. **Help Command**:
   The `/help` command displays all available commands that users can use with the bot. It provides a list of commands and their functionalities.

3. **Scan Command**:
   The `/scan` command allows users to check their Frax balance in Ethereum and Polygon networks. It fetches the balance for the specified wallet address by making API calls to Etherscan and Polygonscan.

4. **Position Command**:
   The `/position` command fetches and sends the Fraxlend position details for the provided wallet address. It includes information about the borrowed and lent assets, deposited collateral, and daily history.

5. **Transaction Command**:
   The `/transaction` command fetches the last five Fraxlend transactions for the specified wallet address and displays the details, such as the transaction type, amount, pair, and timestamp.

6. **Alert Command**:
   The `/alert` command allows users to set up an alert for a wallet address. It prompts the user to provide their wallet address. Once provided, the bot saves the user's wallet address and chat ID to Database and schedules a cron job to send position details every 12 hours.

7. **Fetch and Send Positions (Cron Job)**:
   The bot periodically fetches saved wallet addresses from Database and sends their Fraxlend positions every 12 hours. It uses the GraphQL endpoint (Fraxlend Subgraph) to fetch the positions.

### How it works:

- Users interact with the bot using various commands.
- The bot fetches data from external APIs to provide the requested information.
- When the `/alert` command is used, the bot saves the user's wallet address and chat ID to Database.
- The bot schedules a cron job to periodically fetch and send positions for saved wallet addresses from database.


The Fraxlend Checker Bot simplifies the process of monitoring Fraxlend positions, transactions, and balances for users, enhancing their overall experience with the Fraxlend lending platform.

#### Example Command Reply:
![Screenshot 2023-07-26 015211](https://github.com/sambitsargam/Fraxlend-Telegram-bot/assets/70655824/5a0a1860-76c9-4a81-a135-972589859602)
![Screenshot 2023-07-26 015244](https://github.com/sambitsargam/Fraxlend-Telegram-bot/assets/70655824/82fd0703-fd2a-45d3-bbac-1151a71ec792)
![Screenshot 2023-07-26 015302](https://github.com/sambitsargam/Fraxlend-Telegram-bot/assets/70655824/b971e4f4-735a-4052-84ee-17d9331aae2b)
![Screenshot 2023-07-26 015531](https://github.com/sambitsargam/Fraxlend-Telegram-bot/assets/70655824/d0d65b8d-88a6-4d83-9b6f-e5408f4e785c)


