import React, { useState } from "react";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 52" width="160" height="40">
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00b4d8"/>
              <stop offset="100%" stopColor="#0077b6"/>
            </linearGradient>
          </defs>
          <rect x="4" y="14" width="7" height="22" rx="2" fill="url(#hg)"/>
          <rect x="0" y="20" width="15" height="10" rx="2" fill="url(#hg)"/>
          <polyline points="22,25 29,25 33,14 37,36 41,22 45,25 58,25"
            fill="none" stroke="url(#hg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="66" y="32" fontFamily="Poppins,Segoe UI,sans-serif" fontSize="20" fontWeight="700" fill="url(#hg)">MediFlow</text>
        </svg>
      </div>

      <nav className={menuOpen ? "nav open" : "nav"}>
        <a href="/">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </div>
    </header>
  );
}

export default Header;
