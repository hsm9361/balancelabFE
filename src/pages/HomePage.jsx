import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/css/pages/Home.module.css';
import ImageSlider from '../components/main/ImageSlider';
import CallToAction from '../components/main/CallToAction';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ImageSlider />
        <CallToAction navigate={navigate} />
      </div>
    </div>
  );
};

export default HomePage;