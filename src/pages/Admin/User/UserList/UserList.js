import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../../assets/styles/Admin.css";
import AdminHeader from "../../../../components/AdminHeader/AdminHeader";
import AdminNav from "../../../../components/AdminNav/AdminNav";
import Loader from "../../../../components/Loader/Loader";
import "./UserList.css";
import { Link, useNavigate } from "react-router-dom";
import { formatDateToDDMMYYYY } from "../../../../helper/FormatHelper";
const UserList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [pointCreate, setPointCreate] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [userid, setUserid] = useState("");
  const [point, setPoint] = useState("");
  const [roleid, setRoleid] = useState(2);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, keyword, roleid]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      let rp;
      if (keyword === "") {
        rp = await axios.get(
          `http://localhost:1412/api/admin/user/getbyrole?roleid=${roleid}&page=${page}&limit=10`
        );
      } else {
        rp = await axios.get(
          `http://localhost:1412/api/admin/user/getbyname?name=${keyword}&page=${page}&limit=10`
        );
      }
      setLoading(false);
      setMovies(rp.data.listResult);
      setTotalPages(rp.data.totalPage); // Assuming API returns total pages
      console.log(rp.data.listResult);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleAction = (id) => {
    navigate(`/admin/users/edit/role/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1412/api/admin/user/delete/${id}`);
      setNotificationMessage("Xóa thành công!");
      setShowNotification(true);
      fetchData(currentPage); // Refresh the data
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePoints = async () => {
    try {
      await axios.put(
        `http://localhost:1412/api/admin/user/recharge?userid=${userid}&point=${point}`
      );
      setNotificationMessage("Nạp xu thành công!");
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

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="admin_layout">
      <div className="header_ad">
        <AdminHeader />
      </div>
      <div className="content">
        <div className="nav">
          <div className="content_nav">
            <AdminNav />
          </div>
        </div>
        <div className="content_data">
          <div className="lable_list">
            <h2>Danh sách người dùng</h2>
          </div>
          <div className="search_lable">
            <div className="search">
              <input
                type="text"
                className="search_input"
                placeholder="Nhập tên người dùng muốn tìm!"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className="search_button" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
            <div className="admintouser">
              <select
                className="select_admin_user"
                value={roleid}
                onChange={(e) => setRoleid(e.target.value)}
              >
                <option value="2">User</option>
                <option value="1">Admin</option>
              </select>
            </div>
          </div>
          <div className="create_movie">
            <Link to={"/admin/users/create"} className="crate_button">
              Thêm mới <i className="fa-solid fa-plus"></i>
            </Link>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Ngày tạo</th>
                  <th>Ngày chỉnh sửa</th>
                  <th>Xu</th>
                  <th>Quyền hạn</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8}>Loading...</td>
                  </tr>
                ) : (
                  movies.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="vnName">{item.username}</td>
                      <td className="cnName">{item.email}</td>
                      <td>{formatDateToDDMMYYYY(item.timeAdd)}</td>
                      <td>{formatDateToDDMMYYYY(item.timeUpdate)}</td>
                      <td className="status">{item.point}</td>
                      <td className="vip">{item.role.name}</td>
                      <td>
                        <button onClick={() => handleAction(item.id)}>
                          <i className="fa-solid fa-shield-halved"></i>
                        </button>
                        <button to="#" onClick={() => handleDelete(item.id)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                          to="#"
                          onClick={() => handleCreatePoint(item.id)}
                        >
                          <i className="fa-solid fa-coins"></i>
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
          {pointCreate && (
            <>
              <div className="notification-background"></div>
              <div className="notification">
                <div
                  className="closes_point"
                  onClick={() => setPointCreate(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="form_group">
                  <label>Xu nạp</label>
                  <input
                    type="text"
                    className="create_input"
                    placeholder="Nhập số xu"
                    onChange={(e) => setPoint(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="notification_button"
                  onClick={handleCreatePoints}
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

export default UserList;
