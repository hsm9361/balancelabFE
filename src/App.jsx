// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './layouts/Header.jsx';
import Footer from './layouts/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ImageAnalysisPage from './pages/imageAnalysis/ImageAnalysisPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import DietPage from './pages/DietPage.jsx';
import MyPage from './pages/mypage/MyPage.jsx';
import './App.css';
import ImageAnalysisResultPage from './pages/imageAnalysis/ImageAnalysisResultPage.jsx';
import LoadingPage from './components/imageAnalysis/LoadingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import HealthPrediction from './pages/healthPrediction/HealthPrediction.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/oauth/callback" element={<AuthCallback />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/healthprediction" element={<HealthPrediction />} /> {/* /healthprediction */}
            <Route path="/analysis" element={<ImageAnalysisPage />} />
            <Route path="/analysis/loading" element={<LoadingPage />} />
            <Route path="/analysis/result" element={<ImageAnalysisResultPage />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;