// src/services/authService.js
import Cookies from "js-cookie";

export const setToken = (newToken) => {
  Cookies.set("accessToken", newToken);
  window.dispatchEvent(new Event("tokenChanged")); // Phát sự kiện tokenChanged
};

export const removeToken = () => {
  Cookies.remove("accessToken");
  window.dispatchEvent(new Event("tokenChanged")); // Phát sự kiện tokenChanged
};

export const getToken = () => {
  return Cookies.get("accessToken");
};
