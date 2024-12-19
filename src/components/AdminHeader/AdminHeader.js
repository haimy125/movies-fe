import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import './AdminHeader.css'; // Tạo file CSS cho styling


const AdminHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className='admin_header'>
            <div className='admin_logo'>
              <a href='/'>
                <img src="/logo.png" alt='logo'className='admin_logo_img'/>
                <span className='logo_name'>Admin</span>
                </a>
            </div>
      <UserMenu/>
    </header>
  );
};

export default AdminHeader;
