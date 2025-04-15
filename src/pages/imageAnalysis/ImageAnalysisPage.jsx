import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';
import ImageUploadSection from 'components/imageAnalysis/ImageUploadSection';
import AnalysisInfoSection from 'components/imageAnalysis/AnalysisInfoSection';
import GuideCard from 'components/imageAnalysis/GuideCard';
import FooterSection from 'components/imageAnalysis/FooterSection'; // 새 컴포넌트
import { useImageUpload } from 'hooks/useImageUpload';

function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { uploadImage, loading, error } = useImageUpload('testUser');

  const handleAnalysis = async () => {
    if (!selectedImage) return;
    try {
      const result = await uploadImage(selectedImage);
      navigate('/analysis/result', {
        state: {
          imageUrl: previewUrl,
          imageFile: selectedImage,
          analysisResult: result,
        },
      });
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <div className={styles.analysisPage}>
      <header className={styles.header}>
        <h2 className={styles.title}>오늘의 한 끼 분석</h2>
        <p className={styles.description}>
          음식 사진을 업로드하면 AI가 영양 정보를 분석해드립니다!
        </p>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.uploadColumn}>
          <ImageUploadSection
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />
        </section>
        <section className={styles.infoColumn}>
          <GuideCard />
        </section>
      </main>
      <AnalysisInfoSection
        selectedImage={selectedImage}
        handleAnalysis={handleAnalysis}
      />
      <FooterSection /> {/* 하단 영역 추가 */}
      {loading && <div className={styles.loading}>분석 중...</div>}
      {error && <div className={styles.error}>에러: {error}</div>}
    </div>
  );
}

export default ImageAnalysisPage;