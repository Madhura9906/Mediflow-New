import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaUser,
  FaPhone,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaNotesMedical,
  FaCheckCircle
} from "react-icons/fa";

function AddAppointment() {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientName: "",
    mobile: "",
    doctor: "",
    date: "",
    time: "",
    notes: ""
  });

  const [success, setSuccess] = useState(false);

  // fetch doctors from DB
  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const c = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            patientName: form.patientName,
            doctorId: form.doctor,
            date: form.date,
            time: form.time,
            symptoms: form.notes
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          setForm({
            patientName: "",
            mobile: "",
            doctor: "",
            date: "",
            time: "",
            notes: ""
          });
        }, 3000);
      } else {
        alert("Booking failed");
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
          <FaCalendarAlt /> Add Appointment
        </h2>

        {success && (
          <div
            style={{
              background: "#e8f5e9",
              border: "1px solid #a5d6a7",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#2e7d32"
            }}
          >
            <FaCheckCircle />
            Appointment booked successfully!
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={form.patientName}
                  onChange={c}
                  required
                />
              </div>

              <div className="form-field">
                <FaPhone className="icon" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={c}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <FaUserMd className="icon" />

                <select
                  name="doctor"
                  value={form.doctor}
                  onChange={c}
                  required
                >
                  <option value="">Select Doctor</option>

                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <FaCalendarAlt className="icon" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={c}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-field">
                <FaClock className="icon" />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={c}
                  required
                />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 20 }}>
              <FaNotesMedical className="icon" />

              <textarea
                name="notes"
                placeholder="Symptoms / Notes"
                rows={3}
                value={form.notes}
                onChange={c}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center"
              }}
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddAppointment;