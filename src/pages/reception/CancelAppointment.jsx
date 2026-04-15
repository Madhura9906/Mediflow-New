import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaCalendarTimes,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaTrash
} from "react-icons/fa";

function CancelAppointment() {
  const [appointments, setAppointments] = useState([]);

  // fetch appointments from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/cancel/${id}`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Appointment cancelled successfully");

        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === id
              ? { ...appt, status: "Cancelled" }
              : appt
          )
        );
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaCalendarTimes /> Cancel Appointment
        </h2>

        <div className="card">
          {appointments.length === 0 ? (
            <div className="empty-state">
              No appointments to cancel
            </div>
          ) : (
            appointments.map((a) => (
              <div
                key={a._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid #eef2f7"
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: 6
                    }}
                  >
                    <FaUser
                      style={{
                        color: "#0077b6",
                        marginRight: 8
                      }}
                    />
                    {a.patientName || "Patient"}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#666",
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap"
                    }}
                  >
                    <span>
                      <FaPhone style={{ marginRight: 4 }} />
                      ------
                    </span>

                    <span>
                      👨‍⚕️ {a.doctorId?.name || "Doctor"}
                    </span>

                    <span>
                      <FaCalendarAlt
                        style={{ marginRight: 4 }}
                      />
                      {new Date(a.date).toLocaleDateString()}
                    </span>

                    <span>
                      <FaClock style={{ marginRight: 4 }} />
                      {a.time}
                    </span>
                  </div>
                </div>

                {a.status !== "Cancelled" ? (
                  <button
                    className="btn-danger"
                    onClick={() =>
                      cancelAppointment(a._id)
                    }
                  >
                    <FaTrash /> Cancel
                  </button>
                ) : (
                  <span
                    style={{
                      color: "#d32f2f",
                      fontWeight: 600
                    }}
                  >
                    Cancelled
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CancelAppointment;