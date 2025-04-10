// src/components/ProtectedRoute.jsx
import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  // 마이페이지는 로그인 필수, 다른 페이지는 모달로 안내
  if (!isAuthenticated) {
    if (location.pathname === '/mypage') {
      return <Navigate to="/" replace />;
    }
    
    if (!showModal) {
      setShowModal(true);
    }
  }

  return (
    <>
      <AuthModal
        isOpen={showModal && !isAuthenticated}
        onClose={() => setShowModal(false)}
        type="required"
      />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;