import React, { useEffect } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const t = setTimeout(onFinish, 2500);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <div className="splash-logo-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="80" height="80">
          <defs>
            <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00b4d8"/>
              <stop offset="100%" stopColor="#0077b6"/>
            </linearGradient>
          </defs>
          <circle cx="30" cy="30" r="28" fill="url(#sg)" opacity="0.15"/>
          <rect x="24" y="10" width="12" height="40" rx="4" fill="url(#sg)"/>
          <rect x="10" y="24" width="40" height="12" rx="4" fill="url(#sg)"/>
        </svg>
      </div>
      <h1 className="splash-name">MediFlow</h1>
      <p className="splash-tagline">Smart Healthcare Management</p>
      <div className="splash-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
};

export default SplashScreen;
