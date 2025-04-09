import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 Balance Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 