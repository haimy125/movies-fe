// src/components/UserMenu.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserMenu.css";
import { removeToken } from "../../services/tokenService";

const UserMenu = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Đọc giá trị từ cookie
    const getCookie = (name) => {
      const cookies = document.cookie.split("; "); // Tách các cookie thành mảng
      for (let cookie of cookies) {
        const [key, value] = cookie.split("="); // Tách tên và giá trị
        if (key === name) {
          return decodeURIComponent(value);
        }
      }
      return null; // Trả về null nếu không tìm thấy cookie
    };
    const token = getCookie("token");
    if (token && user) {
      removeToken();
      // Xóa cookie bằng cách đặt giá trị rỗng và `expires` về quá khứ
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      console.log("Cookies cleared. Logging out...");
    }

    // Chuyển hướng đến trang đăng nhập
    setTimeout(() => {
      handleLogout
    }, 1000);
  };

  return (
    <div className="user-menu">
      {user ? (
        <div className="user-menu-container" onClick={handleMenuToggle}>
          <img
            src={`http://localhost:1412/api/view/${user?.id}`}
            alt="User Avatar"
            className="user-avatar"
          />
          <span className="user-name">{user.username}</span>
          {isMenuOpen && (
            <div className="user-menu-dropdown">
              {user.role.id === 1 ? (
                <Link to="/admin/home">Trang quản lý</Link>
              ) : (
                ""
              )}
              <Link to="/user/profile">Thông tin tài khoản</Link>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      ) : (
        <div className="login">
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
        </div>
      )}
    </div>
  );
};

export default UserMenu;