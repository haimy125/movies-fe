import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../../assets/styles/Admin.css";
import HeaderAdmin from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import Loader from "../../../../components/Loader/Loader";
import "./Category.css";
import { Link, useNavigate } from "react-router-dom";
const CategoryList = () => {
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword]);
  const fetchData = async (page) => {
    setLoading(true);
    try {
      let rp;
      if (keyword === "") {
        rp = await axios.get(
          `http://localhost:1412/admin/category/all?page=${page}&limit=10`
        );
      } else {
        rp = await axios.get(
          `http://localhost:1412/admin/category/getbyname?name=${keyword}&page=${page}&limit=12`
        );
      }

      setCategory(rp.data.listResult);
      setLoading(false);
      setTotalPages(rp.data.totalPage); // Giả sử API trả về tổng số trang
      console.log(rp.data.listResult);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const handleAction = (id) => {
    navigate(`/admin/category/edit/${id}`);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1412/admin/category/delete/${id}`);
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
            <h2>Danh sách thể loại</h2>
          </div>
          <div className="search_lable">
            <div className="search">
              <Link to="/admin/category/create" className="crate_button">
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
          <div className="create_movie"></div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên thể loại</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3}>Loading...</td>
                  </tr>
                ) : (
                  category.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <button onClick={() => handleAction(item.id)}>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => handleDelete(item.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <Link to="#" onClick={() => handlePageChange(currentPage - 1)}>
              &laquo;
            </Link>
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i + 1}
                to="#"
                className={i + 1 === currentPage ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Link>
            ))}
            <Link to="#" onClick={() => handlePageChange(currentPage + 1)}>
              &raquo;
            </Link>
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

export default CategoryList;
