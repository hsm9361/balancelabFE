import React, { useState } from 'react';

function HealthPredictionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    smokeDaily: 'no',
    drinkWeekly: '',
    exerciseWeekly: '',
    historyDiabetes: 'no',
    historyHypertension: 'no',
    historyCardiovascular: 'no',
    dailyCarbohydrate: '',
    dailySugar: '',
    dailyFat: '',
    dailySodium: '',
    dailyFibrin: '',
    dailyWater: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      dailyWater: parseFloat(formData.dailyWater)
    };
    onSubmit(inputData);
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form">
      <div className="form-group">
        <label>나이</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>키 (cm)</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          step="0.1"
          required
        />
      </div>

      <div className="form-group">
        <label>몸무게 (kg)</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          step="0.1"
          required
        />
      </div>

      <div className="form-group">
        <label>성별</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            여성
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>흡연 여부</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="smokeDaily"
              value="yes"
              checked={formData.smokeDaily === 'yes'}
              onChange={handleChange}
            />
            흡연
          </label>
          <label>
            <input
              type="radio"
              name="smokeDaily"
              value="no"
              checked={formData.smokeDaily === 'no'}
              onChange={handleChange}
            />
            비흡연
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>주 음주 회수</label>
        <input
          type="number"
          name="drinkWeekly"
          value={formData.drinkWeekly}
          onChange={handleChange}
          min="0"
          max="7"
          required
        />
      </div>

      <div className="form-group">
        <label>주 운동 회수</label>
        <input
          type="number"
          name="exerciseWeekly"
          value={formData.exerciseWeekly}
          onChange={handleChange}
          min="0"
          max="7"
          required
        />
      </div>

      <div className="form-group">
        <label>당뇨 가족력이 있으신가요?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="historyDiabetes"
              value="yes"
              checked={formData.historyDiabetes === 'yes'}
              onChange={handleChange}
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
            />
            아니요
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>고혈압 가족력이 있으신가요?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="historyHypertension"
              value="yes"
              checked={formData.historyHypertension === 'yes'}
              onChange={handleChange}
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
            />
            아니요
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>심혈관질환 가족력이 있으신가요?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="historyCardiovascular"
              value="yes"
              checked={formData.historyCardiovascular === 'yes'}
              onChange={handleChange}
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
            />
            아니요
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>일일 탄수화물 섭취량 (g)</label>
        <input
          type="number"
          name="dailyCarbohydrate"
          value={formData.dailyCarbohydrate}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>일일 당 섭취량 (g)</label>
        <input
          type="number"
          name="dailySugar"
          value={formData.dailySugar}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>일일 지방 섭취량 (g)</label>
        <input
          type="number"
          name="dailyFat"
          value={formData.dailyFat}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>일일 나트륨 섭취량 (mg)</label>
        <input
          type="number"
          name="dailySodium"
          value={formData.dailySodium}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>일일 섬유질 섭취량 (g)</label>
        <input
          type="number"
          name="dailyFibrin"
          value={formData.dailyFibrin}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>일일 수분 섭취량 (ml)</label>
        <input
          type="number"
          name="dailyWater"
          value={formData.dailyWater}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <button type="submit" className="predict-button">예측하기</button>
    </form>
  );
}

export default HealthPredictionForm; 