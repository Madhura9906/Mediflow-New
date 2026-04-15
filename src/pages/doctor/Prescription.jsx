import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import "./Prescription.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaPlus,
  FaDownload,
  FaTrash,
  FaFilePrescription,
  FaUpload
} from "react-icons/fa";

function Prescription() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    date: ""
  });

  const [medicines, setMedicines] = useState([]);

  const [medicine, setMedicine] = useState({
    name: "",
    dose: "",
    days: ""
  });

  const [notes, setNotes] = useState("");

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

  const handlePatientChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value
    });
  };

  const handleMedicineChange = (e) => {
    setMedicine({
      ...medicine,
      [e.target.name]: e.target.value
    });
  };

  const addMedicine = () => {
    if (!medicine.name) return;

    setMedicines([...medicines, medicine]);

    setMedicine({
      name: "",
      dose: "",
      days: ""
    });
  };

  const removeMedicine = (i) => {
    setMedicines(
      medicines.filter((_, idx) => idx !== i)
    );
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(0, 119, 182);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("MediFlow", 14, 12);

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("Doctor Prescription", 14, 22);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);

    doc.text(
      `Patient: ${patient.name}`,
      14,
      40
    );

    doc.text(
      `Age: ${patient.age}`,
      80,
      40
    );

    doc.text(
      `Date: ${patient.date}`,
      150,
      40
    );

    autoTable(doc, {
      startY: 50,
      head: [["Medicine", "Dose", "Days"]],
      body: medicines.map((m) => [
        m.name,
        m.dose,
        m.days
      ]),
      headStyles: {
        fillColor: [0, 119, 182]
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255]
      }
    });

    const finalY =
      doc.lastAutoTable.finalY + 20;

    if (notes) {
      doc.setFontSize(10);

      doc.text(
        `Notes: ${notes}`,
        14,
        finalY
      );
    }

    doc.text(
      "Doctor Signature: _______________",
      130,
      finalY + 20
    );

    doc.save("MediFlow_Prescription.pdf");
  };

  const uploadPrescription = async () => {
    if (!pdfFile || !selectedAppointment) {
      alert("Select patient and PDF");
      return;
    }

    const formData = new FormData();
    formData.append(
      "prescription",
      pdfFile
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/upload-prescription/${selectedAppointment}`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          "Prescription uploaded successfully"
        );
      } else {
        alert("Upload failed");
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
          <FaFilePrescription /> Doctor Prescription
        </h2>

        {/* Patient Info */}
        <div className="card">
          <h3
            style={{
              marginBottom: 16,
              color: "#0077b6",
              fontSize: 15
            }}
          >
            Patient Information
          </h3>

          <div className="form-row">
            <div className="form-field">
              <select
                value={patient.name}
                onChange={(e) => {
                  const selected =
                    appointments.find(
                      (appt) =>
                        appt.patientName ===
                        e.target.value
                    );

                  setSelectedAppointment(
                    selected?._id || ""
                  );

                  setPatient({
                    ...patient,
                    name:
                      selected?.patientName ||
                      "",
                    date:
                      selected?.date
                        ? new Date(
                            selected.date
                          )
                            .toISOString()
                            .split("T")[0]
                        : ""
                  });
                }}
              >
                <option value="">
                  Select Patient
                </option>

                {appointments.map((appt) => (
                  <option
                    key={appt._id}
                    value={
                      appt.patientName
                    }
                  >
                    {appt.patientName} —{" "}
                    {appt.doctorId
                      ?.name ||
                      "Doctor"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={patient.age}
                onChange={
                  handlePatientChange
                }
              />
            </div>

            <div className="form-field">
              <input
                type="date"
                name="date"
                value={patient.date}
                onChange={
                  handlePatientChange
                }
              />
            </div>
          </div>
        </div>

        {/* Medicine */}
        <div className="card">
          <h3
            style={{
              marginBottom: 16,
              color: "#0077b6",
              fontSize: 15
            }}
          >
            Add Medicine
          </h3>

          <div className="form-row">
            <div className="form-field">
              <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={medicine.name}
                onChange={
                  handleMedicineChange
                }
              />
            </div>

            <div className="form-field">
              <input
                type="text"
                name="dose"
                placeholder="Dose (1-0-1)"
                value={medicine.dose}
                onChange={
                  handleMedicineChange
                }
              />
            </div>

            <div className="form-field">
              <input
                type="number"
                name="days"
                placeholder="Days"
                value={medicine.days}
                onChange={
                  handleMedicineChange
                }
              />
            </div>

            <button
              className="btn-primary"
              onClick={addMedicine}
            >
              <FaPlus /> Add
            </button>
          </div>

          {medicines.length > 0 && (
            <table
              style={{
                marginTop: 12
              }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th>Dose</th>
                  <th>Days</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map(
                  (m, i) => (
                    <tr key={i}>
                      <td>
                        {i + 1}
                      </td>
                      <td>
                        {m.name}
                      </td>
                      <td>
                        {m.dose}
                      </td>
                      <td>
                        {m.days}
                      </td>

                      <td>
                        <button
                          className="btn-danger"
                          onClick={() =>
                            removeMedicine(
                              i
                            )
                          }
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Notes */}
        <div className="card">
          <h3
            style={{
              marginBottom: 12,
              color: "#0077b6",
              fontSize: 15
            }}
          >
            Doctor Notes
          </h3>

          <div className="form-field">
            <textarea
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              rows={3}
            />
          </div>
        </div>

        {/* Download PDF first */}
        <button
          className="btn-primary"
          onClick={downloadPDF}
          style={{
            width: "100%",
            justifyContent: "center"
          }}
        >
          <FaDownload /> Download Prescription PDF
        </button>

        {/* Upload PDF after download */}
        <div
          className="card"
          style={{
            marginTop: 20
          }}
        >
          <h3
            style={{
              marginBottom: 12,
              color: "#0077b6"
            }}
          >
            Upload Prescription PDF
          </h3>

          <div className="form-field">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setPdfFile(
                  e.target.files[0]
                )
              }
            />
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: 12 }}
            onClick={uploadPrescription}
          >
            <FaUpload /> Upload PDF
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Prescription;