import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ProfileNav from '../../../components/ProfileNAV/Profilenav';
import { useAuth } from '../../../services/authService';
import Loader from '../../../components/Loader/Loader';
import { getToken } from '../../../services/tokenService';
import './Updateinfo.css';
const UpdateInfo = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState(null);
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchUserDetail = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(`http://localhost:1412/api/user/profile?id=${user.id}`);
                    setLoading(false);
                    setUsers(response.data || {}); // Đảm bảo `response.data` có dữ liệu
                    setEmail(response.data.email || {});
                    setFullname(response.data.fullname || '');
                } catch (error) {
                    setLoading(false);
                    console.error(error.response?.data || error.message);
                }
            }
        };
        fetchUserDetail();
    }, [user]);

    const fetchUserDetail = async () => {
        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('email', email);
        if (user?.id) {
            const accessToken = getToken("accessToken");
            axios.post(`http://localhost:1412/api/updateinfo/${user?.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    alert('Avatar updated successfully');

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
                            <h2>Thông tin tài khoản</h2>
                            <p>Bạn có thể thay đổi họ tên và email của bản thân </p>
                        </div>
                        <div className="avatar-section">
                            <div className='password_group'>
                                <label>Tên đăng nhập</label>
                                {/* <p className='notification_info'>Bạn không thể sửa thông tin này.</p> */}
                                <input
                                    type='text'
                                    className='input_password donts_write'
                                    value={users?.username}

                                    readOnly />
                            </div>
                            <div className='password_group'>
                                <label>Họ và tên</label>
                                <input
                                    type='text'
                                    className='input_password'
                                    value={fullname || ''}
                                    onChange={(e) => setFullname(e.target.value)}
                                />
                            </div>
                            <div className='password_group'>
                                <label>email</label>
                                <input
                                    type='text'
                                    className='input_password'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='password_group'>
                                <label>Số xu</label>
                                {/* <p className='notification_info'>Bạn không thể sửa thông tin này.</p> */}
                                <input
                                    type='text'
                                    className='input_password donts_write'
                                    value={users?.point}
                                    readOnly />
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

export default UpdateInfo;
