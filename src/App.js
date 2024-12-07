// src/App.js
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './assets/styles/main.css';
import { AdminRouters, privateRoutes, publicRoutes } from './routers/index';
import { useAuth } from './services/authService';

const App = () => {
  const token = Cookies.get('token');
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
   console.log(isAuthenticated);

  }, [isAuthenticated]);

  return (
    <Router>
      <div id="top" className="App">
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route key={index} path={route.path} element={<Page />} />
            );
          })}

          {/* Private Routes */}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={isAuthenticated === false ? <Navigate to="/login" replace /> :  <Page />}
              />
            );
          })}

          {/* Admin Routes */}
          {AdminRouters.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                    user?.role.name === "ROLE_USER"
                    ? <Navigate to="/403" replace />
                    : <Page />
                }
              />
            );
          })}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <a href="#top" className='to_top'>
          <i className="fa-solid fa-arrow-up"></i>
        </a>
      </div>
    </Router>
  );
};


export default App;
