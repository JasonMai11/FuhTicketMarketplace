const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    // Setup accounts & variables
    const [deployer] = await ethers.getSigners()
    const NAME = "FuhToken"
    const SYMBOL = "FUH"
    const chainId = network.config.chainId;

    // Deploy contract
    const TokenMaster = await ethers.getContractFactory("TokenMaster")
    const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)
    await tokenMaster.deployed()

    console.log(`Deployed TokenMaster Contract at: ${tokenMaster.address}\n`)


      // List 6 events
  const _events = [
    {
      name: "UFC Miami",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL"
    },
    {
      name: "ETH Tokyo",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan"
    },
    {
      name: "ETH Privacy Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul"
    },
    {
      name: "Dallas Mavericks vs. San Antonio Spurs",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX"
    },
    {
      name: "ETH Global Toronto",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada"
    }
  ]

  for (var i = 0; i < 5; i++) {
    const transaction = await tokenMaster.connect(deployer).list(
      _events[i].name,
      _events[i].cost,
      _events[i].tickets,
      _events[i].date,
      _events[i].time,
      _events[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${_events[i].name}`)
  }
    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying...")
        await verify(tokenMaster.address, [NAME, SYMBOL])
    }

}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});