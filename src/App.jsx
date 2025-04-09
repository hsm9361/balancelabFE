import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import DietAnalysisPage from './pages/dietAnalysis/DietAnalysisPage.jsx';
import DietAnalysisResultPage from './pages/dietAnalysis/DietAnalysisResultPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis">
              <Route index element={<ImageAnalysisPage />} /> {/* /analysis */}
              <Route path="loading" element={<LoadingPage />} /> {/* /analysis/loading */}
              <Route path="result" element={<ImageAnalysisResultPage />} /> {/* /analysis/result */}
            </Route>
            <Route path="/dietAnalysis">
              <Route index element={<DietAnalysisPage />} /> {/* /dietAnalysis */}
              <Route path="result" element={<DietAnalysisResultPage />} /> {/* /dietAnalysis/result */}
            </Route>
            <Route path="/diet" element={<DietPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 