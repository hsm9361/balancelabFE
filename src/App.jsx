import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './layouts/Header.jsx';
import Footer from './layouts/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ImageAnalysisPage from './pages/imageAnalysis/ImageAnalysisPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import MyPage from './pages/mypage/MyPage.jsx';
import './App.css';
import ImageAnalysisResultPage from './pages/imageAnalysis/ImageAnalysisResultPage.jsx';
import LoadingPage from './components/imageAnalysis/LoadingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import HealthPrediction from './pages/healthPrediction/HealthPrediction.jsx';
import PredictionResult from './pages/healthPrediction/PredictionResult.jsx';
import DietAnalysisPage from './pages/dietAnalysis/DietAnalysisPage.jsx';
import DietAnalysisResultPage from './pages/dietAnalysis/DietAnalysisResultPage.jsx';
import DietLoadingPage from './components/dietAnalysis/DietLoadingPage.jsx';
import DietConsulting from './pages/dietConsulting/DietConsultingResult.jsx';
import DietConsultIndex from './pages/dietConsulting/DietConsultIndex.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import HealthPredictionIndex from './pages/healthPrediction/HealthPredictionIndex.jsx';

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
            <Route path="/healthprediction">
              <Route index element={<HealthPredictionIndex />} />
              <Route path="form" element={<HealthPrediction />} />
              <Route path="result" element={<PredictionResult />} />
            </Route>
            <Route path="/diet-consulting">
              <Route index element={<DietConsultIndex />} />
              <Route path="result" element={<DietConsulting />} />
            </Route>
            <Route path="/analysis">
              <Route index element={<AnalysisPage />} />
              <Route path="image-analysis">
                <Route index element={<ImageAnalysisPage />} />
                <Route path="loading" element={<LoadingPage />} />
                <Route path="result" element={<ImageAnalysisResultPage />} />
              </Route>
              <Route path="diet-analysis">
                <Route index element={<DietAnalysisPage />} />
                <Route path="loading" element={<DietLoadingPage />} />
                <Route path="result" element={<DietAnalysisResultPage />} />
              </Route>
            </Route>
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