import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Đặt là null để xác định trạng thái chờ
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(Cookies.get("token"));

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(Cookies.get("token")); // Cập nhật token khi có sự kiện
    };

    window.addEventListener("tokenChanged", handleTokenChange);

    return () => window.removeEventListener("tokenChanged", handleTokenChange); // Dọn dẹp sự kiện
  }, []);

  useEffect(() => {
    const fetchUserInfoFromApi = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1412/api/checktoken?token=${token}`
        );
        if (!response?.data) return;

        setUser(response?.data);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserInfoFromApi();
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, [token]); // useEffect sẽ chạy lại khi token thay đổi

  return { isAuthenticated, user, isLoading };
};

export { useAuth };

// import axios from 'axios';

// const authService = {
//   getToken: () => localStorage.getItem('token'),
//   getRefreshToken: () => localStorage.getItem('refreshToken'),
//   setToken: (token) => localStorage.setItem('token', token),
//   setRefreshToken: (token) => localStorage.setItem('refreshToken', token),

//   refreshToken: async () => {
//     const refreshToken = authService.getRefreshToken();
//     if (!refreshToken) throw new Error('No refresh token available');

//     const response = await axios.post('/api/refresh-token', { refreshToken });
//     const { token } = response.data;

//     authService.setToken(token);
//     return token;
//   },
// };

// axios.interceptors.request.use(
//   async (config) => {
//     let token = authService.getToken();
//     config.headers.Authorization = `Bearer ${token}`;

//     // Kiểm tra token hết hạn
//     const isTokenExpired = false; // Thêm logic kiểm tra expiration của token
//     if (isTokenExpired) {
//       try {
//         token = await authService.refreshToken();
//         config.headers.Authorization = `Bearer ${token}`;
//       } catch (error) {
//         console.error('Token refresh failed', error);
//         // Redirect nếu cần
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default authService;
