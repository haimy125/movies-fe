import axios from 'axios';
import React, { useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import './Register.css';
import Loader from '../../components/Loader/Loader';

const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:1412/api/login/register',
                {
                    username: username,
                    password: password,
                    email: email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            setNotification('Đăng ký thành công!');
            setLoading(true);
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } catch (error) {
            if (error.response) {
                // Xử lý lỗi từ phía Backend
                const backendError = error.response.data;

                if (typeof backendError === 'string') {
                    // Trường hợp lỗi RuntimeException trả về chuỗi
                    setError(backendError);
                } else if (typeof backendError === 'object' && backendError !== null) {
                    // Lỗi validation, ghép các thông báo lỗi chi tiết
                    const errorMessage = Object.values(backendError)
                        .filter((msg) => typeof msg === 'string')
                        .join('\n');
                    setError(errorMessage || 'Có lỗi xảy ra, vui lòng thử lại.');
                } else {
                    setError('Đăng ký không thành công. Vui lòng thử lại.');
                }
            } else if (error.request) {
                // Không nhận được phản hồi từ máy chủ
                setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng của bạn.');
            } else {
                // Lỗi khác (ví dụ: cấu hình request)
                setError('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='font_body'>
            <Header />
            <div className="register-container">
                <div className='font_container'>
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Đăng Ký</h2>
                        <div className="form-group">
                            <label>Tên đăng ký:</label>
                            <input
                                className='form_input'
                                placeholder='Nhập tên đăng ký của bạn!'
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
                                placeholder='Nhập mật khẩu!'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                className='form_input'
                                type="email"
                                value={email}
                                placeholder='Nhập email!'
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {notification && <p style={{ color: 'green' }}>{notification} </p>}
                        <button type="submit" className="login-button">Đăng ký</button>
                        <p>Bạn đã tài khoản.<a href='/login'>Đăng nhập</a>  tại đây!</p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
