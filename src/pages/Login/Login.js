import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./Login.css";
import { setToken, getToken } from "../../services/tokenService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:1412/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      if (!username || !password) {
        return;
      }
      const accessToken = getToken("accessToken");
      const response = await axios.post(
        `${API_URL}/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true,
        }
      );

      if (!response?.data) return;
      return response?.data;
    } catch (error) {
      console.error("Login failed in login function:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotification("");

    if (!username || !password) {
      return;
    }

    try {
      const data = await login(username, password);
      const { token, user } = data;

      setToken(token);

      if (user && token) {
        // Lưu vào cookie
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `accessToken=${token}; path=/; Secure; SameSite=Strict; max-age=${
          60 * 60 * 24
          }`; // Lưu token trong 1 ngày
        // document.cookie = `user=${encodeURIComponent(
        //   JSON.stringify(user)
        // )}; path=/; Secure; max-age=${60 * 60 * 24}`; // Lưu user trong 1 ngày
      }

      setNotification("Đăng nhập thành công!");
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="font_body">
      <Header />
      <div className="login-container">
        <div className="font_container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Đăng nhập</h2>

            {/* Nhập tên đăng nhập */}
            <div className="form-group">
              <label>Tên đăng nhập:</label>
              <input
                className="form_input"
                placeholder="Nhập tên đăng nhập của bạn!"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Nhập mật khẩu */}
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                className="form_input"
                type="password"
                placeholder="Nhập mật khẩu để đăng nhập!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Tùy chọn nhớ tài khoản */}
            <div className="rememberandforgot">
              <div className="rememberitem">
                {/* <div className="form-group remember">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Nhớ tài khoản</label>
                </div> */}
                <div className="form-group">
                  <label>
                    <a className="forgotpassword" href="/security/finduser">
                      Quên mật khẩu?
                    </a>
                  </label>
                </div>
              </div>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {notification && (
              <div className="alert alert-success" role="alert">
                {notification}
              </div>
            )}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <p>
              Bạn chưa có tài khoản? <a href="/register">Đăng ký</a> tại đây!
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
