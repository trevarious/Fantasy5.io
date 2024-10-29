import { FC } from 'react';
import styles from "./ConnectWallet.module.css";
import metaMask from "../../assets/metamask.webp";

interface ConnectWalletProps {
    onStateChange: (updater: (prev: boolean) => boolean) => void;
}

export const ConnectWallet: FC<ConnectWalletProps> = ({ onStateChange }) => {
    const handleClick = () => {
        onStateChange((prev: boolean) => !prev);
    }

    return (
        <>
            <h1 className={styles.backButton} onClick={handleClick}>⬅️</h1>
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Setting Up Your Wallet</h1>
                </div>
                <div className={styles.linkContainer}>
                    <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                        <p className={styles.titleLink}>Quick Download</p>
                    </a>
                    <img src={metaMask} alt="metamask logo" width={20} />
                </div>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>How A Wallet Works</h2>
                    <p>To connect with Dapps, you must do so through a wallet. Your wallet will act as your identity, allow you access to the web3 space.</p>
                    <p>Your identity remains anonymous and you will be identified only through your public address.</p>
                    <p>Information stored from interactions you make on Dapps will be accessible through your public address, ensuring you have access to data you store on-chain</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>How To Interact With A Dapp</h2>
                    <p>From your laptop, you may interact with Dapps by downloading a wallet extension that will connect you to any Dapp.</p>
                    <p>Upon landing on A dapps site, it will often ask you for permission to connect your wallet to the Dapp. This is crucial to ensure data related to your interactions are associated with your wallets address. After granting permission, you are free to interact with the dapp</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Costs Of Interacting With Dapps</h2>
                    <p>Since data storage and retrieval cost computational effort, a fee is accrued from interacting with the blockchain. This is known as gas and is paid with ETH.</p>
                    <p>Interacting and updating the state of a dapp will cost gas, simple reads do not. Visit{' '}
                        <a href="https://ethereum.foundation/" target="_blank" rel="noopener noreferrer">Ethereum</a>
                        {' '}official site to learn more about the technology</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Benefits Of Having A Wallet</h2>
                    <p>Interacting with Dapps through your own wallet means that you have complete control over your funds and data stored on chain.</p>
                    <p>With this comes great responsibility, as you will be in control of your keys. This means if you lose keys to your wallet, you will not be able to recover anything. Be sure to keep your keys safe!</p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Recommended Wallet</h2>
                    <p>Metamask is the most widely used wallet in web3. We recommend downloading the browser extension so you can have quick access to all Dapps.</p>
                    <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Official Site</a>
                </section>
            </div>
        </>
    );
};