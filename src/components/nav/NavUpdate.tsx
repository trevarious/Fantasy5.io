import React, { useEffect, useRef, useState } from "react";
import eth from '../../assets/eth.png';
import sepoliaEth from '../../assets/sepolia-eth.png';
import { contractAddress } from "../web3/contractAddress";
import { useWeb3 } from '../web3/Web3';
import styles from "./Nav.module.css";
import { FaBars, FaTimes } from 'react-icons/fa'; // Add this import for the hamburger icons

enum LotteryState {
    OPEN,
    CALCULATING,
    CLOSED
}

const Nav: React.FC = () => {
    const { userAccount, initializeWeb3, contract, web3 } = useWeb3();
    // const [hasCountdownStarted, setHasCountDownStarted] = useState<any>(null);
    const [countdownTime, setCountdownTime] = useState<any>(null);
    const [entranceFee, setEntranceFee] = useState<any>(null);
    const [lotteryState, setLotteryState] = useState<any>(null);
    const [numberOfPlayers, setNumberOfPlayers] = useState<any>(null);
    const [previousDraw, setPreviousDraw] = useState<any>(null);
    const [jackpotAmount, setJackpotAmount] = useState<any>(null);
    // const [lastJackpotPaidAmount, setLastJackpotPaidAmount] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

    const rightNavRef = useRef<HTMLDivElement>(null);

    const eject = async () => {
        try {
            await contract.methods.withdrawContractBalance().send({ from: userAccount?.address });
        } catch (error) {
            console.error(error);
        }
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const fetchCountdownTime = async () => {
        if (contract) {
            try {
                const nextDrawTimestamp = await contract.methods.timestampForNextDraw().call();
                setCountdownTime(parseInt(nextDrawTimestamp, 10)); // Ensure it's a number
            } catch (err) {
                console.error('Error fetching countdown time:', err);
            }
        }
    };

    const fetchLotteryState = async () => {
        try {
            const state = await contract.methods.viewLotteryState().call();
            console.log("Lottery state: ", state);
            setLotteryState(state);
        } catch (err: any) {
            console.error("Error fetching lottery state: ", err.message);
        }
    };

    const fetchLotteryDetails = async () => {
        try {
            if (contract) {
                const returns = await contract.methods.getLotteryDetails().call();
                console.log(returns);

                const jackpot: any = web3?.utils.fromWei(returns[7], "ether");
                const jackpotAmounts = parseFloat(jackpot).toFixed(2);

                setNumberOfPlayers(returns[1] ? parseInt(returns[1], 10) : null);
                setEntranceFee(web3?.utils.fromWei(returns[3], "ether"));
                setPreviousDraw(returns[6] ? returns[6].map(Number) : null);
                setJackpotAmount(jackpotAmounts);
                // setLastJackpotPaidAmount(returns[8] ? returns[8] : null);
                // setHasCountDownStarted(returns[9] ? returns[9] : null);

                fetchCountdownTime();
            } else {
                console.error("Contract is not initialized.");
            }
        } catch (error) {
            console.error("There was an error retrieving LotteryStats(): ", error);
        }
    };

    useEffect(() => {
        if (userAccount && contract) {
            fetchLotteryDetails();
            fetchLotteryState();
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
                setCountdownTime((prev: number) => prev > 0 ? prev - 1 : 0);
            } else if (countdownTime === 0) {
                console.log("Time for the draw!");
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownTime]);

    useEffect(() => {
        if (contract) {
            const ticketSubmittedEvent = contract.events.ticketSubmitted();
            ticketSubmittedEvent.on('data', (event: any) => {
                console.log('Ticket submitted:', event.returnValues);
            });

            return () => {
                ticketSubmittedEvent.removeAllListeners();
            };
        }
    }, [contract]);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.leftNav}>
                    {userAccount?.address === '0xa5AEB29CFC2f648525e0B064956A6b24458BD5B8' && (
                        <button onClick={eject}>eject</button>
                    )}
                    <a className={`${styles.title} ${styles.link}`}><span className={styles.titleSpan}>meta</span>Fantasty5</a>
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
                                rel="noopener noreferrer"
                            >
                                <span className={styles.truncatedAddress}>
                                    {formatAddress(contractAddress)}
                                </span>
                            </a>
                            <img src={sepoliaEth} alt="Sepolia ETH" className={styles.sepoliaImg} />
                        </div>
                    )}
                </div>
                <button className={styles.menuButton} onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <div className={`${styles.rightNav} ${isMenuOpen ? styles.show : ''}`} ref={rightNavRef}>
                    <div className={`${styles.draw}`}>
                        <ul className={styles.previousDraw}>
                            Last Win:
                            {previousDraw && previousDraw.map((number: any, index: any) => (
                                <>
                                    <li className={styles.previousWinningNumbers} key={index}>{` ${number}`}</li>
                                    <br></br>
                                </>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.rightNavItem}>
                        <div className={styles.numberOfPlayers}>
                            {numberOfPlayers !== null ? `Players: ${numberOfPlayers}` : 'Players: 0'}
                        </div>
                    </div>
                    <div className={styles.rightNavItem}>
                        <div className={styles.entranceFee}>
                            {entranceFee ? `Price: ${entranceFee}` : 'Offline'}
                        </div>
                        <img src={eth} className={styles.ethImg} alt="ETH" />
                    </div>
                    <div className={styles.rightNavItem}>
                        <div className={styles.jackpot}>
                            {jackpotAmount ? `Jackpot: ${jackpotAmount}` : 'Offline'}
                        </div>
                        <img src={eth} className={styles.ethImg} alt="ETH" />
                    </div>
                    <div className={styles.last}>
                        <div className={`${styles.rightNavItem} ${styles.rightNavItemLeft}`}>
                            <span>Lotto:</span>
                            <div className={`${styles.lotteryState} ${lotteryState === LotteryState.OPEN ? styles.lotteryStateOpen : lotteryState === LotteryState.CLOSED ? styles.lotteryStateClosed : styles.lotteryStateCalculating}`}>
                                {lotteryState !== null ? lotteryState : 'Offline'}
                            </div>
                        </div>
                        <div className={`${styles.rightNavItem} ${styles.rightNavItemRight}`}>
                            <span>Draw in:</span>
                            <div className={styles.nextDrawTimestamp}>
                                {countdownTime !== null ? (
                                    <div>
                                        {countdownTime}
                                    </div>
                                ) : 'Loading...'}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className={`${styles.rightNavSmallScreen} ${isMenuOpen ? styles.show : ''}`}>
                <h1 className={styles.smallScreenTitle}>
                    STATS
                </h1>
                <div className={styles.rightNavItem}>
                    <ul className={styles.previousDraw}>
                        Last Win:
                        {previousDraw && previousDraw.map((number: any, index: any) => (
                            <>
                                <li className={styles.previousWinningNumbers} key={index}>{` ${number}`}</li>
                                <br></br>
                            </>
                        ))}
                    </ul>
                </div>
                <div className={styles.rightNavItem}>
                    <div className={styles.numberOfPlayers}>
                        {numberOfPlayers !== null ? `Players: ${numberOfPlayers}` : 'Players: 0'}
                    </div>
                </div>
                <div className={styles.rightNavItem}>
                    <div className={styles.entranceFee}>
                        {entranceFee ? `Price: ${entranceFee}` : 'Offline'}
                    </div>
                    <img src={eth} className={styles.ethImg} alt="ETH" />
                </div>
                <div className={styles.rightNavItem}>
                    <div className={styles.jackpot}>
                        {jackpotAmount ? `Jackpot: ${jackpotAmount}` : 'Offline'}
                    </div>
                    <img src={eth} className={styles.ethImg} alt="ETH" />
                </div>
                <div className={styles.last}>
                    <div className={`${styles.rightNavItem} ${styles.rightNavItemLeft}`}>
                        <span>Lotto:</span>
                        <div className={`${styles.lotteryState} ${lotteryState === LotteryState.OPEN ? styles.lotteryStateOpen : lotteryState === LotteryState.CLOSED ? styles.lotteryStateClosed : styles.lotteryStateCalculating}`}>
                            {lotteryState !== null ? lotteryState : 'Offline'}
                        </div>
                    </div>
                    <div className={`${styles.rightNavItem} ${styles.rightNavItemRight}`}>
                        <span>Draw in:</span>
                        <div className={styles.nextDrawTimestamp}>
                            {countdownTime !== null ? (
                                <div>
                                    {countdownTime}
                                </div>
                            ) : 'Loading...'}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;
