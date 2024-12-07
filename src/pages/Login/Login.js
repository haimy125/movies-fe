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
    const savedPassword = localStorage.getItem('password');
    
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotification('');
    
    try {
      // Tạo đối tượng params cho request
      const params = new URLSearchParams();

      params.append('username', username);
      params.append('password', password);
      
      // Gửi request đến API login
      const response = await axios.post('http://localhost:1412/api/login/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true, // Đảm bảo gửi cookie
      });

      // Lưu thông tin đăng nhập nếu người dùng chọn "Nhớ tài khoản"
      if (rememberMe) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }

      localStorage.setItem('userId', response.data.id);

      // Xử lý thông báo và chuyển hướng sau khi login thành công
      setNotification('Đăng nhập thành công!');
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/'; // Chuyển hướng đến trang chủ
      }, 3000);
      
    } catch (error) {
      // Xử lý lỗi khi đăng nhập thất bại
      setLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Đã có lỗi xảy ra.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='font_body'>
      <Header />
      <div className="login-container">
        <div className='font_container'>
          <form onSubmit={handleSubmit} className="login-form">
            {notification && <p style={{color:'green'}}>{notification}</p>}
            <h2>Đăng nhập</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
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
            <div className="form-group">
              <label>Password:</label>
              <input
                className='form_input'
                type="password"
                value={password}
                placeholder='Nhập mật khẩu để đăng nhập!'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='rememberandforgot'>
              <div className='rememberitem'>
              <div className="form-group remember">
              <input
                type="checkbox"
                id='remember'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label for="remember" >Nhớ tài khoản</label>
            </div>
            <div className="form-group">
              <label><a className='forgotpassword' href='/security/finduser'>Quên mật khẩu?</a></label>
            </div>
              </div>
           
            </div>
            
                {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            <p>Bạn chưa có tài khoản.<a href='/register'>Đăng ký</a> tài đây!</p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
