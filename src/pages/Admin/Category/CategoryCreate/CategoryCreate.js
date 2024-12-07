import axios from 'axios';
import React, { useState } from 'react';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import './CategoryCreate.css';

const CategoryCreate = () => {
    const [newcategory, setNewcategory] = useState({
        name: '',
      
      });
     const [notification, setNotification] = useState('');
      const [error, setError] = useState('');
      const handleChange = (e) => {
        const { name, value } = e.target;
      
        setNewcategory({
            ...newcategory,
            [name]: value
          });
       
      };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1412/admin/category/create', newcategory);
      setNotification('Thêm mới thành công!');
      setNewcategory({
        name:'',
      })
    } catch (error) {
      setError(error.data)
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
            <h2>Thêm mới thể loại</h2>
            <a href='/admin/category' className='backtolist'> Quay lại </a>
          </div>
          <div className='create_movie_font'>
            {notification && <p style={{color:'green'}}>{notification}</p>}
            {error && <p style={{color:'red'}}>{error}</p>}
          <form onSubmit={handleSubmit} className='create_movie_form'>
            <div className='form_group'>
              <label>Tên thể thoại</label>
              <input
             
                type='text'
                name='name'
                 className='create_input'
                placeholder='Nhập tên thể loại phim'
                value={newcategory.name}
                onChange={handleChange}
                required
              />
            </div>
           
            <button type='submit' className='create_button'>Thêm mới</button>
          </form>
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
