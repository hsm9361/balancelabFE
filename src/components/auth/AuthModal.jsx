import React, { useEffect, useRef, useCallback } from 'react';
import Modal from '../common/Modal';
import styles from '../../assets/css/components/Modal.module.css';
import useAuth from '../../hooks/useAuth';

const AuthModal = ({ isOpen, onClose, type = 'required', onLoginSuccess }) => {
  const loginWindowRef = useRef(null);
  const { updateAuthState } = useAuth();  // useAuth hook에서 updateAuthState 가져오기

  // 사용자 정보 저장 및 설정
  const handleAuthData = async (authData) => {
    try {
      const { username, email, accessToken, refreshToken } = authData;
      
      const authState = {
        user: {
          username: username || email,
          email,
        },
        accessToken,
        refreshToken,
        status: 'authenticated'
      };

      // 로컬 스토리지에 인증 정보 저장
      localStorage.setItem('auth-storage', JSON.stringify({ state: authState }));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 전역 인증 상태 업데이트
      updateAuthState(authState);

      // CustomEvent를 발생시켜 현재 창의 상태 업데이트 트리거
      window.dispatchEvent(new CustomEvent('auth-update', { detail: authState }));

      // 팝업 창 닫기
      if (loginWindowRef.current) {
        loginWindowRef.current.close();
        loginWindowRef.current = null;
      }

      return authState;
    } catch (error) {
      console.error('Error handling auth data:', error);
      return null;
    }
  };

  // 로그인 메시지 처리
  const handleLoginMessage = useCallback(async (event) => {
    // 출처 검증
    if (event.origin !== window.location.origin) {
      return;
    }

    const { type, error, ...authData } = event.data;

    if (type === 'LOGIN_SUCCESS') {
      try {
        const authState = await handleAuthData(authData);
        if (authState) {
          // 부모 컴포넌트에 로그인 성공 알림
          if (onLoginSuccess) {
            onLoginSuccess(authState);
          }
          // 모달 닫기
          onClose();
        }
      } catch (err) {
        console.error('Failed to process login:', err);
      }
    } else if (type === 'LOGIN_ERROR') {
      console.error('Login error:', error);
      onClose();
    }
  }, [onClose, onLoginSuccess, updateAuthState]);

  // 메시지 이벤트 리스너 설정
  useEffect(() => {
    window.addEventListener('message', handleLoginMessage);
    return () => {
      window.removeEventListener('message', handleLoginMessage);
    };
  }, [handleLoginMessage]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (loginWindowRef.current) {
        loginWindowRef.current.close();
      }
    };
  }, []);

  const handleGoogleLogin = useCallback(() => {
    // 이미 열린 창이 있다면 닫기
    if (loginWindowRef.current) {
      loginWindowRef.current.close();
    }

    // 팝업 창 크기와 위치 계산
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // 구글 로그인 URL에 redirect_uri 추가 (Spring Security의 기본 OAuth2 콜백 URL 사용)
    const redirectUri = encodeURIComponent('http://localhost:3000/oauth/callback');
    const googleAuthUrl = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${redirectUri}`;
    
    loginWindowRef.current = window.open(
      googleAuthUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (loginWindowRef.current) {
      loginWindowRef.current.focus();
    } else {
      console.error('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  }, []);

  const handleCancel = useCallback(() => {
    if (loginWindowRef.current) {
      loginWindowRef.current.close();
    }
    onClose();
    // 메인 페이지로 리다이렉트
    window.location.href = '/';
  }, [onClose]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const handleLoginSuccess = async (token) => {
    try {
      console.log('Received token:', token);
      
      // 토큰이 없거나 유효하지 않은 경우
      if (!token || token.length < 10) {
        console.error('Invalid token received');
        return;
      }

      // 사용자 정보 가져오기
      const userInfo = await fetchUserInfo(token);
      
      // 인증 상태 업데이트
      const authState = {
        user: userInfo,
        token: token,
        status: 'authenticated'
      };
      
      handleAuthData(authState);
      
      // 페이지 새로고침 (약간의 지연 후)
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('Login success handling failed:', error);
    }
  };

  const modalContent = {
    required: {
      title: '로그인이 필요합니다',
      message: '이 기능을 사용하기 위해서는 로그인이 필요합니다.',
      buttons: (
        <>
          <button className={styles.primaryButton} onClick={handleGoogleLogin}>
            구글로 로그인
          </button>
          <button className={styles.secondaryButton} onClick={handleCancel}>
            취소
          </button>
        </>
      )
    },
    error: {
      title: '서버 오류',
      message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      buttons: (
        <button className={styles.primaryButton} onClick={handleCancel}>
          확인
        </button>
      )
    },
    timeout: {
      title: '연결 시간 초과',
      message: '서버 응답 시간이 초과되었습니다. 인터넷 연결을 확인하고 다시 시도해주세요.',
      buttons: (
        <button className={styles.primaryButton} onClick={handleCancel}>
          확인
        </button>
      )
    },
    connection: {
      title: '연결 실패',
      message: '서버에 연결할 수 없습니다. 인터넷 연결을 확인하고 다시 시도해주세요.',
      buttons: (
        <button className={styles.primaryButton} onClick={handleCancel}>
          확인
        </button>
      )
    }
  };

  const content = modalContent[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={content.title}
      buttons={content.buttons}
    >
      <p>{content.message}</p>
    </Modal>
  );
};

export default AuthModal; 