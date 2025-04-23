import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('http://localhost:8080/api/health-prediction/predict', {
        
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithMemberId),
      });
      
  
      if (!response.ok) {
        const errorData = await response.text();
        toast.error(errorData || '서버 응답 오류');
        return;
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
      <h1>🧬 질병 예측 시스템</h1>
      <h2>질병 위험군을 예측해보세요!</h2>
      
      <HealthPredictionForm onSubmit={handleSubmit} />
      <ToastContainer />
    </div>
  );
}

export default HealthPrediction;