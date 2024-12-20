import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import Loader from "../../../components/Loader/Loader";
import ProfileNav from "../../../components/ProfileNAV/Profilenav";
import { useAuth } from "../../../services/authService";

const Follows = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    fetchUserDetail(currentPage);
  }, [user, currentPage]);

  const fetchUserDetail = async (page) => {
    if (user?.id) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:1412/api/user/follow/getbyuser/${user.id}?page=${page}&limit=10`
        );
        setNotification(response.data.listResult || []);
        setTotalPages(response.data.totalPage);
        setLoading(false);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setLoading(true);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteFollow = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:1412/api/user/follow/delete?userid=${user.id}&movieid=${id}`
      );
      await fetchUserDetail(currentPage);
      setNotificationMessage("Bạn bỏ theo dõi phim thành công ");
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage(error.response.data);
      setShowNotification(true);
    }
  };
  const handleaction = (id) => {
    window.location.href = `/movie/detail/${id}`;
  };
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
            <div className="detal_info">
              <h2>Phim đang theo dõi</h2>
              <p>Đây là danh sách các phim mà bạn đã theo dõi</p>
            </div>
            <div className="avatar-section">
              <div className="history_table">
                <table className="history_table_content">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên phim</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {notification.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="movie_orders_name">
                          {item.movie.vnName}
                        </td>
                        <td>
                          <a
                            href="#"
                            className="view_movie"
                            onClick={() => handleaction(item.movie.id)}
                          >
                            {" "}
                            <i className="fa-solid fa-eye"></i> xem phim
                          </a>
                        </td>
                        <td>
                          <a
                            href="#"
                            className="view_movie"
                            onClick={() => handleDeleteFollow(item.movie.id)}
                          >
                            {" "}
                            <i className="fa-solid fa-rotate-left"></i> Bỏ theo
                            dõi
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination_user">
                <a href="#!" onClick={() => handlePageChange(currentPage - 1)}>
                  &laquo;
                </a>
                {[...Array(totalPages)].map((_, i) => (
                  <a
                    key={i + 1}
                    href="#!"
                    className={i + 1 === currentPage ? "active" : ""}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </a>
                ))}
                <a href="#!" onClick={() => handlePageChange(currentPage + 1)}>
                  &raquo;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Follows;
