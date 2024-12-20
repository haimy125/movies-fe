import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentForm from "../../components/Comment/CommentForm";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import StarRating from "../../components/StarRating/StarRating";
import { useAuth } from "../../services/authService";
import "./MovieDetall.css"; // Tạo file CSS cho styling
import { Typography } from "@mui/material";
import BasicModal from "../../components/Modal/BasicModal";
import QRPayModal from "../../components/Modal/QrPayModal";
import { getToken } from "../../services/tokenService";
import { convertMillisecondsToDate } from "../../helper/FormatHelper";

const MovieDetail = () => {
  const { id } = useParams();
  const accessToken = getToken("accessToken");
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [episode, setEpisode] = useState([]);
  const [comments, setComments] = useState([]);
  const [movie, setMovie] = useState(null);
  const [isBuy, setIsBuy] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [checkPrice, setCheckPrice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    //if (!accessToken) {
    //  window.location.href = '/login';
    //  return; // Thoát khỏi useEffect nếu chưa có token
    //}

    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieResponse, episodeResponse, commentResponse] =
          await Promise.all([
            user
              ? axios.get(
                  `http://localhost:1412/api/admin/movies/userMovieDetail?userId=${user.id}&movieId=${id}`
                )
              : axios.get(
                  `http://localhost:1412/api/admin/movies/getbyid/${id}`
                ),
            axios.get(
              `http://localhost:1412/api/admin/episode/getBymovie/all/${id}`
            ),
            axios.get(
              `http://localhost:1412/api/user/comment/movie/bymovie/${id}?page=${currentPage}&limit=10`
            ),
          ]);

        if (user) {
          setMovie(movieResponse.data.movie);
          setIsBuy(movieResponse.data.buy);
          setIsFollowed(movieResponse.data.followed);
        } else {
          setMovie(movieResponse.data);
        }

        setEpisode(episodeResponse.data.listResult);
        setComments(commentResponse.data.listResult || {});
        setLoading(false);

        // if (user?.id) {
        //   const vipResponse = await axios.get(
        //     `http://localhost:1412/api/user/movie/checkvip?userid=${user.id}&movieid=${id}`
        //   );
        //   setCheckPrice(true);
        // }
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage, accessToken, user?.id]); // Thêm user?.id để tránh render vô tận

  console.log("Đây nè: ", episode, comments);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // if (!movie) {
  //   return <p>Đang tải dữ liệu...</p>;
  // }

  const handleAction = async (epid) => {
    if (movie?.vipmovie) {
      if (checkPrice) {
        navigate(`/movie/ep/${id}/${epid}`);
      } else {
        setNotificationMessage(
          "Đây là phim có yêu cầu trả phí, bạn vui lòng mua phim trước khi xem!"
        );
        setShowNotification(true);
      }
    } else {
      navigate(`/movie/ep/${id}/${epid}`);
    }
  };

  const handleBuyMovie = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:1412/api/user/movie/buymovie?userid=${user.id}&movieid=${id}`
      );
      setIsBuy(true);
      setNotificationMessage("Bạn đã mua phim thành công ");
      setShowNotification(true);
      setCheckPrice(true);
    } catch (error) {
      setNotificationMessage(error.response.data);
      setShowNotification(true);
      setCheckPrice(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:1412/api/user/follow/add?userid=${user.id}&movieid=${id}`
      );
      setIsFollowed(true);
      setNotificationMessage("Bạn đã theo dõi phim thành công ");
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage(error.response.data);
      setShowNotification(true);
    }
  };

  const handleUnFollow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:1412/api/user/follow/delete?userid=${user.id}&movieid=${id}`
      );
      setIsFollowed(false);
      setNotificationMessage("Bạn đã hủy theo dõi phim thành công ");
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage(error.response.data);
      setShowNotification(true);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <Header />
      <div className="detail">
        <div className="info">
          <div className="images_movies">
            <img
              src={`http://localhost:1412/api/admin/movies/view/${id}`}
              className="movie-image"
              alt="Movie Poster"
            />
          </div>
          <div className="info_content">
            <h1>{movie?.vnName}</h1>
            <p>Tên nước ngoài: {movie?.cnName}</p>
            <p>Tác giả: {movie?.author}</p>
            <p>
              Thời điểm đăng:{" "}
              {movie ? convertMillisecondsToDate(movie?.timeAdd) : "N/A"}
            </p>
            <p>Loại phim: {movie?.vipMovie ? "Trả phí" : "Miễn phí"} </p>
            <p>Giá: {movie?.price} xu</p>
            <p>Mô tả:</p>
            <p>
              {showFullDescription
                ? movie?.description || "Mô tả không có sẵn"
                : movie?.description
                ? `${movie.description.substring(0, 100)}...`
                : "Mô tả không có sẵn"}
              <span className="toggle-description" onClick={toggleDescription}>
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
              </span>
            </p>
            <div className="button_movie_detail">
              {!(isBuy || movie?.price === 0) && (
                <button className="follow_button play" onClick={handleBuyMovie}>
                  Mua Phim
                </button>
              )}
              {isFollowed ? (
                <button
                  className="follow_button"
                  onClick={() => handleUnFollow()}
                >
                  Hủy theo dõi
                </button>
              ) : (
                <button
                  className="follow_button"
                  onClick={() => handleFollow()}
                >
                  Theo dõi
                </button>
              )}
            </div>{" "}
          </div>
          <div className="info_review">
            {isAuthenticated ? (
              <StarRating userId={user.id} movieId={id} />
            ) : (
              <p>
                Bạn phải <Link to={"/login"}>đăng nhập</Link> để thực hiện chức
                năng đánh giá phim
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="ep_cmt">
        {(isBuy || movie?.price === 0) && (
          <div className="episodes">
            <h2>Danh sách tập phim</h2>
            <div className="episode-list">
              {episode.map((item, index) => (
                <div
                  key={index}
                  className="episode-item"
                  onClick={() => handleAction(item?.id)}
                >
                  {item?.name}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="comment">
          <h2>Danh sách bình luận</h2>
          {isAuthenticated ? (
            <>
              <div className="comment_list">
                {comments.map((item, index) => (
                  <div key={index} className="comment_item">
                    <div className="info_coment_user">
                      {/* Kiểm tra nếu item.useradd và item.useradd.username tồn tại */}
                      <p className="comment_user">
                        {item.useradd && item.useradd.username
                          ? item.useradd.username
                          : "Anonymous"}
                      </p>
                      <p className="comment_date">
                        {convertMillisecondsToDate(item.timeAdd)}
                      </p>
                    </div>
                    <p className="comment_content">{item.content}</p>
                  </div>
                ))}
                <div className="pagination_user">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  >
                    &laquo;
                  </a>
                  {[...Array(totalPages)].map((_, i) => (
                    <a
                      key={i + 1}
                      href="#"
                      className={i + 1 === currentPage ? "active" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </a>
                  ))}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  >
                    &raquo;
                  </a>
                </div>
              </div>
              <CommentForm movieid={id} userid={user.id} />
            </>
          ) : (
            "Bạn phải đăng nhập mới có thể bình luận phim!"
          )}
        </div>
      </div>
      <Footer />
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
      {/* <BasicModal open={true} heading="test">
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </BasicModal> */}
    </div>
  );
};

export default MovieDetail;
