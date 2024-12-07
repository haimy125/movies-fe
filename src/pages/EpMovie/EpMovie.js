import React, { useState , useEffect} from 'react';
import CommentFormEp from '../../components/CommentFormEp/CommentFormEp';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EpMovie.css'; // Tạo file CSS cho styling
import { useAuth } from '../../services/authService';
const EpMovie = () => {
  const {id} = useParams();
  const {isAuthenticated,user} = useAuth();
  const [showFullDescription, setShowFullDescription] = useState(false);
 const movieid = localStorage.getItem('moviedetailid');
 const [comments, setComments] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [loading, setLoading] = useState(true);
 const [views, setViews]=useState('');
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const [episode, setEpisode] = useState([]);
  const [movie, setMovie] = useState(null);
  useEffect(() => {
    const fetchDetail = async () => {
      const response = await axios.get(`http://localhost:1412/api/admin/episode/getbyid/${id}`);
      setMovie(response.data);
      formatViews(response.data.views);
      
    };
    const fetchEp = async () => {
      const response = await axios.get(`http://localhost:1412/api/admin/episode/getBymovie/all/${movieid}`);
      setEpisode(response.data.listResult);
      console.log(response.data.listResult);
    };
    const fetchcomment = async (page) => {
      const response = await axios.get(`http://localhost:1412/api/user/comment/episode/byep/${id}?page=${page}&limit=10`);
      setComments(response.data.listResult || {});
      console.log(response.data.listResult || {});
      setLoading(false);
    };
    fetchcomment(currentPage);
    fetchDetail();
    fetchEp();

  }, []);

  const handleaction = (id) => {
    window.location.href = `/movie/ep/${id}`;
  }
  const formatViews = (views) => {
    if (views < 1000) {
      setViews(views.toLocaleString());
    } else if (views >= 1000 && views < 1000000) {
      setViews(`${(views / 1000).toFixed(1)}K`);
    } else if (views >= 1000000 && views < 1000000000) {
      setViews(`${(views / 1000000).toFixed(1)}M`);
    } else {
      setViews(`${(views / 1000000000).toFixed(1)}B`);
    }
  };
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const convertMillisecondsToDate = (milliseconds) => {
    const date = new Date(milliseconds);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();

    // Format the day and month with leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  };
  return (
    <div>
      <Header />
      <div className="detail">
        <div className='info'>
         <VideoPlayer videoId={id} vnname={movie?.movie.vnname} ep={movie?.name}/>
        </div>
        <h2 className='movie_name'>
        {movie?.name}
        </h2>
      <div>
      <p>{views} lượt xem </p>
      </div>
     
      </div>  
      <div className='ep_cmt'>
      <div className="episodes">
          <h2>Danh sách tập phim</h2>
          <div className="episode-list">
          {episode.map((item, index) => (
              <div key={index} className="episode-item" onClick={() => handleaction(item?.id)}>
                {item?.name}
              </div>
            ))}
          </div>
        </div>
        <div className='comment'>
        <h2>Danh sách bình luận</h2>
        {isAuthenticated ? 
            <>
            <div className='comment_list'>
            {comments.map((item, index) => (
                  <div className='comment_item'>
                    <p className='comment_content'>{item?.content}</p>
                    <div className='info_coment_user'><p className='comment_user'>{item?.useradd?.username}</p>
                      <p className='comment_date'>{convertMillisecondsToDate(item?.timeadd)}</p></div>
                  </div>
                ))}
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
          <CommentFormEp userid={user.id} epid={id} />
            </>
            : "Bạn phải đăng nhập mới có thể bình luận tập phim!"
            }
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EpMovie;
