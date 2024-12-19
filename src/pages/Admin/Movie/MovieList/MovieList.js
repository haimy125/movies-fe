import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../../assets/styles/Admin.css";
import HeaderAdmin from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import "./MovieList.css";
import Loader from "../../../../components/Loader/Loader";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { formatDateToDDMMYYYY } from "../../../../helper/FormatHelper";
const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword]);
  const fetchData = async (page) => {
    setLoading(true);
    try {
      let rp;
      if (keyword === "") {
        rp = await axios.get(
          `http://localhost:1412/api/admin/movies/all?page=${page}&limit=10`
        );
      } else {
        rp = await axios.get(
          `http://localhost:1412/api/admin/movies/getbyname?name=${keyword}&page=${page}&limit=10`
        );
      }

      setMovies(rp.data.listResult);
      setTotalPages(rp.data.totalPage); // Giả sử API trả về tổng số trang
      console.log(rp.data.listResult);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const handleAction = (id) => {
    navigate(`/admin/movie/edit/${id}`);
    // window.location.href = `/admin/movie/edit/${id}`;
  };
  const handleActiontoep = (id) => {
    navigate(`/admin/movie/episodes/${id}`);
    // window.location.href = `/admin/movie/episodes/${id}`;
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1412/api/admin/movies/delete/${id}`);
      setNotificationMessage("Xóa thành công!");
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

  // if (loading) {
  //   return <Loader />;
  // }
  return (
    <div className="admin_layout">
      <div className="header_ad">
        <HeaderAdmin />
      </div>
      <div className="content">
        <div className="nav">
          <div className="content_nav">
            <AdminNav />
          </div>
        </div>

        <div className="content_data">
          <div className="lable_list">
            <h2>Danh sách phim</h2>
          </div>
          <div className="search_lable">
            <div className="search">
              <Link to="/admin/movie/create" className="crate_button">
                Thêm mới <i className="fa-solid fa-plus"></i>
              </Link>
            </div>
            <div className="admintouser">
              <input
                type="text"
                className="search_input"
                placeholder="Nhập tên phim muốn tìm!"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="search_button" onClick={handleSearch}>
                Tìm kiếm
              </button>
              {/* <select className='select_admin_user'>
                <option value="1">User</option>
                <option value="0">Admin</option>
              </select> */}
            </div>
          </div>
          {/* <div className="create_movie"></div> */}
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên phim</th>
                  <th>Tên nước ngoài</th>
                  <th>Ngày đăng</th>
                  <th>Ngày chỉnh sửa</th>
                  <th>Trạng thái</th>
                  <th>Loại hình</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8}>Loading...</td>
                  </tr>
                ) : (
                  movies.map((item, index) => {
                    console.log("item movie", item);
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="vnName">{item.vnName}</td>
                        <td className="cnName">{item.cnName}</td>
                        <td>{formatDateToDDMMYYYY(item.timeAdd)}</td>
                        <td>{formatDateToDDMMYYYY(item.timeUpdate)}</td>
                        <td className="status">{item.status}</td>
                        {item.vipmovie === true ? (
                          <td className="vip">Trả phí</td>
                        ) : (
                          <td className="non_vip">Miễn phí</td>
                        )}
                        <td>
                          <a href="#" onClick={() => handleAction(item.id)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </a>
                          <a href="#" onClick={() => handleDelete(item.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </a>
                          <a href="#" onClick={() => handleActiontoep(item.id)}>
                            <i className="fa-solid fa-bars-staggered"></i>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <a href="#" onClick={() => handlePageChange(currentPage - 1)}>
              &laquo;
            </a>
            {[...Array(totalPages)].map((_, i) => (
              <a
                key={i + 1}
                href="#"
                className={i + 1 === currentPage ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </a>
            ))}
            <a href="#" onClick={() => handlePageChange(currentPage + 1)}>
              &raquo;
            </a>
          </div>
          {showNotification && (
            <>
              <div className="notification-background"></div>
              <div className="notification">
                <p>{notificationMessage}</p>
                <button
                  className="notification_button"
                  onClick={() => setShowNotification(false)}
                >
                  Xác nhận
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
