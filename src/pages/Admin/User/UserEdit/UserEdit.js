import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import { useAuth } from '../../../../services/authService';
const UserEdit = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      role: '', // Default role
    });
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      fetchUserDetails();
    }, []);
  
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:1412/api/admin/user/getbyid/${id}`);
        const data = response.data;
        setFormData({
          username: data.username,
          email: data.email,
          role: data.role.id,
        });
        
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleRoleChange = (role) => {
      setFormData({ ...formData, role });
      console.log('Selected role:', role);
    };
  
    const handleRoleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
          setFormData({ ...formData, role: parseInt(value) });
        }
      };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`http://localhost:1412/api/admin/user/update/role?userid=${id}&roleid=${formData.role}`, formData);
        setNotification('Cập nhật thành công!');
        console.log(response.data);
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
            <h2>Cập nhật quyền hạn của người đùng</h2>
          </div>
          <div className='create_movie_font'>
            {notification && <p style={{ color: 'green' }}>{notification}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
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

             
              <button className='create_button' type='submit'>
                Cập nhật phim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
