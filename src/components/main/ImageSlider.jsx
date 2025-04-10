import React, { useState, useEffect } from 'react';
import styles from 'assets/css/pages/Home.module.css';
import foodPlateImage1 from 'assets/images/main01.jpeg';
import foodPlateImage2 from 'assets/images/main02.jpeg';
import foodPlateImage3 from 'assets/images/main03.jpeg';

const ImageSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [foodPlateImage1, foodPlateImage2, foodPlateImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // 4초마다 전환
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.imageContainer}>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`건강한 식단 ${index + 1}`}
          className={`${styles.mainImage} ${
            index === currentImage ? styles.active : ''
          }`}
        />
      ))}
    </div>
  );
};

export default ImageSlider;