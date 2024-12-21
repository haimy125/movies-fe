import React, { useState } from "react";
import { convertMillisecondsToDate } from "../../../helper/FormatHelper";
import Loading from "../../../components/Loading";

const Detail = (props) => {
  const { isLoading, isBuy, isFollowed, onBuy, onFollow, onUnFollow, data } =
    props;
  const { id, vnName, cnName, author, timeAdd, vipMovie, price, description } =
    data ?? {};

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div
      className="info_main"
      style={{
        padding: "20px",
        width: "70%",
      }}
    >
      <h1>Thông tin chi tiết</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px",
            height: "80%",
          }}
        >
          <div
            className="images_movies"
            style={{
              width: "30%",
              height: "100%",
              backgroundColor: "#1C1C1C",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src={`http://localhost:1412/api/admin/movies/view/${id}`}
              className="movie-image"
              alt="Movie Poster"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
          <div className="info_content">
            <h1>{vnName}</h1>
            <p>Tên nước ngoài: {cnName}</p>
            <p>Tác giả: {author}</p>
            <p>Thời điểm đăng: {convertMillisecondsToDate(timeAdd) ?? "N/A"}</p>
            <p>Loại phim: {vipMovie ? "Trả phí" : "Miễn phí"} </p>
            <p>Giá: {price} xu</p>
            <p>
              Mô tả:
              <span
                className={{
                  display: "inline",
                }}
              >
                {!!description
                  ? showFullDescription
                    ? " " + description
                    : ` ${description?.substring(0, 100)}...`
                  : " Mô tả không có sẵn"}
                <span
                  className="toggle-description"
                  onClick={toggleDescription}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                </span>
              </span>
            </p>
            <div className="button_movie_detail">
              {!(isBuy || price === 0) && (
                <button className="follow_button play" onClick={onBuy}>
                  Mua Phim
                </button>
              )}
              {isFollowed ? (
                <button className="follow_button" onClick={() => onUnFollow()}>
                  Hủy theo dõi
                </button>
              ) : (
                <button className="follow_button" onClick={() => onFollow()}>
                  Theo dõi
                </button>
              )}
            </div>{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
