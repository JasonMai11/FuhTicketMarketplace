import { Routes, Route} from 'react-router-dom'

// components
import Layout from './components/Layout'
import Sell from './components/Sell'
import Home from './components/Home'


function App() {

    return (
        <>        
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path = "/" index element = {<Home />} />
                <Route path = "sell" element = {<Sell />} />
            </Route>
        </Routes>
        </>

    );
}

export default App;