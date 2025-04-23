import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';
import { userService } from '../../services/userService';
import Predict from 'assets/images/predict.png';
import useAuth from '../../hooks/useAuth';

const genderOptions = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];

function HealthPrediction() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: {
      height: '',
      weight: '',
      gender: '',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const fetchMemberInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
      const data = await userService.getUserBodyInfo();
      setMemberInfo(data);
      reset({
        height: data.height || '',
        weight: data.weight || '',
        gender: data.gender || '',
      });
    } catch (err) {
      console.error('Fetch member info error:', err);
      if (err.message === 'Authentication required' || err.message.includes('401')) {
        localStorage.removeItem('accessToken');
        navigate('/login', {
          state: { from: location.pathname },
          replace: true,
        });
        return;
      }
      setError('회원 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate, location.pathname, reset]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMemberInfo();
    } else {
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [isAuthenticated, fetchMemberInfo, navigate, location.pathname]);

  // 인증 상태 업데이트 이벤트 처리
  useEffect(() => {
    const handleAuthUpdate = () => {
      if (isAuthenticated) {
        fetchMemberInfo();
      }
    };
    window.addEventListener('auth-update', handleAuthUpdate);
    return () => {
      window.removeEventListener('auth-update', handleAuthUpdate);
    };
  }, [isAuthenticated, fetchMemberInfo]);

  const onSubmit = async (data) => {
    try {
      const bodyInfo = {
        height: parseFloat(data.height) || null,
        weight: parseFloat(data.weight) || null,
        gender: data.gender || null,
      };
      await userService.saveUserBodyInfo(bodyInfo);
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

  const handleCancel = () => {
    fetchMemberInfo();
  };

  const handleRetry = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !isAuthenticated) {
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }
    await fetchMemberInfo();
  };

  if (isLoading) {
    return <div className="health-prediction"><div>Loading...</div></div>;
  }

  if (error) {
    return (
      <div className="health-prediction">
        <div>Error: {error}</div>
        <button className="consult-button" onClick={handleRetry}>
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="health-prediction">
      <h1>현재 등록된 신체 정보</h1>
      <h2>{user?.username}님의 정보를 확인하고 수정할 수 있습니다</h2>
      <form className="prediction-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>회원 email</label>
          <span>{user?.email}</span>
        </div>
        <div className="form-group">
          <label htmlFor="height">키 (cm)</label>
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
                className={errors.height ? 'input-error' : ''}
                {...field}
              />
            )}
          />
          {errors.height && <span className="error-text">{errors.height.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="weight">몸무게 (kg)</label>
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
                className={errors.weight ? 'input-error' : ''}
                {...field}
              />
            )}
          />
          {errors.weight && <span className="error-text">{errors.weight.message}</span>}
        </div>
        <div className="form-group">
          <label>성별</label>
          <div className="radio-group">
            <Controller
              name="gender"
              control={control}
              rules={{ required: '성별은 필수 선택입니다.' }}
              render={({ field }) => (
                <>
                  {genderOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.gender && <span className="error-text">{errors.gender.message}</span>}
        </div>
        <div className="button-group">
          <button
            type="submit"
            className="consult-button"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? '저장 중...' : '정보 저장'}
          </button>
          <button
            type="button"
            className="back-button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="button"
            className="save-button"
            onClick={handleProceedToForm}
            disabled={isSubmitting}
          >
            건강 예측 문답 시작
            <img src={Predict} alt="예측" className="plane-icon" />
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default HealthPrediction;