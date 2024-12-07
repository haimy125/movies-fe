import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import Loader from '../../../components/Loader/Loader';
import ProfileNav from '../../../components/ProfileNAV/Profilenav';
import { useAuth } from '../../../services/authService';

const MovieBuyed = () => {
    const { user } = useAuth();
    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUserDetail = async (page) => {
            if (user?.id) {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:1412/api/admin/orders/getbyuser?userid=${user.id}&page=${page}&limit=10`);
                    setNotification(response.data.listResult || []);
                    setTotalPages(response.data.totalPage);
                    setLoading(false)
                } catch (error) {
                    console.error(error.response?.data || error.message);
                }
            }
        };

        fetchUserDetail(currentPage);
    }, [user, currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const convertMillisecondsToDate = (milliseconds) => {
        const date = new Date(milliseconds);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const year = date.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        return `${formattedDay}-${formattedMonth}-${year}`;
    };
    const handleaction=(id)=>{
        window.location.href = `/movie/detail/${id}`;
        }
    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Header />
            <div className="profile-container">
                <ProfileNav />
                <div className="profile-content">
                    <div className="account-info">
                        <div className='detal_info'>
                            <h2>Phim đã mua</h2>
                            <p>Bạn có thể xem danh sach phim đã mua tại đây</p>
                        </div>
                        <div className="avatar-section">
                            <div className='history_table'>
                                <table className='history_table_content'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tên phim</th>
                                            <th>Thời gian mua</th>
                                            <th>Số xu</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notification.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className='movie_orders_name'>{item.movie.vnname}</td>
                                                <td>{convertMillisecondsToDate(item.date)}</td>
                                                <td >{item.point}</td>
                                                <td ><a href='#' className='view_movie' onClick={() => handleaction(item.movie.id)}> <i class="fa-solid fa-eye"></i></a></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination_user">
                                <a href="#!" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</a>
                                {[...Array(totalPages)].map((_, i) => (
                                    <a
                                        key={i + 1}
                                        href="#!"
                                        className={i + 1 === currentPage ? 'active' : ''}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </a>
                                ))}
                                <a href="#!" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MovieBuyed;
