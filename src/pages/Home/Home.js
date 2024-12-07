import React from 'react';
import HotMovies from '../../components/HotMovies/HotMovies';
import NewMovies from '../../components/NewMovies/NewMovies';
import TopMovies from '../../components/TopMovies/TopMovies';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css'; // Tạo file CSS cho styling

const Home = () => {

  return (
    <div>

      <Header />
    <div className="home">
      <HotMovies />
      <div className="movie-lists">
        <div className="new_movies">
        <NewMovies />
      
        </div>
        
        <div className="top_movies"> 
        <TopMovies />
        </div>
     
      </div>

     
    </div>
    <Footer/>
    </div>
  );
};

export default Home;
