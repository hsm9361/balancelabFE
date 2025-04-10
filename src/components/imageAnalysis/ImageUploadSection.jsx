import React, { useCallback } from 'react';
import styles from 'assets/css/pages/ImageAnalysisPage.module.css';

function ImageUploadSection({
  selectedImage,
  setSelectedImage,
  previewUrl,
  setPreviewUrl,
}) {
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

  return (
    <div className={styles.uploadSection}>
      <div
        className={styles.imageUploadArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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
  );
}

export default ImageUploadSection;