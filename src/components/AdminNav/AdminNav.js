import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminNav.css'; // Tạo file CSS cho styling

const AdminNav = () => {
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
    <nav className='admin_nav'>
      <div className='admin_action'>
        <NavLink to='/admin/home' className={({ isActive }) => (isActive ? 'active_nav' : '')}>
          <i className="fa-solid fa-chart-simple"></i> Thống kê
        </NavLink>
      </div>
      <div className='admin_action'>
        <NavLink to='/admin/users' className={({ isActive }) => (isActive ? 'active_nav' : '')}>
          <i className="fa-solid fa-users"></i> Quản lý Người dùng
        </NavLink>
      </div>
      <div className='admin_action'>
        <NavLink to='/admin/category' className={({ isActive }) => (isActive ? 'active_nav' : '')}>
          <i className="fa-solid fa-layer-group"></i> Quản lý thể loại
        </NavLink>
      </div>
      
      <div className='admin_action'>
        <NavLink to='/admin/movie' className={({ isActive }) => (isActive ? 'active_nav' : '')}>
          <i className="fa-solid fa-video"></i> Quản lý phim
        </NavLink>
      </div>
      <div className='admin_action'>
        <NavLink to='/admin/orders' className={({ isActive }) => (isActive ? 'active_nav' : '')}>
        <i class="fa-solid fa-crown"></i> Quản lý phim đã mua
        </NavLink>
      </div>
    </nav>
  );
};

export default AdminNav;
