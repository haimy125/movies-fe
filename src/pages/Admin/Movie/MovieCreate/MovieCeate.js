import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import { useAuth } from '../../../../services/authService';
import './MovieCreate.css';

const MovieCreate = () => {
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    vn_name: '',
    cn_name: '',
    description: '',
    user_add: '', // Assuming a default user ID, you can change this as needed
    author: '',
    episode_number: '',
    status: 'Đang ra',
    new_movie: false,
    hot_movie: false,
    vip_movie: false,
    price: '',
    image: null,
    year:'',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    fetchDataSchedule();
  }, []);

  const fetchData = async () => {
    try {
      const rp = await axios.get(`http://localhost:1412/admin/category/all?page=1&limit=10000`);
      setCategoryList(rp.data.listResult);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDataSchedule = async () => {
    try {
      const rp = await axios.get(`http://localhost:1412/api/admin/schedule/getAll`);
      setScheduleList(rp.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setFileName(files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleCategoryChange = (e, id) => {
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, id]);
    } else {
      setSelectedCategories(selectedCategories.filter((categoryId) => categoryId !== id));
    }
  };
  const handleScheduleChange = (e, id) => {
    if (e.target.checked) {
      setSelectedSchedules([...selectedSchedules, id]);
    } else {
      setSelectedSchedules(selectedSchedules.filter((scheduleid) => scheduleid !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryIdsString = selectedCategories.join(',');
    const scheduleIdString = selectedSchedules.join(',');
    const dataToSubmit = new FormData();
    dataToSubmit.append('vn_name', formData.vn_name);
    dataToSubmit.append('cn_name', formData.cn_name);
    dataToSubmit.append('description', formData.description);
    dataToSubmit.append('user_add', user.id);
    dataToSubmit.append('author', formData.author);
    dataToSubmit.append('episode_number', formData.episode_number);
    dataToSubmit.append('status', formData.status);
    dataToSubmit.append('new_movie', formData.new_movie === 'true');
    dataToSubmit.append('hot_movie', formData.hot_movie === 'true');
    dataToSubmit.append('vip_movie', formData.vip_movie === 'true');
    dataToSubmit.append('price', formData.price);
    dataToSubmit.append('year', formData.year);
    dataToSubmit.append('categorylist', categoryIdsString);
    dataToSubmit.append('schedulelist', scheduleIdString);
    dataToSubmit.append('image', fileName);

    try {
      const response = await axios.post('http://localhost:1412/api/admin/movies/create', dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotification('Thêm mới thành công!');
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
            <h2>Thêm mới phim</h2>
            <a href='/admin/movie' className='backtolist'> Quay lại </a>
          </div>
          <div className='create_movie_font'>
            {notification && <p style={{ color: 'green' }}>{notification}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className='create_movie_form'>
              <div className='form_group'>
                <label>Tên Việt Nam</label>
                <input
                  type='text'
                  name='vn_name'
                  className='create_input'
                  placeholder='Nhập tên tiếng việt của phim'
                  value={formData.vn_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Tên tiếng hán</label>
                <input
                  type='text'
                  name='cn_name'
                  className='create_input'
                  placeholder='Nhập tên tiếng trung của phim'
                  value={formData.cn_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Tác giả</label>
                <input
                  type='text'
                  name='author'
                  className='create_input'
                  placeholder='Nhập tên tác giả của phim'
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Số tập</label>
                <input
                  type='number'
                  name='episode_number'
                  className='create_input'
                  placeholder='Nhập số tập của phim'
                  value={formData.episode_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Năm sản xuất</label>
                <input
                  type='number'
                  name='year'
                  className='create_input'
                  placeholder='Nhập năm sản xuất'
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Trạng thái</label>
                <select
                  className='create_input'
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Đang ra">Đang ra</option>
                  <option value="Tạm hoãn">Tạm hoãn</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
              <div className='form_group'>
                <label>Phim mới</label>
                <select
                  className='create_input'
                  name='new_movie'
                  value={formData.new_movie}
                  onChange={handleChange}
                >
                  <option value="true">Phim mới ra</option>
                  <option value="false">Phim đã ra lâu</option>
                </select>
              </div>
              <div className='form_group'>
                <label>Phim hot</label>
                <select
                  className='create_input'
                  name='hot_movie'
                  value={formData.hot_movie}
                  onChange={handleChange}
                >
                  <option value="true">Phim đang nổi</option>
                  <option value="false">Phim thường</option>
                </select>
              </div>
              <div className='form_group'>
                <label>Vip</label>
                <select
                  className='create_input'
                  name='vip_movie'
                  value={formData.vip_movie}
                  onChange={handleChange}
                >
                  <option value="true">Trả phí</option>
                  <option value="false">Miễn phí</option>
                </select>
              </div>
              <div className='form_group'>
                <label>Giá</label>
                <input
                  type='number'
                  name='price'
                  className='create_input'
                  placeholder='Nhập giá của phim'
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form_group'>
                <label>Nội dung chính</label>
                <textarea
                  type='text'
                  name='description'
                  className='create_textarea'
                  placeholder='Nhập nội dung chính của phim'
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <label>Thể loại</label>
              <div className='category_movie_list'>
                
                {categoryList.map((item, index) => (
                  <div className='category_movie_list_group' key={index}>
                    <input
                      type='checkbox'
                      onChange={(e) => handleCategoryChange(e, item.id)}
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
              </div>
              <br/>
              <label>lịch chiếu</label>
              <div className='category_movie_list'>
                
                {scheduleList.map((item, index) => (
                  <div className='category_movie_list_group' key={index}>
                    <input
                      type='checkbox'
                      onChange={(e) => handleScheduleChange(e, item.id)}
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
              </div>
              <div className='form_group'>
                <label>Chọn file phim</label>
                <input
                  type='file'
                  id='movieFile'
                  name='image'
                  className='custom-file-input'
                  onChange={handleChange}
                  required
                />
                <label className='custom-file-label' htmlFor='movieFile'>
                  Chọn file
                </label>
              </div>
              <div className='form_group image_movie'>
                <img src={selectedImage} alt='Selected' className='selected_image' />
              </div>
              <button className='create_button' type='submit'>
                Thêm mới phim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCreate;
