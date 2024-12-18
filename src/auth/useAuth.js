import { useState, useEffect } from 'react';
import authService from '../services/authService';

export function useAuth() {
  const [token, setToken] = useState(authService.getToken());

  useEffect(() => {
    setToken(authService.getToken());
  }, []);

  return {
    token,
    setToken: authService.setToken,
    refreshToken: authService.refreshToken,
  };
}
