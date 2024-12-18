import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ProfileNav from "../../../components/ProfileNAV/Profilenav";
import { useAuth } from "../../../services/authService";
import Loader from "../../../components/Loader/Loader";
import "./recharge.css";
import CurrencyInput from "../../../components/Input/CurrencyInput";
import { Button } from "@mui/material";
import QRPayModal from "../../../components/Modal/QrPayModal";

const VIETTIN_ID = "970415";
const MY_BANK_ID = "109869595383";
const QR_IMG_ROOT =
  "https://img.vietqr.io/image/" +
  VIETTIN_ID +
  "-" +
  MY_BANK_ID +
  "-compact2.png";

const Recharge = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bankInfo, setBankInfo] = useState({
    // description: user.id + "buy" + new Date().getTime(),
    description: "ND:74256182471-0365096648-5buy3",
    amount: "",
    accountName: "DO%20TRUONG%20GIANG",
  });
  const [qrImg, setQrImg] = useState(
    `${QR_IMG_ROOT}?amount=${bankInfo.amount ?? 0}&addInfo=${
      bankInfo.description
    }&accountName=${bankInfo.accountName}`
  );
  const [isOpenQrModal, setIsOpenQrModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setQrImg(
      `${QR_IMG_ROOT}?amount=${bankInfo.amount ?? 0}&addInfo=${
        bankInfo.description
      }&accountName=${bankInfo.accountName}`
    );
  }, [bankInfo]);

  const handleOnClickNap = () => {
    setBankInfo({
      ...bankInfo,
      //   description: user.id + "buy" + new Date().getTime(),
    });
    console.log(bankInfo, qrImg);
    setIsOpenQrModal(true);
  };

  const handleOnOpenQrModal = () => {
    setIsOpenQrModal(true);
  };
  const handleOnCloseQrModal = () => {
    setIsOpenQrModal(false);
  };

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
            <div className="detal_info">
              <h2>Nạp xu</h2>
              <p>số tiền nạp sẽ được quy đổi ra xu</p>
              <p>với 1 xu = 1.000 đồng</p>
              <p>
                các bước nạp xu:
                <br />
                Bước 1: quét mã QR của một ngân hàng có trên
                <br />
                Bước 2: nhập số tiền muốn Nạp
                <br />
                Bước 3: Nhập nội dung Chuyển khoản là: 3DCM{user?.id}
                {user?.username}NX
                <br />
                Bước 4: Thực hiện thanh toán.
              </p>
            </div>
            <div className="avatar-section list_pay">
              <CurrencyInput
                setValue={(newValue) => {
                  setBankInfo({
                    ...bankInfo,
                    amount: newValue,
                  });
                }}
              />
              <Button
                onClick={handleOnClickNap}
                variant="contained"
                style={{
                  "--variant-containedColor": "white",
                  "--variant-containedBg": "#f39c12",
                }}
              >
                Nạp
              </Button>
              {/* <div className="password_group can_giua">
                <div>
                  <label>Ngân hàng Agribank</label>
                  <img
                    src={`/images/PayAgribank.jpg`}
                    className="pay_images"
                    alt="agribank"
                    onClick={() => handleImageClick("/images/PayAgribank.jpg")}
                  />
                </div>
                <div>
                  <label>Ví điện tử MoMo</label>
                  <img
                    src={`/images/PayMoMo.jpg`}
                    className="pay_images"
                    alt="momo"
                    onClick={() => handleImageClick("/images/PayMoMo.jpg")}
                  />
                </div>
                <div>
                  <label>Ngân hàng VietComBank</label>
                  <img
                    src={`/images/VietComBank.jpg`}
                    className="pay_images"
                    alt="vietcombank"
                    onClick={() => handleImageClick("/images/VietComBank.jpg")}
                  />
                </div>
                <div>
                  <label>Ngân hàng OCB Bank</label>
                  <img
                    src={`/images/OCBBank.jpg`}
                    className="pay_images"
                    alt="ocb"
                    onClick={() => handleImageClick("/images/OCBBank.jpg")}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {selectedImage && (
        <>
          <div className="notification-background"></div>
          <div className="notification image_select">
            <img className="modal-content" src={selectedImage} alt="Selected" />
            <button className="notification_button" onClick={closeModal}>
              Xác nhận
            </button>
          </div>
        </>
      )}

      <QRPayModal
        open={isOpenQrModal}
        bankInfo={bankInfo}
        qrImg={qrImg}
        onClose={handleOnCloseQrModal}
        onOpen={handleOnOpenQrModal}
        onSubmit={handleOnCloseQrModal}
      />
    </div>
  );
};

export default Recharge;