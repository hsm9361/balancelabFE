import React, { useState } from 'react';
import styles from 'assets/css/pages/healthPrediction/HealthPredictionForm.module.css';

function HealthPredictionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    id: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    smokeDaily: '',
    drinkWeekly: '',
    exerciseWeekly: '',
    historyDiabetes: '',
    historyHypertension: '',
    historyCardiovascular: '',
    dailyCarbohydrate: '',
    dailySugar: '',
    dailyFat: '',
    dailySodium: '',
    dailyFibrin: '',
    dailyWater: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputData = {
      age: parseFloat(formData.age),
      gender: formData.gender === 'male' ? 0 : 1,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      historyDiabetes: formData.historyDiabetes === 'yes' ? 1 : 0,
      historyHypertension: formData.historyHypertension === 'yes' ? 1 : 0,
      historyCardiovascular: formData.historyCardiovascular === 'yes' ? 1 : 0,
      smokeDaily: formData.smokeDaily === 'yes' ? 1 : 0,
      drinkWeekly: parseFloat(formData.drinkWeekly),
      exerciseWeekly: parseFloat(formData.exerciseWeekly),
      dailyCarbohydrate: parseFloat(formData.dailyCarbohydrate),
      dailySugar: parseFloat(formData.dailySugar),
      dailyFat: parseFloat(formData.dailyFat),
      dailySodium: parseFloat(formData.dailySodium),
      dailyFibrin: parseFloat(formData.dailyFibrin),
      dailyWater: parseFloat(formData.dailyWater),
    };
    onSubmit(inputData);
  };

  return (
    <div className={styles.healthPrediction}>
      <header className={styles.header}>
        <h1 className={styles.title}>건강 예측 설문지</h1>
        <p className={styles.description}>
          생활 습관과 가족력을 알려주시면 더욱 정확한 건강 예측을 제공합니다.
        </p>
      </header>
      <form onSubmit={handleSubmit} className={styles.predictionForm}>
        <div className={styles.formGroup}>
          <label>흡연하시나요?</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="smokeDaily"
                value="yes"
                checked={formData.smokeDaily === 'yes'}
                onChange={handleChange}
                required
              />
              예
            </label>
            <label>
              <input
                type="radio"
                name="smokeDaily"
                value="no"
                checked={formData.smokeDaily === 'no'}
                onChange={handleChange}
                required
              />
              아니요
            </label>
          </div>
        </div>

        <div className={styles.formGroup2}>
          <label>일주일에 몇 번 술을 드시나요?</label>
          <div className={styles.radioGroup2}>
            {['0', '1', '2', '3', '4', '5', '6', '7'].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="drinkWeekly"
                  value={value}
                  checked={formData.drinkWeekly === value}
                  onChange={handleChange}
                  required
                />
                {value}회
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup2}>
          <label>일주일에 몇 번 운동하시나요?</label>
          <div className={styles.radioGroup2}>
            {['0', '1', '2', '3', '4', '5', '6', '7'].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="exerciseWeekly"
                  value={value}
                  checked={formData.exerciseWeekly === value}
                  onChange={handleChange}
                  required
                />
                {value}회
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>가족 중 당뇨병 환자가 있으신가요?</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="historyDiabetes"
                value="yes"
                checked={formData.historyDiabetes === 'yes'}
                onChange={handleChange}
                required
              />
              예
            </label>
            <label>
              <input
                type="radio"
                name="historyDiabetes"
                value="no"
                checked={formData.historyDiabetes === 'no'}
                onChange={handleChange}
                required
              />
              아니요
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>고혈압 가족력이 있으신가요?</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="historyHypertension"
                value="yes"
                checked={formData.historyHypertension === 'yes'}
                onChange={handleChange}
                required
              />
              예
            </label>
            <label>
              <input
                type="radio"
                name="historyHypertension"
                value="no"
                checked={formData.historyHypertension === 'no'}
                onChange={handleChange}
                required
              />
              아니요
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>가족 중 심혈관 질환 환자가 있나요?</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="historyCardiovascular"
                value="yes"
                checked={formData.historyCardiovascular === 'yes'}
                onChange={handleChange}
                required
              />
              예
            </label>
            <label>
              <input
                type="radio"
                name="historyCardiovascular"
                value="no"
                checked={formData.historyCardiovascular === 'no'}
                onChange={handleChange}
                required
              />
              아니요
            </label>
          </div>
        </div>

        <button type="submit" className={styles.predictButton}>
          결과 확인하기
        </button>
      </form>
    </div>
  );
}

export default HealthPredictionForm;