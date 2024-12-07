import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ProfileNav from '../../../components/ProfileNAV/Profilenav';
import { useAuth } from '../../../services/authService';
import Loader from '../../../components/Loader/Loader';
import './recharge.css';

const Recharge = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
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
                            <h2>Nạp xu</h2>
                            <p>số tiền nạp sẽ được quy đổi ra xu</p>
                            <p>với 1 xu = 1.000 đồng</p>
                            <p>các bước nạp xu:
                                <br/>
                                Bước 1: quét mã QR của một ngân hàng có trên
                                <br/>
                                Bước 2: nhập số tiền muốn Nạp
                                <br/>
                                Bước 3: Nhập nội dung Chuyển khoản là: 3DCM{user?.id}{user?.username}NX
                                <br/>
                                Bước 4: Thực hiện thanh toán.
                            </p>
                        </div>
                        <div className="avatar-section list_pay">
                            <div className='password_group can_giua'>
                                <div>
                                    <label>Ngân hàng Agribank</label>
                                    <img 
                                        src={`/images/PayAgribank.jpg`} 
                                        className='pay_images' 
                                        alt='agribank' 
                                        onClick={() => handleImageClick('/images/PayAgribank.jpg')}
                                    />
                                </div>
                                <div>
                                    <label>Ví điện tử MoMo</label>
                                    <img 
                                        src={`/images/PayMoMo.jpg`} 
                                        className='pay_images' 
                                        alt='momo' 
                                        onClick={() => handleImageClick('/images/PayMoMo.jpg')}
                                    />
                                </div>
                                <div>
                                    <label>Ngân hàng VietComBank</label>
                                    <img 
                                        src={`/images/VietComBank.jpg`} 
                                        className='pay_images' 
                                        alt='vietcombank' 
                                        onClick={() => handleImageClick('/images/VietComBank.jpg')}
                                    />
                                </div>
                                <div>
                                    <label>Ngân hàng OCB Bank</label>
                                    <img 
                                        src={`/images/OCBBank.jpg`} 
                                        className='pay_images' 
                                        alt='ocb' 
                                        onClick={() => handleImageClick('/images/OCBBank.jpg')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {selectedImage && (
                <>
                <div className='notification-background'></div>
                <div className='notification image_select'>
                 <img className="modal-content" src={selectedImage} alt="Selected" />
                  <button className='notification_button' onClick={closeModal}>Xác nhận</button>
                </div>
              </>
                
            )}
        </div>
    );
};

export default Recharge;
