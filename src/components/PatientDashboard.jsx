import React from "react";
import "./PatientDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaFilePrescription,
  FaHistory,
  FaFileInvoiceDollar,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

function PatientDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("mediflowUser"));

  const handleLogout = () => {
    localStorage.removeItem("mediflowUser");
    window.location.href = "/";
  };

  const cards = [
    {
      title: "Take Appointment",
      icon: <FaCalendarCheck />,
      desc: "Book a doctor appointment",
      path: "/patient/take-appointment"
    },
    {
      title: "View Prescription",
      icon: <FaFilePrescription />,
      desc: "Check doctor prescriptions",
      path: "/patient/view-prescription"
    },
    {
      title: "Last Visits",
      icon: <FaHistory />,
      desc: "View previous visit history",
      path: "/patient/last-visits"
    },
    {
      title: "Billing",
      icon: <FaFileInvoiceDollar />,
      desc: "View payment history",
      path: "/patient/billing"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Top bar */}
      <div className="dashboard-topbar">
        <div className="user-profile">
          <FaUserCircle />
          <span>{user?.name || "Patient"}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Patient Dashboard</h1>
        <p className="dashboard-sub">Select an option to get started</p>
      </div>

      {/* Cards */}
      <div className="dashboard-grid">
        {cards.map((c, i) => (
          <div
            className="dashboard-card"
            key={i}
            onClick={() => navigate(c.path)}
          >
            <div className="card-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientDashboard;