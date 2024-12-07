import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Đặt là null để xác định trạng thái chờ
  const [user, setUser] = useState(null);
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchUserInfoFromApi = async () => {
      try {
        const response = await axios.get(`http://localhost:1412/api/login/checktoken?token=${token}`);
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false); // Chỉ cập nhật isAuthenticated một lần
      }
    };

    if (token) {
      fetchUserInfoFromApi();
    } else {
      setIsAuthenticated(false); // Không có token, xác thực thất bại
    }
  }, [token]);

  return { isAuthenticated, user };
};

export { useAuth };
