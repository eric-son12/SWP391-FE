import React from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./Home.scss";

const Home: React.FC = () => {
  return (
    <>
      <Header />

      <div className="home-page">
        <h4>Home Page</h4>
      </div>

      <Footer />
    </>
  );
};

export default Home;
