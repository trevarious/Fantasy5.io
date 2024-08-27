import styles from "./Instructions.module.css"; // Assuming you have a CSS module for styling

const Instructions: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1>Instructions</h1>
            <p>Welcome to the Instructions page. Here you will find guidelines and tips on how to use the application.</p>
            <ul>
                <li>Step 1: Connect your wallet.</li>
                <li>Step 2: Choose a lottery option.</li>
                <li>Step 3: Enter the lottery.</li>
                <li>Step 4: Check the results.</li>
            </ul>
            <p>If you need further assistance, please contact support.</p>
        </div>
    );
};

export default Instructions;