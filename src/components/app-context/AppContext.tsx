// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from '../web3/Web3';
enum LotteryState {
    OPEN,
    CALCULATING,
    CLOSED
}
interface AppContextType {
    lotteryState: LotteryState;
    roundStartTimestamp: number | null;
    lastDrawTimestamp: number | null;
    entranceFee: any;
    numberOfPlayers: number | null;
    jackpotAmount: string | null;
    intervalForDraw: any;
    // previousDraw: number[] | null;
    withdrawContractBalance: () => void;
    refreshLotteryData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userAccount, contract, web3 } = useWeb3();
    const [lotteryState, setLotteryState] = useState<any>(null);
    const [roundStartTimestamp, setRoundStartTimestamp] = useState<number | null>(null);
    const [lastDrawTimestamp, setLastDrawTimestamp] = useState<number | null>(null);
    const [entranceFee, setEntranceFee] = useState<string | null>(null);
    const [numberOfPlayers, setNumberOfPlayers] = useState<number | null>(null);
    const [jackpotAmount, setJackpotAmount] = useState<string | null>(null);
    const [intervalForDraw, setIntervalForDraw] = useState<any>(null);
    // const [previousDraw, setPreviousDraw] = useState<number[] | null>(null);
    const withdrawContractBalance = async () => {
        if (contract && web3) {
            const result = await contract.methods.withdrawContractBalance().send({ from: userAccount.address });
            if (result) {
                alert("Eject succcessfull");
            } else {
                alert("error with method call eject()");
            }
        } else {
            console.log("error with the contract or web3 upon eject.");
        }
    }
    const refreshLotteryData = async () => {
        if (contract && web3) {
            try {
                const [state, lotteryDetails, playerDetails] = await Promise.all([
                    contract.methods.viewLotteryState().call(),
                    contract.methods.getLotteryDetails().call(),
                    contract.methods.getCurrentDrawPlayerDetails().call()
                ]);
                console.log("State: ", state);
                setLotteryState(state);
                setEntranceFee(web3.utils.fromWei(lotteryDetails[0], "ether"));
                setNumberOfPlayers(parseInt(playerDetails[1], 10));
                const jackpot = parseFloat(web3.utils.fromWei(lotteryDetails[1], "ether")).toFixed(2);
                setJackpotAmount(jackpot);
                // setPreviousDraw(lotteryDetails[2].map(Number));
                console.log("Round start timestamp: ", lotteryDetails[3]);
                console.log("Last draw timestamp: ", lotteryDetails[4]);
                setRoundStartTimestamp(parseInt(lotteryDetails[3], 10));
                setLastDrawTimestamp(parseInt(lotteryDetails[4], 10));
                setIntervalForDraw(lotteryDetails[5]);
            } catch (error) {
                console.error("Error refreshing lottery data:", error);
            }
        }
    };

    useEffect(() => {
        if (contract && web3) {
            refreshLotteryData();

            const intervalId = setInterval(refreshLotteryData, 30000); // Refresh every 30 seconds

            return () => clearInterval(intervalId);
        }
    }, [contract, web3]);

    return (
        <AppContext.Provider value={{
            lotteryState,
            roundStartTimestamp,
            lastDrawTimestamp,
            entranceFee,
            numberOfPlayers,
            jackpotAmount,
            intervalForDraw,
            // previousDraw,
            withdrawContractBalance,
            refreshLotteryData,

        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};