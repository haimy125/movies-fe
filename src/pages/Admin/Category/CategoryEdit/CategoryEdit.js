import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import { useAuth } from '../../../../services/authService';
import './CategoryEdit.css';
import Loader from '../../../../components/Loader/Loader';
const CategoryEdit = () => {
    const {id} = useParams();
    const {user} = useAuth();
    const [loading, setLoading] = useState(true);
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
      useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
       
          const  rp = await axios.get(`http://localhost:1412/admin/category/getbyid/${id}`);
           
          const data = rp.data;
        
          setNewcategory({
            name:data.name,
          });
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
if(loading){
return <Loader />
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:1412/admin/category/update/${id}`, newcategory);
      setNotification('Cập nhật thành công!');
   
      console.log('Category created:', response.data);
    } catch (error) {
      setError(error.data)
      console.error('Error creating category:', error);
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
           
            <button type='submit' className='create_button'>Cập nhật</button>
          </form>
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEdit;
