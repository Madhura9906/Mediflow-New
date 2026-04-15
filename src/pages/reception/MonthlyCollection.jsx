import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import { FaChartLine } from "react-icons/fa";

const data = [
  { month: "Oct 2025", amount: 42000 },
  { month: "Nov 2025", amount: 38500 },
  { month: "Dec 2025", amount: 51000 },
  { month: "Jan 2026", amount: 47200 },
  { month: "Feb 2026", amount: 44800 },
  { month: "Mar 2026", amount: 56300 }
];

const max = Math.max(...data.map((d) => d.amount));

function MonthlyCollection() {
  const [monthlyAppointments, setMonthlyAppointments] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthly = (data.appointments || []).filter(
          (appt) => {
            const date = new Date(appt.date);

            return (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear &&
              appt.status !== "Cancelled"
            );
          }
        );

        setMonthlyAppointments(monthly.length);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaChartLine /> Monthly Collection
        </h2>

        <div className="card">
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 24
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 160,
                background:
                  "linear-gradient(135deg,#0077b6,#00b4d8)",
                borderRadius: 12,
                padding: "20px",
                color: "white"
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  opacity: 0.8,
                  marginBottom: 4
                }}
              >
                This Month
              </p>

              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                ₹{" "}
                {data[data.length - 1].amount.toLocaleString()}
              </h3>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 160,
                background: "#f0f8ff",
                borderRadius: 12,
                padding: "20px",
                border: "1px solid #e0eaf2"
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  marginBottom: 4
                }}
              >
                Total 6 Months
              </p>

              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0077b6"
                }}
              >
                ₹{" "}
                {data
                  .reduce((s, d) => s + d.amount, 0)
                  .toLocaleString()}
              </h3>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 160,
                background: "#fff",
                borderRadius: 12,
                padding: "20px",
                border: "1px solid #e0eaf2"
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  marginBottom: 4
                }}
              >
                Appointments This Month
              </p>

              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0077b6"
                }}
              >
                {monthlyAppointments}
              </h3>
            </div>
          </div>

          {/* Chart */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: 160,
              padding: "0 8px"
            }}
          >
            {data.map((d, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#0077b6",
                    fontWeight: 600
                  }}
                >
                  ₹{(d.amount / 1000).toFixed(0)}k
                </span>

                <div
                  style={{
                    width: "100%",
                    borderRadius: "6px 6px 0 0",
                    height: `${(d.amount / max) * 120}px`,
                    background:
                      i === data.length - 1
                        ? "linear-gradient(180deg,#0077b6,#00b4d8)"
                        : "linear-gradient(180deg,#90caf9,#bbdefb)",
                    transition: "all 0.3s"
                  }}
                />

                <span
                  style={{
                    fontSize: 10,
                    color: "#888",
                    textAlign: "center"
                  }}
                >
                  {d.month.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Collection</th>
                <th>vs Previous</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d, i) => {
                const diff =
                  i > 0 ? d.amount - data[i - 1].amount : 0;

                return (
                  <tr key={i}>
                    <td>{d.month}</td>

                    <td
                      style={{
                        fontWeight: 600,
                        color: "#0077b6"
                      }}
                    >
                      ₹ {d.amount.toLocaleString()}
                    </td>

                    <td>
                      {i > 0 && (
                        <span
                          className={`badge ${
                            diff >= 0
                              ? "badge-green"
                              : "badge-red"
                          }`}
                        >
                          {diff >= 0 ? "▲" : "▼"} ₹
                          {Math.abs(diff).toLocaleString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MonthlyCollection;