// src/services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const loginWithGoogle = (): void => {
  // OAuth2 리다이렉트 URL을 클라이언트 측 콜백 URL로 설정
  const redirectUri = `${window.location.origin}/oauth/callback`;
  window.location.href = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const fetchUserInfo = async (token: string): Promise<{ username: string }> => {
  const response = await api.get('/member/fetchUserInfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // { username: string } 형태로 반환
};

export const logout = (): void => {
  // 서버 로그아웃 엔드포인트가 있다면 호출 가능
  // 예: await api.post('/logout');
};