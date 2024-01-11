Welcome to FuhTicketMarket Place Repo:

Solidity Contract Functionality:
List Events, Sell Tickets, Withdraw earnings on Web3.

Sell and Buy Tickets on a decentralized web application!

Features:
(Required Functionality)
- A user can connect their wallet to this smart contract
- A user can switch connected wallets

(Side Functionality)
- A user can sell tickets for a concert they are hosting
- A user can buy tickets from various concerts if they have enough ETH
- [Temporary] only the owner/deployer of the contract can withdraw the ETH

(Functionalities in progress)
- A user can list individual seating for a concert
- Multiple Users can list concerts (**currently restricted to only deployer**)
    - ^ Leads to an individual user that is not the owner being able to withdraw from the contract
- A user is able to apply filtering 
- A user is able to apply Search
- A user is able to see their current tokens/tickets they possess
- A user is able to list a ticket from their own wallet



Instructions:

** For Testing with Hardhat (Localhost): **
1) run command [npx hardhat node]
    - this will run nodes where you can use hardhat wallets with ETH already supplied.

2) run command [npx hardhat run scripts/01-deploy-market.js --network localhost]
    - this will deploy the script to deploy the market (contract)

3) run command [npm run start]
    - this will deploy the front end of the website to begin interacting with your smart contract