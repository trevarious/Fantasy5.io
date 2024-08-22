import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import { contractABI } from './contractABI';
import { contractAddress } from './contractAddress';

// Sepolia Network ID
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Hex ID for Sepolia

interface UserAccountState {
    address: string;
}

interface Web3ContextProps {
    userAccount: UserAccountState | null | any;
    error: string | null;
    web3: Web3 | null;
    contract: any; // Using 'any' here, but consider typing it properly if you can
    initializeWeb3: () => void;
    entranceFee: string | number | undefined;
}

const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userAccount, setUserAccount] = useState<UserAccountState | null>(null);
    const [entranceFee, setEntranceFee] = useState<string | number | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<any>(null); // Adjust type as needed

    const initializeWeb3 = useCallback(async () => {
        try {
            if (window.ethereum) {
                console.log('Ethereum provider detected');
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setUserAccount({ address: accounts[0] });
                    console.log(`Connected account: ${accounts[0]}`);

                    // Check the network
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    if (chainId !== SEPOLIA_CHAIN_ID) {
                        // Prompt user to switch to Sepolia network
                        setError('Please switch to the Sepolia network.');
                        alert('Please switch the the sepolia test net.');
                        try {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: SEPOLIA_CHAIN_ID }],
                            });
                            // Reinitialize contract after switching
                            const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                            setContract(contractInstance);
                            console.log('Contract initialized successfully');
                            await updateEntranceFee(); // Update entrance fee after switching network
                        } catch (switchError) {
                            console.error('Error switching network:', switchError);
                            setError('Error switching network.');
                        }
                    } else {
                        // Network is correct, initialize contract
                        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                        setContract(contractInstance);
                        console.log('Contract initialized successfully');
                        await updateEntranceFee(); // Fetch entrance fee on correct network
                    }
                } else {
                    console.warn('No accounts found.');
                    setError('No accounts found.');
                }
            } else {
                console.warn('Non-Ethereum browser detected.');
                setError('Non-Ethereum browser detected.');
                alert('Non-Ethereum browser detected. Please switch the the sepolia test net.');
            }
        } catch (err) {
            console.error('Web3 initialization error:', err);
            setError('Web3 initialization error.');
        }
    }, []);

    const updateEntranceFee = useCallback(async () => {
        try {
            if (contract) {
                const fee = await contract.methods.getEntranceFee().call();
                setEntranceFee(fee);
            }
        } catch (err) {
            console.error('Error fetching entrance fee:', err);
            setError('Error fetching entrance fee.');
        }
    }, [contract]);

    useEffect(() => {
        if (web3) {
            const handleAccountsChanged = async (accounts: string[]) => {
                if (accounts.length > 0) {
                    setUserAccount({ address: accounts[0] });
                    console.log(`Account changed: ${accounts[0]}`);
                    await updateEntranceFee(); // Update entrance fee when account changes
                } else {
                    setUserAccount(null);
                    console.warn('No accounts available after change.');
                }
            };

            const handleChainChanged = async () => {
                // Reinitialize on network change
                await initializeWeb3();
            };

            window.ethereum?.on('accountsChanged', handleAccountsChanged);
            window.ethereum?.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum?.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [web3, initializeWeb3, updateEntranceFee]);

    return (
        <Web3Context.Provider value={{ userAccount, error, web3, contract, initializeWeb3, entranceFee }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = React.useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
};
