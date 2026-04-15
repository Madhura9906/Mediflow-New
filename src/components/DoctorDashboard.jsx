import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaNotesMedical,
  FaFilePrescription,
  FaCapsules,
  FaCalendarCheck,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

function DoctorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("mediflowUser"));

  const [appointments, setAppointments] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("mediflowUser");
    window.location.href = "/";
  };

  useEffect(() => {
  fetch("http://localhost:5000/api/appointments")
    .then((res) => res.json())
    .then((data) => {
      const doctorAppointments = (data.appointments || [])
        .filter((appt) => {
          const loggedDoctorName = user?.name
            ?.toLowerCase()
            .replace("dr. ", "")
            .trim();

          const appointmentDoctorName = appt.doctorId?.name
            ?.toLowerCase()
            .replace("dr. ", "")
            .trim();

          return (
            (
              appt.doctorId?._id === user?._id ||
              appointmentDoctorName === loggedDoctorName
            ) &&
            appt.status !== "Cancelled"
          );
        })
        .map((appt) => {
          const now = new Date();

          const appointmentDateTime = new Date(
            `${appt.date} ${appt.time}`
          );

          if (
            appointmentDateTime < now &&
            appt.status === "Pending"
          ) {
            return {
              ...appt,
              status: "Completed"
            };
          }

          return appt;
        });

      setAppointments(doctorAppointments);
    })
    .catch((err) => console.log(err));
}, [user]);

  const cards = [
    {
      title: "Search Patient",
      icon: <FaSearch />,
      desc: "Find patient by mobile number",
      action: () => navigate("/doctor/patient-search")
    },
    {
      title: "Patient Case Paper",
      icon: <FaNotesMedical />,
      desc: "View & fill case history",
      action: () => navigate("/doctor/case-paper")
    },
    {
      title: "Prescription",
      icon: <FaFilePrescription />,
      desc: "Create & download prescription",
      action: () => navigate("/doctor/prescription")
    },
    {
      title: "Add Medicine",
      icon: <FaCapsules />,
      desc: "Add medicine to database",
      action: () => navigate("/doctor/add-medicine")
    },
    {
      title: "Follow-Up",
      icon: <FaCalendarCheck />,
      desc: "Schedule patient follow-ups",
      action: () => navigate("/doctor/followup")
    }
  ];

  return (
    <div className="doctor-dashboard">
      {/* Topbar */}
      <div className="dashboard-topbar">
        <div className="user-profile">
          <FaUserCircle />
          <span>{user?.name || "Doctor"}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Doctor Dashboard</h1>
        <p className="dashboard-sub">Select an option to get started</p>
      </div>

      {/* Today's Patients */}
      <div className="appointments-preview">
        <h2 className="appointments-title">Today's Patients</h2>

        {appointments.length === 0 ? (
          <p className="no-appointments">No appointments today</p>
        ) : (
          <div className="appointments-table">
            <div className="table-header">
              <span>Patient</span>
              <span>Date</span>
              <span>Time</span>
              <span>Status</span>
            </div>

            {appointments.map((appt) => (
              <div key={appt._id} className="table-row">
                <span>{appt.patientName || "Patient"}</span>
                <span>
                  {new Date(appt.date).toLocaleDateString()}
                </span>
                <span>{appt.time || "--"}</span>
                <span className="status-badge">
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-grid">
        {cards.map((c, i) => (
          <div
            className="dashboard-card"
            key={i}
            onClick={c.action}
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

export default DoctorDashboard;