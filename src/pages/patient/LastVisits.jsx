import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import { FaHistory } from "react-icons/fa";

function LastVisits() {
  const [visits, setVisits] = useState([]);

  const user = JSON.parse(localStorage.getItem("mediflowUser"));

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/appointments");
        const data = await res.json();

        if (data.success) {
          const myVisits = (data.appointments || []).filter(
            (visit) =>
              (visit.mobile === user?.mobile ||
                visit.patientName === user?.name) &&
              (visit.status === "Completed" ||
                visit.status === "Pending" ||
                visit.status === "Cancelled")
          );

          setVisits(myVisits);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchVisits();
  }, [user]);

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaHistory /> My Last Visits
        </h2>

        <div className="card">
          {visits.length === 0 ? (
            <div className="empty-state">
              No visits found for your account
            </div>
          ) : (
            visits.map((visit) => (
              <div
                key={visit._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid #eef2f7"
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: 4
                    }}
                  >
                    👨‍⚕️ {visit.doctorId?.name || "Doctor"}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#666"
                    }}
                  >
                    📅 {new Date(visit.date).toLocaleDateString()} &nbsp;|&nbsp;
                    ⏰ {visit.time} &nbsp;|&nbsp;
                    🩺 {visit.symptoms || "Consultation"}
                  </div>
                </div>

                <span
                  className={`badge ${
                    visit.status === "Cancelled"
                      ? "badge-red"
                      : "badge-green"
                  }`}
                >
                  {visit.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LastVisits;