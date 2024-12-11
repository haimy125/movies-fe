import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import './Info.css';
import ProfileNav from '../../../components/ProfileNAV/Profilenav';
import { useAuth } from '../../../services/authService';
import Loader from '../../../components/Loader/Loader';

const Profile = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState('account-info');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetail = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(`http://localhost:1412/api/login/user/profile?id=${user.id}`);
                    setLoading(false);
                    setUsers(response.data || {}); // Đảm bảo `response.data` có dữ liệu
                } catch (error) {
                    setLoading(false);
                    console.error(error.response?.data || error.message);
                }
            }
        };
        fetchUserDetail();
    }, [user]);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarUpload = () => {
        const formData = new FormData();
        formData.append('avatar', avatar);

        axios.post(`http://localhost:1412/api/login/avatar/${user?.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                alert('Thay đổi ảnh thành công!');
                setUsers({ ...users, avatar: response.data.avatar });
                window.location.reload();
            })
            .catch(error => {
                alert(error.response.data);
            });
    };

    const triggerFileInput = () => {
        document.getElementById('avatarInput').click();
    };

    const convertDateArrayToDate = (dateArray) => {
        const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);

        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const year = date.getFullYear();

        // Format the day and month with leading zeros if needed
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}-${formattedMonth}-${year}`;
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
                            <p>Hiển thị thông tin của bạn và bạn có thể thay đổi đại diện theo ý thích</p>
                        </div>
                        <div className="avatar-section">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar Preview" className="avatar" />
                            ) : (
                                <img src={`http://localhost:1412/api/login/view/${users?.id}`} alt="Avatar" className="avatar" />
                            )}
                            <button className='button_avartar' onClick={triggerFileInput}>Chọn ảnh</button>
                            <input
                                type="file"
                                id="avatarInput"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                            <div className='info_user_detail'>
                                <p><strong>Tên tài khoản:</strong> {users?.username}</p>
                                <p><strong>Email:</strong> {users?.email}</p>
                                <p><strong>Xu:</strong> {users?.point} xu</p>
                                <p><strong>Ngày tạo:</strong> {convertDateArrayToDate(users?.timeAdd)}</p>
                                {avatar && <button className='button_avartar_update' onClick={handleAvatarUpload}>Lưu</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
