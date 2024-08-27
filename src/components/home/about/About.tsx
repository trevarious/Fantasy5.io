import styles from "./About.module.css";

const About: React.FC = () => {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>About the Contract</h1>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h2 className={styles.heroRewardsSubTitle}>What is META5?</h2>
                        <p className={styles.heroPara}>
                            META5 is a Fantasy 5 lottery game that operates with draws every 20 minutes,
                            provided there is at least one player participating. The game allows players to
                            pick 5 numbers from a range of 1 to 36, and winners are determined based on how
                            many of their chosen numbers match the drawn numbers.
                        </p>

                        <h2 className={styles.heroRewardsSubTitle}>How It Works</h2>
                        <p className={styles.heroPara}>
                            The contract utilizes Chainlink VRF (Verifiable Random Function) for secure and
                            transparent random number generation. Additionally, Chainlink Automation ensures
                            that the draws occur automatically without manual intervention.
                        </p>

                        <h2 className={styles.heroRewardsSubTitle}>Technical Details</h2>
                        <ul className={styles.heroRewardsList}>
                            <li className={styles.heroRewardsListItem}>Deployed on the Sepolia testnet.</li>
                            <li className={styles.heroRewardsListItem}>Simulates a lottery game with automated draws.</li>
                            <li className={styles.heroRewardsListItem}>Players choose 5 numbers from 1 to 36.</li>
                            <li className={styles.heroRewardsListItem}>Winners are based on matching drawn numbers.</li>
                        </ul>

                        <h2 className={styles.heroRewardsSubTitle}>Additional Notes</h2>
                        <p className={styles.heroPara}>
                            In production, you might want to implement a fee structure to maintain Oracle
                            balances and ensure the sustainability of the contract.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
