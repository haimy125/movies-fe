import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from '../UserMenu/UserMenu';
import './Header.css'; // Tạo file CSS cho styling
import axios from 'axios';
const Header = () => {
  const [categorys, setCategorys] = useState([]);

const [keyword, setKeyword] = useState('');

  useEffect(() => {
    categoryList();
  }, []);

  const categoryList = async () => {
    try {
      const response = await axios.get(`http://localhost:1412/admin/category/all?page=1&limit=10000`);
      setCategorys(response.data.listResult);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleSearch = () =>{
      localStorage.setItem('keyWord', keyword);
      window.location.href ='/movie/page';
  }
  const handleAction= (id) =>{
    localStorage.setItem('categoryid', id);
    window.location.href ='/movie/page';
}
  return (
    <header>
    <div className="logo">
      <img src={`/logo.png`}  alt='logo' className='logo_img'/>
      <Link to="/">5SS Movies</Link>
      <div className='menu'>
      <nav>
      <div className="dropdown">
        <span > <Link to="/movie/page" className='action'><i className="fa-solid fa-list"></i> Thể loại phim</Link> </span>
        <div className="dropdown-content">
          {categorys.map((item, index)=>(
          <Link className='action' key={index} onClick={() => handleAction(item.id)}>{item.name}</Link>
          ))}
        </div>
      </div>
      <Link to="/schedule/movie" className='action'> <i className="fa-solid fa-calendar-days"></i> Lịch chiếu phim</Link>
    </nav>
      </div>
      
    </div>
  
    <div className="search-bar">
      <input type="text" placeholder="Tìm kiếm phim..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button type="button" onClick={()=>handleSearch()}>Tìm kiếm</button>
    </div>
    <UserMenu />
  </header>
  );
};

export default Header;
