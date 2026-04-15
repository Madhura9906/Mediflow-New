import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaCalendarAlt,
  FaUserMd,
  FaClock,
  FaNotesMedical,
  FaCheckCircle
} from "react-icons/fa";

function TakeAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [booked, setBooked] = useState(false);

  const user = JSON.parse(localStorage.getItem("mediflowUser"));

  // fetch doctors
  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const selectedDoc = doctors.find((d) => d._id === doctor);

  const defaultSlots = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      // check if slot already booked
      const checkRes = await fetch("http://localhost:5000/api/appointments");
      const checkData = await checkRes.json();

      const alreadyBooked = (checkData.appointments || []).some(
        (appt) =>
          appt.doctorId?._id === doctor &&
          appt.date === date &&
          appt.time === time &&
          appt.status !== "Cancelled"
      );

      if (alreadyBooked) {
        alert("This slot is already booked. Please choose another time.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/appointments/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            patientName: user?.name || "Patient",
            doctorId: doctor,
            date,
            time,
            symptoms
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setBooked(true);
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (booked) {
    return (
      <div className="page-wrapper">
        <Header />
        <div
          className="page-content"
          style={{ textAlign: "center", paddingTop: 60 }}
        >
          <FaCheckCircle
            style={{
              fontSize: 64,
              color: "#2e7d32",
              marginBottom: 16
            }}
          />

          <h2 style={{ color: "#0A1628", marginBottom: 8 }}>
            Appointment Confirmed!
          </h2>

          <p style={{ color: "#666", marginBottom: 4 }}>
            Doctor:{" "}
            <strong>
              {selectedDoc?.name?.startsWith("Dr.")
                ? selectedDoc?.name
                : `Dr. ${selectedDoc?.name}`}
            </strong>
          </p>

          <p style={{ color: "#666", marginBottom: 4 }}>
            Date: <strong>{date}</strong>
          </p>

          <p style={{ color: "#666", marginBottom: 24 }}>
            Time: <strong>{time}</strong>
          </p>

          <button
            className="btn-primary"
            onClick={() => {
              setBooked(false);
              setDoctor("");
              setDate("");
              setTime("");
              setSymptoms("");
            }}
          >
            Book Another
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaCalendarAlt /> Book Appointment
        </h2>

        {/* Doctor Selection */}
        <div className="card">
          <h3
            style={{
              color: "#0077b6",
              marginBottom: 16,
              fontSize: 15
            }}
          >
            Select Doctor
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 16
            }}
          >
            {doctors.map((d) => (
              <div
                key={d._id}
                onClick={() => setDoctor(d._id)}
                style={{
                  padding: "20px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor:
                    doctor === d._id ? "#0077b6" : "#dce8f2",
                  background:
                    doctor === d._id ? "#f0f8ff" : "white"
                }}
              >
                <FaUserMd
                  style={{
                    color: "#0077b6",
                    fontSize: 26,
                    marginBottom: 10
                  }}
                />

                <h3 style={{ color: "#0A1628", marginBottom: 4 }}>
                  {d.name?.startsWith("Dr.")
                    ? d.name
                    : `Dr. ${d.name}`}
                </h3>

                <p style={{ color: "#666", fontSize: 14 }}>
                  {d.specialization}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Date & Time */}
          <div className="card">
            <div className="form-row">
              <div>
                <label>
                  <FaCalendarAlt
                    style={{ color: "#0077b6", marginRight: 6 }}
                  />
                  Appointment Date
                </label>

                <div className="form-field">
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label>
                  <FaClock
                    style={{ color: "#0077b6", marginRight: 6 }}
                  />
                  Select Time Slot
                </label>

                <div className="form-field">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    <option value="">Choose time</option>

                    {(selectedDoc?.availableTimings?.length
                      ? selectedDoc.availableTimings
                      : defaultSlots
                    ).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="card">
            <label>
              <FaNotesMedical
                style={{ color: "#0077b6", marginRight: 6 }}
              />
              Symptoms / Notes
            </label>

            <div className="form-field">
              <textarea
                rows={3}
                placeholder="Describe your symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center"
            }}
          >
            Confirm Appointment
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default TakeAppointment;