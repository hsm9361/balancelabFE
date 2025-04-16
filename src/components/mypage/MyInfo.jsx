import React, { useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  const fetchMemberInfo = async () => {
    try {
      const data = await memberService.getMemberInfo();
      console.log(data);
      setMemberInfo({
        height: data.height?.toString() || '',
        weight: data.weight?.toString() || '',
        age: data.age?.toString() || '',
        gender: data.gender || '',
        activityLevel: data.activityLevel || '',
        goalWeight: data.goalWeight?.toString() || '',
      });
      setProfileImageUrl(data.profileImageUrl || null);
      setLoading(false);
    } catch (err) {
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        return;
      }
      setError('회원 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      const dto = {
        height: parseFloat(memberInfo.height),
        weight: parseFloat(memberInfo.weight),
        age: parseInt(memberInfo.age),
        gender: memberInfo.gender,
        activityLevel: memberInfo.activityLevel,
        goalWeight: parseFloat(memberInfo.goalWeight)
      };

      // Create a Blob with the JSON data
      const dtoBlob = new Blob([JSON.stringify(dto)], {
        type: 'application/json'
      });
      
      formData.append('dto', dtoBlob);

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await memberService.updateMemberInfo(formData);
      await fetchMemberInfo(); // 업데이트 후 데이터 새로고침
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Update error:', err);
      if (err.message === 'Authentication required') {
        return;
      }
      setError('회원 정보 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const activityLevelLabels = {
    'SEDENTARY': '거의 운동하지 않음',
    'LIGHTLY_ACTIVE': '가벼운 운동 (주 1-3회)',
    'MODERATELY_ACTIVE': '중간 강도 운동 (주 3-5회)',
    'VERY_ACTIVE': '강한 운동 (주 6-7회)',
    'EXTRA_ACTIVE': '매우 강한 운동 (매일 2회 이상)'
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            <img
              src={profileImageUrl || '/default-profile.png'}
              alt="프로필"
              className={styles.profileImage}
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.imageInput}
              />
            )}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              required
            >
              <option value="">선택하세요</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
              <option value="OTHER">기타</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="activityLevel">활동 수준</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={memberInfo.activityLevel}
              onChange={handleInputChange}
              disabled={!isEditing}
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
              disabled={!isEditing}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.buttonGroup}>
            {!isEditing ? (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
            ) : (
              <>
                <button type="submit" className={styles.saveButton}>
                  저장
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsEditing(false);
                    setProfileImage(null);
                    fetchMemberInfo(); // 취소 시 원래 데이터로 복원
                  }}
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyInfo;