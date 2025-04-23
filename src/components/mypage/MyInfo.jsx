import React, { useEffect, useCallback } from 'react';
import { FaUser } from 'react-icons/fa';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMemberInfo } from '../../hooks/useMemberInfo';
import styles from './MyInfo.module.css';
import { genderOptions, activityLevelOptions } from '../../constants/member';
import { getImageUrl } from '../../utils/imageUtils';

const MyInfo = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: {
      membername: '',
      height: '',
      weight: '',
      age: '',
      gender: null,
      activityLevel: null,
      goalWeight: '',
    },
  });

  const {
    error,
    loading,
    profileImage,
    setProfileImage,
    profileImageUrl,
    setProfileImageUrl,
    fetchMemberInfo,
    updateMemberInfo,
    clearProfileImage,
    setError,
  } = useMemberInfo(reset);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchMemberInfo();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchMemberInfo]);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Selected file:', file.name);
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('FileReader result:', reader.result);
          setProfileImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [setProfileImage, setProfileImageUrl]
  );

  const onSubmit = (data) => updateMemberInfo(data, profileImage);

  const handleCancel = () => {
    reset();
    clearProfileImage();
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button
          onClick={() => {
            setError(null);
            fetchMemberInfo();
          }}
          className={styles.retryButton}
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            {profileImageUrl ? (
              <img
                src={getImageUrl(profileImageUrl)}
                alt="프로필"
                className={styles.profileImage}
                onError={(e) => {
                  console.error('Image load failed:', getImageUrl(profileImageUrl));
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
                onLoad={() => console.log('Image loaded successfully:', getImageUrl(profileImageUrl))}
              />
            ) : (
              <FaUser className={styles.defaultIcon} />
            )}
            <FaUser className={styles.defaultIcon} style={{ display: 'none' }} />
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
            <label htmlFor="membername">이름</label>
            <Controller
              name="membername"
              control={control}
              rules={{
                required: '이름은 필수 입력입니다.',
                maxLength: { value: 50, message: '이름은 50자 이내로 입력하세요.' },
              }}
              render={({ field }) => (
                <input
                  type="text"
                  id="membername"
                  className={styles.input}
                  {...field}
                />
              )}
            />
            {errors.membername && <span className={styles.fieldError}>{errors.membername.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="height">키 (cm)</label>
            <Controller
              name="height"
              control={control}
              rules={{ required: '키는 필수 입력입니다.', min: { value: 0, message: '0 이상 입력하세요.' } , max:{ value: 250, message: '250 이하로 입력하세요.' }} }
              render={({ field }) => (
                <input
                  type="number"
                  id="height"
                  className={styles.input}
                  step="0.1"
                  {...field}
                />
              )}
            />
            {errors.height && <span className={styles.fieldError}>{errors.height.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="weight">몸무게 (kg)</label>
            <Controller
              name="weight"
              control={control}
              rules={{ required: '몸무게는 필수 입력입니다.', min: { value: 0, message: '0 이상 입력하세요.' } ,max:{ value: 200, message: '200 이하로 입력하세요.' }}}
              render={({ field }) => (
                <input
                  type="number"
                  id="weight"
                  className={styles.input}
                  step="0.1"
                  {...field}
                />
              )}
            />
            {errors.weight && <span className={styles.fieldError}>{errors.weight.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="age">나이</label>
            <Controller
              name="age"
              control={control}
              rules={{ required: '나이는 필수 입력입니다.', min: { value: 0, message: '0 이상 입력하세요.' }, max:{ value: 110, message: '110 이하로 입력하세요.' } }}
              render={({ field }) => (
                <input
                  type="number"
                  id="age"
                  className={styles.input}
                  {...field}
                />
              )}
            />
            {errors.age && <span className={styles.fieldError}>{errors.age.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gender">성별</label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: '성별은 필수 선택입니다.' }}
              render={({ field }) => (
                <Select
                  id="gender"
                  options={genderOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택하세요"
                  className={styles.select}
                  isClearable
                />
              )}
            />
            {errors.gender && <span className={styles.fieldError}>{errors.gender.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="activityLevel">활동 수준</label>
            <Controller
              name="activityLevel"
              control={control}
              rules={{ required: '활동 수준은 필수 선택입니다.' }}
              render={({ field }) => (
                <Select
                  id="activityLevel"
                  options={activityLevelOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택하세요"
                  className={styles.select}
                  isClearable
                />
              )}
            />
            {errors.activityLevel && (
              <span className={styles.fieldError}>{errors.activityLevel.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="goalWeight">목표 체중 (kg)</label>
            <Controller
              name="goalWeight"
              control={control}
              rules={{ required: '목표 체중은 필수 입력입니다.', min: { value: 0, message: '0 이상 입력하세요.' }, max:{ value: 200, message: '200 이하로 입력하세요.' } }}
              render={({ field }) => (
                <input
                  type="number"
                  id="goalWeight"
                  className={styles.input}
                  step="0.1"
                  {...field}
                />
              )}
            />
            {errors.goalWeight && <span className={styles.fieldError}>{errors.goalWeight.message}</span>}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting || (!isDirty && !profileImage)}
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
      <ToastContainer />
    </div>
  );
};

export default MyInfo;