import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ClientLayout.css";

const ClientLayout = ({ children }) => {
  return (
    <div className="client-layout-wrap">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
