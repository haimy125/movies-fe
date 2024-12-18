import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './VipMovie.css';

const VipMovies = () => {
  const movies = [
    // Dữ liệu mẫu cho phim mới
  ];

  return (
    <div className="vip-movies">
      <h2>Phim trả phí</h2>
      <div className="movie-list">
          <div className='movie_item'>
          <MovieCard/>
          </div>
          <div className='movie_item'>
          <MovieCard/>
          </div>
          <div className='movie_item'>
          <MovieCard/>
          </div>
          <div className='movie_item'>
          <MovieCard/>
          </div>
          <div className='movie_item'>
          <MovieCard/>
          </div>
     
        
      </div>
    </div>
  );
};

export default VipPMovies;
