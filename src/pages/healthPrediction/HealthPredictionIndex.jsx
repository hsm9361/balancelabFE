import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { memberService } from '../../services/memberService';
import { FaUtensils, FaUser, FaClipboardList } from 'react-icons/fa';
import styles from 'assets/css/pages/healthPrediction/HealthPredictionIndex.module.css'; // Use CSS Modules

function HealthPredictionIndex() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: {
      height: '',
      weight: '',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch member info
  const fetchMemberInfo = async () => {
    try {
      const data = await memberService.getMemberInfo();
      setMemberInfo(data);
      reset({
        height: data.height || '',
        weight: data.weight || '',
      });
    } catch (err) {
      console.error('Fetch member info error:', err);
      if (err.message === 'Authentication required') {
        localStorage.setItem('redirectPath', window.location.pathname);
        navigate('/login', { replace: true });
        return;
      }
      setError('회원 정보를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMemberInfo()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const updateDto = {
        height: parseFloat(data.height) || null,
        weight: parseFloat(data.weight) || null,
        username: memberInfo?.username || null,
        age: memberInfo?.age || null,
        gender: memberInfo?.gender || null,
        membername: memberInfo?.membername || null,
        goalWeight: memberInfo?.goalWeight || null,
        activityLevel: memberInfo?.activityLevel || null,
      };
      formData.append('dto', new Blob([JSON.stringify(updateDto)], { type: 'application/json' }));

      await memberService.updateMemberInfo(formData);
      toast.success('정보가 성공적으로 업데이트되었습니다.');
      reset(data);
      await fetchMemberInfo();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('정보 업데이트에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
    }
  };

  const handleProceedToForm = () => {
    navigate('/healthprediction/form');
  };

  if (isLoading) {
    return (
      <div className={styles.healthPrediction}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.healthPrediction}>
        <div className={styles.error}>Error: {error}</div>
        <button
          className={styles.consultButton}
          onClick={() => {
            setError(null);
            fetchMemberInfo();
          }}
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.healthPrediction}>
      <header className={styles.header}>
        <h1 className={styles.title}>맞춤형 건강 예측</h1>
        <p className={styles.description}>
          {memberInfo.membername}님, 지난 7일간의 식단, 개인 정보, 생활 습관, 그리고 가족력을 바탕으로 건강 상태를 예측합니다. 아래에서 개인 정보를 확인하고 업데이트하세요.
        </p>
      </header>
      <div className={styles.guideCard}>
        <h2 className={styles.guideTitle}>예측에 사용되는 데이터</h2>
        <ul className={styles.guideList}>
          <li>
            <FaUtensils className={styles.guideIcon} /> <strong>식단 기록</strong>: 최근 7일간 섭취한 음식 데이터를 분석합니다.
          </li>
          <li>
            <FaUser className={styles.guideIcon} /> <strong>개인 정보</strong>: 키, 몸무게, 성별 등 기본 정보를 활용합니다.
          </li>
          <li>
            <FaClipboardList className={styles.guideIcon} /> <strong>설문지</strong>: 생활 습관(운동, 음주)과 가족력 데이터를 포함합니다.
          </li>
        </ul>
      </div>
      <div className={styles.predictionForm}>
        <h2 className={styles.formTitle}>나의 정보</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="email">email</label>
            <span>{memberInfo.email}</span>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="height">키 (cm)</label>
            <div className={styles.inputWrapper}>
              <Controller
                name="height"
                control={control}
                rules={{
                  required: '키는 필수 입력입니다.',
                  min: { value: 0, message: '0 이상 입력하세요.' },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    id="height"
                    step="0.1"
                    className={errors.height ? styles.inputError : ''}
                    {...field}
                  />
                )}
              />
              {errors.height && <span className={styles.errorText}>{errors.height.message}</span>}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="weight">몸무게 (kg)</label>
            <div className={styles.inputWrapper}>
              <Controller
                name="weight"
                control={control}
                rules={{
                  required: '몸무게는 필수 입력입니다.',
                  min: { value: 0, message: '0 이상 입력하세요.' },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    id="weight"
                    step="0.1"
                    className={errors.weight ? styles.inputError : ''}
                    {...field}
                  />
                )}
              />
              {errors.weight && <span className={styles.errorText}>{errors.weight.message}</span>}
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.consultButton}
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? '저장 중...' : '정보 저장'}
            </button>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleProceedToForm}
              disabled={isSubmitting}
            >
              건강 예측
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default HealthPredictionIndex;