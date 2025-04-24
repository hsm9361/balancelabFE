import React, { useEffect, useCallback, useState } from 'react';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import { useMemberInfo } from '../../hooks/useMemberInfo';
import styles from './MyInfo.module.css';
import { genderOptions, activityLevelOptions } from '../../constants/member';
import { getImageUrl } from '../../utils/imageUtils';

const MyInfo = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: {
      membername: '',
      height: '',
      weight: '',
      birthDate: '', // 초기값을 빈 문자열로 설정
      gender: null,
      activityLevel: null,
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
  } = useMemberInfo();

  const birthDate = watch('birthDate');
  const height = watch('height');
  const weight = watch('weight');

  const calculateAge = (birthDate) => {
    if (!birthDate || isNaN(new Date(birthDate))) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (height, weight) => {
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);
    if (!parsedHeight || !parsedWeight || parsedHeight <= 0) {
      return { bmi: 0, status: '' };
    }
    const heightInMeters = parsedHeight / 100;
    const bmi = (parsedWeight / (heightInMeters * heightInMeters)).toFixed(1);
    let status = '';
    if (bmi < 18.5) status = '저체중';
    else if (bmi < 23) status = '정상';
    else if (bmi < 25) status = '과체중';
    else if (bmi < 30) status = '비만';
    else status = '고도비만';
    return { bmi, status };
  };

  const { bmi, status } = calculateBMI(height, weight);

  useEffect(() => {
    const loadMemberInfo = async () => {
      try {
        const memberInfo = await fetchMemberInfo();
        if (memberInfo) {
          reset({
            membername: memberInfo.membername || '',
            height: memberInfo.height || '',
            weight: memberInfo.weight || '',
            birthDate: memberInfo.birthDate || '1990-01-01', // 서버 데이터 우선
            gender: memberInfo.gender || null,
            activityLevel: memberInfo.activityLevel || null,
          });
          setIsFormReady(true);
        }
      } catch (err) {
        console.error('회원 정보를 불러오는 중 오류:', err);
        reset({
          membername: '',
          height: '',
          weight: '',
          birthDate: '1990-01-01', // 에러 시 기본값
          gender: null,
          activityLevel: null,
        });
        setIsFormReady(true);
      }
    };
    loadMemberInfo();
  }, [fetchMemberInfo, reset]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  }, [setProfileImage, setProfileImageUrl]);

  const onSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        age: calculateAge(data.birthDate),
      };
      await updateMemberInfo(submitData, profileImage);
      reset(data);
    } catch (err) {
      console.error('회원 정보 업데이트 실패:', err);
      setError('회원 정보 업데이트에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    reset({
      membername: '',
      height: '',
      weight: '',
      birthDate: '1990-01-01',
      gender: null,
      activityLevel: null,
    });
    clearProfileImage();
    setShowCalendar(false);
  };

  if (loading || !isFormReady) {
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

  const activityField = {
    name: 'activityLevel',
    label: '활동 수준',
    type: 'select',
    options: activityLevelOptions,
    rules: { required: '활동 수준은 필수 선택입니다.' },
  };

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

        <div className={styles.sectionTitle}>기본 정보</div>
        <div className={styles.infoSection}>
          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="membername" className={styles.label}>
                이름
              </label>
              <div className={styles.inputWrapper}>
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
                {errors.membername && (
                  <span className={styles.fieldError}>{errors.membername.message}</span>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.label}>
                성별
              </label>
              <div className={styles.inputWrapper}>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: '성별은 필수 선택입니다.' }}
                  render={({ field }) => (
                    <Select
                      id="gender"
                      options={genderOptions}
                      value={field.value || null}
                      onChange={(option) => field.onChange(option)}
                      placeholder="선택하세요"
                      className={styles.select}
                      isClearable
                    />
                  )}
                />
                {errors.gender && (
                  <span className={styles.fieldError}>{errors.gender.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="birthDate" className={styles.label}>
                생년월일
              </label>
              <div className={styles.inputWrapper}>
                <Controller
                  name="birthDate"
                  control={control}
                  rules={{
                    required: '생년월일은 필수 입력입니다.',
                    validate: (value) => {
                      const date = new Date(value);
                      return !isNaN(date) || '유효한 날짜를 입력하세요.';
                    },
                  }}
                  render={({ field }) => (
                    <div className={styles.datePickerWrapper}>
                      <input
                        type="text"
                        id="birthDate"
                        className={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        onFocus={() => setShowCalendar(true)}
                      />
                      <FaCalendarAlt
                        className={styles.calendarIcon}
                        onClick={() => setShowCalendar(!showCalendar)}
                      />
                      {showCalendar && birthDate && (
                        <div className={styles.calendarContainer}>
                          <Calendar
                            onChange={(date) => {
                              const formattedDate = date.toISOString().split('T')[0];
                              field.onChange(formattedDate);
                              setShowCalendar(false);
                            }}
                            value={
                              birthDate && !isNaN(new Date(birthDate))
                                ? new Date(birthDate)
                                : new Date('1990-01-01')
                            }
                            maxDate={new Date()}
                            calendarType="gregory"
                            locale="ko-KR"
                          />
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.birthDate && (
                  <span className={styles.fieldError}>{errors.birthDate.message}</span>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>나이</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={calculateAge(birthDate)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="height" className={styles.label}>
                키 (cm)
              </label>
              <div className={styles.inputWrapper}>
                <Controller
                  name="height"
                  control={control}
                  rules={{
                    required: '키는 필수 입력입니다.',
                    min: { value: 0, message: '0 이상 입력하세요.' },
                    max: { value: 250, message: '250 이하로 입력하세요.' },
                  }}
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
                {errors.height && (
                  <span className={styles.fieldError}>{errors.height.message}</span>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="weight" className={styles.label}>
                몸무게 (kg)
              </label>
              <div className={styles.inputWrapper}>
                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    required: '몸무게는 필수 입력입니다.',
                    min: { value: 0, message: '0 이상 입력하세요.' },
                    max: { value: 200, message: '200 이하로 입력하세요.' },
                  }}
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
                {errors.weight && (
                  <span className={styles.fieldError}>{errors.weight.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label className={styles.label}>BMI 지수</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  className={styles.input}
                  value={bmi || 0}
                  readOnly
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>BMI 상태</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={status || ''}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle}>활동 수준</div>
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
                render={({ field }) => (
                  <Select
                    id={activityField.name}
                    options={activityField.options}
                    value={field.value || null}
                    onChange={(option) => field.onChange(option)}
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ top: '1rem', right: '1rem' }}
      />
    </div>
  );
};

export default MyInfo;