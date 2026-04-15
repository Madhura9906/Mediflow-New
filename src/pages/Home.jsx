import React from "react";
import Header from "../components/Header";
import AuthPage from "../components/AuthPage";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Header />
      <AuthPage />
      <Footer />
    </div>
  );
}
export default Home;