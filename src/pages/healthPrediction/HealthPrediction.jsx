import React, { useState } from 'react';
import 'assets/css/pages/healthPrediction/HealthPrediction.css';
function HealthPrediction() {
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

  const [predictions, setPredictions] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
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

    try {
      const response = await fetch('http://192.168.0.66:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Error:', error);
      alert('예측 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="health-prediction">
      <h1>🧬 질병 예측 시스템</h1>
      <h2>생활 습관, 가족력 등을 입력하여 질병 여부를 예측해보세요!</h2>

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

      {predictions && (
        <div className="prediction-results">
          <h3>✅ 예측 결과</h3>
          <div className="result-item">
            <p>🔸 <strong>당뇨 확률:</strong> {(predictions.diabetes * 100).toFixed(2)}%</p>
            {predictions.diabetes >= 0.75 ? (
              <p className="warning">⚠️ 당뇨 가능성이 높습니다.</p>
            ) : (
              <p className="safe">✅ 당뇨 가능성은 낮습니다.</p>
            )}
          </div>

          <div className="result-item">
            <p>🔸 <strong>고혈압 확률:</strong> {(predictions.hypertension * 100).toFixed(2)}%</p>
            {predictions.hypertension >= 0.75 ? (
              <p className="warning">⚠️ 고혈압 가능성이 높습니다.</p>
            ) : (
              <p className="safe">✅ 고혈압 가능성은 낮습니다.</p>
            )}
          </div>

          <div className="result-item">
            <p>🔸 <strong>심혈관질환 확률:</strong> {(predictions.cardiovascular * 100).toFixed(2)}%</p>
            {predictions.cardiovascular >= 0.75 ? (
              <p className="warning">⚠️ 심혈관질환 가능성이 높습니다.</p>
            ) : (
              <p className="safe">✅ 심혈관질환 가능성은 낮습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthPrediction; 