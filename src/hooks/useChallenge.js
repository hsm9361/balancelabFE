import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';

export const useChallenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [periodUnit, setPeriodUnit] = useState('개월');
  const [period, setPeriod] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [challengeStatus, setChallengeStatus] = useState('');
  const [isChallengeRegistered, setIsChallengeRegistered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('알림');
  const [modalConfirmHandler, setModalConfirmHandler] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ongoingChallenge, setOngoingChallenge] = useState(null);
  const [allChallenges, setAllChallenges] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalMessage('');
    setModalTitle('알림');
    setModalConfirmHandler(null);
  }, []);

  // 진행 중인 챌린지 조회
  const fetchOngoingChallenge = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching ongoing challenge...');
      const response = await apiClient.get('/challenge/user/ongoing');
      const data = response.data;
      console.log('Fetched ongoing challenge:', data);
      // 소수점 포맷팅
      if (data) {
        data.startWeight = parseFloat(data.startWeight).toFixed(1);
        data.targetWeight = parseFloat(data.targetWeight).toFixed(1);
      }
      setOngoingChallenge((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          console.log('Updating ongoingChallenge:', data);
          return data;
        }
        return prev;
      });
      setChallengeStatus(data ? '진행중' : '');
      setIsChallengeRegistered(!!data);
      setEndDate((prev) => {
        const newEndDate = data?.endDate ? data.endDate : null;
        if (prev !== newEndDate) {
          console.log('Updating endDate:', newEndDate);
          return newEndDate;
        }
        return prev;
      });
    } catch (err) {
      setOngoingChallenge(null);
      setChallengeStatus('');
      setIsChallengeRegistered(false);
      setEndDate(null);
      if (err.response?.status !== 404) {
        console.error('Failed to fetch ongoing challenge:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setModalTitle('오류');
        setModalMessage('진행 중인 챌린지 조회에 실패했습니다.');
        setModalOpen(true);
      }
    } finally {
      setLoading(false);
      console.log('Fetch ongoing challenge complete.');
    }
  }, []);

  // 모든 챌린지 조회
  const fetchAllChallenges = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching all challenges...');
      console.log('Authorization header:', apiClient.defaults.headers.common['Authorization']);
      const response = await apiClient.get('/challenge/user/challenges', {
        params: { t: new Date().getTime() },
      });
      const data = response.data;
      console.log('Fetched all challenges:', data);
      // 소수점 포맷팅
      if (data) {
        data.forEach((challenge) => {
          challenge.startWeight = parseFloat(challenge.startWeight).toFixed(1);
          challenge.targetWeight = parseFloat(challenge.targetWeight).toFixed(1);
        });
      }
      setAllChallenges(data || []);
    } catch (err) {
      console.error('Failed to fetch all challenges:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      let message = '챌린지 목록 조회에 실패했습니다.';
      if (err.response?.status === 401) {
        message = '로그인이 필요합니다.';
        navigate('/login');
      } else if (err.response?.status === 404) {
        message = '챌린지 데이터가 없습니다.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      setModalTitle('오류');
      setModalMessage(message);
      setModalOpen(true);
      setAllChallenges([]);
    } finally {
      setLoading(false);
      console.log('Fetch all challenges complete.');
    }
  }, [navigate]);

  // 몸무게 히스토리 조회
  const fetchWeightHistory = useCallback(async (startDate) => {
    try {
      setLoading(true);
      console.log('Fetching weight history...', { startDate });
      const response = await apiClient.get('/challenge/user/weight-history', {
        params: { startDate, t: new Date().getTime() },
      });
      const data = response.data;
      console.log('Fetched weight history:', data);
      // 소수점 포맷팅
      if (data) {
        data.forEach((entry) => {
          entry.weight = parseFloat(entry.weight).toFixed(1);
        });
      }
      setWeightHistory(data || []);
    } catch (err) {
      console.error('Failed to fetch weight history:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setModalTitle('오류');
      setModalMessage('몸무게 히스토리 조회에 실패했습니다.');
      setModalOpen(true);
      setWeightHistory([]);
    } finally {
      setLoading(false);
      console.log('Fetch weight history complete.');
    }
  }, []);

  // 챌린지 데이터 갱신
  const refreshChallenges = useCallback(async () => {
    await fetchOngoingChallenge();
    await fetchAllChallenges();
    if (ongoingChallenge?.startDate) {
      await fetchWeightHistory(ongoingChallenge.startDate);
    } else {
      setWeightHistory([]);
    }
  }, [fetchOngoingChallenge, fetchAllChallenges, fetchWeightHistory, ongoingChallenge]);

  // endDate 계산 헬퍼
  const calculateEndDate = (start, period, unit) => {
    const startDate = new Date(start);
    let months = 0;
    if (unit === '개월') {
      months = parseInt(period);
    } else if (unit === '년') {
      months = parseInt(period) * 12;
    }
    startDate.setMonth(startDate.getMonth() + months);
    return startDate.toISOString().split('T')[0];
  };

  // 챌린지 등록
  const registerChallenge = useCallback(async (goal, startWeight) => {
    setLoading(true);
    setError(null);

    try {
      const parsedStartWeight = parseFloat(startWeight);
      const parsedTargetWeight = parseFloat(targetWeight);

      // 소수점 자릿수 제한 (최대 1자리)
      if (parsedStartWeight.toString().split('.')[1]?.length > 1) {
        throw new Error('시작 몸무게는 소수점 1자리까지만 입력 가능합니다.');
      }
      if (parsedTargetWeight.toString().split('.')[1]?.length > 1) {
        throw new Error('목표 체중은 소수점 1자리까지만 입력 가능합니다.');
      }

      if (isNaN(parsedStartWeight) || parsedStartWeight <= 0) {
        throw new Error('시작 몸무게는 0보다 커야 합니다.');
      }
      if (isNaN(parsedTargetWeight) || parsedTargetWeight <= 0) {
        throw new Error('목표 체중은 0보다 커야 합니다.');
      }

      const challengeData = {
        goal,
        period: parseInt(period),
        periodUnit,
        startWeight: parsedStartWeight,
        targetWeight: parsedTargetWeight,
        startDate: startDate.toISOString().split('T')[0],
        endDate: calculateEndDate(startDate, period, periodUnit),
      };

      console.log('전송 데이터:', challengeData);

      const response = await apiClient.post('/challenge/create', challengeData);
      console.log('챌린지 등록 성공:', response.data);

      setIsChallengeRegistered(true);
      setChallengeStatus('진행중');
      setModalTitle('성공');
      setModalMessage('챌린지가 등록되었습니다!');
      setModalOpen(true);
      setPeriod('');
      setTargetWeight('');
      setStartDate(new Date());
      setEndDate(null);
      await refreshChallenges();
    } catch (err) {
      console.error('챌린지 등록 에러:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMessage = err.response?.data?.message || err.message || '챌린지 등록 중 오류가 발생했습니다.';
      setError(errorMessage);
      setModalTitle('오류');
      setModalMessage(errorMessage);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, [period, periodUnit, targetWeight, startDate, refreshChallenges]);

  // 챌린지 중단 처리
  const failOngoingChallenge = useCallback(async (challengeId) => {
    try {
      setLoading(true);
      await apiClient.put(`/challenge/fail/${challengeId}`);
      setOngoingChallenge(null);
      setIsChallengeRegistered(false);
      setChallengeStatus('');
      setEndDate(null);
      setModalTitle('성공');
      setModalMessage('챌린지가 중단되었습니다.');
      setModalOpen(true);
      await refreshChallenges();
    } catch (err) {
      console.error('챌린지 중단 처리 에러:', err);
      setModalTitle('오류');
      setModalMessage('챌린지 중단 처리 중 오류가 발생했습니다.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, [refreshChallenges]);

  // 챌린지 실패 확인
  const failChallenge = useCallback(() => {
    if (!ongoingChallenge?.id) return;
    setModalTitle('확인');
    setModalMessage('챌린지를 실패 처리하시겠습니까?');
    setModalOpen(true);
  }, [ongoingChallenge]);

  // 모달 확인 핸들러
  const handleModalConfirm = useCallback(
    async (action) => {
      if (action === 'register') {
        handleCloseModal();
      } else if (action === 'fail') {
        await failOngoingChallenge(ongoingChallenge.id);
      }
    },
    [handleCloseModal, failOngoingChallenge, ongoingChallenge]
  );

  // 페이지 진입 시 데이터 갱신
  useEffect(() => {
    console.log('Page entered, refreshing challenges...');
    refreshChallenges();
  }, [location.pathname, refreshChallenges]);

  return {
    periodUnit,
    setPeriodUnit,
    period,
    setPeriod,
    targetWeight,
    setTargetWeight,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    challengeStatus,
    isChallengeRegistered,
    modalOpen,
    modalMessage,
    modalTitle,
    modalConfirmHandler,
    setModalConfirmHandler,
    loading,
    error,
    handleCloseModal,
    registerChallenge,
    failChallenge,
    handleModalConfirm,
    setModalTitle,
    setModalMessage,
    setModalOpen,
    ongoingChallenge,
    fetchOngoingChallenge,
    allChallenges,
    fetchAllChallenges,
    weightHistory,
    fetchWeightHistory,
  };
};