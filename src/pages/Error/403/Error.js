// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import './Error403.css'; // Nếu bạn muốn thêm CSS tùy chỉnh
const Error403 = () => {
  return (
    <>
    <Header/>
    <div className="not-found-page">
      <h1 className="not-found-title">403</h1>
      <p className="not-found-message">Bạn không đủ quyền hạn!</p>
      <Link className="not-found-link" to="/">Go to Home</Link>
    </div>
    <Footer/>
    </>
  );
};

export default Error403;
