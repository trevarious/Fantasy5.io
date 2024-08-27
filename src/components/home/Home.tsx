import React from 'react';
import Banner from "./banner/Banner";
import About from "./about/About";
import styles from "./Home.module.css";


const Home: React.FC = () => {

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <Banner />
            </div>
            <div className={styles.section}>
                <About />
            </div>
        </div>
    );
};

export default Home;
