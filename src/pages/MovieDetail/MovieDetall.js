import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentForm from "../../components/Comment/CommentForm";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import StarRating from "../../components/StarRating/StarRating";
import { useAuth } from "../../services/authService";
import "./MovieDetall.css"; // Tạo file CSS cho styling
import { getToken } from "../../services/tokenService";
import { convertMillisecondsToDate } from "../../helper/FormatHelper";
import Loading from "../../components/Loading";
import Detail from "./Detail";

const MovieDetail = () => {
  const { id } = useParams();
  const accessToken = getToken("accessToken");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [showFullDescription, setShowFullDescription] = useState(false);
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

  const [isLoadingMovieDetail, setIsLoadingMovieDetail] = useState(true);
  const [isLoadingMovieEp, setIsLoadingMovieEp] = useState(true);
  const [isLoadingMovieCmt, setIsLoadingMovieCmt] = useState(true);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    //if (!accessToken) {
    //  window.location.href = '/login';
    //  return; // Thoát khỏi useEffect nếu chưa có token
    //}
    console.log("test");

    fetchData();
  }, [id, currentPage, accessToken, user?.id]); // Thêm user?.id để tránh render vô tận

  const fetchData = async () => {
    try {
      if (user) {
        fetchDataMovieDetailWithUser();
      } else {
        fetchDataMovieDetailWithoutUser();
      }

      fetchDataMovieEp();
      fetchDataMovieComment();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchDataMovieDetailWithUser = async () => {
    setIsLoadingMovieDetail(true);
    try {
      await axios
        .get(
          `http://localhost:1412/api/admin/movies/userMovieDetail?userId=${user.id}&movieId=${id}`
        )
        .then((response) => {
          setMovie(response.data.movie);
          setIsBuy(response.data.buy);
          setIsFollowed(response.data.followed);
        });
      setIsLoadingMovieDetail(false);
    } catch (error) {
      console.error("Có lỗi khi fetch MovieDetail", error);
      setIsLoadingMovieDetail(false);
    }
  };
  const fetchDataMovieDetailWithoutUser = async () => {
    setIsLoadingMovieDetail(true);
    setIsBuy(false);
    setIsFollowed(false);
    try {
      await axios
        .get(`http://localhost:1412/api/admin/movies/getbyid/${id}`)
        .then((response) => {
          setMovie(response.data);
        });
      setIsLoadingMovieDetail(false);
    } catch (error) {
      console.log("Có lỗi khi fetch MovieDetail", error);
      setIsLoadingMovieDetail(false);
    }
  };
  const fetchDataMovieEp = async () => {
    setIsLoadingMovieEp(true);
    try {
      await axios
        .get(`http://localhost:1412/api/admin/episode/getBymovie/all/${id}`)
        .then((response) => {
          setEpisode(response.data.listResult);
        });
      setIsLoadingMovieEp(false);
    } catch (error) {
      console.log("Có lỗi khi fetch MovieEp", error);
      setIsLoadingMovieEp(false);
    }
  };
  const fetchDataMovieComment = async () => {
    setIsLoadingMovieCmt(true);
    try {
      await axios
        .get(
          `http://localhost:1412/api/user/comment/movie/bymovie/${id}?page=${currentPage}&limit=10`
        )
        .then((response) => {
          setComments(response.data.listResult || {});
        });
      setIsLoadingMovieCmt(false);
    } catch (error) {
      console.log("Có lỗi khi fetch MovieComment", error);
      setIsLoadingMovieCmt(false);
    }
  };

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
      await axios
        .post(
          `http://localhost:1412/api/user/movie/buymovie?userid=${user.id}&movieid=${id}`
        )
        .then(() => {
          fetchDataMovieDetailWithUser();
          fetchDataMovieEp();

          setIsBuy(true);
          setNotificationMessage("Bạn đã mua phim thành công ");
          setShowNotification(true);
          setCheckPrice(true);
        });
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
      await axios
        .post(
          `http://localhost:1412/api/user/follow/add?userid=${user.id}&movieid=${id}`
        )
        .then(() => {
          // fetchDataMovieDetailWithUser();
          setIsFollowed(true);
          setNotificationMessage("Bạn đã theo dõi phim thành công ");
          setShowNotification(true);
        });
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
      await axios
        .delete(
          `http://localhost:1412/api/user/follow/delete?userid=${user.id}&movieid=${id}`
        )
        .then(() => {
          setIsFollowed(false);
          setNotificationMessage("Bạn đã hủy theo dõi phim thành công ");
          setShowNotification(true);
        });
    } catch (error) {
      setNotificationMessage(error.response.data);
      setShowNotification(true);
    }
  };

  return (
    <div>
      <Header />
      <div className="detail">
        <div
          className="info"
          style={{
            justifyContent: "flex-start",
          }}
        >
          <Detail
            isLoading={isLoadingMovieDetail}
            data={movie}
            onBuy={handleBuyMovie}
            onFollow={handleFollow}
            onUnFollow={handleUnFollow}
            {...{ isBuy, isFollowed }}
          />
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
        <div className="episodes">
          <h2>Danh sách tập phim</h2>
          {isLoadingMovieEp ? (
            <Loading />
          ) : isBuy || movie?.price === 0 ? (
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
          ) : (
            <p>Hãy mua phim để xem được danh sách các tập phim</p>
          )}
        </div>
        <div className="comment">
          <h2>Danh sách bình luận</h2>
          {isAuthenticated ? (
            isLoadingMovieCmt ? (
              <Loading />
            ) : (
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
            )
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
