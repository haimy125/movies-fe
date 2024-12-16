// src/App.js
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./assets/styles/main.css";
import { AdminRouters, privateRoutes, publicRoutes } from "./routers/index";
import { useAuth } from "./services/authService";

const App = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    console.log("[Check] isLoading:", isLoading);
    console.log("Authentication status:", isAuthenticated);
    console.log("User details:", user);
  }, [isAuthenticated, user, isLoading]);

  const checkRoleAccess = (role) => {
    return user?.role?.name === role;
  };

  const renderRoutes = (routes, fallback) =>
    routes.map((route, index) => {
      const Page = route.component;
      return (
        <Route
          key={index}
          path={route.path}
          element={fallback ? fallback(route) : <Page />}
        />
      );
    });

  return isLoading ? (
    <h1>Loading ...</h1>
  ) : (
    <Router>
      <div id="top" className="App">
        <Routes>
          {/* Public Routes */}
          {renderRoutes(publicRoutes)}

          {/* Private Routes */}
          {renderRoutes(privateRoutes, (route) =>
            isAuthenticated === false ? (
              <Navigate to="/login" replace />
            ) : (
              <route.component />
            )
          )}

          {/* Admin Routes */}
          {renderRoutes(AdminRouters, (route) => {
            if (isLoading) return <h1>Loading...</h1>;
            return checkRoleAccess("ROLE_ADMIN") ? (
              <route.component />
            ) : (
              <Navigate to="/403" replace />
            );
          })}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <a href="#top" className="to_top">
          <i className="fa-solid fa-arrow-up"></i>
        </a>
      </div>
    </Router>
  );
};

export default App;
