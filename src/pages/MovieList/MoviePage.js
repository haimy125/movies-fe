import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./MoviePage.css";
import Loader from "../../components/Loader/Loader";

// MoviePage Component
const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [filterParams, setFilterParams] = useState({
    genre: "",
    year: "",
    sortBy: "",
    vip: "",
  });
  const [filterApplied, setFilterApplied] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const name = localStorage.getItem("keyWord");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorys, setCategorys] = useState([]);
  const [years, setYears] = useState([]);
  const currentYear = new Date().getFullYear();
  const categoryid = localStorage.getItem("categoryid");

  useEffect(() => {
    // Generate list of years from 1990 to current year
    const yearsList = [];
    for (let i = 1990; i <= currentYear; i++) {
      yearsList.push(i);
    }
    // Sort years in descending order
    yearsList.sort((a, b) => b - a);
    setYears(yearsList);
    fetchMovies(currentPage);
    categoryList();
  }, [currentPage, filterApplied, filterParams]); // Trigger fetch when page or filterApplied changes

  const fetchMovies = async (page) => {
    try {
      const { genre, sortBy, vip, year } = filterParams;
      setLoading(true);
      let response;
      if (filterApplied) {
        response = await axios.get(
          `http://localhost:1412/api/user/movie/list?category=${genre}&year=${year}&vip=${vip}&sortBy=${sortBy ?? "date"
          }&page=${page}&limit=30`
        );
        setLoading(false);
      } else if (name) {
        response = await axios.get(
          `http://localhost:1412/api/user/movie/getbyname?name=${name}&page=${page}&limit=30`
        );
        localStorage.setItem("keyWord", "");
        setLoading(false);
      } else if (categoryid) {
        response = await axios.get(
          `http://localhost:1412/api/user/movie/getbycategory?categoryid=${categoryid}&page=${page}&limit=30`
        );
        localStorage.setItem("categoryid", "");
        setLoading(false);
      } else {
        response = await axios.get(
          `http://localhost:1412/api/user/movie/all?page=${page}&limit=30`
        );
        setLoading(false);
      }
      setMovies(response.data.listResult);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching movies", error);
      setLoading(false);
    }
  };

  const categoryList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1412/admin/category/all?page=1&limit=10000`
      );
      setCategorys(response.data.listResult);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAction = (id) => {
    window.location.href = `/movie/detail/${id}`;
  };

  const handleFilter = useCallback(() => {
    console.log("click");

    const selectedCriteriaCount =
      Object.values(filterParams).filter((value) => value !== "") ?? 0;

    if (selectedCriteriaCount < 2) {
      setNotificationMessage("Vui lòng chọn ít nhất 2 tiêu chí để lọc!");
      setShowNotification(true);
      return;
    }

    setFilterApplied(true); // Set filterApplied to true to trigger the API call
    setCurrentPage(1); // Reset to first page when filter is applied
  }, [filterParams]);

  const handleReset = () => {
    setFilterApplied(false); // Set filterApplied to false to show all movies
    setCurrentPage(1); // Reset to first page when filter is reset
    setFilterParams({
      genre: "",
      year: "",
      sortBy: "",
      vip: "",
    });
    // setGenre("");
    // setYear("");
    // setSortBy("");
    // setVip("");
  };

  const handleFilterOptionChange = (type) => (event) => {
    setFilterParams({
      ...filterParams,
      [type]: event.target.value,
    });
    setFilterApplied(true);
  };

  const __renderFilterButton = () => {
    const filterBtn = (
      <button onClick={handleFilter} className="filter-apply-button">
        <i className="fa-solid fa-filter"></i>
      </button>
    );
    const unFilterBtn = (
      <button onClick={handleReset} className="filter-apply-button">
        <i className="fa-solid fa-filter-circle-xmark"></i>
      </button>
    );

    return (
      <div className="filter-container">
        {filterBtn}
        {filterApplied && unFilterBtn}
      </div>);
  };

  const __renderMovieList = () => (
    movies.map((item, index) => {
      return (
        <div
          className="movie_item"
          onClick={() => handleAction(item.id)}
          key={index}
        >
          <MovieCard
            id={item.id}
            name={item.vnName}
            vip={item.vipmovie}
            ep={item.episodenumber}
          />
        </div>
      );
    })
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />
      <div className="movie-page">
        {/* Movie Filter */}
        <div className="movie-filter">
          <div className="filter">
            <div className="filter-group">
              <select
                id="genre"
                className="filter-input"
                value={filterParams.genre}
                onChange={handleFilterOptionChange("genre")}
              >
                <option value="">Thể loại</option>
                {categorys.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                id="year"
                className="filter-input"
                value={filterParams.year}
                onChange={handleFilterOptionChange("year")}
              >
                <option value="">Năm sản xuất</option>
                {years.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                id="vip"
                className="filter-input"
                value={filterParams.vip}
                onChange={handleFilterOptionChange("vip")}
              >
                <option value="">Loại phí</option>
                <option value="true">Trả phí</option>
                <option value="false">Miễn phí</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                id="sortBy"
                className="filter-input"
                value={filterParams.sortBy}
                onChange={handleFilterOptionChange("sortBy")}
              >
                <option value="">Sắp xếp</option>
                <option value="date">Ngày đăng</option>
                <option value="views">Lượt xem</option>
                <option value="name">Tên tiếng Việt</option>
              </select>
            </div>
            {/* Button to apply filter */}
            {__renderFilterButton()}
          </div>
        </div>

        {/* Movie List */}
        <div className="pages">
          <div className="movie-list">{__renderMovieList()}</div>
          <div className="pagination_user">
            <a href="#" onClick={() => handlePageChange(currentPage - 1)}>
              &laquo;
            </a>
            {[...Array(totalPages)].map((_, i) => (
              <a
                key={i + 1}
                href="#"
                className={i + 1 === currentPage ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </a>
            ))}
            <a href="#" onClick={() => handlePageChange(currentPage + 1)}>
              &raquo;
            </a>
          </div>
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
    </div>
  );
};

export default MoviePage;
