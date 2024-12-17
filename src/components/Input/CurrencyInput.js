import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";

const CurrencyInput = ({ setValue }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);

  const formatCurrency = (value) => {
    const numberValue = value.replace(/[^\d]/g, "");
    return Number(numberValue).toLocaleString("vi-VN");
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const formattedValue = formatCurrency(inputValue);
    setAmount(formattedValue);
    setValue(Number(formattedValue.replace(".", "")));

    const numericValue = parseInt(inputValue.replace(/[^\d]/g, ""), 10);
    if (numericValue < 10000 || isNaN(numericValue)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <Box sx={{ width: 300, margin: "20px auto" }}>
      <Typography variant="h6" gutterBottom>
        Nhập số tiền nạp (VNĐ)
      </Typography>
      <TextField
        label="Số tiền"
        variant="outlined"
        value={amount}
        onChange={handleChange}
        fullWidth
        error={error}
        helperText={error ? "Số tiền nạp tối thiểu là 10.000 VNĐ" : ""}
        InputProps={{
          style: {
            backgroundColor: "white", // Nền trắng
            borderRadius: "5px", // Bo tròn góc
          },
          endAdornment: (
            <Typography style={{ padding: "12px" }}>VNĐ</Typography>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            // Viền khi focus
            "&.Mui-focused fieldset": {
              borderColor: "#f39c12",
            },
            // Viền khi hover
            "&:hover fieldset": {
              borderColor: "#f39c12",
            },
            // Màu chữ khi focus
            "&.Mui-focused input": {
              color: "#f39c12",
            },
            "& input": {
              color: "black", // Màu chữ mặc định
            },
          },
          "& .MuiInputLabel-root": {
            color: "black", // Màu nhãn mặc định
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#f39c12", // Màu nhãn khi focus
          },
        }}
      />
    </Box>
  );
};

export default CurrencyInput;
