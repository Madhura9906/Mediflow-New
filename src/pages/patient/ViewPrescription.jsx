import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaFilePrescription,
  FaDownload
} from "react-icons/fa";

function ViewPrescription() {
  const [prescriptions, setPrescriptions] =
    useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:5000/api/appointments"
    )
      .then((res) => res.json())
      .then((data) => {
        const valid =
          (
            data.appointments || []
          ).filter(
            (appt) =>
              appt.prescription
          );

        setPrescriptions(valid);
      })
      .catch((err) =>
        console.log(err)
      );
  }, []);

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaFilePrescription /> My
          Prescriptions
        </h2>

        {prescriptions.length ===
        0 ? (
          <div className="card">
            No prescriptions yet
          </div>
        ) : (
          prescriptions.map((rx) => (
            <div
              key={rx._id}
              className="card"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 14
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color:
                        "#0A1628",
                      fontSize: 15
                    }}
                  >
                    👨‍⚕️{" "}
                    {rx.doctorId
                      ?.name ||
                      "Doctor"}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color:
                        "#888"
                    }}
                  >
                    📅{" "}
                    {new Date(
                      rx.date
                    ).toLocaleDateString()}
                  </div>
                </div>

                <a
                  href={`http://localhost:5000/uploads/${rx.prescription}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{
                    padding:
                      "8px 16px",
                    fontSize: 13,
                    textDecoration:
                      "none"
                  }}
                >
                  <FaDownload /> View
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ViewPrescription;
