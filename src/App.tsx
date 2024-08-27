// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavUpdate from './components/nav/Nav';
import Ticket from './components/ticket/Ticket';
import Home from './components/home/Home';
import Instructions from './components/instructions/Instructions';
import { Web3Provider } from './components/web3/Web3';
import { AppProvider } from './components/app-context/AppContext';
import ScrollHandler from '../src/utils/ScrollHandler';

const App: React.FC = () => {
  return (
    <Router>
      <Web3Provider>
        <AppProvider>
          <ScrollHandler />
          <div>
            <NavUpdate />
            <Routes>
              <Route path="/" element={<Home />} /> {/* Default route */}
              <Route path="/play" element={<Ticket />} />
              <Route path="/instructions" element={<Instructions />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </AppProvider>
      </Web3Provider>
    </Router>
  );
};

export default App;
