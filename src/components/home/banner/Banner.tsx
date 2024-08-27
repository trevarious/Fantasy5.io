import styles from "./Banner.module.css";
import { Link } from 'react-router-dom';

const Banner: React.FC = () => {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>Big Prizes Await 💰</h1>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <p className={styles.heroPara}>
                            META5 leverages the power of Chainlink to provide autonomous draws every 20 minutes.
                        </p>
                        <p className={styles.heroPara}>
                            We offer verifiable randomness via Chainlink VRF to ensure players have a fair chance.
                        </p>
                        <p className={styles.heroPara}>
                            BIG prizes for jackpot winners relative to the contract balance.
                        </p>
                    </div>
                    <div className={styles.heroRewards}>
                        <h2 className={styles.heroRewardsTitle}>Special incentives to start a new draw!</h2>
                        <h3 className={styles.heroRewardsSubTitle}>Draw Initiator Revieves</h3>
                        <ul className={styles.heroRewardsList}>
                            <li className={styles.heroRewardsListItem}>
                                75% Discount on entry
                            </li>
                            <li className={styles.heroRewardsListItem}>
                                0.1% of total entry fees collected from previous round
                            </li>
                        </ul>
                        <div className={styles.howToPlayLink}>
                            <Link to="/instructions">How To Play</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Banner;
