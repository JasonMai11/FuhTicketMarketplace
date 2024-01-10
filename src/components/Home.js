import { useEffect, useState } from "react";
import { ethers } from 'ethers';

// Components
import Navigation from './Navigation';
import Sort from './Sort';
import Card from './Card';
import SeatChart from './SeatChart';

// ABIs
import TokenMasterABI from '../abis/TokenMaster.json';

// Config
import config from '../config.json';

function Home() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [tokenMaster, setTokenMaster] = useState(null);

    const [events, setEvents] = useState([]);

    const [event, setEvent] = useState({})
    const [toggle, setToggle] = useState(false);

    const loadBlockChainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // get the current network
        const network = await provider.getNetwork();

        // get the contract address
        const address = config[network.chainId].TokenMaster.address

        // deploy the contract
        const tokenMaster = new ethers.Contract(address, TokenMasterABI, provider);
        setTokenMaster(tokenMaster);
        

        const totalEvents = await tokenMaster.totalEvents();
        const events = []
        for (var i = 1; i <= totalEvents; i++) {
            const event = await tokenMaster.getEvent(i);
            events.push(event);
        }
        setEvents(events);
        

        // Refresh Account (when the user changes their wallet, the account will update)
        window.ethereum.on("accountsChanged", async function() {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0]);
            setAccount(account);
            console.log(accounts[0], " is connected to the contract");
        })
        console.log('Connected to MetaMask');
    }

    useEffect(() => {
        loadBlockChainData();
    }, [])


    return (
        <div>
            <header>
                <Navigation account={account} setAccount={setAccount}/>
                <h2 className="header__title"><strong>Event</strong> Tickets</h2>
            </header>
            <Sort />
            <div className='cards'>
                {events.map((event, index) => (
                    <Card
                    event = {event}
                    id = {index + 1}
                    tokenMaster = {tokenMaster}
                    provider = {provider}
                    account = {account}
                    toggle = {toggle}
                    setToggle = {setToggle}
                    setEvent = {setEvent}
                    key = {index}
                    />
                ))}
            </div>
            {toggle && (
                <SeatChart
                event={event}
                tokenMaster={tokenMaster}
                provider={provider}
                setToggle={setToggle}
                />
            )}
        </div>
    );
}

export default Home;