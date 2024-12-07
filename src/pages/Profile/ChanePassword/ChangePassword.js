import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ProfileNav from '../../../components/ProfileNAV/Profilenav';
import { useAuth } from '../../../services/authService';
import Loader from '../../../components/Loader/Loader';
import './ChangePassword.css';
const ChangePassword = () => {
    const { user } = useAuth();
    const [oldpassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


        const fetchUserDetail = async () => {
            const formData = new FormData();
            formData.append('password', oldpassword);
            formData.append('newpassword', newPassword);
            formData.append('confirmpassword', confirmPassword);
            if (user?.id) {
                axios.post(`http://localhost:1412/api/login/changepassword/${user?.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        alert('đổi mật khẩu thành công!');
                      
                        window.location.reload();
                    })
                    .catch(error => {
                        alert(error.response.data);
                        console.error(error)
                    });
            }
        };


    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Header />
            <div className="profile-container">
                <ProfileNav />  
                <div className="profile-content">
                    <div className="account-info">
                        <div className='detal_info'>
                            <h2>Đổi mật khẩu</h2>
                            <p>Bạn có thể thay đổi mật khẩu nếu muốn hoặc có vấn đề về bảo mật thông tin của bạn.</p>
                        </div>
                        <div className="avatar-section">
                            <div className='password_group'>
                                <label>Mật khẩu hiện tại</label>
                            <input 
                            type='password' 
                            className='input_password ' 
                            placeholder='Nhập mật khẩu hiện tại của bạn!'
                             value={oldpassword}
                             onChange={(e) => setOldPassword(e.target.value)}/>
                            </div>
                            <div className='password_group'>
                            <label>Mật khẩu mới</label>
                            <input
                            type='password'
                             className='input_password'
                              placeholder='Nhập mật khẩu mới của bạn!'
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <div className='password_group'>
                                <label>Xác nhận mật khẩu</label>
                            <input
                             type='password'
                              className='input_password' 
                              placeholder='Nhập lại mật khẩu mới của bạn!' 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <div className='password_group'>
                            <button className='button_change_password' onClick={fetchUserDetail} >Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;
