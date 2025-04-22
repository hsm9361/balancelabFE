import React, { useState, useEffect } from 'react';
import styles from '../../assets/css/components/mypage/Challenge.module.css';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import { useChallenge } from '../../hooks/useChallenge';
import { useMemberInfo } from '../../hooks/useMemberInfo';

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
    fetchOngoingChallenge,
  } = useChallenge();

  const { fetchMemberInfo, error: memberError, loading: memberLoading } = useMemberInfo(() => {});
  const [userWeight, setUserWeight] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [customGoalInput, setCustomGoalInput] = useState('');

  // 목표 옵션 배열 (아이콘 포함)
  const goalOptions = [
    { value: '체중조절', label: '⚖️ 체중조절' },
    { value: '건강관리', label: '🩺 건강관리' },
    { value: '근성장', label: '💪 근성장' },
    { value: '지구력증가', label: '🏃‍♂️ 지구력증가' },
    { value: '기타', label: '✍️ 기타' },
  ];

  // 유저 정보 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMemberInfo();
        console.log('Fetched member info:', data);
        if (data?.weight) {
          setUserWeight(parseFloat(data.weight));
        } else {
          setModalTitle('오류');
          setModalMessage('몸무게 정보를 불러올 수 없습니다. 회원 정보 페이지에서 설정해주세요.');
          setModalOpen(true);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setModalTitle('오류');
        setModalMessage('데이터를 불러오는데 실패했습니다: ' + err.message);
        setModalOpen(true);
      }
    };
    loadData();
  }, [fetchMemberInfo]);

  // 태그 선택 핸들러
  const handleGoalSelect = (value) => {
    setSelectedGoal(value);
    if (value !== '기타') {
      setCustomGoalInput('');
    }
  };

  // 기타 입력창 변경 핸들러
  const handleCustomGoalChange = (e) => setCustomGoalInput(e.target.value);

  // 체중 비교 함수
  const getWeightChangeLabel = () => {
    if (!targetWeight || !userWeight) return { label: '', className: '' };
    const target = parseInt(targetWeight);
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
    const finalGoal = selectedGoal === '기타' ? customGoalInput : selectedGoal;

    if (!finalGoal || !period) {
      setModalTitle('오류');
      setModalMessage('모든 필드를 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (!Number(period) || Number(period) <= 0) {
      setModalTitle('오류');
      setModalMessage('기간은 1 이상의 숫자를 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (selectedGoal === '체중조절' && (!targetWeight || !Number(targetWeight) || Number(targetWeight) <= 0)) {
      setModalTitle('오류');
      setModalMessage('목표 체중은 1 이상의 숫자를 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (selectedGoal === '기타' && !customGoalInput.trim()) {
      setModalTitle('오류');
      setModalMessage('기타 목표를 입력해주세요.');
      setModalOpen(true);
      return;
    }
    if (challengeStatus === '진행중' && isChallengeRegistered && endDate && new Date() <= endDate) {
      setModalTitle('오류');
      setModalMessage('진행중인 챌린지가 존재합니다. 실패 버튼을 눌러 새로 등록해주세요.');
      setModalOpen(true);
      return;
    }

    registerChallenge(finalGoal);
  };

  // 실패 버튼 핸들러
  const handleFailChallenge = () => {
    setModalTitle('확인');
    setModalMessage('이 챌린지를 실패 처리하시겠습니까?');
    setModalOpen(true);
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
      <div className={styles.card}>
        <h1 className={styles.title}>나만의 챌린지 시작하기</h1>

        {/* 목표 선택 */}
        <div className={styles.section}>
          <label className={styles.label}>목표 선택</label>
          <div className={styles.tagContainer}>
            {goalOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.tag} ${selectedGoal === option.value ? styles.tagSelected : ''}`}
                onClick={() => handleGoalSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedGoal === '기타' && (
            <input
              type="text"
              placeholder="기타 목표를 입력해주세요"
              value={customGoalInput}
              onChange={handleCustomGoalChange}
              className={styles.input}
            />
          )}
        </div>

        {/* 기간 선택 */}
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

        {/* 목표 체중 */}
        {selectedGoal === '체중조절' && (
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
        )}

        {/* 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.registerButton}
            onClick={handleRegisterChallenge}
            disabled={loading}
          >
            챌린지 시작
          </button>
        </div>

        {/* 기간 종료 알림 */}
        {endDate && new Date() > endDate && isChallengeRegistered && (
          <div className={styles.alert}>
            챌린지 기간이 종료되었습니다. 새로 등록할 수 있습니다.
          </div>
        )}
      </div>

      {/* 진행 중인 챌린지 */}
      {ongoingChallenge && (
        <div className={styles.ongoingSection}>
          <h2 className={styles.subtitle}>진행 중인 챌린지</h2>
          <div className={styles.challengeCard}>
            <div className={styles.challengeInfo}>
              <h3 className={styles.challengeTitle}>{ongoingChallenge.goal}</h3>
              <p className={styles.challengeDetail}>
                기간: {ongoingChallenge.period}
              </p>
              <p className={styles.challengeDetail}>
                시작 날짜: {new Date(ongoingChallenge.startDate + 'T00:00:00').toLocaleDateString()}
              </p>
              <p className={styles.challengeDetail}>
                종료 날짜: {new Date(ongoingChallenge.endDate + 'T00:00:00').toLocaleDateString()}
              </p>
              {ongoingChallenge.targetWeight && (
                <p className={styles.challengeDetail}>
                  목표 체중: {ongoingChallenge.targetWeight}kg
                </p>
              )}
            </div>
            <button
              className={styles.failButton}
              onClick={handleFailChallenge}
              disabled={loading}
            >
              실패
            </button>
          </div>
        </div>
      )}

      {/* CustomModal */}
      <CustomModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        onConfirm={
          modalTitle === '성공' ? handleCloseModal :
          modalTitle === '확인' ? () => handleModalConfirm('fail') : null
        }
      />
    </div>
  );
}

export default Challenge;