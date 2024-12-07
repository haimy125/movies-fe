import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import { useAuth } from '../../../../services/authService';
const EpisodeEdit = () => {
    const {user} = useAuth();
    const { id } = useParams();
    const movie = localStorage.getItem('movieid');
    const [formData, setFormData] = useState({
        name: '',
        views: '',
        description: '',
        useradd: '',
        likes: '',
        movie: '',
        videofile: null,
        subfile: null,
    });
    const [episode, setEpisode] = useState(null);
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');
    const [nameFile, setNameFile] = useState('');

    useEffect(() => {
            const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:1412/api/admin/episode/getbyid/${id}`);
            const ep = response.data;
            console.log('ep',response.data);
            setFormData({
                name: ep.name,
                views: ep.views,
                description: ep.description,
                useradd: '', // Assuming a default user ID, you can change this as needed
                likes: ep.likes,
                movie: movie,
                videofile: null,
                subfile: null,
            });
        
        } catch (error) {
            setError(error.response ? error.response.data : 'Error fetching data');
            console.error('Error fetching data:', error);
        }
    };
        fetchData();
    }, []);



    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'videofile' || name === 'subfile') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
            setNameFile(name);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = new FormData();
        dataToSubmit.append('name', formData.name);
        dataToSubmit.append('views', formData.views);
        dataToSubmit.append('description', formData.description);
        dataToSubmit.append('useradd', user.id);
        dataToSubmit.append('likes', formData.likes);
        dataToSubmit.append('movie', formData.movie);
        if (formData.videofile) {
            dataToSubmit.append('videofile', formData.videofile);
        }
        if (formData.subfile) {
            dataToSubmit.append('subfile', formData.subfile);
        }

        try {
            const response = await axios.put(`http://localhost:1412/api/admin/episode/update/${id}`, dataToSubmit, {
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

    const handleAction = () => {
        window.location.href = `/admin/movie/episodes/${movie}`;
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
                        <h2>Chỉnh sửa tập phim</h2>
                    </div>
                    <a onClick={handleAction}>Quay lại</a>
                    <div className='create_movie_font'>
                        {notification && <p style={{ color: 'green' }}>{notification}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={handleSubmit} className='create_movie_form'>
                            <div className='form_group'>
                                <label>Tập phim</label>
                                <input
                                    type='text'
                                    name='name'
                                    className='create_input'
                                    placeholder='Nhập tên tiếng việt của phim'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='form_group'>
                                <label>Lượt xem</label>
                                <input
                                    type='text'
                                    name='views'
                                    className='create_input'
                                    placeholder='Nhập số lượt xem'
                                    value={formData.views}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='form_group'>
                                <label>Lượt thích</label>
                                <input
                                    type='text'
                                    name='likes'
                                    className='create_input'
                                    placeholder='Nhập số lượt thích'
                                    value={formData.likes}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='form_group'>
                                <label>Mô tả</label>
                                <textarea
                                    name='description'
                                    className='create_textarea'
                                    placeholder='Nhập mô tả của phim'
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='form_group'>
                                <label>Chọn file phim mới</label>
                                <p className='notification_info'>kích cỡ file không quá 100MB</p>
                                <input
                                    type='file'
                                    name='videofile'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='form_group'>
                                <label>Chọn file sub mới</label>
                                <p className='notification_info'>kích cỡ file không quá 100MB</p>
                                <input
                                    type='file'
                                    name='subfile'
                                    onChange={handleChange}
                                />
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

export default EpisodeEdit;
