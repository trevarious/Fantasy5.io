import { useState, useEffect } from "react";
import { useWeb3 } from '../web3/Web3';
import styles from './Ticket.module.css';
import ether from "../../assets/eth.png";
import quickPick from "../../assets/quick-pick.png";

// Generate an array of numbers from 1 to 36
const generateNumbers = () => Array.from({ length: 36 }, (_, i) => i + 1);

// Generate a Quick Pick of 5 unique random numbers
const generateQuickPick = (numbers: number[]) => {
    const shuffled = [...numbers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};

const Ticket = () => {
    const { userAccount, contract, web3 } = useWeb3();
    const [entranceFee, setEntranceFee] = useState<any>(null);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

    useEffect(() => {
        const fetchLotteryDetails = async () => {
            try {
                if (contract) {
                    const returns = await contract.methods.getLotteryDetails().call();
                    console.log("Ticket.jsx entranceFee: ", returns[3]);
                    setEntranceFee(web3?.utils.fromWei(returns[3], "ether"));
                } else {
                    console.log("Ticket.jsx: Contract not yet initialized.");
                }
            } catch (error) {
                console.error("There was an error retrieving LotteryStats(): ", error);
            }
        }
        fetchLotteryDetails();
    }, [contract]);

    const submitTicket = async () => {
        if (contract && web3 && userAccount) {
            try {
                if (selectedNumbers.length !== 5) {
                    console.error("Please select exactly 5 numbers");
                    return;
                }

                const value = web3.utils.toWei(entranceFee, "ether");

                // Sort the numbers and ensure they're uint8
                const sortedNumbers = selectedNumbers.sort((a, b) => a - b).map(num => Number(num));

                // Submit the ticket
                const result = await contract.methods.submitTicket(userAccount.address, sortedNumbers).send({
                    from: userAccount.address,
                    value: value
                });

                if (result) {
                    console.log("Ticket submitted successfully!");
                    setSelectedNumbers([]);  // Clear selected numbers after successful submission
                }
            } catch (err) {
                console.error("Error submitting ticket", err);
                if (err instanceof Error) {
                    console.error(err.message);
                }
            }
        }
    };

    const numbers = generateNumbers();

    const handleNumberClick = (num: number) => {
        setSelectedNumbers(prev => {
            if (prev.includes(num)) {
                return prev.filter(n => n !== num);
            } else if (prev.length < 5) {
                return [...prev, num];
            }
            return prev;
        });
    };

    const handleQuickPick = () => {
        const quickPickNumbers = generateQuickPick(numbers);
        setSelectedNumbers(quickPickNumbers);
    };

    return (
        <div className={styles.container}>
            <div className={styles.ticket}>
                <h1 className={styles.title}>PLAY</h1>
                <div className={styles.numbersgrid}>
                    {numbers.map(num => (
                        <button
                            key={num}
                            className={`${styles.numberButton} ${selectedNumbers.includes(num) ? styles.selected : ''}`}
                            onClick={() => handleNumberClick(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <div className={styles.selectedNumbers}>
                    <h2 className={styles.selectedNumbersTitle}>Selected Numbers</h2>
                    <div className={styles.numbersList}>
                        {selectedNumbers.sort((a, b) => a - b).join(', ')}
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <button
                        className={styles.submitTicketButton}
                        onClick={submitTicket}
                        disabled={selectedNumbers.length !== 5}
                    >
                        Submit<span className={styles.spanSubmitTicketButton}>({entranceFee} ETH<img src={ether} className={styles.ether}></img>)</span>
                    </button>

                    <button
                        className={styles.quickPickButton}
                        onClick={handleQuickPick}
                    >
                        <span><img src={quickPick} alt="qp" /></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
