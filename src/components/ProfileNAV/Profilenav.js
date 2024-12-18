import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Profilenav.css";
import QRPayModal from "../Modal/QrPayModal";
import { useAuth } from "../../services/authService";
import { getToken } from '../../services/tokenService';

const ProfileNav = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedMenu, setSelectedMenu] = useState("account-info");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

  //   useEffect(() => {
  //     console.log("User check:", user);
  //     if (!user) return;
  //     // const userId = localStorage.getItem("user")?.id; // Lấy userId từ localStorage

  //     console.log("Bank info", bankInfo);

  //     // if (user.id) {
  //     //   // Gọi API để lấy thông tin người dùng với id
  //     //   axios
  //     //     .get(`http://localhost:1412/api/login/user/profile?id=${userId}`)
  //     //     .then((response) => {
  //     //       setUser(response.data);
  //     //       console.log("test");

  //     //     })
  //     //     .catch((error) => console.error(error));
  //     // } else {
  //     //   console.error("User ID is not available");
  //     // }
  //   }, [user]); // Khi component mount, sẽ gọi API

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarUpload = () => {
        const formData = new FormData();
        formData.append('avatar', avatar);
        const token = getToken("token");
        axios.post('/api/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
      .then((response) => {
        alert("Avatar updated successfully");
        // setUser({ ...user, avatarUrl: response.data.avatarUrl });
            })
      .catch((error) => console.error(error));
    };

    const triggerFileInput = () => {
    document.getElementById("avatarInput").click();
    };

    return (
        <div className="profile_nav">
            {/* <h2 >Xin chao: jinhyk21</h2> */}
            <div className="profile-sidebar">
                <Link to="/user/profile" className="action_info">
                    Thông tin tài khoản
                </Link>
                <Link to="/user/changepassword" className="action_info">
                    Đổi mật khẩu
                </Link>
                <Link to="/user/update/detail" className="action_info">
                    Cập nhật thông tin
                </Link>
                <Link to="/user/recharge" className="action_info">
                    Nạp xu
                </Link>
                <Link to="/user/history" className="action_info">
                    Lịch sử giao dịch
                </Link>
                <Link to="/user/buy" className="action_info">
                    Bộ phim đã mua
                </Link>
                <Link to="/user/follows" className="action_info">
                    Theo dõi
                </Link>
            </div>
        </div>
    );
};

export default ProfileNav;
