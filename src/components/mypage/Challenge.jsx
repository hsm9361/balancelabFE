import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/components/mypage/Challenge.module.css';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import { useChallenge } from '../../hooks/useChallenge';
import { userService } from '../../services/userService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useAuth from '../../hooks/useAuth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Challenge() {
  const navigate = useNavigate();
  const {
    periodUnit,
    setPeriodUnit,
    period,
    setPeriod,
    targetWeight,
    setTargetWeight,
    modalOpen,
    modalMessage,
    modalTitle,
    challengeStatus,
    isChallengeRegistered,
    endDate,
    handleCloseModal,
    registerChallenge,
    failChallenge,
    handleModalConfirm,
    loading,
    setModalTitle,
    setModalMessage,
    setModalOpen,
    ongoingChallenge,
    allChallenges,
    weightHistory,
  } = useChallenge();

  const { isAuthenticated } = useAuth();
  const [userWeight, setUserWeight] = useState(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberError, setMemberError] = useState(null);

  const goalOptions = [
    { value: '체중조절', label: '⚖️ 체중조절', icon: '⚖️' },
  ];

  const fetchMemberInfo = async () => {
    setMemberLoading(true);
    setMemberError(null);
    try {
      const data = await userService.getUserBodyInfo();
      console.log('🪵 MemberInfo:', data);
      if (!data) throw new Error('회원 정보가 null입니다.');
      if (data.weight) setUserWeight(parseFloat(data.weight));
      else {
        setModalTitle('오류');
        setModalMessage('몸무게 정보를 불러올 수 없습니다. 회원 정보 페이지에서 설정해주세요.');
        setModalOpen(true);
      }
    } catch (err) {
      setModalTitle('오류');
      setModalMessage('데이터를 불러오는데 실패했습니다: ' + err.message);
      setModalOpen(true);
      setMemberError(err.message);
    } finally {
      setMemberLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!ongoingChallenge?.startWeight || !ongoingChallenge?.targetWeight || !userWeight) return 0;
    const start = parseFloat(ongoingChallenge.startWeight);
    const target = parseFloat(ongoingChallenge.targetWeight);
    const current = parseFloat(userWeight);
    if (isNaN(start) || isNaN(target) || isNaN(current)) return 0;
    const totalChange = target - start;
    if (totalChange === 0) return 100;
    const currentChange = current - start;
    let progress = (currentChange / totalChange) * 100;
    progress = Math.min(Math.max(progress, 0), 100);
    return progress.toFixed(0);
  };

  const chartData = {
    labels: weightHistory.map((e) =>
      new Date(e.insDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: '몸무게 (kg)',
        data: weightHistory.map((e) => e.weight),
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(ongoingChallenge?.targetWeight
        ? [
            {
              label: '목표 체중 (kg)',
              data: Array(weightHistory.length).fill(parseFloat(ongoingChallenge.targetWeight)),
              borderColor: '#d9534f',
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
              tension: 0,
            },
          ]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: "'Poppins', sans-serif", size: 14 },
          color: '#3b5a7a',
        },
      },
      tooltip: {
        backgroundColor: '#f8fafc',
        titleColor: '#3b5a7a',
        bodyColor: '#6c757d',
        borderColor: '#6c8caf',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '날짜',
          color: '#3b5a7a',
          font: { family: "'Poppins', sans-serif", size: 14, weight: '500' },
        },
        ticks: {
          color: '#6c757d',
          font: { family: "'Poppins', sans-serif", size: 12 },
        },
      },
      y: {
        title: {
          display: true,
          text: '몸무게 (kg)',
          color: '#3b5a7a',
          font: { family: "'Poppins', sans-serif", size: 14, weight: '500' },
        },
        ticks: {
          color: '#6c757d',
          font: { family: "'Poppins', sans-serif", size: 12 },
        },
        suggestedMin: Math.min(...weightHistory.map((e) => e.weight), parseFloat(ongoingChallenge?.targetWeight ?? Infinity)) - 5,
        suggestedMax: Math.max(...weightHistory.map((e) => e.weight), parseFloat(ongoingChallenge?.targetWeight ?? -Infinity)) + 5,
      },
    },
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMemberInfo();
    } else {
      navigate('/login', { state: { from: '/mypage' }, replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const getWeightChangeLabel = () => {
    if (!targetWeight || !userWeight) return { label: '', className: '' };
    const target = parseFloat(targetWeight);
    if (isNaN(target)) return { label: '', className: '' };
    if (target > userWeight) return { label: '증가', className: 'increase' };
    if (target < userWeight) return { label: '감소', className: 'decrease' };
    return { label: '유지', className: 'maintain' };
  };

  const handleRegisterChallenge = () => {
    if (!period || !targetWeight || !Number(period) || !Number(targetWeight) || Number(period) <= 0 || Number(targetWeight) <= 0 || !userWeight) {
      setModalTitle('오류');
      setModalMessage('입력값을 확인해주세요.');
      setModalOpen(true);
      return;
    }
    registerChallenge('체중조절', userWeight);
  };

  const showRegisterSection = !ongoingChallenge || (endDate && new Date() > new Date(endDate)) || !isChallengeRegistered;

  if (memberLoading) return <div className={styles.loading}>유저 정보 로딩 중...</div>;
  if (memberError) return <div className={styles.error}>{memberError}</div>;

  const { label: weightChangeLabel, className: weightChangeClass } = getWeightChangeLabel();

  return (
    <div className={styles.container}>
      {showRegisterSection && <div className={styles.card}>챌린지 등록 영역...</div>}
      {ongoingChallenge && <div className={styles.ongoingSection}>진행 중 챌린지 영역...</div>}
      <div className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </div>
      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={handleCloseModal}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default Challenge;