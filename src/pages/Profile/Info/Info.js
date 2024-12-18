import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import './Info.css';
import ProfileNav from '../../../components/ProfileNAV/Profilenav';
import { useAuth } from '../../../services/authService';
import Loader from '../../../components/Loader/Loader';
import { formatDateToDDMMYYYY } from '../../../helper/FormatHelper'; 
const Profile = () => {
    const { user, isLoading } = useAuth();
    const [users, setUsers] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState('account-info');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetail = async () => {
            if (user?.id) {
                try {
                    const response = await axios.get(`http://localhost:1412/api/user/profile?id=${user.id}`);
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
        axios.post(`http://localhost:1412/api/avatar/${user?.id}`, formData)
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
                                <img src={`http://localhost:1412/api/view/${users?.id}`} alt="Avatar" className="avatar" />
                            )}
                            /* The button with the class name 'button_avartar' and the onClick event
                            handler set to triggerFileInput function is allowing the user to select
                            an image file. When the button is clicked, it triggers the hidden file
                            input field with the id 'avatarInput', which opens a file selection
                            dialog for the user to choose an image file. */
                            {/* <button className='button_avartar' onClick={triggerFileInput}>Chọn ảnh</button> */}
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
                                <p><strong>Ngày tạo:</strong> {formatDateToDDMMYYYY(users?.timeAdd)}</p>
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
