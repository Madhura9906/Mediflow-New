import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaCheckCircle
} from "react-icons/fa";

function PatientSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data.appointments || []);
      })
      .catch((err) => console.log(err));
  }, []);

  const results = query
    ? patients.filter(
        (p) =>
          p.patientName
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          p.mobile?.includes(query)
      )
    : [];

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <h2 className="page-title">
          <FaSearch /> Search Patient
        </h2>

        <div className="card">
          <div className="form-field">
            <FaPhone className="icon" />
            <input
              type="text"
              placeholder="Enter patient name"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />
          </div>
        </div>

        {results.length > 0 && (
          <div className="card">
            {results.map((p) => (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom:
                    "1px solid #eef2f7"
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600
                    }}
                  >
                    <FaUser
                      style={{
                        color:
                          "#0077b6",
                        marginRight: 8
                      }}
                    />
                    {p.patientName}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#666"
                    }}
                  >
                    Doctor:{" "}
                    {p.doctorId?.name}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() =>
                    setSelected(p)
                  }
                >
                  <FaCheckCircle /> Select
                </button>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="card">
            <h3>
              Selected:{" "}
              {selected.patientName}
            </h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PatientSearch;