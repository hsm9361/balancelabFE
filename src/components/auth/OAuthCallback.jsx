import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 토큰 정보 추출
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('token');
        
        if (accessToken) {
          // 토큰 저장
          localStorage.setItem('accessToken', accessToken);
          
          // 원래 페이지로 리다이렉트 (또는 기본값으로 마이페이지)
          const redirectPath = localStorage.getItem('redirectPath') || '/mypage';
          localStorage.removeItem('redirectPath'); // 리다이렉트 경로 제거
          navigate(redirectPath);
        } else {
          console.error('No token received');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>처리 중입니다...</p>
    </div>
  );
};

export default OAuthCallback; 