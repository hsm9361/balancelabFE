import { useCallback, useEffect, useRef, useState } from 'react';
import apiClient from '../services/apiClient';

export const useChallenge = () => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ongoingChallenge, setOngoingChallenge] = useState(null);
  const hasFetched = useRef(false);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalMessage('');
    setModalTitle('알림');
  }, []);

  // 챌린지 조회
  const fetchOngoingChallenge = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching ongoing challenge...');
      const response = await apiClient.get('/challenge/user/ongoing');
      const data = response.data;
      // 상태 변경 최소화
      setOngoingChallenge((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(data)) {
          console.log('Updating ongoingChallenge:', data);
          return data;
        }
        return prev;
      });
      setChallengeStatus(data ? '진행중' : '');
      setIsChallengeRegistered(!!data);
      // endDate 문자열로 유지
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
        console.error('Failed to fetch ongoing challenge:', err);
        setModalTitle('오류');
        setModalMessage('진행 중인 챌린지 조회에 실패했습니다.');
        setModalOpen(true);
      }
    } finally {
      setLoading(false);
      console.log('Fetch complete.');
    }
  }, []);

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
  const registerChallenge = useCallback(async (goal) => {
    setLoading(true);
    setError(null);

    try {
      // endDate 계산
      const calculatedEndDate = calculateEndDate(startDate, period, periodUnit);

      const challengeData = {
        goal,
        period: parseInt(period), // 숫자만 전송
        periodUnit, // "개월" 또는 "년"
        targetWeight: goal === '체중조절' ? parseInt(targetWeight) : null,
        startDate: startDate.toISOString().split('T')[0],
        endDate: calculatedEndDate,
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
      await fetchOngoingChallenge();
    } catch (err) {
      console.error('챌린지 등록 에러:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });
      const errorMessage = err.response?.data?.message || '챌린지 등록 중 오류가 발생했습니다.';
      setError(errorMessage);
      setModalTitle('오류');
      setModalMessage(errorMessage);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, [period, periodUnit, targetWeight, startDate]);

  // 챌린지 실패 처리
  const failOngoingChallenge = useCallback(async (challengeId) => {
    try {
      setLoading(true);
      await apiClient.put(`/challenge/fail/${challengeId}`);
      setOngoingChallenge(null);
      setIsChallengeRegistered(false);
      setChallengeStatus('');
      setEndDate(null);
      setModalTitle('성공');
      setModalMessage('챌린지가 실패로 처리되었습니다.');
      setModalOpen(true);
    } catch (err) {
      console.error('챌린지 실패 처리 에러:', err);
      setModalTitle('오류');
      setModalMessage('챌린지 실패 처리 중 오류가 발생했습니다.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // 초기 챌린지 조회 (한 번만 실행)
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchOngoingChallenge();
    }
  }, [fetchOngoingChallenge]);

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
  };
};