import axios from 'axios';
import React, { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
const CheckUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const response = await axios.get( `http://localhost:1412/api/login/find/user?username=${username}&email=${email}`);
      setLoading(true);
      setTimeout(() => {
      window.location.href = `/forgetpassword/${response.data.id}`;
       }, 3000);
    } catch (error) {
      setError(error.response.data);
    }
  };
if(loading){
 return <Loader/>
}
  return (
    <div className='font_body'>
      <Header/>
      <div className="login-container">
        <div className='font_container'>
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Tìm kiếm tài khoản</h2>
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
          
            <button type="submit" className="login-button">Đăng nhập</button>
            <p>Bạn đã có tài khoản.<a href='/login'>Đăng nhập</a>  tài đây!</p>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CheckUser;
