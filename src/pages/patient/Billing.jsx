import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaFileInvoiceDollar,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign
} from "react-icons/fa";

function Billing() {
  const [billingData, setBillingData] = useState([]);

  const user = JSON.parse(localStorage.getItem("mediflowUser"));

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        const appointments = data.appointments || [];

        const now = new Date();

        const patientBills = appointments.filter((appt) => {
          if (
            appt.patientName?.toLowerCase() !==
              user?.name?.toLowerCase() ||
            appt.status === "Cancelled"
          ) {
            return false;
          }

          const appointmentDateTime = new Date(
            `${appt.date} ${appt.time}`
          );

          return appointmentDateTime < now;
        });

        setBillingData(patientBills);
      })
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <h2 className="page-title">
          <FaFileInvoiceDollar /> Billing History
        </h2>

        <div className="card">
          {billingData.length === 0 ? (
            <div className="empty-state">
              No completed bills yet
            </div>
          ) : (
            billingData.map((bill) => (
              <div
                key={bill._id}
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
                    <FaUserMd
                      style={{
                        color: "#0077b6",
                        marginRight: 8
                      }}
                    />
                    {bill.doctorId?.name || "Doctor"}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#666"
                    }}
                  >
                    <FaCalendarAlt
                      style={{ marginRight: 4 }}
                    />
                    {new Date(
                      bill.date
                    ).toLocaleDateString()}
                    &nbsp; | &nbsp;
                    <FaClock
                      style={{ marginRight: 4 }}
                    />
                    {bill.time}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    color: "#0077b6",
                    fontSize: 18
                  }}
                >
                  <FaRupeeSign />
                  500
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

export default Billing;