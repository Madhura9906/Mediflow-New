import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Splash Screen */
import SplashScreen from "./components/SplashScreen";

/* Home */
import Home from "./pages/Home";

/* Patient Pages */
import PatientHome from "./pages/PatientHome";
import TakeAppointment from "./pages/patient/TakeAppointment";
import ViewPrescription from "./pages/patient/ViewPrescription";
import LastVisits from "./pages/patient/LastVisits";
import Billing from "./pages/patient/Billing";

/* Doctor Pages */
import DoctorHome from "./pages/DoctorHome";
import PatientSearch from "./pages/doctor/PatientSearch";
import CasePaper from "./pages/doctor/CasePaper";
import Prescription from "./pages/doctor/Prescription";
import AddMedicine from "./pages/doctor/AddMedicine";
import Followup from "./pages/doctor/Followup";

/* Receptionist Pages */
import ReceptionistHome from "./pages/ReceptionistHome";
import AddAppointment from "./pages/reception/AddAppointment";
import ReorderAppointment from "./pages/reception/ReorderAppointment";
import CancelAppointment from "./pages/reception/CancelAppointment";
import PrintBill from "./pages/reception/PrintBill";
import DailyCollection from "./pages/reception/DailyCollection";
import MonthlyCollection from "./pages/reception/MonthlyCollection";

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Patient */}
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/take-appointment" element={<TakeAppointment />} />
        <Route path="/patient/view-prescription" element={<ViewPrescription />} />
        <Route path="/patient/last-visits" element={<LastVisits />} />
        <Route path="/patient/billing" element={<Billing />} />

        {/* Doctor */}
        <Route path="/doctor/home" element={<DoctorHome />} />
        <Route path="/doctor/patient-search" element={<PatientSearch />} />
        <Route path="/doctor/case-paper" element={<CasePaper />} />
        <Route path="/doctor/prescription" element={<Prescription />} />
        <Route path="/doctor/add-medicine" element={<AddMedicine />} />
        <Route path="/doctor/followup" element={<Followup />} />

        {/* Receptionist */}
        <Route path="/reception/home" element={<ReceptionistHome />} />
        <Route path="/reception/add-appointment" element={<AddAppointment />} />
        <Route path="/reception/reorder-appointment" element={<ReorderAppointment />} />
        <Route path="/reception/cancel-appointment" element={<CancelAppointment />} />
        <Route path="/reception/print-bill" element={<PrintBill />} />
        <Route path="/reception/daily-collection" element={<DailyCollection />} />
        <Route path="/reception/monthly-collection" element={<MonthlyCollection />} />
      </Routes>
    </Router>
  );
}

export default App;