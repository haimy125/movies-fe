import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";

const MODAL_TIME = 300;

const INPUT_PAYMENT =
  "https://script.google.com/macros/s/AKfycbzcoKVCiqIb-BkQ2nFxhrIU7jOH2sN9HEvGq7Vkyn5Hus5tlIDyWngoNN-Rk8zg2wUE3w/exec";

const QRPayModal = ({ open, onOpen, onClose, onSubmit, bankInfo, qrImg }) => {
  const [timeLeft, setTimeLeft] = useState(MODAL_TIME); // Đếm ngược 120 giây
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const checkPayment = async () => {
    try {
      const response = await fetch(INPUT_PAYMENT);
      const data = await response.json();
      const dataCheck = await data.data[1];

      if (dataCheck) {
        const price = dataCheck["Giá trị"];
        const description = dataCheck["Mô tả"];
        if (
          price >= bankInfo.amount &&
          description.includes(bankInfo.description)
        ) {
          const authToken = Cookies.get("token"); // Token bạn lấy được từ quá trình đăng nhập

          const response = await axios.put(
            `http://localhost:1412/api/admin/user/napTien?token=${authToken}&point=${bankInfo.amount}`,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authToken}`, // Thêm header Authorization
              },
            }
          );

          localStorage.setItem("user", JSON.parse(response.data));

          console.log("thanh toán thành công");
        } else {
          console.log("Chưa thanh toán");
        }
      }
    } catch (error) {
      console.log("[Error] Error when check qr payment", error);
    }
  };

  // Đếm ngược thời gian
  useEffect(() => {
    let timer;
    if (open && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      handleClose(); // Đóng Modal khi hết thời gian
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (open) setTimeLeft(MODAL_TIME);
    else setTimeLeft(0);
  }, [open]);

  // Hiển thị thời gian theo định dạng phút:giây
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleOpen = () => {
    onOpen();
  };

  const handleClose = () => {
    onClose();
  };
  const handleSubmit = async () => {
    setIsCheckingPayment(true);

    await checkPayment();
    await checkPayment();

    // onSubmit();
    setIsCheckingPayment(true);
  };

  return (
    <div>
      {/* Modal */}
      <Modal
        aria-labelledby="qr-pay-modal-title"
        aria-describedby="qr-pay-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {/* Nút đóng */}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            {/* Tiêu đề */}
            <Typography id="qr-pay-modal-title" variant="h6" component="h2">
              Thanh toán qua QR Pay
            </Typography>

            {/* Mô tả */}
            <Typography id="qr-pay-modal-description" sx={{ mt: 2 }}>
              Quét mã QR bên dưới để hoàn tất thanh toán:
            </Typography>

            {/* Thời gian đếm ngược */}
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                textAlign: "center",
                fontWeight: "bold",
                color: "red",
              }}
            >
              Thời gian còn lại: {formatTime(timeLeft)}
            </Typography>

            {/* Hình ảnh QR Code */}
            {!isCheckingPayment ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <img
                  src={qrImg}
                  alt="QR Code"
                  style={{
                    width: "400px",
                    height: "400px",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              </Box>
            ) : (
              <span> Đang kiểm tra thanh toán... </span>
            )}

            {/* Nút xác nhận */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Xác nhận đã thanh toán
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default QRPayModal;
