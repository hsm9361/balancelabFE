import React, { useState, useEffect, useCallback } from 'react';
import { FaUser } from 'react-icons/fa';
import { memberService } from '../../services/memberService';
import styles from './MyInfo.module.css';

const MyInfo = () => {
  const [memberInfo, setMemberInfo] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    goalWeight: '',
  });
  const [initialMemberInfo, setInitialMemberInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  const fetchMemberInfo = async () => {
    try {
      const data = await memberService.getMemberInfo();
      const info = {
        height: data.height?.toString() || '',
        weight: data.weight?.toString() || '',
        age: data.age?.toString() || '',
        gender: data.gender || '',
        activityLevel: data.activityLevel || '',
        goalWeight: data.goalWeight?.toString() || '',
      };
      setMemberInfo(info);
      setInitialMemberInfo(info);
      setProfileImageUrl(data.profileImageUrl || null);
      setLoading(false);
    } catch (err) {
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
        return;
      }
      setError('회원 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setMemberInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const hasChanges = () => {
    if (!initialMemberInfo) return false;
    return (
      JSON.stringify(memberInfo) !== JSON.stringify(initialMemberInfo) ||
      profileImage !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !hasChanges()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const dto = {
        height: parseFloat(memberInfo.height),
        weight: parseFloat(memberInfo.weight),
        age: parseInt(memberInfo.age),
        gender: memberInfo.gender,
        activityLevel: memberInfo.activityLevel,
        goalWeight: parseFloat(memberInfo.goalWeight),
      };
      const dtoBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('dto', dtoBlob);
      if (profileImage) formData.append('profileImage', profileImage);

      await memberService.updateMemberInfo(formData);
      await fetchMemberInfo();
      setProfileImage(null);
      setError(null);
    } catch (err) {
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        setError('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
      }
      setError('회원 정보 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMemberInfo(initialMemberInfo);
    setProfileImage(null);
    setProfileImageUrl(null); // Reset to default icon
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const activityLevelLabels = {
    SEDENTARY: '거의 운동하지 않음',
    LIGHTLY_ACTIVE: '가벼운 운동 (주 1-3회)',
    MODERATELY_ACTIVE: '중간 강도 운동 (주 3-5회)',
    VERY_ACTIVE: '강한 운동 (주 6-7회)',
    EXTRA_ACTIVE: '매우 강한 운동 (매일 2회 이상)',
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="프로필"
                className={styles.profileImage}
              />
            ) : (
              <FaUser className={styles.defaultIcon} />
            )}
            <label htmlFor="profileImage" className={styles.imageInput}>
              프로필 변경
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.hiddenInput}
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.formGroup}>
            <label htmlFor="height">키 (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={memberInfo.height}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="weight">몸무게 (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={memberInfo.weight}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="age">나이</label>
            <input
              type="number"
              id="age"
              name="age"
              value={memberInfo.age}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={memberInfo.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="activityLevel">활동 수준</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={memberInfo.activityLevel}
              onChange={handleInputChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="SEDENTARY">거의 운동하지 않음</option>
              <option value="LIGHTLY_ACTIVE">가벼운 운동 (주 1-3회)</option>
              <option value="MODERATELY_ACTIVE">중간 강도 운동 (주 3-5회)</option>
              <option value="VERY_ACTIVE">강한 운동 (주 6-7회)</option>
              <option value="EXTRA_ACTIVE">매우 강한 운동 (매일 2회 이상)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="goalWeight">목표 체중 (kg)</label>
            <input
              type="number"
              id="goalWeight"
              name="goalWeight"
              value={memberInfo.goalWeight}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting || !hasChanges()}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyInfo;