import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../../assets/styles/Admin.css';
import HeaderAdmin from '../../../../components/AdminHeader/AdminHeader';
import AdminNav from '../../../../components/AdminNav/AdminNav';
import Loader from '../../../../components/Loader/Loader';
import './UserList.css';

const UserList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [pointCreate, setPointCreate] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [userid, setUserid] = useState('');
  const [point, setPoint] = useState('');
  const [roleid, setRoleid] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword, roleid]);

  const fetchData = async (page) => {
    try {
      let rp;
      if (keyword === '') {
        rp = await axios.get(`http://localhost:1412/api/admin/user/getbyrole?roleid=${roleid}&page=${page}&limit=10`);
      } else {
        rp = await axios.get(`http://localhost:1412/api/admin/user/getbyname?name=${keyword}&page=${page}&limit=10`);
      }
      setLoading(false);
      setMovies(rp.data.listResult);
      setTotalPages(rp.data.totalPage); // Assuming API returns total pages
      console.log(rp.data.listResult);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = (id) => {
    window.location.href = `/admin/users/edit/role/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1412/api/admin/user/delete/${id}`);
      setNotificationMessage('Xóa thành công!');
      setShowNotification(true);
      fetchData(currentPage); // Refresh the data
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePoints = async () => {
    try {
      await axios.put(`http://localhost:1412/api/admin/user/recharge?userid=${userid}&point=${point}`);
      setNotificationMessage('Nạp xu thành công!');
      setPointCreate(false);
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

  const handleCreatePoint = (id) => {
    setUserid(id);
    setPointCreate(true);
  };
  const convertMillisecondsToDate = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";
    const date = new Date(timestamp); // Chuyển đổi timestamp thành đối tượng Date
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
};


  if (loading) {
    return <Loader />;
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
            <h2>Danh sách người dùng</h2>
          </div>
          <div className='search_lable'>
            <div className='search'>
              <input
                type='text'
                className='search_input'
                placeholder='Nhập tên người dùng muốn tìm!'
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className='search_button' onClick={handleSearch}>Tìm kiếm</button>
            </div>
            <div className='admintouser'>
              <select
                className='select_admin_user'
                value={roleid}
                onChange={(e) => setRoleid(e.target.value)}
              >
                <option value="2">User</option>
                <option value="1">Admin</option>
              </select>
            </div>
          </div>
          <div className='create_movie'>
            <a href='/admin/movie/create' className='crate_button'>
              Thêm mới <i className="fa-solid fa-plus"></i>
            </a>
          </div>
          <div className='table'>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Ngày tạo</th>
                  <th>Xu</th>
                  <th>Quyền hạn</th>
                  <th>Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className='vnName'>{item.username}</td>
                    <td className='cnname'>{item.email}</td>
                    {/* Chuyển đổi định dạng ngày */}
                    <td>{new Date(item.timeAdd).toLocaleDateString('vi-VN')}</td>
                    <td className='status'>{item.point}</td>
                    <td className='vip'>{item.role.name}</td>
                    <td>
                      <a href='#' onClick={() => handleAction(item.id)}>
                        <i className="fa-solid fa-shield-halved"></i>
                      </a>
                      <a href='#' onClick={() => handleDelete(item.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </a>
                      <a href='#' onClick={() => handleCreatePoint(item.id)}>
                        <i className="fa-solid fa-coins"></i>
                      </a>
                    </td>
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
          {pointCreate && (
            <>
              <div className='notification-background'></div>
              <div className='notification'>
                <div className='closes_point' onClick={() => setPointCreate(false)}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div className='form_group'>
                  <label>Xu nạp</label>
                  <input
                    type='text'
                    className='create_input'
                    placeholder='Nhập số xu'
                    onChange={(e) => setPoint(e.target.value)}
                    required
                  />
                </div>
                <button className='notification_button' onClick={handleCreatePoints}>Xác nhận</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
