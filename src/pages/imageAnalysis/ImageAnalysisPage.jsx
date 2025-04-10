// pages/ImageAnalysisPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';
import ImageUploadSection from 'components/imageAnalysis/ImageUploadSection';
import AnalysisInfoSection from 'components/imageAnalysis/AnalysisInfoSection';
import { useImageUpload } from 'hooks/useImageUpload';

function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { uploadImage, loading, error, analysisResult } = useImageUpload('testUser'); // userId는 상황에 따라 동적으로 설정 가능

  const handleAnalysis = async () => {
    if (!selectedImage) return;

    try {
      const result = await uploadImage(selectedImage);
      // 분석 결과와 함께 로딩 페이지 또는 결과 페이지로 이동
      navigate('/analysis/result', {
        state: { 
          imageUrl: previewUrl, 
          imageFile: selectedImage, 
          analysisResult: result 
        },
      });
    } catch (err) {
      // 에러는 useImageUpload 훅에서 상태로 관리되므로 여기서 추가 처리 가능
      console.error('Analysis failed:', err);
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