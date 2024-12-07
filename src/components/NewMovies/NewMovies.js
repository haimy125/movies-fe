import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import MovieCard from '../MovieCard/MovieCard';
import './NewMovies.css';
const NewMovies = () => {
const [movies,setmovies] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(()=>{
  fechdata();
},[]);
const fechdata=async () =>{
  try {
    const rp = await axios.get('http://localhost:1412/user/home/new?page=1&limit=12');
    setmovies(rp.data.listResult);
    setLoading(false);
  } catch (error) {
    console.error(error.data);
  }
}
if(loading){
  return <Loader/>
 }
const handleaction=(id)=>{
window.location.href = `/movie/detail/${id}`;
}

if(movies && movies?.length===0){
  return (
    <div className="new-movies">
    <h2>Phim Mới</h2>
    <div className="movie-list">
        <h2>Không có phim nào</h2>
      </div>
      </div>
  );
}
  return (
    <div className="new-movies">
      <h2>Phim Mới</h2>
      <div className="movie-list">
        {movies.map((item, index)=>(
          <div className='movie_item' key={index} onClick={() => handleaction(item.id)}>
          <MovieCard id={item.id} name={item.vnname} vip={item.vipmovie} ep={item.episodenumber} />
          </div>
        ))}
      </div>
      <a href='/movie/page' className='view_all_movies'>Xem tất cả </a>
    </div>
  );
};

export default NewMovies;
