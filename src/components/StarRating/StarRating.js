import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StarRating.css';
import { getToken } from '../../services/tokenService'
const StarRating = ({ maxRating = 5, userId, movieId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  console.log('user', userId);
  console.log('movie', movieId);
  // Fetch existing rating when the component mounts

  useEffect(() => {
    const fetchRantings = async () => {
      try {
        const response = await axios.get(`http://localhost:1412/api/user/ratings/getuserandmovie?userid=${userId}&movieid=${movieId}`);
        setRating(response.data.rating);
        setIsRated(true);
      } catch (error) {
        console.error('Error submitting rating:', error)
      }

    }
    fetchRantings();
  }, [userId, movieId]);

  // Handle click event when the user selects a star
  const handleClick = async (value) => {
    if (!isRated) {
      try {
        const accessToken = getToken("accessToken");
        const response = await axios.post(`http://localhost:1412/api/user/ratings/review?userid=${userId}&movieid=${movieId}&rating=${value}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });
        setRating(value);
        setIsRated(true);
        console.log('Rating submitted:', response.data);
      } catch (error) {
        console.error('Error submitting rating:', error)
      }

    }
  };

  // Handle mouse enter event when hovering over a star
  const handleMouseEnter = (value) => {
    if (!isRated) {
      setHoverRating(value);
    }
  };

  // Handle mouse leave event when leaving a star
  const handleMouseLeave = () => {
    if (!isRated) {
      setHoverRating(0);
    }
  };

  // Generate star elements
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= (hoverRating || rating) ? 'filled' : ''}`}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
      >
        ★
      </span>
    );
  }

  return (
    <div className="star-rating">
      <h1>Đánh giá phim</h1>
      <div className="large-star">
        {rating}
      </div>
      <div className="stars">
        {stars}
      </div>
      {isRated && <p>Bạn đã đánh giá phim này.</p>}
    </div>
  );
};

export default StarRating;
