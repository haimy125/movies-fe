// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Nếu bạn muốn thêm CSS tùy chỉnh
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
const NotFound = () => {
  return (
    <>
    <Header/>
    <div className="not-found-page">
        
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Trang này không có Hoặc đã bị xóa</p>
      <Link className="not-found-link" to="/">Go to Home</Link>
    </div>
    <Footer/>
    </>
  );
};

export default NotFound;
