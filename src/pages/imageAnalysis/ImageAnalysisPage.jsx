import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';
import ImageUploadSection from 'components/imageAnalysis/ImageUploadSection';
import AnalysisInfoSection from 'components/imageAnalysis/AnalysisInfoSection';

function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleAnalysis = () => {
    if (selectedImage) {
      navigate('/analysis/loading', {
        state: { imageUrl: previewUrl, imageFile: selectedImage },
      });
    }
  };

  return (
    <div className={styles.analysisContainer}>
      <ImageUploadSection
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
      />
      <AnalysisInfoSection
        selectedImage={selectedImage}
        handleAnalysis={handleAnalysis}
      />
    </div>
  );
}

export default ImageAnalysisPage;