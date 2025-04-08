import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>About 페이지 내용을 여기에 작성하세요.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default AboutPage; 