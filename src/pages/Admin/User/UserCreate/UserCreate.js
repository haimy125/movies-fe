// File: UserCreate.js
import axios from "axios";
import React, { useState } from "react";
import "../../../../assets/styles/Admin.css";
import HeaderAdmin from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import ReusableForm from "../../../../components/ReusableForm";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const UserCreate = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  // const [formData, setFormData] = useState({
  //   username: "",
  //   fullname: "",
  //   password: "",
  //   email: "",
  //   role: "",
  //   point: 0,
  //   status: true,
  //   active: true,
  // });
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  const handleSubmitForm = async (data) => {
    console.log("Submitted Data:", data);
    const { confirmPassword, ...keepData } = data;
    const formData = {
      ...keepData,
      point: 0,
      status: true,
      active: true,
    };

    try {
      const response = await axios.post('http://localhost:1412/api/admin/user/create', formData);
      setNotification('Tạo người dùng thành công!');
      console.log(response.data);
      navigate("/admin/users");
    } catch (error) {
      setError(error.response ? error.response.data : "Error submitting form");
      console.error("Error submitting form:", error);
    }
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleRoleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     setFormData({ ...formData, role: parseInt(value) });
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const accessToken = getToken("accessToken");
  //     const response = await axios.post(
  //       "http://localhost:1412/api/admin/user/create",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setNotification("Tạo người dùng thành công!");
  //     console.log(response.data);
  //     setFormData({ username: "", email: "", role: "" }); // Reset form after successful creation
  //   } catch (error) {
  //     setError(error.response ? error.response.data : "Error submitting form");
  //     console.error("Error submitting form:", error);
  //   }
  // };

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
          <ReusableForm
            title="Tạo Người Dùng Mới"
            fields={fields}
            onSubmit={handleSubmit(handleSubmitForm)}
            submitButtonLabel="Xác Nhận"
            control={control}
            errors={errors}
            watch={watch}
          />
          {/* <div className="label_list">
            <h2>Tạo người dùng mới</h2>
          </div>
          <div className="create_movie_font">
            <form onSubmit={handleSubmit} className="create_movie_form">
              <div className="form_group">
                <label>Họ tên</label>
                <input
                  type="text"
                  name="fullname"
                  className="create_input"
                  placeholder="Nhập họ tên"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Tên người dùng</label>
                <input
                  type="text"
                  name="username"
                  className="create_input"
                  placeholder="Nhập tên người dùng"
                  value={formData.f}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="create_input"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="create_input"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form_group">
                <label>Vai trò</label>
                <div className="role_selection">
                  <label>
                    <input
                      type="checkbox"
                      value="1"
                      checked={formData.role === 1}
                      onChange={handleRoleCheckboxChange}
                    />
                    ROLE_ADMIN
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="2"
                      checked={formData.role === 2}
                      onChange={handleRoleCheckboxChange}
                    />
                    ROLE_USER
                  </label>
                </div>
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {notification && <p style={{ color: "green" }}>{notification}</p>}
              <button className="create_button" type="submit">
                Tạo người dùng
              </button>
            </form>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
