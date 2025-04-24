import React, { useCallback, useRef } from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function ImageUploadSection({
  selectedImage,
  setSelectedImage,
  previewUrl,
  setPreviewUrl,
  disabled,
  onInvalidFile, // 에러 콜백
}) {
  const fileInputRef = useRef(null);
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']; // 허용된 MIME 타입
  const allowedExtensions = ['.png', '.jpeg', '.jpg']; // 허용된 확장자
  const maxFileSize = 5 * 1024 * 1024; // 최대 파일 크기: 5MB

  const validateFile = (file) => {
    if (!file) {
      return { isValid: false, message: '파일이 선택되지 않았습니다.' };
    }

    // 빈 파일 체크
    if (file.size === 0) {
      return { isValid: false, message: '빈 파일은 업로드할 수 없습니다.' };
    }

    // 파일 크기 체크
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        message: `파일 크기는 ${maxFileSize / (1024 * 1024)}MB를 초과할 수 없습니다.`,
      };
    }

    // MIME 타입 체크
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: 'PNG, JPG, JPEG 형식의 이미지만 업로드 가능합니다.',
      };
    }

    // 확장자 체크
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        message: '파일 확장자는 PNG, JPG, JPEG만 허용됩니다.',
      };
    }

    return { isValid: true };
  };

  const handleImageUpload = useCallback(
    (event) => {
      if (disabled) return;
      const file = event.target.files[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.isValid) {
        onInvalidFile(validation.message);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // 입력 초기화
        }
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [setSelectedImage, setPreviewUrl, disabled, onInvalidFile]
  );

  const handleDrop = useCallback(
    (event) => {
      if (disabled) return;
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.isValid) {
        onInvalidFile(validation.message);
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [setSelectedImage, setPreviewUrl, disabled, onInvalidFile]
  );

  const handleDragOver = useCallback((event) => {
    if (disabled) return;
    event.preventDefault();
  }, [disabled]);

  const handleResetImage = useCallback(() => {
    if (disabled) return;
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setSelectedImage, setPreviewUrl, disabled]);

  const triggerFileInput = useCallback(() => {
    if (disabled || !fileInputRef.current) return;
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
              accept="image/png,image/jpeg,image/jpg"
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
              accept="image/png,image/jpeg,image/jpg"
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