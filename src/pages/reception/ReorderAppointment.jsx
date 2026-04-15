import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaExchangeAlt,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaSave
} from "react-icons/fa";

function ReorderAppointment() {
  const [appointments, setAppointments] = useState([]);

  // fetch appointments
  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data.appointments || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (id, field, value) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === id
          ? { ...appt, [field]: value }
          : appt
      )
    );
  };

  const saveUpdate = async (appointment) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/update/${appointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: appointment.date,
            time: appointment.time
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Appointment updated successfully");
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaExchangeAlt /> Reorder / Reschedule Appointments
        </h2>

        <p
          style={{
            color: "#666",
            fontSize: 14,
            marginBottom: 20
          }}
        >
          Update appointment date and time
        </p>

        <div className="card">
          {appointments.length === 0 ? (
            <div className="empty-state">
              No appointments found
            </div>
          ) : (
            appointments.map((a, i) => (
              <div
                key={a._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid #eef2f7"
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#0077b6,#00b4d8)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0
                  }}
                >
                  {i + 1}
                </div>

                <div style={{ flex: 1 }}>
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
                    {a.patientName}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap"
                    }}
                  >
                    <div className="form-field">
                      <FaCalendarAlt className="icon" />

                      <input
                        type="date"
                        value={
                          a.date
                            ? new Date(a.date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleChange(
                            a._id,
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-field">
                      <FaClock className="icon" />

                      <input
                        type="time"
                        value={a.time || ""}
                        onChange={(e) =>
                          handleChange(
                            a._id,
                            "time",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => saveUpdate(a)}
                >
                  <FaSave /> Save
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ReorderAppointment;