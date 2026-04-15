import React from "react";
import Header from "../components/Header";
import ReceptionistDashboard from "../components/ReceptionistDashboard";
import Footer from "../components/Footer";
import "./dashboardVideo.css";

function ReceptionistHome() {
  return (
    <div className="dashboard-video-wrapper">
      <video
        className="dashboard-bg-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/bg1.mp4" type="video/mp4" />
      </video>

      <div className="dashboard-overlay"></div>

      <Header />
      <ReceptionistDashboard />
      <Footer />
    </div>
  );
}

export default ReceptionistHome;