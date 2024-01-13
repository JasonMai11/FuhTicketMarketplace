**Welcome to FuhTicketMarket Place Repo:**

Solidity Contract Functionality:
List Events, Sell Tickets, and Withdraw earnings on Web3.

Sell and Buy Tickets on a decentralized web application!

Features:
(Required Functionality)
- A user can connect their wallet to this smart contract
- A user can switch connected wallets

(Side Functionality)
- A user can sell tickets for a concert they are hosting
- A user can buy tickets from various concerts if they have enough ETH
- [Temporary] Only the owner/deployer of the contract can withdraw the ETH

(Functionalities in progress)
- A user can list individual seating for a concert
- Multiple Users can list concerts (**currently restricted to only deployer**)
    - ^ Leads to an individual user who is not the owner being able to withdraw from the contract
- A user is able to apply filtering 
- A user is able to apply Search
- A user is able to see the current tokens/tickets they possess
- A user is able to list a ticket from their own wallet



**Instructions:**

**Deploying on Localhost (Hardhat)**
1) run command [npx hardhat node]
    - this will run nodes where you can use hardhat wallets with ETH already supplied.
2) run command [npx hardhat run scripts/01-deploy-market.js --network localhost]
    - this will deploy the script to deploy the market (contract)
3) run command [npm run start]
    - this will deploy the front end of the website to begin interacting with your smart contract

**Deploying on Testnet (Sepolia):**
1) Run the same commands as usual, but when deploying the script, make sure to use the command below:
[npx hardhat run scripts/02-deploy-market.js --network sepolia]
2) Running this script will also verify the contract on etherscan.
[https://sepolia.etherscan.io/address/0xc0be87D01E963EF6Da25559c24d8fBE612B51d29#code] <- contract verification from etherscan.
3) To reflect these changes, make sure the contract address deployed matches the sepolias contract address in config.json in the src folder.
