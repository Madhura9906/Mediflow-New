import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import { FaMoneyBillWave, FaUser, FaClock, FaCreditCard, FaRupeeSign } from "react-icons/fa";

function DailyCollection() {
const [payments, setPayments] = useState([]);

useEffect(() => {
  fetch("http://localhost:5000/api/appointments")
    .then((res) => res.json())
    .then((data) => {
      const today = new Date().toISOString().split("T")[0];

      const todayAppointments = (data.appointments || [])
        .filter((appt) => {
          const apptDate = new Date(appt.date)
            .toISOString()
            .split("T")[0];

          return (
            apptDate === today &&
            appt.status !== "Cancelled"
          );
        })
        .map((appt) => ({
          id: appt._id,
          patient: appt.patientName,
          service: "Consultation",
          amount: 500,
          method: "Cash",
          time: appt.time
        }));

      setPayments(todayAppointments);
    })
    .catch((err) => console.log(err));
}, []);

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <h2 className="page-title"><FaMoneyBillWave /> Daily Collection</h2>

        <div className="card" style={{
          background:"linear-gradient(135deg,#0077b6,#00b4d8)",
          display:"flex",alignItems:"center",gap:20,marginBottom:24
        }}>
          <div style={{
            width:56,height:56,borderRadius:"50%",
            background:"rgba(255,255,255,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}>
            <FaRupeeSign style={{fontSize:24,color:"white"}}/>
          </div>
          <div>
            <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginBottom:4}}>Today's Total Collection</p>
            <h2 style={{color:"white",fontSize:32,fontWeight:700}}>₹ {total.toLocaleString()}</h2>
          </div>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr><th>Patient</th><th>Service</th><th>Time</th><th>Method</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td><FaUser style={{color:"#0077b6",marginRight:6}}/>{p.patient}</td>
                  <td>{p.service}</td>
                  <td><FaClock style={{color:"#0077b6",marginRight:6}}/>{p.time}</td>
                  <td>
                    <span className={`badge ${p.method==="Cash"?"badge-green":p.method==="UPI"?"badge-blue":"badge-orange"}`}>
                      {p.method}
                    </span>
                  </td>
                  <td style={{fontWeight:600,color:"#0077b6"}}>₹ {p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default DailyCollection;
