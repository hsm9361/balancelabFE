// src/components/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL 파라미터 확인
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('data');
        const encodedError = params.get('error');

        if (encodedError) {
          // 에러 데이터 디코딩
          const errorData = JSON.parse(decodeURIComponent(encodedError));
          throw new Error(errorData.message || 'Login failed');
        }

        if (!encodedData) {
          throw new Error('No authentication data received');
        }

        // URL 디코딩 후 JSON 파싱
        const decodedData = decodeURIComponent(encodedData);
        const authData = JSON.parse(decodedData);

        if (authData.type !== 'LOGIN_SUCCESS') {
          throw new Error('Invalid authentication response');
        }

        // hasRequiredInfo 값이 없는 경우 'N'으로 설정
        if (!authData.hasRequiredInfo) {
          authData.hasRequiredInfo = 'N';
        }

        // 부모 창으로 인증 정보 전달
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'LOGIN_SUCCESS',
              username: authData.username,
              email: authData.email,
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken,
              hasRequiredInfo: authData.hasRequiredInfo
            },
            window.location.origin
          );
          // 팝업 창 닫기
          window.close();
        } else {
          // 팝업이 아닌 경우 (직접 URL 접근 등)
          // 로컬 스토리지에 데이터 저장
          const storageData = {
            state: {
              user: {
                username: authData.username || authData.email,
                email: authData.email,
                hasRequiredInfo: authData.hasRequiredInfo
              },
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken,
              status: 'authenticated'
            }
          };
          
          localStorage.setItem('auth-storage', JSON.stringify(storageData));
          localStorage.setItem('accessToken', authData.accessToken);
          localStorage.setItem('refreshToken', authData.refreshToken);
          
          // 메인 페이지로 이동 (모달은 Header에서 처리)
          navigate('/');
        }
      } catch (err) {
        console.error('Authentication failed:', err);
        // 에러 발생 시 부모 창에 알림
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'LOGIN_ERROR',
              error: err.message
            },
            window.location.origin
          );
          window.close();
        } else {
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  // 로딩 상태 표시
  return (
    <div className="loading">
      <p>인증 처리 중...</p>
    </div>
  );
};

export default AuthCallback;