import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../components/AdminNav/AdminNav';
import Loader from '../../../components/Loader/Loader';
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
  }, [currentPage,keyword]);
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
  const convertMillisecondsToDate = (milliseconds) => {
    const date = new Date(milliseconds);
  
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();
  
    // Format the day and month with leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${formattedDay}-${formattedMonth}-${year}`;
  };
  
  if(loading){
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
              <tr>
                <th>#</th>
                <th>Tên phim mua</th>
                <th>Tài khoản mua</th>
                <th>Ngày mua</th>
                <th>Số xu</th>
              </tr>
              {movies.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td className='vnname'>{item.movie.vnname}</td>
                  <td className='cnname'>{item.user.username}</td>
                  <td>{convertMillisecondsToDate(item.date)}</td>
                  <td className='status'>{item.point} Xu</td>
                </tr>
              ))}

            </table>
          </div>

          <div class="pagination">
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
