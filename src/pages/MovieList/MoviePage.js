import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import MovieCard from '../../components/MovieCard/MovieCard';
import './MoviePage.css';
import Loader from '../../components/Loader/Loader';

// MoviePage Component
const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [vip, setVip] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const name = localStorage.getItem('keyWord');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorys, setCategorys] = useState([]);
  const [years, setYears] = useState([]);
  const currentYear = new Date().getFullYear();
  const categoryid = localStorage.getItem('categoryid');

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
  }, [currentPage, filterApplied]); // Trigger fetch when page or filterApplied changes

  const fetchMovies = async (page) => {
    try {
      setLoading(true);
      let response;
      if (filterApplied) {
        response = await axios.get(`http://localhost:1412/api/user/movie/list?category=${genre}&year=${year}&vip=${vip}&sortBy=${sortBy}&page=${page}&limit=30`);
        setLoading(false);
      } else if (name) {
        response = await axios.get(`http://localhost:1412/api/user/movie/getbyname?name=${name}&page=${page}&limit=30`);
        localStorage.setItem('keyWord', '');
        setLoading(false);
      }
      else if (categoryid) {
        response = await axios.get(`http://localhost:1412/api/user/movie/getbycategory?categoryid=${categoryid}&page=${page}&limit=30`);
        localStorage.setItem('categoryid', '');
        setLoading(false);
      } else {
        response = await axios.get(`http://localhost:1412/api/user/movie/all?page=${page}&limit=30`);
        setLoading(false);
      }
      setMovies(response.data.listResult);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error('Error fetching movies', error);
      setLoading(false);
    }
  };

  const categoryList = async () => {
    try {
      const response = await axios.get(`http://localhost:1412/admin/category/all?page=1&limit=10000`);
      setCategorys(response.data.listResult);
    } catch (error) {
      console.error('Error fetching categories', error);
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

  const handleFilter = () => {
    const selectedCriteriaCount = [genre, year, sortBy, vip]?.filter(value => value !== '')?.length || 0;
    
    if (selectedCriteriaCount < 2) {
      setNotificationMessage('Vui lòng chọn ít nhất 2 tiêu chí để lọc!');
      setShowNotification(true);
      return;
    }

    setFilterApplied(true); // Set filterApplied to true to trigger the API call
    setCurrentPage(1); // Reset to first page when filter is applied
  };

  const handleReset = () => {
    setFilterApplied(false); // Set filterApplied to false to show all movies
    setCurrentPage(1); // Reset to first page when filter is reset
    setGenre('');
    setYear('');
    setSortBy('');
    setVip('');
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Header />
      <div className="movie-page">
        {/* Movie Filter */}
        <div className="movie-filter">
          <div className='filter'>
          <div className="filter-group">
            <select
              id="genre"
              className='filter-input'
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Thể loại</option>
              {categorys.map((item, index) => (
                <option key={index} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              id="year"
              className='filter-input'
              value={year}
              onChange={handleYearChange}
            >
              <option value="">Năm sản xuất</option>
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>{yearOption}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              id="vip"
              className='filter-input'
              value={vip}
              onChange={(e) => setVip(e.target.value)}
            >
              <option value="">Loại phí</option>
              <option value="true">Trả phí</option>
              <option value="false">Miễn phí</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              id="sortBy"
              className='filter-input'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sắp xếp</option>
              <option value="date">Ngày đăng</option>
              <option value="views">Lượt xem</option>
              <option value="name">Tên tiếng Việt</option>
            </select>
          </div>
           {/* Button to apply filter */}
          {filterApplied ? 
          <button onClick={handleReset} className='filter-apply-button'><i className="fa-solid fa-filter-circle-xmark"></i></button> 
          : 
          <button onClick={handleFilter} className='filter-apply-button'><i className="fa-solid fa-filter"></i></button>}
          </div>
          
        </div>

        {/* Movie List */}
        <div className="page-movies">
          <div className="movie-list-page">
            <div className='list'>
            {movies.map((item, index) => (
              <div className='movie_item' onClick={() => handleAction(item.id)} key={index}>
                <MovieCard id={item.id} name={item.vnName} vip={item.vipmovie} ep={item.episodenumber} />
              </div>
            ))}
            </div>
           
          </div>
          <div className="pagination_user">
          <a href="#" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</a>
          {[...Array(totalPages)].map((_, i) => (
            <a
              key={i + 1}
              href="#"
              className={i + 1 === currentPage ? 'active' : ''}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </a>
          ))}
          <a href="#" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</a>
        </div>
        </div>
   
      </div>
      <Footer />
      {showNotification && (
        <>
          <div className='notification-background'></div>
          <div className='notification'>
            <p>{notificationMessage}</p>
            <button className='notification_button' onClick={() => setShowNotification(false)}>Xác nhận</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MoviePage;
