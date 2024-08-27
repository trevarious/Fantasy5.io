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
    contract: any;
    drawHistory: any;
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
    const [drawHistory, setDrawHistory] = useState<any[]>([]); // Update state type as needed

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
                    contract.methods.getCurrentDrawPlayerDetails().call(),

                ]);
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
    const getDrawHistory = async () => {
        try {
            // Fetch the current draw ID
            const drawIdString = await contract.methods.drawId().call();
            const drawId = parseInt(drawIdString, 10);

            if (contract && drawId) {
                const numPreviousDraws = 10;
                const historyPromises: Promise<any>[] = [];

                for (let i = 0; i < numPreviousDraws; i++) {
                    const currentDrawId = drawId - i - 1;
                    if (currentDrawId < 1) break;

                    historyPromises.push(
                        contract.methods.getRoundHistory(currentDrawId).call()
                            .then((result: any) => {
                                // Ensure proper conversion from BigInt (if needed)
                                const timestamp = parseInt(result[0], 10);
                                const winningNumbers = result[1].map(Number);
                                const prizeTiers = result[2].map(Number);
                                const winnerTiers = result[3].map(Number);

                                return {
                                    timestamp,
                                    winningNumbers,
                                    prizeTiers,
                                    winnerTiers
                                };
                            })
                            .catch((error: any) => ({
                                error: error.message
                            }))
                    );
                }

                const historyResults = await Promise.all(historyPromises);
                console.log("History details for past draws: ", historyResults);
                setDrawHistory(historyResults as any);
            } else {
                alert("Contract not initialized or drawId not set.");
            }
        } catch (error: any) {
            console.error("Error fetching draw history. ERROR: ", error.message);
        }
    };

    useEffect(() => {
        if (contract && web3) {
            refreshLotteryData();

            const intervalId = setInterval(refreshLotteryData, 30000); // Refresh every 30 seconds

            return () => clearInterval(intervalId);
        }
    }, [contract, web3]);
    useEffect(() => {
        if (contract && web3) {
            getDrawHistory();
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
            contract,
            drawHistory,
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