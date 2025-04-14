// src/hooks/useAuth.ts
import { useCallback, useEffect, useState } from 'react';

interface User {
  username: string;
  email?: string;
  hasRequiredInfo?: 'Y' | 'N';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'authenticated' | 'unauthenticated';
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState | null>(() => {
    try {
      const storedAuth = localStorage.getItem('auth-storage');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        return parsed.state;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse stored auth data:', error);
      return null;
    }
  });

  // 인증 상태 업데이트 함수
  const updateAuthState = useCallback((newState: AuthState) => {
    setAuthState(newState);
  }, []);

  // 로그아웃 처리
  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthState(null);
  }, []);

  // 초기 인증 상태 로드
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          setAuthState(parsed.state);
        } else {
          setAuthState(null);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setAuthState(null);
      }
    };

    // 스토리지 변경 이벤트 리스너 (다른 탭/창의 변경사항)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth-storage') {
        loadAuthState();
      }
    };

    // 현재 창의 auth-update 이벤트 리스너
    const handleAuthUpdate = (event: CustomEvent<AuthState>) => {
      setAuthState(event.detail);
    };

    // 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-update', handleAuthUpdate as EventListener);

    // 초기 상태 로드
    loadAuthState();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-update', handleAuthUpdate as EventListener);
    };
  }, []);

  return {
    user: authState?.user || null,
    isAuthenticated: !!authState,
    hasRequiredInfo: authState?.user?.hasRequiredInfo === 'Y',
    accessToken: authState?.accessToken || null,
    refreshToken: authState?.refreshToken || null,
    updateAuthState,
    handleLogout
  };
};

export default useAuth;