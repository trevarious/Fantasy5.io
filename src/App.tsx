import React from 'react';
import NavUpdate from "./components/nav/NavUpdate"
import Ticket from './components/ticket/Ticket';
import { Web3Provider } from './components/web3/Web3'; // Import the Web3Provider

const App: React.FC = () => {
  return (
    <Web3Provider>
      <NavUpdate />
      {/* Other components that need Web3 context */}
      <Ticket />
    </Web3Provider >
  );
};

export default App;
