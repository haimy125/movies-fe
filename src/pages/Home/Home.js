import React from "react";
import HotMovies from "../../components/HotMovies/HotMovies";
import NewMovies from "../../components/NewMovies/NewMovies";
import TopMovies from "../../components/TopMovies/TopMovies";
import "./Home.css"; // Tạo file CSS cho styling
import ClientLayout from "../../layout/ClientLayout";

const Home = () => {
  return (
    <ClientLayout>
      <HotMovies />
      <div className="movie-lists">
        <div className="new_movies">
          <NewMovies />
        </div>

        <div className="top_movies">
          <TopMovies />
        </div>
      </div>
    </ClientLayout>
  );
};

export default Home;
