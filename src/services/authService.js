import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Đặt là null để xác định trạng thái chờ
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(Cookies.get("accessToken"));

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(Cookies.get("accessToken")); // Cập nhật token khi có sự kiện
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
        if (!response?.data) {
          window.location.href = "/login";
          return;
        }

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
//   getAccessToken: () => localStorage.getItem('accessToken'),
//   getRefreshToken: () => localStorage.getItem('refreshToken'),
//   setAccessToken: (token) => localStorage.setItem('accessToken', token),
//   setRefreshToken: (token) => localStorage.setItem('refreshToken', token),

//   refreshAccessToken: async () => {
//     const refreshToken = authService.getRefreshToken();
//     if (!refreshToken) throw new Error('No refresh token available');

//     const response = await axios.post('/api/refresh-token', { refreshToken });
//     const { accessToken } = response.data;

//     authService.setAccessToken(accessToken);
//     return accessToken;
//   },
// };

// axios.interceptors.request.use(
//   async (config) => {
//     let accessToken = authService.getAccessToken();
//     config.headers.Authorization = `Bearer ${accessToken}`;

//     // Kiểm tra token hết hạn
//     const isTokenExpired = false; // Thêm logic kiểm tra expiration của token
//     if (isTokenExpired) {
//       try {
//         accessToken = await authService.refreshAccessToken();
//         config.headers.Authorization = `Bearer ${accessToken}`;
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
