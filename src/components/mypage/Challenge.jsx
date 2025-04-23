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
      {/* 챌린지 등록 섹션 */}
      {showRegisterSection && (
        <div className={styles.card}>
          <h1 className={styles.title}>나만의 챌린지 시작하기</h1>

          <div className={styles.section}>
            <label className={styles.label}>기간</label>
            <div className={styles.inputGroup}>
              <input
                type="number"
                placeholder="기간 입력"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                min="1"
                step="1"
                className={styles.input}
              />
              <select
                value={periodUnit}
                onChange={(e) => setPeriodUnit(e.target.value)}
                className={styles.select}
              >
                <option value="개월">개월</option>
                <option value="년">년</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>목표 체중 (kg)</label>
            <div className={styles.inputGroup}>
              <input
                type="number"
                placeholder="목표 체중"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                min="1"
                step="1"
                className={styles.input}
              />
              <span className={`${styles.weightChangeLabel} ${styles[weightChangeClass]}`}>
                {weightChangeLabel}
              </span>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={styles.registerButton}
              onClick={handleRegisterChallenge}
              disabled={loading}
            >
              챌린지 시작
            </button>
          </div>

          {endDate && new Date() > new Date(endDate) && isChallengeRegistered && (
            <div className={styles.alert}>
              챌린지 기간이 종료되었습니다. 새로 등록할 수 있습니다.
            </div>
          )}
        </div>
      )}

      {/* 진행 중인 챌린지 */}
      {ongoingChallenge && (
        <div className={styles.ongoingSection}>
          <h2 className={styles.subtitle}>진행 중인 챌린지</h2>
          <div className={styles.challengeCard}>
            <div className={styles.challengeInfo}>
              <div className={styles.challengeHeader}>
                <span className={styles.goalIcon}>
                  {goalOptions[0].icon}
                </span>
                <h3 className={styles.challengeTitle}>{ongoingChallenge.goal}</h3>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>{calculateProgress()}% 달성</span>
              </div>
              <div className={styles.challengeDetails}>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>📅</span>
                  기간: {ongoingChallenge.period}{ongoingChallenge.periodUnit}
                </p>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>🚀</span>
                  시작 날짜: {new Date(ongoingChallenge.startDate + 'T00:00:00').toLocaleDateString()}
                </p>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>🏁</span>
                  종료 날짜: {new Date(ongoingChallenge.endDate + 'T00:00:00').toLocaleDateString()}
                </p>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>⚖️</span>
                  시작 몸무게: {ongoingChallenge.startWeight}kg
                </p>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>🎯</span>
                  목표 체중: {ongoingChallenge.targetWeight}kg
                </p>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>🏋️</span>
                  현재 몸무게: {userWeight ? `${userWeight}kg` : '로딩 중...'}
                </p>
                <p className={styles.challengeDetail}>
                  <span className={styles.detailIcon}>📊</span>
                  상태: <span className={`${styles.statusLabel} ${styles[ongoingChallenge.status.toLowerCase()]}`}>
                    {ongoingChallenge.status ? getStatusLabel(ongoingChallenge.status) : '로딩 중...'}
                  </span>
                </p>
              </div>
            </div>
            {ongoingChallenge.status === 'ONGOING' && (
              <button
                className={styles.failButton}
                onClick={handleFailChallenge}
                disabled={loading}
              >
                중단
              </button>
            )}
          </div>

          {/* 몸무게 히스토리 그래프 */}
          <div className={styles.weightHistorySection}>
            <h3 className={styles.chartTitle}>몸무게 변화</h3>
            {weightHistory.length > 0 ? (
              <div className={styles.chartContainer}>
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className={styles.noData}>몸무게 히스토리가 없습니다.</p>
            )}
          </div>
        </div>
      )}

      {/* 과거 챌린지 */}
      <div className={styles.pastChallengesSection}>
        <h2 className={styles.subtitle}>과거 챌린지</h2>
        {allChallenges.length > 0 ? (
          allChallenges
            .filter((challenge) => challenge.status !== 'ONGOING')
            .map((challenge) => (
              <div key={challenge.id} className={styles.challengeCard}>
                <div className={styles.challengeInfo}>
                  <div className={styles.challengeHeader}>
                    <span className={styles.goalIcon}>
                      {goalOptions[0].icon}
                    </span>
                    <h3 className={styles.challengeTitle}>{challenge.goal}</h3>
                  </div>
                  <div className={styles.challengeDetails}>
                    <p className={styles.challengeDetail}>
                      <span className={styles.detailIcon}>📅</span>
                      기간: {challenge.period}{challenge.periodUnit}
                    </p>
                    <p className={styles.challengeDetail}>
                      <span className={styles.detailIcon}>🚀</span>
                      시작 날짜: {new Date(challenge.startDate + 'T00:00:00').toLocaleDateString()}
                    </p>
                    <p className={styles.challengeDetail}>
                      <span className={styles.detailIcon}>🏁</span>
                      종료 날짜: {new Date(challenge.endDate + 'T00:00:00').toLocaleDateString()}
                    </p>
                    <p className={styles.challengeDetail}>
                      <span className={styles.detailIcon}>⚖️</span>
                      시작 몸무게: {challenge.startWeight}kg
                    </p>
                    <p className={styles.challengeDetail}>
                      <span className={styles.detailIcon}>🎯</span>
                      목표 체중: {challenge.targetWeight}kg
                    </p>
                    <p className={styles.challengeDetail}>
                      <span className={styles.detailIcon}>📊</span>
                      상태: <span className={`${styles.statusLabel} ${styles[challenge.status.toLowerCase()]}`}>
                        {getStatusLabel(challenge.status)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className={styles.noChallenges}>
            과거 챌린지가 없습니다.
          </div>
        )}
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