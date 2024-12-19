// src/components/HotMovies.js

import React, { useState, useRef, useEffect } from "react";
import "./HotMovies.css";
import axios from "axios";
const HotMovies = () => {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const scrollStep = 300; // Số pixels để di chuyển mỗi lần
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fechdata();
  }, []);
  const fechdata = async () => {
    try {
      const rp = await axios.get(
        "http://localhost:1412/user/home/hot?page=1&limit=10"
      );
      console.log("hot movies::::",rp )
      setMovies(rp.data.listResult);
    } catch (error) {
      console.error(error.data);
    }
  };

  useEffect(() => {
    // Di chuyển tự động
    scrollIntervalRef.current = setInterval(() => {
      const container = containerRef.current;
      if (container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const newOffset = (offset + scrollStep) % (maxScrollLeft + 1);
        setOffset(newOffset);
      }
    }, 3000); // Di chuyển mỗi 3 giây

    // Dọn dẹp khi component unmount
    return () => clearInterval(scrollIntervalRef.current);
  }, [offset]);

  const handlePrev = () => {
    const container = containerRef.current;
    if (container) {
      const newOffset = Math.max(0, offset - scrollStep);
      setOffset(newOffset);
    }
  };

  const handleNext = () => {
    const container = containerRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const newOffset = Math.min(maxScrollLeft, offset + scrollStep);
      setOffset(newOffset);
    }
  };
  if (!movies || movies?.length === 0) {
    return (
      <div className="hot-movies">
        <h2>Không có phim nào</h2>
      </div>
    );
  }
  const handleaction = (id) => {
    window.location.href = `/movie/detail/${id}`;
  };
  return (
    <div className="hot-movies">
      <button className="scroll-button prev" onClick={handlePrev}>
        &lt;
      </button>
      <div className="hot-movies-container" ref={containerRef}>
        <div
          className="hot-movies-list"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {movies.map((item, index) => (
            <div
              key={index}
              className="hot-movie-card"
              onClick={() => handleaction(item.id)}
            >
              <img
                key={"image" + index}
                src={"http://localhost:1412/user/home/view/" + item.id}
                alt="thôn phệ tinh không"
              />
            </div>
          ))}

          {/* ))} */}
        </div>
      </div>
      <button className="scroll-button next" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default HotMovies;
