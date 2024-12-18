// src/components/UserMenu.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserMenu.css";
import { removeToken } from "../../services/tokenService";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1412/api";
const UserMenu = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        setUser(JSON.parse(localUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    // Đọc giá trị từ cookie
    const getCookie = (name) => {
      setUser(null);
      localStorage.removeItem("user");
      const cookies = document.cookie.split("; "); // Tách các cookie thành mảng
      for (let cookie of cookies) {
        const [key, value] = cookie.split("="); // Tách tên và giá trị
        if (key === name) {
          return decodeURIComponent(value);
        }
      }
      return null; // Trả về null nếu không tìm thấy cookie
    };
    const accessToken = getCookie("accessToken");
    if (accessToken && user) {
      removeToken();
      // Xóa cookie bằng cách đặt giá trị rỗng và `expires` về quá khứ
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      console.log("Cookies cleared. Logging out...");
    }
    // Chuyển hướng đến trang đăng nhập
    setTimeout(() => {
      window.location.href = "/login";
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
