import React, { useEffect, useRef, useState } from "react";
import eth from '../../assets/eth.png';
import sepoliaEth from '../../assets/sepolia-eth.png';
import { contractAddress } from "../web3/contractAddress";
import { useWeb3 } from '../web3/Web3';
import styles from "./Nav.module.css";

enum LotteryState {
    OPEN,
    CALCULATING,
    CLOSED
}

const Nav: React.FC = () => {
    const { userAccount, initializeWeb3, contract, web3 } = useWeb3();
    const [countdownTime, setCountdownTime] = useState<number | null>(null);
    const [entranceFee, setEntranceFee] = useState<string | null>(null);
    const [contractBalance, setContractBalance] = useState<string | null>(null);
    const [lotteryState, setLotteryState] = useState<LotteryState | null | string>(null);
    const [numberOfPlayers, setNumberOfPlayers] = useState<number | null>(null);
    const rightNavRef = useRef<HTMLDivElement>(null);

    const formatAddress = (address: string) => {
        return `${address.slice(0, 2)}...${address.slice(-5)}`;
    };

    const fetchCountdownTime = async () => {
        if (contract) {
            try {
                const timeLeft = await contract.methods.viewTimeLeftToDraw().call();
                setCountdownTime(parseInt(timeLeft));
            } catch (err) {
                console.error('Error fetching countdown time:', err);
            }
        }
    };

    const fetchNavStats = async () => {
        if (web3 && contract) {
            try {
                // Determine if there are any players
                const numOfPlayers = await contract.methods.viewNumberOfPlayers().call();
                if (numOfPlayers > 0) {
                    setNumberOfPlayers(numberOfPlayers);
                }
                // Fetch entrance fee
                const entranceFeeResult = await contract.methods.viewEntranceFee().call();
                const entranceFeeInETH = web3.utils.fromWei(entranceFeeResult, "ether") || '0.00';
                setEntranceFee(entranceFeeInETH);

                // Fetch contract balance
                const contractAddress = contract.options.address;
                const contractBalanceResult = await web3.eth.getBalance(contractAddress);
                const contractBalanceInETH = web3.utils.fromWei(contractBalanceResult, "ether") || '0.00';
                setContractBalance(contractBalanceInETH);

                // Fetch lottery state
                const result = await contract.methods.viewFantasy5State().call();
                const lotteryState = LotteryState[result as keyof typeof LotteryState];
                setLotteryState(lotteryState);

                // Fetch countdown time
                await fetchCountdownTime();

            } catch (err) {
                console.error('Error fetching nav stats:', err);
                // Optionally, handle specific errors for each fetch if needed
            }
        } else {
            setEntranceFee(null);
            setContractBalance(null);
            setLotteryState(null);
            setNumberOfPlayers(null);
        }
    };

    useEffect(() => {
        if (userAccount && contract) {
            fetchNavStats();
        }
    }, [userAccount, contract, web3]);

    useEffect(() => {
        if (contract && rightNavRef.current) {
            rightNavRef.current.style.visibility = 'visible';
        }
    }, [contract]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (countdownTime !== null && countdownTime > 0) {
                setCountdownTime(prev => prev !== null ? prev - 1 : null);
            } else if (countdownTime === 0) {
                // Timer finished, you can trigger the draw here
                console.log("Time for the draw!");
                fetchCountdownTime(); // Refresh countdown
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownTime]);


    useEffect(() => {
        if (contract) {
            const ticketSubmittedEvent = contract.events.ticketSubmitted();
            ticketSubmittedEvent.on('data', (event: any) => {
                console.log('Ticket submitted:', event.returnValues);
                fetchCountdownTime();
            });

            return () => {
                ticketSubmittedEvent.removeAllListeners();
            };
        }
    }, [contract]);
    // const eject = async () => {
    //     try {
    //         await contract.methods.withdrawContractBalance().send({ from: userAccount?.address });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    return (
        <nav className={styles.nav}>
            <div className={styles.leftNav}>

                <a className={`${styles.title} ${styles.link}`}>Fantasty5</a>
                {!userAccount ? (
                    <button onClick={initializeWeb3} className={`${styles.contractAddress} ${styles.link}`}>
                        Connect Wallet
                    </button>
                ) : (
                    <div className={styles.addressContainer}>
                        <a
                            className={styles.address}
                            href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                            target="_blank"
                        >
                            <span className={styles.truncatedAddress}>
                                {formatAddress(contractAddress)}
                            </span>
                        </a>
                        <img src={sepoliaEth} alt="Sepolia ETH" className={styles.sepoliaImg} />
                    </div>
                )}
            </div>

            <div className={styles.rightNav} ref={rightNavRef}>
                {countdownTime !== null && (
                    <div className={`${styles.countdown} ${styles.rightNavItem}`}>
                        Draw in: {Math.floor(countdownTime / 60)}:{(countdownTime % 60).toString().padStart(2, '0')}
                    </div>
                )}
                <div className={styles.rightNavItem}>
                    <div className={styles.entranceFee}>
                        {entranceFee ? `Ticket Price: ${entranceFee}` : 'Offline'}
                    </div>
                    <img src={eth} className={styles.ethImg} />
                </div>
                <div className={styles.rightNavItem}>
                    <div className={styles.contractBalance}>
                        {contractBalance ? `TVL: ${contractBalance}` : 'Offline'}
                    </div>
                    <img src={eth} className={styles.ethImg} />
                </div>
                <div className={`${styles.rightNavItem}`}>
                    <span>Lotto:</span>
                    <div className={` ${styles.lotteryState} ${lotteryState == "OPEN" ? styles.lotteryStateOpen : lotteryState == "CLOSED" ? styles.lotteryStateClosed : styles.lotteryStateCalculating}`}>
                        {lotteryState ? ` ${lotteryState}` : 'Offline'}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
