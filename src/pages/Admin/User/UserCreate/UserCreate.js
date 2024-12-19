// File: UserCreate.js
import axios from "axios";
import React, { useState } from "react";
import "../../../../assets/styles/Admin.css";
import HeaderAdmin from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import ReusableForm from "../../../../components/ReusableForm";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../../../services/tokenService";

const UserCreate = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleSubmitForm = async (data) => {
    console.log("Submitted Data:", data);
    const { confirmPassword, ...keepData } = data;
    const formData = {
      ...keepData,
      point: 0,
      status: true,
      active: true,
    };
    await axios
      .post("http://localhost:1412/api/admin/user/create", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
      })
      .then((response) => {
        navigate("/admin/users");
      })
      .catch((err) => {
        console.log("Có lỗi xảy ra khi Create User", err);
      });
  };

  const fields = [
    {
      name: "fullname",
      label: "Họ & Tên",
      type: "text",
      defaultValue: "",
      rules: {
        required: "Họ & Tên là bắt buộc",
        minLength: { value: 5, message: "Họ & Tên phải có ít nhất 5 ký tự" },
      },
    },
    {
      name: "username",
      label: "Tên Người Dùng",
      type: "text",
      defaultValue: "",
      rules: {
        required: "Tên người dùng là bắt buộc",
        minLength: {
          value: 3,
          message: "Tên người dùng phải có ít nhất 3 ký tự",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      defaultValue: "",
      rules: {
        required: "Email là bắt buộc",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Email không hợp lệ",
        },
      },
    },
    {
      name: "password",
      label: "Mật Khẩu",
      type: "password",
      defaultValue: "",
      rules: {
        required: "Mật khẩu là bắt buộc",
        minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        maxLengh: { value: 25, message: "Mật khẩu không được quá 25 ký tự" },
      },
    },
    {
      name: "confirmPassword",
      label: "Xác Nhận Mật Khẩu",
      type: "password",
      defaultValue: "",
      rules: {
        required: "Xác nhận mật khẩu là bắt buộc",
        validate: (value) => {
          const currentPassword = watch("password");
          return value === currentPassword || "Mật khẩu không khớp";
        },
      },
    },
    {
      name: "role",
      label: "Vai Trò",
      type: "select",
      defaultValue: "",
      options: [
        { value: 1, label: "Admin" },
        { value: 2, label: "User" },
      ],
      rules: {
        required: "Vai trò là bắt buộc",
      },
    },
  ];

  return (
    <div className="admin_layout">
      <div className="header_ad">
        <HeaderAdmin />
      </div>
      <div className="content">
        <div className="nav">
          <div className="content_nav">
            <AdminNav />
          </div>
        </div>
        <div className="content_data">
          <Link to="/admin/users">Quay lại</Link>
          <ReusableForm
            title="Tạo Người Dùng Mới"
            fields={fields}
            onSubmit={handleSubmit(handleSubmitForm)}
            submitButtonLabel="Xác Nhận"
            control={control}
            errors={errors}
            watch={watch}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
