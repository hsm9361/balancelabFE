import React, { useState } from 'react';

function HealthPredictionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
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

      <div className="form-group2">
        <label>주 음주 회수</label>
        <div className="radio-group2">
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="0"
              checked={formData.drinkWeekly === '0'}
              onChange={handleChange}
            />
            0회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="1"
              checked={formData.drinkWeekly === '1'}
              onChange={handleChange}
            />
            1회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="2"
              checked={formData.drinkWeekly === '2'}
              onChange={handleChange}
            />
            2회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="3"
              checked={formData.drinkWeekly === '3'}
              onChange={handleChange}
            />
            3회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="4"
              checked={formData.drinkWeekly === '4'}
              onChange={handleChange}
            />
            4회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="5"
              checked={formData.drinkWeekly === '5'}
              onChange={handleChange}
            />
            5회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="6"
              checked={formData.drinkWeekly === '6'}
              onChange={handleChange}
            />
            6회
          </label>
          <label>
            <input
              type="radio"
              name="drinkWeekly"
              value="7"
              checked={formData.drinkWeekly === '7'}
              onChange={handleChange}
            />
            7회
          </label>
        </div>
      </div>

      <div className="form-group2">
        <label>주 운동 회수</label>
        <div className="radio-group2">
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="0"
              checked={formData.exerciseWeekly === '0'}
              onChange={handleChange}
            />
            0회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="1"
              checked={formData.exerciseWeekly === '1'}
              onChange={handleChange}
            />
            1회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="2"
              checked={formData.exerciseWeekly === '2'}
              onChange={handleChange}
            />
            2회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="3"
              checked={formData.exerciseWeekly === '3'}
              onChange={handleChange}
            />
            3회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="4"
              checked={formData.exerciseWeekly === '4'}
              onChange={handleChange}
            />
            4회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="5"
              checked={formData.exerciseWeekly === '5'}
              onChange={handleChange}
            />
            5회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="6"
              checked={formData.exerciseWeekly === '6'}
              onChange={handleChange}
            />
            6회
          </label>
          <label>
            <input
              type="radio"
              name="exerciseWeekly"
              value="7"
              checked={formData.exerciseWeekly === '7'}
              onChange={handleChange}
            />
            7회
          </label>
        </div>
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

      

      <button type="submit" className="predict-button">예측하기</button>
    </form>
  );
}

export default HealthPredictionForm; 