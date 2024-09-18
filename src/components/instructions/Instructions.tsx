import {useState} from "react";
import styles from "./Instructions.module.css"; // Assuming you have a CSS module for styling
import { ConnectWallet } from "./ConnectWallet";

const Instructions: React.FC = () => {
    const [isLinkActive, setIsLinkActive]  = useState(false);
    const handleConnectWallet = () => {
        setIsLinkActive((prev: any) => !prev);


    }
    return (
        <>
        {isLinkActive == true ? (<ConnectWallet onStateChange={setIsLinkActive} />) : (<></>)}
        <div className={`${styles.container} ${isLinkActive ? styles.hide : styles.show}`}>
            <div className={styles.introContainer}>
            <h1 className={styles.title}>Instructions</h1>
            <p>Welcome to the Instructions page. Here you will find guidelines and tips on how to use the application.</p>
            </div>
            <ul>
                <li><strong>Step 1:</strong>Connect your wallet. Dont have a wallet? <a onClick={handleConnectWallet}>Click Me</a></li>
                <li><strong>Step 2:</strong> Choose a lottery option.</li>
                <li><strong>Step 3:</strong> Enter the lottery.</li>
                <li><strong>Step 4:</strong> Check the results.</li>
            </ul>
            <p>If you need further assistance, please contact support.</p>
        </div>
        </>
    );
};

export default Instructions;