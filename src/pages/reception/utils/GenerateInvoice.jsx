import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import logo from "../../../assets/logo.png";

export const generateInvoice = async (billData) => {

  const doc = new jsPDF();

  const billNumber = "AC-" + Date.now().toString().slice(-6);

  const upiString = `upi://pay?pa=aadiraclinic@upi&pn=MediFlow&am=${billData.total}&cu=INR`;

  const qrImage = await QRCode.toDataURL(upiString);

  /* LOGO */

  doc.addImage(logo, "PNG", 15, 10, 30, 30);

  /* CLINIC INFO */

  doc.setFontSize(18);
  doc.text("MediFlow", 50, 20);

  doc.setFontSize(11);
  doc.text("Doctor: Dr. Sharma (MBBS)", 50, 28);
  doc.text("GSTIN: 27ABCDE1234F1Z5", 50, 35);
  doc.text("Phone: +91 9876543210", 50, 42);

  /* BILL INFO */

  doc.setFontSize(12);
  doc.text(`Bill No: ${billNumber}`, 150, 20);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 28);

  /* PATIENT INFO */

  doc.text(`Patient: ${billData.patient}`, 20, 60);
  doc.text(`Mobile: ${billData.mobile}`, 20, 68);

  /* TABLE HEADER */

  let y = 85;

  doc.setFillColor(240,240,240);
  doc.rect(20, y, 170, 10, "F");

  doc.text("Service", 25, y+7);
  doc.text("Qty", 110, y+7);
  doc.text("Price", 140, y+7);
  doc.text("Total", 170, y+7);

  y += 15;

  /* TABLE ROWS */

  billData.items.forEach((item)=>{

    const lineTotal = item.qty * item.price;

    doc.text(item.name, 25, y);
    doc.text(String(item.qty), 110, y);
    doc.text(`₹${item.price}`, 140, y);
    doc.text(`₹${lineTotal}`, 170, y);

    y += 10;

  });

  /* TOTAL */

  y += 10;

  doc.setFontSize(14);
  doc.text(`Grand Total: ₹${billData.total}`, 140, y);

  /* QR CODE */

  doc.addImage(qrImage, "PNG", 20, y+10, 40, 40);

  doc.setFontSize(10);
  doc.text("Scan to Pay (UPI)", 20, y+55);

  /* FOOTER */

  doc.setFontSize(10);
  doc.text("Thank you for visiting MediFlow", 70, 280);

  doc.save(`Invoice-${billNumber}.pdf`);
};