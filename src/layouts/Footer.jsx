import React from 'react';
import styles from '../assets/css/layouts/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 Balance Lab. All rights reserved. test</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 