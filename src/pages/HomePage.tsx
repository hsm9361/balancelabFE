import React from 'react';
import { useApi } from '../hooks/useApi';

const HomePage = () => {
  const { data, loading, error, execute } = useApi();

  React.useEffect(() => {
    // API 호출 예시
    execute('/some-endpoint');
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Welcome to Balance Lab</h1>
      {/* 데이터 표시 */}
    </div>
  );
};

export default HomePage; 