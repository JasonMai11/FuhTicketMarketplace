const { expect } = require("chai");

const TOKEN_NAME = "FuhToken";
const TOKEN_SYMBOL = "FUH";

// Test Event Variables
const EVENT_NAME = "LCK Finals";
const EVENT_PRICE = ethers.utils.parseUnits('1', 'ether');
const EVENT_TICKETS = 100;
const EVENT_DATE = "January 20, 2024";
const EVENT_TIME = "8:00PM EST";
const EVENT_LOCATION = "Seoul, South Korea";

describe("TokenMaster", function () { 

    let tokenMaster;
    let deployer, ticketBuyer;

    beforeEach(async function () {
        // Setting up accounts
        [deployer, ticketBuyer] = await ethers.getSigners()
        // Getting the Contract
        const TokenMaster = await ethers.getContractFactory("TokenMaster"); 
        // Deploying the Contract with the constructor arguments
        tokenMaster = await TokenMaster.deploy(TOKEN_NAME, TOKEN_SYMBOL);
    })

    describe("Deployment", function () {

        it("Sets the name of the Token", async function () {
            let name = await tokenMaster.name();
            expect(name).to.equal(TOKEN_NAME);
        })

        it("Sets the symbol of the Token", async function () {
            let symbol = await tokenMaster.symbol();
            expect(symbol).to.equal(TOKEN_SYMBOL);
        })

        it("Sets the owner of the Contract", async function () {
            let owner = await tokenMaster.i_owner();
            expect(owner).to.equal(deployer.address);
        })
    })

    describe("Handling One Event", function () {

        beforeEach(async function () {
            // .connect() is used to send transactions from a specific account (the deployer will handle all transactions, not the contract itself)
            // which is why we use connect() to send transactions from the deployer account
            const transactionResponse = await tokenMaster.connect(deployer).list(EVENT_NAME, EVENT_PRICE, EVENT_TICKETS, EVENT_DATE, EVENT_TIME, EVENT_LOCATION);
            // wait one block to confirm transaction
            const transactionReciept = await transactionResponse.wait(1);
        })

        it("Updates the number of events when event is listed", async function () {
            expect(await tokenMaster.getTotalEvents()).to.equal(1);
        })

        it("The event contains the proper information", async function() {
            const _event = await tokenMaster.getEvent(1)
            expect(_event.name).to.equal(EVENT_NAME);
            expect(_event.price).to.equal(EVENT_PRICE); 
            expect(_event.remainingTickets).to.equal(EVENT_TICKETS);
            expect(_event.date).to.equal(EVENT_DATE);
            expect(_event.time).to.equal(EVENT_TIME);
            expect(_event.location).to.equal(EVENT_LOCATION);
        })

        it("Only the owner is allowed to post an event", async function() {
            expect(tokenMaster.connect(ticketBuyer)
                .list(EVENT_NAME, EVENT_PRICE, EVENT_TICKETS, EVENT_DATE, EVENT_TIME, EVENT_LOCATION))
                .to.be.revertedWith("NOT__OWNER()");
        })

    })

    describe("Minting", function (){
        const ID = 1;       // first event
        const SEAT = 50;    // 50th seat
        const AMOUNT = ethers.utils.parseUnits('1', 'ether'); // 1 ether

        beforeEach(async function () {
            const ticketResponse = await tokenMaster.connect(deployer).list(EVENT_NAME, EVENT_PRICE, EVENT_TICKETS, EVENT_DATE, EVENT_TIME, EVENT_LOCATION);
            const ticketReciept = await ticketResponse.wait(1);
            const transactionResponse = await tokenMaster.connect(ticketBuyer).mint(ID, SEAT, {value: AMOUNT});
            const transactionReciept = await transactionResponse.wait(1);
        })

        it("Ticket count has updated (+1 to totalTickets)", async function () {
            expect(await tokenMaster.totalTickets()).to.equal(1); 
        })
        it("Amount of event tickets should be less by 1", async function () {
            const _event = await tokenMaster.getEvent(1)
            expect(_event.remainingTickets).to.equal(EVENT_TICKETS - 1);
        })
        it("Check if the buyer has the seat", async function () {
            const status = await tokenMaster.hasTicket(ID, ticketBuyer.address);
            expect(status).to.equal(true);
        })
        it("Checks if the seat has been taken by the correct buyer", async function() {
            const owner = await tokenMaster.seatTaken(ID, SEAT);
            expect(owner).to.equal(ticketBuyer.address);
        })
        it("Checks if the seat has been added into the array of taken seats", async function() {
            const seatsArray = await tokenMaster.getSeatsTaken(ID);
            expect(seatsArray.length).to.equal(1);
            expect(seatsArray[0]).to.equal(SEAT);
        })
        it("Updates the contract balance", async function() {
            const balance = await ethers.provider.getBalance(tokenMaster.address);
            expect(balance).to.equal(AMOUNT);
        })

    })

    describe("Withdrawing", function () {
        const ID = 1;       // first event
        const SEAT = 50;    // 50th seat
        const AMOUNT = ethers.utils.parseUnits('1', 'ether'); // 1 ether
        let balanceBefore;

        beforeEach(async function () {
            balanceBefore = await ethers.provider.getBalance(deployer.address);
            const ticketResponse = await tokenMaster.connect(deployer).list(EVENT_NAME, EVENT_PRICE, EVENT_TICKETS, EVENT_DATE, EVENT_TIME, EVENT_LOCATION);
            const ticketReciept = await ticketResponse.wait(1);
            const transactionResponse = await tokenMaster.connect(ticketBuyer).mint(ID, SEAT, {value: AMOUNT});
            const transactionReciept = await transactionResponse.wait(1);
        })

        it("Updates the contract balance", async function() {
            const contractBalance = await ethers.provider.getBalance(tokenMaster.address);
            expect(contractBalance).to.equal(AMOUNT);
        })
        it("Updates the owner's balance upon withdrawal", async function() {
            const balanceAfter = await tokenMaster.withdraw();
            await balanceAfter.wait(1);
            const contractBalance = await ethers.provider.getBalance(tokenMaster.address);
            const ownerBalance = await ethers.provider.getBalance(deployer.address);
            expect(contractBalance).to.equal(0);
            expect(ownerBalance).to.be.greaterThan(balanceBefore);
            
        })
    })

})