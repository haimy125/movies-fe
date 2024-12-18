import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../components/AdminNav/AdminNav';
import Loader from '../../../components/Loader/Loader';
import { convertMillisecondsToDate } from '../../../helper/FormatHelper';
const OrdersList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword]);
  const fetchData = async (page) => {
    try {
      let rp;
      rp = await axios.get(`http://localhost:1412/api/admin/orders/all?page=${page}&limit=10`);
      setMovies(rp.data.listResult);
      setTotalPages(rp.data.totalPage); // Giả sử API trả về tổng số trang
      console.log(rp.data.listResult)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <Loader />
  }
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
          <div className='lable_list'>
            <h2>Danh sách phim đã được mua</h2>
          </div>

          <div className='create_movie'>
          </div>
          <div className='table'>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên phim mua</th>
                  <th>Tài khoản mua</th>
                  <th>Ngày mua</th>
                  <th>Số xu</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className='vnName'>{item.movie?.vnName ?? 'Không có tên phim'}</td>
                    <td className='cnName'>{item.user?.username ?? 'Không có tên người dùng'}</td>
                    <td>{item.date ? convertMillisecondsToDate(item.date) : 'Không có ngày'}</td>
                    <td className='status'>{item.point != null ? `${item.point} Xu` : 'Không có điểm'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <a href="#" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</a>
            {[...Array(totalPages)].map((_, i) => (
              <a
                key={i + 1}
                href="#"
                className={i + 1 === currentPage ? 'active' : ''}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </a>
            ))}
            <a href="#" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</a>
          </div>
          {showNotification && (
            <>
              <div className='notification-background'></div>
              <div className='notification'>
                <p>{notificationMessage}</p>
                <button className='notification_button' onClick={() => setShowNotification(false)}>Xác nhận</button>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default OrdersList;
