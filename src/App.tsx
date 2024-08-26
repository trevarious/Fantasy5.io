// src/App.tsx
import React from 'react';
import NavUpdate from "./components/nav/NavUpdate"
import Ticket from './components/ticket/Ticket';
import { Web3Provider } from '../src/components/web3/Web3';
import { AppProvider } from '../src/components/app-context/AppContext';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <AppProvider>
        <NavUpdate />
        <Ticket />
      </AppProvider>
    </Web3Provider>
  );
};

export default App;