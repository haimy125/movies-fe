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
import BasicModal from "../BasicModal";
import ConfirmationModal from "../ConfirmModel";
import NotificationModal from "../NotificationModal";

const MODAL_TIME = 300;

const INPUT_PAYMENT =
  "https://script.google.com/macros/s/AKfycbzcoKVCiqIb-BkQ2nFxhrIU7jOH2sN9HEvGq7Vkyn5Hus5tlIDyWngoNN-Rk8zg2wUE3w/exec";

const QRPayModal = ({ open, onOpen, onClose, onSubmit, bankInfo, qrImg }) => {
  const [timeLeft, setTimeLeft] = useState(MODAL_TIME); // Đếm ngược 120 giây
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isOpenBasicModel, setIsOpenBasicModel] = useState(false);
  const [isHaveErrOnPayment, setIsHaveErrOnPayment] = useState(false);
  const [basicModel, setBasicModel] = useState({
    heading: "Basic Model Heading",
    content: "Basic Model content",
  });

  const checkPayment = async () => {
    console.log("Bank Info", bankInfo);
    console.log("QR Img", qrImg);

    await fetch(INPUT_PAYMENT)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json().data;
      })
      .then(() => {
        return fetch(INPUT_PAYMENT);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(({ data }) => {
        console.log("Data payment input: ", data);
        const paymentData = data[1];
        if (paymentData) {
          const price = paymentData["Giá trị"];
          const description = paymentData["Mô tả"];

          if (
            price >= bankInfo.amount &&
            description.includes(bankInfo.description)
          ) {
            const authToken = Cookies.get("accessToken");

            return axios({
              method: "PUT",
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authToken}`,
              },
              url: `http://localhost:1412/api/admin/user/napTien`,
              params: {
                point: bankInfo.amount,
              },
            });
          }
        }
      })
      .then((response) => {
        response.then((response) => {
          console.log(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
          setBasicModel({
            heading: "Thanh toán thành công!",
            content: "Hãy mua và tận hưởng những bộ phim chất lượng cao.",
          });
          setIsHaveErrOnPayment(false);
          setIsOpenBasicModel(true);
          console.log("Thanh toán thành công");
        });
      })
      .catch((error) => {
        console.log("Có lỗi khi thanh toán");
        console.error("Error in fetching data:", error);
        setIsHaveErrOnPayment(true);
        setBasicModel({
          heading: "Có lỗi xảy ra khi thanh toán!",
          content:
            "Hãy xác nhận lại việc thực hiện thanh toán của bạn và bấm Xác nhận lại.",
        });
        setIsOpenBasicModel(true);
      });
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
    if (open) {
      setTimeLeft(MODAL_TIME);
    } else {
      setTimeLeft(0);
    }
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

    // onSubmit();
    setIsCheckingPayment(false);
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
            {isCheckingPayment ? (
              <span> Đang kiểm tra thanh toán... </span>
            ) : (
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
            )}

            {/* Nút xác nhận */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={isCheckingPayment}
              >
                Xác nhận đã thanh toán
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      {/* <BasicModal
        open={isOpenBasicModel}
        onClose={() => {
          setIsOpenBasicModel(false);
          handleClose();
        }}
        {...basicModel}
      /> */}
      <NotificationModal
        open={isOpenBasicModel}
        onClose={() => {
          setIsOpenBasicModel(false);
          !isHaveErrOnPayment && handleClose();
        }}
        // onConfirm={() => {
        //   setIsOpenBasicModel(false);
        //   !isHaveErrOnPayment && handleClose();
        // }}
        {...basicModel}
      />
    </div>
  );
};

export default QRPayModal;
