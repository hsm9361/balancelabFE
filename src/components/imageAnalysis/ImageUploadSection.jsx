import React, { useCallback, useRef } from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function ImageUploadSection({
  selectedImage,
  setSelectedImage,
  previewUrl,
  setPreviewUrl,
  disabled,
}) {
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback(
    (event) => {
      if (disabled) return; // 비활성화 상태에서는 업로드 불가
      const file = event.target.files[0];
      if (file) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [setSelectedImage, setPreviewUrl, disabled]
  );

  const handleDrop = useCallback(
    (event) => {
      if (disabled) return; // 비활성화 상태에서는 드롭 불가
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    },
    [setSelectedImage, setPreviewUrl, disabled]
  );

  const handleDragOver = useCallback((event) => {
    if (disabled) return; // 비활성화 상태에서는 드래그 오버 무시
    event.preventDefault();
  }, [disabled]);

  const handleResetImage = useCallback(() => {
    if (disabled) return; // 비활성화 상태에서는 리셋 불가
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setSelectedImage, setPreviewUrl, disabled]);

  const triggerFileInput = useCallback(() => {
    if (disabled || !fileInputRef.current) return; // 비활성화 상태에서는 클릭 무시
    fileInputRef.current.click();
  }, [disabled]);

  return (
    <div className={styles.uploadSection}>
      <div
        className={`${styles.imageUploadArea} ${disabled ? styles.disabled : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <div className={styles.previewContainer}>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            <div className={`${styles.previewOverlay} ${disabled ? styles.disabledOverlay : ''}`}>
              <button
                className={`${styles.overlayButton} ${disabled ? styles.disabledButton : ''}`}
                onClick={triggerFileInput}
                title="다른 이미지 선택"
                disabled={disabled}
              >
                🔄 변경
              </button>
              <button
                className={`${styles.overlayButton} ${disabled ? styles.disabledButton : ''}`}
                onClick={handleResetImage}
                title="이미지 삭제"
                disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
            <label
              htmlFor="imageUpload"
              className={`${styles.uploadLabel} ${disabled ? styles.disabledLabel : ''}`}
            >
              이미지 업로드
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploadSection;