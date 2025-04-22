import { useCallback, useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

export const useChallenge = (userId = 1) => {
  // 상태 관리
  const [periodUnit, setPeriodUnit] = useState('개월');
  const [period, setPeriod] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [challengeStatus, setChallengeStatus] = useState('진행중');
  const [isChallengeRegistered, setIsChallengeRegistered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('알림');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 기간 및 단위에 따라 종료 날짜 계산
  useEffect(() => {
    if (period && period > 0) {
      const calculatedEndDate = new Date(startDate);
      if (periodUnit === '개월') {
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + Number(period));
      } else if (periodUnit === '년') {
        calculatedEndDate.setFullYear(calculatedEndDate.getFullYear() + Number(period));
      }
      setEndDate(calculatedEndDate);
    } else {
      setEndDate(null);
    }
  }, [period, periodUnit, startDate]);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalMessage('');
    setModalTitle('알림');
  }, []);

  // 챌린지 등록
  const registerChallenge = useCallback(async (goal) => {
    setLoading(true);
    setError(null);

    try {
      // period를 개월 단위로 변환
      const months = periodUnit === '년' ? Number(period) * 12 : Number(period);

      // 챌린지 데이터 구성
      const challengeData = {
        memberId: Number(userId),
        goal,
        period: months.toString(),
        targetWeight: goal === '체중조절' ? Number(targetWeight) : null,
        startDate: startDate.toISOString().split('T')[0],
        endDate: null,
      };

      // 디버깅: 요청 데이터 출력
      console.log('전송 데이터:', challengeData);

      // API 호출
      const response = await apiClient.post('/challenge/create', challengeData);
      console.log('챌린지 등록 성공:', response.data);

      // 등록 성공 처리
      setIsChallengeRegistered(true);
      setChallengeStatus('진행중');
      setModalTitle('성공');
      setModalMessage('챌린지가 등록되었습니다!');
      setModalOpen(true);
    } catch (err) {
      console.error('챌린지 등록 에러:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      const errorMessage = err.response?.data?.message || '챌린지 등록 중 오류가 발생했습니다.';
      setError(errorMessage);
      setModalTitle('오류');
      setModalMessage(errorMessage);
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  }, [
    period,
    periodUnit,
    targetWeight,
    startDate,
    endDate,
    challengeStatus,
    isChallengeRegistered,
    userId,
  ]);

  // 챌린지 실패 처리
  const failChallenge = useCallback(() => {
    setModalTitle('확인');
    setModalMessage('챌린지를 실패 처리하시겠습니까?');
    setModalOpen(true);
  }, []);

  // 모달 확인 핸들러
  const handleModalConfirm = useCallback(
    (action) => {
      if (action === 'register') {
        // 폼 초기화
        setPeriod('');
        setTargetWeight('');
        setStartDate(new Date());
        setEndDate(null);
        setIsChallengeRegistered(false);
      } else if (action === 'fail') {
        // 실패 처리
        setChallengeStatus('실패');
        setIsChallengeRegistered(false);
        setModalTitle('성공');
        setModalMessage('챌린지가 실패로 처리되었습니다. 새로 등록할 수 있습니다.');
        setModalOpen(true);
      }
    },
    []
  );

  // 훅에서 반환할 객체
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
  };
};