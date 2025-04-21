import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'react-calendar/dist/Calendar.css'; // react-calendar 기본 스타일
import 'assets/css/pages/calendar/calendar-overrides.css'; // 커스텀 스타일 (마지막에 로드)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
