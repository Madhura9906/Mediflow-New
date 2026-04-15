// CasePaper.jsx

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import { FaNotesMedical, FaPrint } from "react-icons/fa";

function CasePaper() {
  const [appointments, setAppointments] = useState([]);

  const [d, setD] = useState({
    patientName: "",
    age: "",
    gender: "",
    date: "",
    symptoms: "",
    diagnosis: "",
    medicines: "",
    notes: ""
  });

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

  const c = (e) =>
    setD({
      ...d,
      [e.target.name]: e.target.value
    });

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaNotesMedical /> Patient Case Paper
        </h2>

        <div className="card">
          <h3
            style={{
              color: "#0077b6",
              marginBottom: 16,
              fontSize: 15
            }}
          >
            Patient Information
          </h3>

          <div className="form-row">
            <div className="form-field">
              <select
                name="patientName"
                value={d.patientName}
                onChange={c}
              >
                <option value="">
                  Select Patient
                </option>

                {appointments.map((appt) => (
                  <option
                    key={appt._id}
                    value={appt.patientName}
                  >
                    {appt.patientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={d.age}
                onChange={c}
              />
            </div>

            <div className="form-field">
              <select
                name="gender"
                value={d.gender}
                onChange={c}
              >
                <option value="">
                  Gender
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <input
                type="date"
                name="date"
                value={d.date}
                onChange={c}
              />
            </div>
          </div>
        </div>

        {[
          {
            label: "Symptoms",
            name: "symptoms",
            ph: "Describe symptoms..."
          },
          {
            label: "Diagnosis",
            name: "diagnosis",
            ph: "Enter diagnosis..."
          },
          {
            label: "Medicines Prescribed",
            name: "medicines",
            ph: "List medicines..."
          },
          {
            label: "Doctor Notes",
            name: "notes",
            ph: "Additional notes..."
          }
        ].map((f) => (
          <div className="card" key={f.name}>
            <h3
              style={{
                color: "#0077b6",
                marginBottom: 12,
                fontSize: 15
              }}
            >
              {f.label}
            </h3>

            <div className="form-field">
              <textarea
                name={f.name}
                placeholder={f.ph}
                rows={3}
                value={d[f.name]}
                onChange={c}
              />
            </div>
          </div>
        ))}

        <button
          className="btn-primary"
          onClick={() => window.print()}
          style={{
            width: "100%",
            justifyContent: "center"
          }}
        >
          <FaPrint /> Print Case Paper
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default CasePaper;