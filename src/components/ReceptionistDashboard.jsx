import React, { useEffect, useState } from "react";
import "./ReceptionistDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarPlus,
  FaExchangeAlt,
  FaCalendarTimes,
  FaPrint,
  FaMoneyBillWave,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

function ReceptionistDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("mediflowUser")
  );

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mediflowToken");
    localStorage.removeItem("mediflowUser");
    navigate("/");
  };

  const getStatus = (appt) => {
    if (appt.status === "Cancelled") {
      return "Cancelled";
    }

    const now = new Date();
    const appointmentDateTime = new Date(
      `${appt.date} ${appt.time}`
    );

    return appointmentDateTime < now
      ? "Completed"
      : "Pending";
  };

  const getStatusClass = (appt) => {
    if (appt.status === "Cancelled") {
      return "cancelled-status";
    }

    const now = new Date();
    const appointmentDateTime = new Date(
      `${appt.date} ${appt.time}`
    );

    return appointmentDateTime < now
      ? "completed-status"
      : "";
  };

  const cards = [
    {
      title: "Add Appointment",
      icon: <FaCalendarPlus />,
      desc: "Book patient appointment",
      action: () =>
        navigate("/reception/add-appointment")
    },
    {
      title: "Reorder Queue",
      icon: <FaExchangeAlt />,
      desc: "Change appointment order",
      action: () =>
        navigate(
          "/reception/reorder-appointment"
        )
    },
    {
      title: "Cancel Appointment",
      icon: <FaCalendarTimes />,
      desc: "Cancel patient appointment",
      action: () =>
        navigate(
          "/reception/cancel-appointment"
        )
    },
    {
      title: "Print Bill",
      icon: <FaPrint />,
      desc: "Generate patient bill PDF",
      action: () =>
        navigate("/reception/print-bill")
    },
    {
      title: "Daily Collection",
      icon: <FaMoneyBillWave />,
      desc: "View today's revenue",
      action: () =>
        navigate(
          "/reception/daily-collection"
        )
    },
    {
      title: "Monthly Collection",
      icon: <FaChartLine />,
      desc: "View monthly report",
      action: () =>
        navigate(
          "/reception/monthly-collection"
        )
    }
  ];

  return (
    <div className="reception-dashboard">
      {/* topbar */}
      <div className="dashboard-topbar">
        <div className="user-profile">
          <FaUserCircle />
          <span>
            {user?.name || "Receptionist"}
          </span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Receptionist Dashboard
        </h1>

        <p className="dashboard-sub">
          Select an option to get started
        </p>
      </div>

      {/* appointments */}
      <div className="appointments-preview">
        <h2 className="appointments-title">
          Today's Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="no-appointments">
            No appointments yet
          </p>
        ) : (
          <div className="appointments-table">
            <div className="table-header">
              <span>Patient</span>
              <span>Doctor</span>
              <span>Date</span>
              <span>Time</span>
              <span>Status</span>
            </div>

            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="table-row"
              >
                <span>
                  {appt.patientName ||
                    "Patient"}
                </span>

                <span>
                  {appt.doctorId?.name ||
                    "Doctor"}
                </span>

                <span>
                  {new Date(
                    appt.date
                  ).toLocaleDateString()}
                </span>

                <span>
                  {appt.time || "--"}
                </span>

                <span
                  className={`status-badge ${getStatusClass(
                    appt
                  )}`}
                >
                  {getStatus(appt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* cards */}
      <div className="dashboard-grid">
        {cards.map((c, i) => (
          <div
            className="dashboard-card"
            key={i}
            onClick={c.action}
          >
            <div className="card-icon">
              {c.icon}
            </div>

            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReceptionistDashboard;