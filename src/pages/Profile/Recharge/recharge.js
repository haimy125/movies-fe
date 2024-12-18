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
import ConfirmationModal from "../../../components/Modal/ConfirmModel";

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
  const [isOpenConfirmModel, setIsOpenConfirmModel] = useState(false);
  const [confirmModel, setConfirmModel] = useState({
    heading: "Có lỗi xảy ra!",
    content: "Số tiền chuyển nạp không hợp lệ (Tối thiểu là 10.000 VNĐ).",
  });
  const [bankInfo, setBankInfo] = useState({
    description: user.id + "buy" + new Date().getTime(),
    // description: "ND:Tra lai TK",
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
    console.log("Bank: ", bankInfo);
    setQrImg(
      `${QR_IMG_ROOT}?amount=${bankInfo.amount ?? 0}&addInfo=${
        bankInfo.description
      }&accountName=${bankInfo.accountName}`
    );
  }, [bankInfo]);

  const handleOnClickNap = () => {
    const { amount } = bankInfo;

    if (!amount || amount < 10000) {
      setIsOpenConfirmModel(true);
      return;
    }
    setBankInfo({
      ...bankInfo,
      description: user.id + "buy" + new Date().getTime(),
    });
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
              <p>Số tiền nạp sẽ được quy đổi ra xu</p>
              {/* <p>với 1 xu = 1.000 đồng</p> */}
              <p>
                các bước nạp xu:
                <br />
                Bước 1: Nhập vào số tiền muốn nạp {"(>10.000 VNĐ)"}
                <br />
                Bước 2: Nhấn nút "Nạp"
                <br />
                Bước 3: Quét mã VietQR trên hình
                <br />
                Bước 4: Sau khi quét mã và thục hiện thanh toán trên App xong,
                bấm vào nút "Xác nhận đã thanh toán".
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
      <ConfirmationModal
        open={isOpenConfirmModel}
        onClose={() => {
          setIsOpenConfirmModel(false);
        }}
        onConfirm={() => {
          setIsOpenConfirmModel(false);
        }}
        {...confirmModel}
      />
    </div>
  );
};

export default Recharge;
