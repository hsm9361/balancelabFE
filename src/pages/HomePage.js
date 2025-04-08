import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Balance Lab</h1>
      <nav>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <div className="main-content">
        <h2>Welcome to Balance Lab</h2>
        <p>메인 페이지 내용을 여기에 작성하세요.</p>
      </div>
    </div>
  );
};

export default HomePage; 