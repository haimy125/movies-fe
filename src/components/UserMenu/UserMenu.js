// src/components/UserMenu.js

import React, { useState,useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/authService';
import './UserMenu.css';
import Cookies from 'js-cookie';
const UserMenu = () => {
  const { user,isAuthenticated } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Xóa cookie token và thực hiện đăng xuất
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.href = '/login';
  };

  return (
    <div className="user-menu">
    {isAuthenticated && user ? ( 
      <div className="user-menu-container" onClick={handleMenuToggle}>
        <img 
        src={`http://localhost:1412/api/login/view/${user?.id}`} 
          alt="User Avatar" 
          className="user-avatar" 
        />
        <span className="user-name">
          {user.username}
        </span>
        {isMenuOpen && (
          <div className="user-menu-dropdown">
            {user.role.id ===1 ? <Link to="/admin/home">Trang quản lý</Link> : ''}
            <Link to="/user/profile">Thông tin tài khoản</Link>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    ) : (
      <div className='login'>
        <Link to="/login">Đăng nhập</Link>
        <Link to="/register">Đăng ký</Link>
      </div>
    )}
  </div>
);
};

export default UserMenu;
