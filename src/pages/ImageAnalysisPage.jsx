import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalysis = () => {
    if (selectedImage) {
      navigate('/analysis/result', { 
        state: { 
          imageUrl: previewUrl,
        } 
      });
    }
  };

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.uploadSection}>
        <div className={styles.imageUploadArea}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          ) : (
            <div className={styles.uploadPlaceholder}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className={styles.uploadLabel}>
                이미지 업로드
              </label>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.infoSection}>
        <h2 className={styles.title}>오늘의 한끼</h2>
        <p className={styles.description}>
          음식사진 전체를 찍어야 정확도가 올라가요
        </p>
        <button 
          className={styles.analysisButton}
          onClick={handleAnalysis}
          disabled={!selectedImage}
        >
          분석시작
        </button>
      </div>
    </div>
  );
}

export default ImageAnalysisPage; 