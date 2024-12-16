import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem thông tin đăng nhập có được lưu trong localStorage hay không
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotification('');

    try {
      const data = { username, password };

      // Gửi request đến API login
      const response = await axios.post('http://localhost:1412/api/login', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // Đảm bảo cookie được gửi và nhận
      });

      // Lấy dữ liệu từ phản hồi
      const { token, user } = response.data;

      // Lưu AccessToken, RefreshToken vào localStorage hoặc sessionStorage
      if (rememberMe) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', username); // Lưu username nếu người dùng chọn "Nhớ tài khoản"
      } else {
        sessionStorage.setItem('accessToken', token);
        sessionStorage.removeItem('username'); // Xóa username nếu không chọn "Nhớ tài khoản"
      }

      // Hiển thị thông báo thành công
      setNotification('Đăng nhập thành công!');
      setLoading(false);

      // Điều hướng về trang chính sau 1 giây
      setTimeout(() => {
        window.location.href = '/'; // Chuyển hướng đến trang chủ
      }, 1000);
      
    } catch (err) {
      // Xử lý lỗi đăng nhập
      setLoading(false);
      setError(
        err.response?.data || 'Đăng nhập thất bại. Vui lòng thử lại!'
      );
    }
  };

  return (
    <div className='font_body'>
      <Header />
      <div className="login-container">
        <div className='font_container'>
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Đăng nhập</h2>

            {/* Nhập tên đăng nhập */}
            <div className="form-group">
              <label>Tên đăng nhập:</label>
              <input
                className='form_input'
                placeholder='Nhập tên đăng nhập của bạn!'
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
                className='form_input'
                type="password"
                placeholder='Nhập mật khẩu để đăng nhập!'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Tùy chọn nhớ tài khoản */}
            <div className='rememberandforgot'>
              <div className='rememberitem'>
                <div className="form-group remember">
                  <input
                    type="checkbox"
                    id='remember'
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Nhớ tài khoản</label>
                </div>
                <div className="form-group">
                  <label>
                    <a className='forgotpassword' href='/security/finduser'>Quên mật khẩu?</a>
                  </label>
                </div>
              </div>
            </div>

            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {notification && <p style={{ color: 'green' }}>{notification}</p>}

            {/* Nút đăng nhập */}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <p>
              Bạn chưa có tài khoản? <a href='/register'>Đăng ký</a> tại đây!
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
