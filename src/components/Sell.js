import React, { useState } from 'react';
import { ethers } from 'ethers';
import TokenMasterABI from '../abis/TokenMaster.json'

const Sell = ({ tokenMaster, provider }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [numberOfTickets, setNumberOfTickets] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');

    // Listing an event
    const handleListEvent = async (_event) => {
        _event.preventDefault();

        if (!provider) {
            console.error('Provider is not available');
            return;
        }

        const signer = provider.getSigner();
        const listContract = new ethers.Contract(tokenMaster.address, TokenMasterABI, signer);

        try {
            const transaction = await listContract.list(
                name.toString(),
                ethers.utils.parseUnits(price.toString(), 'ether'),
                Number(numberOfTickets),
                date.toString(),
                time.toString(),
                location.toString()
            );

            await transaction.wait();
            console.log('Event listed successfully');
        } catch (error) {
            console.error('Error listing the event:', error);
        }
    };

    // Withdrawing
    const handleWithdraw = async () => {
        if (!provider) {
            console.error('Provider is not available');
            return;
        }

        try {
            const signer = provider.getSigner();
            const withdrawContract = new ethers.Contract(tokenMaster.address, TokenMasterABI, signer);
            const transaction = await withdrawContract.withdraw();
            await transaction.wait();
            console.log('Withdrawal successful');
        } catch (error) {
            console.error('Error during withdrawal:', error);
        }
    };

    return (
        <>  
            <h1>Create an Event!</h1>
            <form onSubmit={handleListEvent}>
                <input type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} />
                <input type="text" placeholder="Price (ETH)" value={price} onChange={e => setPrice(e.target.value)} />
                <input type="number" placeholder="Number of Tickets" value={numberOfTickets} onChange={e => setNumberOfTickets(e.target.value)} />
                <input type="text" placeholder="Date" value={date} onChange={e => setDate(e.target.value)} />
                <input type="text" placeholder="Time" value={time} onChange={e => setTime(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <button type="submit">List Event</button>
            </form>

            <button onClick={handleWithdraw}>Withdraw Funds</button>

        </>
    );
};

export default Sell;
