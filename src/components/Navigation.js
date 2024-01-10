import { ethers } from 'ethers'
import { Link, NavLink } from 'react-router-dom'

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Token MarketPlace</h1>

        <input className='nav__search' type="text" placeholder='Find millions of experiences' />

        <ul className='nav__links'>
          <li><NavLink exact="true" to="/">Concerts</NavLink></li>
          <li><NavLink exact="true" to="/sports">Sports</NavLink></li>
          <li><NavLink exact="true" to="/arts">Arts & Theater</NavLink></li>
          <li><NavLink exact="true" to="/sell">Sell</NavLink></li>
        </ul>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
}

export default Navigation;