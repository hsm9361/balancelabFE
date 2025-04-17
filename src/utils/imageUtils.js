const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getImageUrl = (path) => {
  if (!path) {
    console.log('No image path provided');
    return null;
  }
  if (path.startsWith('data:')) {
    console.log('Using local preview:', path.slice(0, 30));
    return path;
  }
  // 서버 경로 조합 (예: http://localhost:8080/uploads/profiles/filename.png)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_BASE_URL}/uploads${normalizedPath}`;
  console.log('Requesting server image:', fullUrl);
  return fullUrl;
};