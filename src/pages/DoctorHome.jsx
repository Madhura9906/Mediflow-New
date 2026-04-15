import React from "react";
import Header from "../components/Header";
import DoctorDashboard from "../components/DoctorDashboard";
import Footer from "../components/Footer";
import "./dashboardVideo.css";

function DoctorHome() {
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
      <DoctorDashboard />
      <Footer />
    </div>
  );
}

export default DoctorHome;