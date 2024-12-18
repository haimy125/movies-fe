import React, { useState } from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmationModal = (props) => {
  const { open, onClose, onConfirm, heading, content } = props;

  const handleClose = () => onClose();

  const handleConfirm = () => {
    console.log("Confirmed!");
    onConfirm(); // Đóng modal sau khi xác nhận
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
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

          {/* Nút Xác nhận */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button variant="contained" color="success" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
