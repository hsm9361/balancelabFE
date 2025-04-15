import React, { useCallback, useRef } from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function ImageUploadSection({
  selectedImage,
  setSelectedImage,
  previewUrl,
  setPreviewUrl,
}) {
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [setSelectedImage, setPreviewUrl]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [setSelectedImage, setPreviewUrl]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleResetImage = useCallback(() => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setSelectedImage, setPreviewUrl]);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className={styles.uploadSection}>
      <div
        className={styles.imageUploadArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <div className={styles.previewContainer}>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            <div className={styles.previewOverlay}>
              <button
                className={styles.overlayButton}
                onClick={triggerFileInput}
                title="다른 이미지 선택"
              >
                🔄 변경
              </button>
              <button
                className={styles.overlayButton}
                onClick={handleResetImage}
                title="이미지 삭제"
              >
                🗑️ 삭제
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className={styles.uploadPlaceholder}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
              id="imageUpload"
              ref={fileInputRef}
            />
            <label htmlFor="imageUpload" className={styles.uploadLabel}>
              이미지 업로드
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploadSection;