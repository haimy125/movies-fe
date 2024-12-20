import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const NotificationModal = (props) => {
  const {
    open,
    onClose,
    heading = "Thông báo",
    content = "Thao tác thành công!",
    timeToClose = 10,
  } = props;

  const [countdown, setCountdown] = useState(timeToClose);

  useEffect(() => {
    console.log(countdown);
    let timer;

    if (open) {
      // Reset countdown mỗi lần mở Modal
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onClose(); // Tự động đóng Modal
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (countdown === 0) setCountdown(timeToClose);

    return () => {
      clearInterval(timer); // Dọn dẹp timer khi Modal đóng
    };
  }, [open, timeToClose, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      {open && (
        <Box
          sx={{
            zIndex: 13000000, // Đảm bảo Modal luôn hiển thị trên cùng
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
          {/* Nút Close ở góc trên bên phải */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            {heading}
          </Typography>
          <Typography id="modal-description" variant="body1" gutterBottom>
            {content}
          </Typography>

          {/* Hiển thị đếm ngược */}
          <Typography
            sx={{
              textAlign: "center",
              color: "grey.600",
              mt: 2,
            }}
          >
            Tự động đóng sau {countdown} giây
          </Typography>

          {/* Nút Xác nhận */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              gap: "10px",
            }}
          >
            <Button variant="contained" color="success" onClick={handleClose}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default NotificationModal;
