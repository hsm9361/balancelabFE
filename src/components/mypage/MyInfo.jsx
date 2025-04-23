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
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
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

  const fields = [
    {
      name: 'membername',
      label: '이름',
      type: 'text',
      rules: {
        required: '이름은 필수 입력입니다.',
        maxLength: { value: 50, message: '이름은 50자 이내로 입력하세요.' },
      },
    },
    {
      name: 'height',
      label: '키 (cm)',
      type: 'number',
      rules: {
        required: '키는 필수 입력입니다.',
        min: { value: 0, message: '0 이상 입력하세요.' },
        max: { value: 250, message: '250 이하로 입력하세요.' },
      },
      step: '0.1',
    },
    {
      name: 'weight',
      label: '몸무게 (kg)',
      type: 'number',
      rules: {
        required: '몸무게는 필수 입력입니다.',
        min: { value: 0, message: '0 이상 입력하세요.' },
        max: { value: 200, message: '200 이하로 입력하세요.' },
      },
      step: '0.1',
    },
    {
      name: 'age',
      label: '나이',
      type: 'number',
      rules: {
        required: '나이는 필수 입력입니다.',
        min: { value: 0, message: '0 이상 입력하세요.' },
        max: { value: 110, message: '110 이하로 입력하세요.' },
      },
    },
    {
      name: 'gender',
      label: '성별',
      type: 'select',
      options: genderOptions,
      rules: { required: '성별은 필수 선택입니다.' },
    },
    {
      name: 'goalWeight',
      label: '목표 체중 (kg)',
      type: 'number',
      rules: {
        required: '목표 체중은 필수 입력입니다.',
        min: { value: 0, message: '0 이상 입력하세요.' },
        max: { value: 200, message: '200 이하로 입력하세요.' },
      },
      step: '0.1',
    },
  ];

  const activityField = {
    name: 'activityLevel',
    label: '활동 수준',
    type: 'select',
    options: activityLevelOptions,
    rules: { required: '활동 수준은 필수 선택입니다.' },
  };

  // 필드를 두 열로 나누기
  const midIndex = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, midIndex);
  const rightFields = fields.slice(midIndex);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* 프로필 이미지 섹션 */}
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            {profileImageUrl ? (
              <img
                src={getImageUrl(profileImageUrl)}
                alt="프로필"
                className={styles.profileImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
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

        {/* 기본 정보 섹션 */}
        <div className={styles.sectionTitle}>기본 정보</div>
        <div className={styles.infoSection}>
          <div className={styles.columns}>
            <div className={styles.column}>
              {leftFields.map((field) => (
                <div key={field.name} className={styles.formGroup}>
                  <label htmlFor={field.name} className={styles.label}>
                    {field.label}
                  </label>
                  <div className={styles.inputWrapper}>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={field.rules}
                      render={({ field: controllerField }) => (
                        <>
                          {field.type === 'select' ? (
                            <Select
                              id={field.name}
                              options={field.options}
                              value={controllerField.value}
                              onChange={controllerField.onChange}
                              placeholder="선택하세요"
                              className={styles.select}
                              isClearable
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={field.name}
                              className={styles.input}
                              step={field.step || undefined}
                              {...controllerField}
                            />
                          )}
                        </>
                      )}
                    />
                    {errors[field.name] && (
                      <span className={styles.fieldError}>{errors[field.name].message}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.column}>
              {rightFields.map((field) => (
                <div key={field.name} className={styles.formGroup}>
                  <label htmlFor={field.name} className={styles.label}>
                    {field.label}
                  </label>
                  <div className={styles.inputWrapper}>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={field.rules}
                      render={({ field: controllerField }) => (
                        <>
                          {field.type === 'select' ? (
                            <Select
                              id={field.name}
                              options={field.options}
                              value={controllerField.value}
                              onChange={controllerField.onChange}
                              placeholder="선택하세요"
                              className={styles.select}
                              isClearable
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={field.name}
                              className={styles.input}
                              step={field.step || undefined}
                              {...controllerField}
                            />
                          )}
                        </>
                      )}
                    />
                    {errors[field.name] && (
                      <span className={styles.fieldError}>{errors[field.name].message}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 활동 수준 섹션 */}
        {/* <div className={styles.sectionTitle}>활동 수준 아래 고</div> */}
        <div className={styles.activitySection}>
          <div className={styles.formGroup}>
            <label htmlFor={activityField.name} className={styles.label}>
              {activityField.label}
            </label>
            <div className={styles.inputWrapper}>
              <Controller
                name={activityField.name}
                control={control}
                rules={activityField.rules}
                render={({ field: controllerField }) => (
                  <Select
                    id={activityField.name}
                    options={activityField.options}
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                    placeholder="선택하세요"
                    className={styles.select}
                    isClearable
                  />
                )}
              />
              {errors[activityField.name] && (
                <span className={styles.fieldError}>{errors[activityField.name].message}</span>
              )}
            </div>
          </div>
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
      </form>
      <ToastContainer />
    </div>
  );
};

export default MyInfo;