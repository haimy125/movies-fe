// File: UserCreate.js
import axios from 'axios';
import React, { useState } from 'react';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';

const UserCreate = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, role: parseInt(value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1412/api/admin/user/create', formData);
      setNotification('Tạo người dùng thành công!');
      console.log(response.data);
      setFormData({ username: '', email: '', role: '' }); // Reset form after successful creation
    } catch (error) {
      setError(error.response ? error.response.data : 'Error submitting form');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='admin_layout'>
      <div className='header_ad'>
        <HeaderAdmin />
      </div>
      <div className='content'>
        <div className='nav'>
          <div className='content_nav'>
            <AdminNav />
          </div>
        </div>
        <div className='content_data'>
          <div className='label_list'>
            <h2>Tạo người dùng mới</h2>
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
                Tạo người dùng
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
