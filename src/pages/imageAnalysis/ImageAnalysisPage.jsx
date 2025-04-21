import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';
import ImageUploadSection from 'components/imageAnalysis/ImageUploadSection';
import AnalysisInfoSection from 'components/imageAnalysis/AnalysisInfoSection';
import GuideCard from 'components/imageAnalysis/GuideCard';
import FooterSection from 'components/imageAnalysis/FooterSection';
import CustomModal from '../../components/common/CustomModal';
import { useImageUpload } from 'hooks/useImageUpload';

function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const navigate = useNavigate();
  const { uploadImage, loading } = useImageUpload('');

  const handleAnalysis = async () => {
    if (!selectedImage) {
      setModalState({
        isOpen: true,
        title: '이미지 선택 필요',
        message: '분석할 음식 사진을 먼저 선택해주세요.',
      });
      return;
    }

    try {
      const result = await uploadImage(selectedImage);
      console.log('Analysis result:', result); // Debugging log
      navigate('/analysis/image-analysis/result', {
        state: {
          imageUrl: previewUrl,
          imageFile: selectedImage,
          analysisResult: result,
        },
      });
    } catch (err) {
      console.error('Analysis error:', err.message); // Debugging log
      setModalState({
        isOpen: true,
        onConfirm: false,
        title: '분석 오류',
        message: err.message || '분석 중 오류가 발생했습니다.',
      });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  return (
    <div className={styles.analysisPage}>
      <header className={styles.header}>
        <h2 className={styles.title}>이미지 분석</h2>
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
      <FooterSection />
      {loading && <div className={styles.loading}>분석 중...</div>}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
      />
    </div>
  );
}

export default ImageAnalysisPage;