import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaCalendarAlt,
  FaUser,
  FaNotesMedical,
  FaClock,
  FaPlus,
  FaTrash
} from "react-icons/fa";

function Followup() {
  const [appointments, setAppointments] = useState([]);
  const [followups, setFollowups] = useState([]);

  const [form, setForm] = useState({
    name: "",
    date: "",
    reason: ""
  });

  // fetch appointments
  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        const validAppointments = (
          data.appointments || []
        ).filter(
          (appt) => appt.status !== "Cancelled"
        );

        setAppointments(validAppointments);
      })
      .catch((err) => console.log(err));
  }, []);

  // load saved followups
  useEffect(() => {
    const saved = localStorage.getItem(
      "mediflowFollowups"
    );

    if (saved) {
      setFollowups(JSON.parse(saved));
    }
  }, []);

  const addFollowup = (e) => {
    e.preventDefault();

    if (!form.name || !form.date) return;

    const updated = [
      ...followups,
      {
        id: Date.now(),
        ...form
      }
    ];

    setFollowups(updated);

    localStorage.setItem(
      "mediflowFollowups",
      JSON.stringify(updated)
    );

    setForm({
      name: "",
      date: "",
      reason: ""
    });

    alert("Follow-up added successfully");
  };

  const remove = (id) => {
    const updated = followups.filter(
      (f) => f.id !== id
    );

    setFollowups(updated);

    localStorage.setItem(
      "mediflowFollowups",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaCalendarAlt /> Patient Follow-Ups
        </h2>

        {/* Add followup */}
        <div className="card">
          <h3
            style={{
              color: "#0077b6",
              marginBottom: 16,
              fontSize: 15
            }}
          >
            Add New Follow-Up
          </h3>

          <form onSubmit={addFollowup}>
            <div className="form-row">
              <div className="form-field">
                <select
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value
                    })
                  }
                  required
                >
                  <option value="">
                    Select Patient
                  </option>

                  {appointments.map(
                    (appt) => (
                      <option
                        key={
                          appt._id
                        }
                        value={
                          appt.patientName
                        }
                      >
                        {
                          appt.patientName
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-field">
                <FaCalendarAlt className="icon" />

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date:
                        e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-field">
                <FaNotesMedical className="icon" />

                <input
                  type="text"
                  placeholder="Reason"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reason:
                        e.target.value
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
              >
                <FaPlus /> Add
              </button>
            </div>
          </form>
        </div>

        {/* Followup list */}
        <div className="card">
          <h3
            style={{
              color: "#0077b6",
              marginBottom: 16,
              fontSize: 15
            }}
          >
            Upcoming Follow-Ups
          </h3>

          {followups.length === 0 ? (
            <div className="empty-state">
              No follow-ups scheduled
            </div>
          ) : (
            followups.map((f) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "space-between",
                  padding: "14px 0",
                  borderBottom:
                    "1px solid #eef2f7"
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color:
                        "#0A1628",
                      marginBottom: 4
                    }}
                  >
                    <FaUser
                      style={{
                        color:
                          "#0077b6",
                        marginRight: 8
                      }}
                    />
                    {f.name}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color:
                        "#666"
                    }}
                  >
                    📅 {f.date}
                    {f.reason &&
                      ` | ${f.reason}`}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 10
                  }}
                >
                  <span className="badge badge-blue">
                    <FaClock /> Upcoming
                  </span>

                  <button
                    className="btn-danger"
                    onClick={() =>
                      remove(
                        f.id
                      )
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Followup;