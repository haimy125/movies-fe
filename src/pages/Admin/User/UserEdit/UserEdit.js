import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../assets/styles/Admin.css";
import HeaderAdmin from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import { useAuth } from "../../../../services/authService";
import ReusableForm from "../../../../components/ReusableForm";
import { useForm } from "react-hook-form";
import { getToken } from "../../../../services/tokenService";

const UserEdit = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "", // Default role
  });
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:1412/api/admin/user/getbyid/${id}`)
      .then((response) => response.data)
      .then((data) => {
        setFields([
          {
            name: "fullname",
            label: "Họ & Tên",
            type: "text",
            defaultValue: data.fullname,
            rules: {
              required: "Họ & Tên là bắt buộc",
              minLength: {
                value: 5,
                message: "Họ & Tên phải có ít nhất 5 ký tự",
              },
            },
          },
          {
            name: "username",
            label: "Tên Người Dùng",
            type: "text",
            defaultValue: data.username,
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
            defaultValue: data.email,
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
            defaultValue: data.password,
            rules: {
              required: "Mật khẩu là bắt buộc",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
              maxLengh: {
                value: 25,
                message: "Mật khẩu không được quá 25 ký tự",
              },
            },
          },
          {
            name: "confirmPassword",
            label: "Xác Nhận Mật Khẩu",
            type: "password",
            defaultValue: data.password,
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
            defaultValue: data.role.id,
            options: [
              { value: 1, label: "Admin" },
              { value: 2, label: "User" },
            ],
            rules: {
              required: "Vai trò là bắt buộc",
            },
          },
        ]);

        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error when get user info", error);
      });
  }, []);

  const handleSubmitForm = async (data) => {
    await axios
      .post("http://localhost:1412/api/admin/user/update", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(),
        },
      })
      .then(() => {
        navigate("/admin/users");
      })
      .catch((err) => {
        console.log("Có lỗi xảy ra khi Update user", err);
      });
    // await axios({
    //   method: "POST",
    //   url: "http://localhost:1412/api/admin/user/update",
    //   data: data,
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + getToken(),
    //   },
    // })
    //   .then(() => {
    //     navigate("/admin/users");
    //   })
    //   .catch((err) => {
    //     console.log("Có lỗi xảy ra khi Update user", err);
    //   });
  };

  // const handleRoleChange = (role) => {
  //   setFormData({ ...formData, role });
  //   console.log("Selected role:", role);
  // };

  // const handleRoleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     setFormData({ ...formData, role: parseInt(value) });
  //   }
  // };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:1412/api/admin/user/update/role?userid=${id}&roleid=${formData.role}`,
  //       formData
  //     );
  //     setNotification("Cập nhật thành công!");
  //     console.log(response.data);
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
          <Link to="/admin/users">Quay lại</Link>
          {isLoading ? (
            <p>Loading.....</p>
          ) : (
            <ReusableForm
              title="Cập nhật người dùng"
              fields={fields}
              onSubmit={handleSubmit(handleSubmitForm)}
              submitButtonLabel="Xác Nhận"
              control={control}
              errors={errors}
              watch={watch}
            />
          )}

          {/* <div className='label_list'>
            <h2>Cập nhật quyền hạn của người đùng</h2>
          </div>
          <div className='create_movie_font'>
            <form onSubmit={handleSubmit} className='create_movie_form'>
              <div className='form_group'>
                <label>Tên người dùng</label>
                <input
                  type='text'
                  name='username'
                  className='create_input'
                  placeholder='Nhập tên người dùng'
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Email</label>
                <input
                  type='email'
                  name='email'
                  className='create_input'
                  placeholder='Nhập email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Vai trò</label>
                <div className='role_selection'>
                  <label>
                    <input
                      type='checkbox'
                      value='1'
                      checked={formData.role === 1}
                      onChange={handleRoleCheckboxChange}
                    />
                    ROLE_ADMIN
                  </label>
                  <label>
                    <input
                      type='checkbox'
                      value='2'
                      checked={formData.role === 2}
                      onChange={handleRoleCheckboxChange}
                    />
                    ROLE_USER
                  </label>
                </div>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {notification && <p style={{ color: 'green' }}>{notification}</p>}
              <button className='create_button' type='submit'>
                Cập nhật
              </button>
            </form>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
