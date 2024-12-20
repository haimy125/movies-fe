import axios from 'axios';
import React, { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
const CheckUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:1412/api/password-reset/request?email=${email}`);
      setMessage(response.data);
    } catch (error) {
      setMessage("Có lỗi xảy ra: " + error.response.data);
    }
  };
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     // const response = await axios.get(`http://localhost:1412/api/find/user?username=${username}&email=${email}`);
  //     setLoading(true);
  //     setTimeout(() => {
  //       window.location.href = `/forgetpassword/${response.data.id}`;
  //     }, 3000);
  //   } catch (error) {
  //     setError(error.response.data);
  //   }
  // };
  if (loading) {
    return <Loader />
  }
  return (
    <div className='font_body'>
      <Header />
      <div className="login-container">
        <div className='font_container'>
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Tìm kiếm tài khoản theo email</h2>
            <div className="form-group">
              <label>Email:</label>
              <input
                className='form_input'
                type="email"
                value={email}
                placeholder='Nhập email của tài khoản!'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <button type="submit" className="login-button">Gửi yêu cầu</button>
            <p>Bạn đã có tài khoản.<a href='/login'>Đăng nhập</a>  tài đây!</p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckUser;
