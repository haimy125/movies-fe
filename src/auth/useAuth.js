import { useState, useEffect } from 'react';
import authService from '../services/authService';

export function useAuth() {
  const [accessToken, setAccessToken] = useState(authService.getAccessToken());

  useEffect(() => {
    setAccessToken(authService.getAccessToken());
  }, []);

  return {
    accessToken,
    setAccessToken: authService.setAccessToken,
    refreshAccessToken: authService.refreshAccessToken,
  };
}
