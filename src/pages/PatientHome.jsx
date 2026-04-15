import React from "react";
import Header from "../components/Header";
import PatientDashboard from "../components/PatientDashboard";
import Footer from "../components/Footer";
import "./dashboardVideo.css";

function PatientHome() {
  return (
    <>
      <Header />

      <div className="video-banner">
        <video
          className="video-banner-bg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="/videos/bg1.mp4"
            type="video/mp4"
          />
        </video>

        <div className="video-banner-overlay">
          <h1>Welcome to MediFlow</h1>
          <p>Smart Healthcare. Seamless Care.</p>
        </div>
      </div>

      <PatientDashboard />
      <Footer />
    </>
  );
}

export default PatientHome;