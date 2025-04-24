import React, { useState, useEffect, useRef } from 'react';
import styles from '../../assets/css/components/mypage/Challenge.module.css';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import { useChallenge } from '../../hooks/useChallenge';
import { useMemberInfo } from '../../hooks/useMemberInfo';
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
    modalConfirmHandler,
    setModalConfirmHandler,
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
    fetchOngoingChallenge,
    fetchAllChallenges,
  } = useChallenge();

  const { fetchMemberInfo, error: memberError, loading: memberLoading } = useMemberInfo(() => {});
  const [userWeight, setUserWeight] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log('Clicked outside, closing dropdown');
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 목표 옵션 배열
  const goalOptions = [
    { value: '체중조절', label: '⚖️ 체중조절', icon: '⚖️' },
  ];

  // 진행률 계산
  const calculateProgress = () => {
    if (!ongoingChallenge?.startWeight || !ongoingChallenge?.targetWeight || !userWeight) {
      console.warn('Progress calculation: Missing weights', {
        startWeight: ongoingChallenge?.startWeight,
        targetWeight: ongoingChallenge?.targetWeight,
        userWeight,
      });
      return 0;
    }

    const startWeight = parseFloat(ongoingChallenge.startWeight);
    const targetWeight = parseFloat(ongoingChallenge.targetWeight);
    const currentWeight = parseFloat(userWeight);

    if (isNaN(startWeight) || isNaN(targetWeight) || isNaN(currentWeight)) {
      console.error('Progress calculation: Invalid weight values', {
        startWeight,
        targetWeight,
        currentWeight,
      });
      return 0;
    }

    const targetChange = targetWeight - startWeight;
    if (targetChange === 0) {
      console.warn('Progress calculation: No weight change required');
      return 100;
    }

    const currentChange = currentWeight - startWeight;
    let progress = (currentChange / targetChange) * 100;

    if (targetChange > 0) {
      progress = Math.min(Math.max(progress, 0), 100);
    } else {
      progress = Math.min(Math.max(progress, 0), 100);
    }

    const finalProgress = progress.toFixed(0);
    console.log('Progress calculation:', {
      startWeight,
      targetWeight,
      currentWeight,
      targetChange,
      currentChange,
      progress: finalProgress,
    });

    return finalProgress;
  };

  // 몸무게 히스토리 디버깅
  useEffect(() => {
    console.log('Weight history for chart:', weightHistory);
    weightHistory.forEach((entry) => {
      console.log('Parsing insDate:', entry.insDate, new Date(entry.insDate));
    });
  }, [weightHistory]);

  // 몸무게 히스토리 차트 데이터
  const chartData = {
    labels: weightHistory.map((entry) =>
      new Date(entry.insDate).toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: '몸무게 (kg)',
        data: weightHistory.map((entry) => parseFloat(entry.weight).toFixed(1)),
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
              data: Array(weightHistory.length).fill(parseFloat(ongoingChallenge.targetWeight).toFixed(1)),
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
          font: {
            family: "'Poppins', sans-serif",
            size: 14,
          },
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
          font: {
            family: "'Poppins', sans-serif",
            size: 14,
            weight: '500',
          },
        },
        ticks: {
          color: '#6c757d',
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: '몸무게 (kg)',
          color: '#3b5a7a',
          font: {
            family: "'Poppins', sans-serif",
            size: 14,
            weight: '500',
          },
        },
        ticks: {
          color: '#6c757d',
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
        },
        suggestedMin: Math.min(
          ...weightHistory.map((entry) => parseFloat(entry.weight)),
          ongoingChallenge?.targetWeight ? parseFloat(ongoingChallenge.targetWeight) : Infinity
        ) - 5,
        suggestedMax: Math.max(
          ...weightHistory.map((entry) => parseFloat(entry.weight)),
          ongoingChallenge?.targetWeight ? parseFloat(ongoingChallenge.targetWeight) : -Infinity
        ) + 5,
      },
    },
  };

  // 유저 정보 로드
  useEffect(() => {
    const loadMemberData = async () => {
      try {
        const data = await fetchMemberInfo();
        console.log('Fetched member info:', data);
        if (data?.weight) {
          setUserWeight(parseFloat(data.weight).toFixed(1));
        } else if (data?.weight === 0) {
          setUserWeight("0.0");
        }
      } catch (err) {
        console.error('Failed to load member data:', err);
        setModalTitle('오류');
        setModalMessage('데이터를 불러오는데 실패했습니다: ' + err.message);
        setModalOpen(true);
      }
    };
    loadMemberData();
  }, [fetchMemberInfo]);

  // 챌린지 데이터 로드
  useEffect(() => {
    const loadChallengeData = async () => {
      try {
        await Promise.all([fetchOngoingChallenge(), fetchAllChallenges()]);
      } catch (err) {
        console.error('Failed to load challenge data:', err);
        setModalTitle('오류');
        setModalMessage('챌린지 데이터를 불러오는데 실패했습니다: ' + err.message);
        setModalOpen(true);
      }
    };
    loadChallengeData();
  }, [fetchOngoingChallenge, fetchAllChallenges]);

  // 챌린지 상태 디버깅
  useEffect(() => {
    console.log('Challenge state:', {
      ongoingChallenge,
      isChallengeRegistered,
      challengeStatus,
      endDate,
      allChallenges,
      weightHistory,
    });
    console.log('Filtered past challenges:', allChallenges.filter((challenge) => challenge.status !== 'ONGOING'));
  }, [ongoingChallenge, isChallengeRegistered, challengeStatus, endDate, allChallenges, weightHistory]);

  // 체중 비교 함수
  const getWeightChangeLabel = () => {
    if (!targetWeight || !userWeight) return { label: '', className: '' };
    const target = parseFloat(targetWeight);
    if (isNaN(target)) return { label: '', className: '' };
    let label, className;
    if (target > userWeight) {
      label = '증가';
      className = 'increase';
    } else if (target < userWeight) {
      label = '감소';
      className = 'decrease';
    } else {
      label = '유지';
      className = 'maintain';
    }
    console.log('Target:', targetWeight, 'User Weight:', userWeight, 'Label:', label);
    return { label, className };
  };

  // 챌린지 등록 래퍼 함수
  const handleRegisterChallenge = () => {
    const { label: weightChangeLabel } = getWeightChangeLabel();
    const finalGoal = weightChangeLabel || '유지';

    if (!period || !targetWeight) {
      setModalTitle('오류');
      setModalMessage('기간과 목표 체중을 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (!Number(period) || Number(period) <= 0) {
      setModalTitle('오류');
      setModalMessage('기간은 1 이상의 숫자를 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (!Number(targetWeight) || Number(targetWeight) <= 0) {
      setModalTitle('오류');
      setModalMessage('목표 체중은 0보다 큰 숫자를 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (!userWeight) {
      setModalTitle('오류');
      setModalMessage('현재 몸무게 정보를 불러올 수 없습니다.');
      setModalOpen(true);
      return;
    }

    if (finalGoal === '유지') {
      setModalTitle('알림');
      setModalMessage('목표 체중이 현재 몸무게와 같습니다. 회원 정보 페이지에서 현재 몸무게를 수정해주세요.');
      setModalOpen(true);
      setModalConfirmHandler(() => handleCloseModal); // 확인 버튼 클릭 시 모달 닫기
      return;
    }

    registerChallenge(finalGoal, userWeight);
  };

  // 드롭다운 토글
  const toggleDropdown = () => {
    console.log('Toggling dropdown, current state:', isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 실패 버튼 핸들러
  const handleFailChallenge = () => {
    console.log('Fail challenge triggered');
    setModalTitle('확인');
    setModalMessage('이 챌린지를 중단하시겠습니까?');
    setModalOpen(true);
    setIsDropdownOpen(false);
  };

  // 등록 섹션 표시 조건
  const showRegisterSection = (
    (!ongoingChallenge || (endDate && new Date() > new Date(endDate)) || !isChallengeRegistered)
    && showRegisterForm
  );

  // 상태 한글 변환
  const getStatusLabel = (status) => {
    switch (status) {
      case 'ONGOING':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      case 'FAILED':
        return '중단';
      default:
        return status;
    }
  };

  if (memberLoading) {
    return <div className={styles.loading}>유저 정보 로딩 중...</div>;
  }
  if (memberError) {
    return (
      <div className={styles.error}>
        {memberError}
        <button
          onClick={() => fetchMemberInfo()}
          className={styles.retryButton}
        >
          재시도
        </button>
      </div>
    );
  }

  const { label: weightChangeLabel, className: weightChangeClass } = getWeightChangeLabel();

  return (
    <div className={styles.container}>
      {/* 챌린지 등록 섹션 */}
      {(showRegisterSection && showRegisterForm) && (
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
            <div className={styles.weightRow}>
              {/* 왼쪽: 현재 몸무게 */}
              <div className={styles.weightColumn}>
                <div className={styles.inputLikeBox}>
                  🏋️ 현재 몸무게 {userWeight ? `${userWeight}kg` : '로딩 중...'}
                </div>
              </div>

              {/* 오른쪽: 목표 체중 + 변화 레이블 */}
              <div className={styles.weightColumn} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="목표 체중"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  min="0.1"
                  step="0.1"
                  className={styles.input}
                />
                <span className={`${styles.weightChangeLabel} ${styles[weightChangeClass]}`}>
                  {weightChangeLabel && `${weightChangeLabel}`}
                </span>
              </div>
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
      <div className={styles.ongoingSection}>
        <h2 className={styles.subtitle}>진행 중인 챌린지</h2>
        {ongoingChallenge ? (
          <div className={styles.challengeCard}>
            <div className={styles.challengeInfo}>
              <div className={styles.challengeHeader}>
                <span className={styles.goalIcon}>
                  {goalOptions[0].icon}
                </span>
                <h3 className={styles.challengeTitle}>{ongoingChallenge.goal}</h3>
                <button
                  className={styles.moreButton}
                  onClick={toggleDropdown}
                  disabled={loading}
                >
                  ...
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu} ref={dropdownRef}>
                    <button
                      className={styles.failButton}
                      onClick={handleFailChallenge}
                      disabled={loading}
                    >
                      <span className={styles.failButtonIcon}>✕</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* 진행률 컨테이너 */}
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className={styles.progressTextContainer}>
                <span className={styles.progressZero}>0%</span>
                <span className={styles.progressText}>{calculateProgress()}% 달성</span>
              </div>
            </div>

            {/* 챌린지 세부 정보 */}
            <div className={styles.challengeDetails}>
              <table className={styles.challengeTable}>
                <tbody>
                  <tr className={styles.challengeRow}>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        📅 기간: {ongoingChallenge.period}{ongoingChallenge.periodUnit}
                      </span>
                    </td>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        📊 상태: <span className={`${styles.statusLabel} ${styles[ongoingChallenge.status.toLowerCase()]}`}>
                          {ongoingChallenge.status ? getStatusLabel(ongoingChallenge.status) : '로딩 중...'}
                        </span>
                      </span>
                    </td>
                    <td className={styles.challengeCell}></td>
                  </tr>
                  <tr className={styles.challengeRow}>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        🚀 시작 날짜: {new Date(ongoingChallenge.startDate + 'T00:00:00').toLocaleDateString()}
                      </span>
                    </td>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        🏁 종료 날짜: {new Date(ongoingChallenge.endDate + 'T00:00:00').toLocaleDateString()}
                      </span>
                    </td>
                    <td className={styles.challengeCell}></td>
                  </tr>
                  <tr className={styles.challengeRow}>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        ⚖️ 시작 몸무게: {parseFloat(ongoingChallenge.startWeight).toFixed(1)}kg
                      </span>
                    </td>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        🎯 목표 체중: {parseFloat(ongoingChallenge.targetWeight).toFixed(1)}kg
                      </span>
                    </td>
                    <td className={styles.challengeCell}>
                      <span className={styles.challengeText}>
                        🏋️ 현재 몸무게: {userWeight ? `${userWeight}kg` : '로딩 중...'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
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
        ) : (
          !showRegisterForm && (
            <div className={styles.noChallenges}>
              <p>현재 진행 중인 챌린지가 없습니다.<br />새 챌린지를 시작해 보세요!</p>
              <button
                className={styles.startChallengeButton}
                onClick={() => setShowRegisterForm(true)}
              >
                챌린지 시작하기
              </button>
            </div>
          )
        )}
      </div>

      {/* 과거 챌린지 */}
      <div className={styles.pastChallengesSection}>
        <h2 className={styles.subtitle}>과거 챌린지</h2>
        {allChallenges.length > 0 && allChallenges.some((challenge) => challenge.status !== 'ONGOING') ? (
          <div className={styles.tableContainer}>
            <table className={styles.challengeTable}>
              <thead>
                <tr>
                  <th>목표</th>
                  <th>기간</th>
                  <th>시작 날짜</th>
                  <th>종료 날짜</th>
                  <th>시작 체중</th>
                  <th>목표 체중</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {allChallenges
                  .filter((challenge) => challenge.status !== 'ONGOING')
                  .map((challenge) => (
                    <tr key={challenge.id}>
                      <td>
                        <span className={styles.goalIcon}>{goalOptions[0].icon}</span>
                        {challenge.goal}
                      </td>
                      <td>{challenge.period}{challenge.periodUnit}</td>
                      <td>{new Date(challenge.startDate + 'T00:00:00').toLocaleDateString()}</td>
                      <td>{new Date(challenge.endDate + 'T00:00:00').toLocaleDateString()}</td>
                      <td>{parseFloat(challenge.startWeight).toFixed(1)}kg</td>
                      <td>{parseFloat(challenge.targetWeight).toFixed(1)}kg</td>
                      <td>
                        <span className={`${styles.statusLabel} ${styles[challenge.status.toLowerCase()]}`}>
                          {getStatusLabel(challenge.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noChallenges}>
            과거 챌린지가 없습니다.
          </div>
        )}
      </div>

      <CustomModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        onConfirm={
          modalTitle === '성공' ? handleCloseModal :
          modalTitle === '확인' ? () => handleModalConfirm('fail') :
          modalTitle === '알림' ? handleCloseModal :
          modalConfirmHandler || null
        }
      />
    </div>
  );
}

export default Challenge;