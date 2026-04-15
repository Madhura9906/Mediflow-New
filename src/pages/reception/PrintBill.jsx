import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../pages/shared.css";
import {
  FaPrint,
  FaFileInvoiceDollar,
  FaUser,
  FaPhone,
  FaPlus,
  FaTrash
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PrintBill() {
  const [appointments, setAppointments] = useState([]);

  const [patient, setPatient] = useState({
    name: "",
    mobile: "9876543210"
  });

  const [items, setItems] = useState([
    { name: "Consultation", qty: 1, price: 500 },
    { name: "Medicine", qty: 2, price: 200 }
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    qty: 1,
    price: ""
  });

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

  const total = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;

    setItems([
      ...items,
      {
        ...newItem,
        qty: Number(newItem.qty),
        price: Number(newItem.price)
      }
    ]);

    setNewItem({
      name: "",
      qty: 1,
      price: ""
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(0, 119, 182);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("MediFlow", 14, 12);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Patient Invoice", 14, 22);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);

    doc.text(`Patient: ${patient.name}`, 14, 38);
    doc.text(`Mobile: ${patient.mobile}`, 14, 46);
    doc.text(
      `Date: ${new Date().toLocaleDateString()}`,
      14,
      54
    );

    autoTable(doc, {
      startY: 62,
      head: [["Item", "Qty", "Unit Price", "Total"]],
      body: items.map((i) => [
        i.name,
        i.qty,
        `₹${i.price}`,
        `₹${i.qty * i.price}`
      ]),
      headStyles: {
        fillColor: [0, 119, 182]
      },
      foot: [["", "", "Total", `₹${total}`]],
      footStyles: {
        fillColor: [240, 248, 255],
        textColor: [0, 119, 182],
        fontStyle: "bold"
      }
    });

    doc.save("MediFlow_Invoice.pdf");
  };

  return (
    <div className="page-wrapper">
      <Header />

      <div className="page-content">
        <h2 className="page-title">
          <FaFileInvoiceDollar /> Print Bill
        </h2>

        {/* Patient Details */}
        <div className="card">
          <h3
            style={{
              color: "#0077b6",
              fontSize: 15,
              marginBottom: 14
            }}
          >
            Patient Details
          </h3>

          <div className="form-row">
            <div className="form-field">
              <FaUser className="icon" />

              <select
                value={patient.name}
                onChange={(e) => {
                  const selected =
                    appointments.find(
                      (appt) =>
                        appt.patientName ===
                        e.target.value
                    );

                  setPatient({
                    name:
                      selected?.patientName || "",
                    mobile:
                      selected?.mobile ||
                      "9876543210"
                  });
                }}
              >
                <option value="">
                  Select Patient
                </option>

                {appointments.map((appt) => (
                  <option
                    key={appt._id}
                    value={appt.patientName}
                  >
                    {appt.patientName} —{" "}
                    {appt.doctorId?.name ||
                      "Doctor"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <FaPhone className="icon" />

              <input
                placeholder="Mobile"
                value={patient.mobile}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    mobile:
                      e.target.value
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Bill Items */}
        <div className="card">
          <h3
            style={{
              color: "#0077b6",
              fontSize: 15,
              marginBottom: 14
            }}
          >
            Bill Items
          </h3>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>

                  <td
                    style={{
                      fontWeight: 600,
                      color: "#0077b6"
                    }}
                  >
                    ₹{item.qty * item.price}
                  </td>

                  <td>
                    <button
                      className="btn-danger"
                      onClick={() =>
                        setItems(
                          items.filter(
                            (_, idx) =>
                              idx !== i
                          )
                        )
                      }
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              <tr
                style={{
                  background: "#f0f8ff"
                }}
              >
                <td
                  colSpan={3}
                  style={{
                    fontWeight: 700,
                    color: "#0077b6"
                  }}
                >
                  TOTAL
                </td>

                <td
                  style={{
                    fontWeight: 700,
                    color: "#0077b6"
                  }}
                >
                  ₹{total}
                </td>

                <td />
              </tr>
            </tbody>
          </table>

          {/* Add item */}
          <div
            className="form-row"
            style={{ marginTop: 16 }}
          >
            <div className="form-field">
              <input
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    name:
                      e.target.value
                  })
                }
              />
            </div>

            <div className="form-field">
              <input
                type="number"
                placeholder="Qty"
                min="1"
                value={newItem.qty}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    qty:
                      e.target.value
                  })
                }
                style={{
                  width: 60
                }}
              />
            </div>

            <div className="form-field">
              <input
                type="number"
                placeholder="Price (₹)"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price:
                      e.target.value
                  })
                }
              />
            </div>

            <button
              className="btn-secondary"
              onClick={addItem}
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>

        {/* PDF */}
        <button
          className="btn-primary"
          onClick={generatePDF}
          style={{
            width: "100%",
            justifyContent: "center"
          }}
        >
          <FaPrint /> Generate Invoice PDF
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default PrintBill;