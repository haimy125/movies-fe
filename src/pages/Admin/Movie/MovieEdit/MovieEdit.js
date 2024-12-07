import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import { useAuth } from '../../../../services/authService';
import Loader from '../../../../components/Loader/Loader';
import './MovieEdit.css';
const MovieEdit = () => {
  const {user} = useAuth();
    const {id} = useParams();
  const [formData, setFormData] = useState({
    vn_name: '',
    cn_name: '',
    description: '',
    user_add: '', // Assuming a default user ID, you can change this as needed
    author: '',
    episode_number: '',
    status: 'Đang ra',
    new_movie: '',
    hot_movie: '',
    vip_movie: '',
    price: '',
    image: null,
    year: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [categorymovie, setCategorymovie] = useState([]);
  const [scheduleListmovie, setScheduleListmovie] = useState([]);
  const [movie, setmovie] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
    fetchDetail();
    fetchDetailcategory();
    fetchDataSchedule();
    fetchImageFromDatabase();
    fetchDetailSchedules();
    setLoading(false);
  }, []);

  const fetchData = async () => {
    try {
      const rp = await axios.get(`http://localhost:1412/admin/category/all?page=1&limit=10000`);
      setCategoryList(rp.data.listResult);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDetailcategory = async () => {
    try {
      const rp = await axios.get(`http://localhost:1412/api/category_movie/getBymovie/${id}`);
      const categoryIds = rp.data.map(item => item.category.id);
      setSelectedCategories(categoryIds);
      setCategorymovie(rp.data)
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDetailSchedules = async () => {
    try {
      const rp = await axios.get(`http://localhost:1412/api/admin/schedule-movie/getbymovie/${id}`);
      const scheduleIds = rp.data.map(item => item.schedule.id);
      setSelectedSchedules(scheduleIds);
      setScheduleListmovie(rp.data)
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
  const fetchDetail = async () => {
    try {
      const rp = await axios.get(`http://localhost:1412/api/admin/movies/getbyid/${id}`);
        const data = rp.data;
        setFormData({
            vn_name: data.vnname,
            cn_name: data.cnname,
            description: data.description,
            user_add: '', // Assuming a default user ID, you can change this as needed
            author: data.author,
            episode_number: data.episodenumber,
            status: data.status,
            new_movie: data.newmovie,
            hot_movie: data.hotmovie,
            vip_movie: data.vipmovie,
            price: data.price,
            image: null,
            year:data.year,
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchImageFromDatabase = async () => {
    try {
      const response = await axios.get(`http://localhost:1412/api/admin/movies/view/${id}`, {
        responseType: 'arraybuffer', // Để nhận dữ liệu nhị phân
      });
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const imageBlob = new Blob([base64Image], { type: 'image/jpeg' }); // Thay đổi type phù hợp với hình ảnh của bạn
      setFormData({
        ...formData,
        image: imageBlob,
      });
    } catch (error) {
      console.error(error);
    }
  };
  if(loading){
    return <Loader />
  }
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
        if (files &&files?.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
            setFileName(files[0]);
            setSelectedImage(URL.createObjectURL(files[0]));
        } else {
            setFormData({
                ...formData,
                [name]: null,
            });
            setFileName(null);
            setSelectedImage(`http://localhost:1412/api/admin/movies/view/${id}`);
        }
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
    const scheduleIdString = selectedSchedules.join(',');
    const categoryIdsString = selectedCategories.join(',');
    const dataToSubmit = new FormData();
    dataToSubmit.append('vn_name', formData.vn_name);
    dataToSubmit.append('cn_name', formData.cn_name);
    dataToSubmit.append('description', formData.description);
    dataToSubmit.append('user_add', user.id);
    dataToSubmit.append('author', formData.author);
    dataToSubmit.append('episode_number', formData.episode_number);
    dataToSubmit.append('status', formData.status);
    dataToSubmit.append('new_movie', formData.new_movie);
    dataToSubmit.append('hot_movie', formData.hot_movie);
    dataToSubmit.append('vip_movie', formData.vip_movie );
    dataToSubmit.append('price', formData.price);
    dataToSubmit.append('year', formData.year);
    dataToSubmit.append('categorylist', categoryIdsString);
    dataToSubmit.append('schedulelist', scheduleIdString);
    if(fileName){
      dataToSubmit.append('image', formData.image);
    }

 
    try {
      const response = await axios.put(`http://localhost:1412/api/admin/movies/update/${id}`, dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
            <h2>Cập nhật thông tin phim</h2>
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
                  placeholder='Nhập năm xản xuất'
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
                  <option value="Đang ra"selected={formData.hot_movie === 'Đang ra'} >Đang ra</option>
                  <option value="Tạm hoãn" selected={formData.hot_movie === 'Tạm hoãn'} >Tạm hoãn</option>
                  <option value="Hoàn thành" selected={formData.hot_movie === 'Hoàn thành'} >Hoàn thành</option>
                </select>
              </div>
              <div className='form_group'>
                <label>Truyện mới</label>
                <select
                  className='create_input'
                  name='new_movie'
                  value={formData.new_movie}
                  onChange={handleChange}
                >
                  <option value="true" selected={formData.new_movie === true}>Truyện mới ra</option>
                  <option value="false"  selected={formData.new_movie === false}>Truyện đã ra lâu</option>
                </select>
              </div>
              <div className='form_group'>
                <label>Truyện hot</label>
                <select
                  className='create_input'
                  name='hot_movie'
                  value={formData.hot_movie}
                  onChange={handleChange}
                >
                  <option value="true" selected={formData.hot_movie === true}>Truyện đang nổi</option>
                  <option value="false" selected={formData.hot_movie === false}>Truyện thường</option>
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
                  <option value="true" selected={formData.vip_movie === true}>Trả phí</option>
                  <option value="false"  selected={formData.vip_movie === false}>Miễn phí</option>
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
                      checked={(selectedCategories ?? []).includes(item.id)}
                      
                      onChange={(e) => handleCategoryChange(e, item.id)}
                    />
                    <label>{item.name}</label>
                  </div>
                ))}
              </div>
              <label>Lịch chiếu</label>
              <div className='category_movie_list'>
                {scheduleList.map((item, index) => (
                  <div className='category_movie_list_group' key={index}>
                    <input
                      type='checkbox'
                      checked={(selectedSchedules ?? []).includes(item.id)}
                      
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
                />
                <label className='custom-file-label' htmlFor='movieFile'>
                  Chọn file
                </label>
              </div>
              {selectedImage ?  
              <div className='form_group image_movie'>
                <img src={selectedImage} alt='Selected' className='selected_image' />
              </div> :
               <div className='form_group image_movie'>
               <img src={`http://localhost:1412/api/admin/movies/view/${id}`} alt='Selected' className='selected_image' />
             </div> 
              }
             
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

export default MovieEdit;
