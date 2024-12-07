import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import './EpisodeList.css';
import Loader from '../../../../components/Loader/Loader';
const EpisodeList = () => {
    const {id} = useParams();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);
  const fetchData = async (page) => {
    try {
    
       const rp = await axios.get(`http://localhost:1412/api/admin/episode/getBymovie/${id}?page=${page}&limit=10`);
      setMovies(rp.data.listResult);
      setTotalPages(rp.data.totalPage); // Giả sử API trả về tổng số trang
setLoading(false);      
    } catch (error) {
      console.error(error);
    }
  };
  if(loading){
    return <Loader/>
  }
  const handleAction = (epid) => {
    window.location.href = `/admin/movie/episodes/edit/${epid}`;
    localStorage.setItem('movieid', id);
  }
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1412/api/admin/episode/delete/${id}`);
      setNotificationMessage('Xóa thành công!');
      setShowNotification(true);
      fetchData(currentPage); // Refresh the data
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    fetchData(1); // Reset to first page when searching
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
  const handleActiontocreate = ()=>{
    window.location.href =`/admin/movie/episodes/${id}/create`;
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
            <h2>Danh sách tập phim</h2>
            <a href='/admin/movie' className='backtolist'> Quay lại danh sách phim </a>
          </div>
          <div className='search_lable'>
            {/* <div className='search'>
              <input type='text' className='search_input' placeholder='Nhập tên phim muốn tìm!' onChange={(e) => setKeyword(e.target.value)} />
              <button className='search_button' onClick={handleSearch}>Tìm kiếm</button>
            </div> */}
            {/* <div className='admintouser'>
              <select className='select_admin_user'>
                <option value="1">User</option>
                <option value="0">Admin</option>
              </select>
            </div> */}
          </div>
          <div className='create_movie'>
            <a onClick={() => handleActiontocreate()} className='crate_button'>Thêm mới <i class="fa-solid fa-plus"></i></a>

          </div>
          <div className='table'>
            <table>
              <tr>
                <th>#</th>
                <th>Tên </th>
              
                <th>ngày đăng</th>
                <th>Lượt xem</th>
                <th>Lượt thích</th>
                <th>chỉnh sửa</th>
              </tr>
              {movies.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td className='vnname'>{item.name}</td>
          
                  <td>{convertMillisecondsToDate(item.timeadd)}</td>
                  <td className='vnname'>{item.views}</td>
                
                  <td className='status'>{item.likes}</td>
                 
                  <td>

                    <a href='#'  onClick={() => handleAction(item.id)}><i class="fa-solid fa-pen-to-square"></i></a>
                    <a href='#' onClick={() => handleDelete(item.id)}><i class="fa-solid fa-trash"></i></a>
                  </td>
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

export default EpisodeList;
