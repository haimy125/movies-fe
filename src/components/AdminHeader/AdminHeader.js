import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import './AdminHeader.css'; // Tạo file CSS cho styling

const HeaderAdmin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
  }, []);

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

export default HeaderAdmin;
