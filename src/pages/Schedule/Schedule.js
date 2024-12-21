import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import MovieCard from "../../components/MovieCard/MovieCard";

import "./Schedule.css";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [moviesBySchedule, setMoviesBySchedule] = useState({});

  useEffect(() => {
    fetchSchedules();
  }, []);

  const navigate = useNavigate();

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1412/api/admin/schedule/getAll`
      );
      const scheduleData = response.data;
      setSchedules(scheduleData);

      const moviesData = await fetchMoviesBySchedule(scheduleData);
      setMoviesBySchedule(moviesData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules and movies", error);
      setLoading(false);
    }
  };

  const fetchMoviesBySchedule = async (scheduleData) => {
    const movies = {};

    await Promise.all(
      scheduleData.map(async (scheduleItem) => {
        const response = await axios.get(
          `http://localhost:1412/api/admin/schedule-movie/getbyschedule/${scheduleItem.id}`
        );
        movies[scheduleItem.id] = response.data;
      })
    );

    return movies;
  };

  const handleAction = (id) => {
    navigate(`/movie/detail/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />
      <div className="movie-page">
        <div className="schedule_page">
          <div className="page_item">
            {schedules.map((scheduleItem) => (
              <div className="schedule_page_item" key={scheduleItem.id}>
                <h2>{scheduleItem.name}</h2>
                <hr />
                <br />
                <div className="movie_item_schedule">
                  <div className="movie_list">
                    {moviesBySchedule &&
                    moviesBySchedule[scheduleItem.id]?.length > 0 ? (
                      moviesBySchedule[scheduleItem.id].map((movieitem) => (
                        <div
                          className="movie_item"
                          onClick={() => handleAction(movieitem.movie.id)}
                          key={movieitem.id}
                        >
                          <MovieCard
                            id={movieitem.movie.id}
                            name={movieitem.movie.vnName}
                            vip={movieitem.movie.vipmovie}
                            ep={movieitem.movie.episodenumber}
                          />
                        </div>
                      ))
                    ) : (
                      <p>Ngày {scheduleItem.name} không có phim nào chiếu</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Schedule;
