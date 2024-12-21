import React from "react";
import "./MovieCard.css"; // Tạo file CSS cho styling

const MovieCard = ({ id, name, vip, ep }) => {
  const truncateText = (text, maxLength) => {
    if (text && text?.length > maxLength) {
      return text?.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <div className="movie-card">
      <div className="movie_card_item">
        <img
          src={`http://localhost:1412/user/home/view/${id}`}
          alt={name}
          className="movie-image"
        />
        <div className="name_card_item">
          <h3>{truncateText(name, 35)}</h3>
        </div>
        <div className="ep_card_item">
          <span>{ep}</span>
        </div>
        <div className="vip_card_item">
          {vip === true ? <span>VIP</span> : ""}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
