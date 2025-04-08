import React from 'react';
import styles from '../../assets/css/pages/mypage/mypage.module.css';

function MyCalendar() {
  // 더미 데이터 - 실제 구현 시 API나 상태관리를 통해 데이터 불러올 예정
  const currentMonth = '2025년 4월';
  
  // 간단한 달력 그리드 (실제로는 더 정교한 달력 라이브러리 사용 권장)
  const weeks = [
    ['', '', '1', '2', '3', '4', '5'],
    ['6', '7', '8', '9', '10', '11', '12'],
    ['13', '14', '15', '16', '17', '18', '19'],
    ['20', '21', '22', '23', '24', '25', '26'],
    ['27', '28', '29', '30', '', '', '']
  ];
  
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.contentTitle}>캘린더</h2>
      
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button className={styles.monthNav}>◀</button>
          <h3 className={styles.currentMonth}>{currentMonth}</h3>
          <button className={styles.monthNav}>▶</button>
        </div>
        
        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            {weekdays.map((day, index) => (
              <div key={index} className={styles.weekday}>{day}</div>
            ))}
          </div>
          
          <div className={styles.calendarGrid}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`${styles.day} ${!day ? styles.emptyDay : ''}`}
                  >
                    {day}
                    {day === '8' && <div className={styles.eventIndicator}></div>}
                    {day === '15' && <div className={styles.eventIndicator}></div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.scheduleList}>
          <h4>이번 달 기록</h4>
          <ul className={styles.scheduleItems}>
            <li className={styles.scheduleItem}>
              <span className={styles.scheduleDate}>4월 8일</span>
              <span className={styles.scheduleTitle}>식단 기록</span>
            </li>
            <li className={styles.scheduleItem}>
              <span className={styles.scheduleDate}>4월 15일</span>
              <span className={styles.scheduleTitle}>운동 기록</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;