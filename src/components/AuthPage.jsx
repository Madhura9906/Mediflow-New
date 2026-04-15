import React, { useEffect, useState } from "react";
import "./AuthPage.css";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaStethoscope,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaUserMd,
  FaUserInjured,
  FaDesktop
} from "react-icons/fa";

function AuthPage() {
  const [role, setRole] = useState("patient");
  const [isLogin, setIsLogin] = useState(true);
  const [loggedRole, setLoggedRole] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [spec, setSpec] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("mediflowUser"));
    if (savedUser?.role) {
      setLoggedRole(savedUser.role);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your name");
      return;
    }

    if (!isLogin && role === "doctor" && !spec) {
      setError("Please enter specialization");
      return;
    }

    try {
      setError("");

      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const bodyData = isLogin
        ? {
            email,
            password,
            role
          }
        : {
            name,
            email,
            password,
            role,
            phone
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (!isLogin && role === "doctor") {
        await fetch("http://localhost:5000/api/doctors/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name.startsWith("Dr.") ? name : `Dr. ${name}`,
            specialization: spec,
            availableTimings: [
              "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
              "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
              "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
              "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
              "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
              "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
              "08:00 PM"
            ]
          })
        });
      }

      localStorage.setItem("mediflowToken", data.token);
      localStorage.setItem("mediflowUser", JSON.stringify(data.user));

      alert(isLogin ? "Login successful" : "Registration successful");

      setLoggedRole(role);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setSpec("");
  };

  const handleLogout = () => {
    localStorage.removeItem("mediflowUser");
    localStorage.removeItem("mediflowToken");
    setLoggedRole(null);
  };

  if (loggedRole === "patient") {
    return <PatientDashboard onLogout={handleLogout} />;
  }

  if (loggedRole === "doctor") {
    return <DoctorDashboard onLogout={handleLogout} />;
  }

  if (loggedRole === "receptionist") {
    return <ReceptionistDashboard onLogout={handleLogout} />;
  }

  const roleIcons = {
    doctor: <FaUserMd />,
    patient: <FaUserInjured />,
    receptionist: <FaDesktop />
  };

  return (
    <div className="auth-split">
      <div className="auth-hero">
        <video
          className="hero-bg-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/bg1.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-logo">
            <span className="hero-logo-text">MediFlow</span>
          </div>

          <h1 className="hero-title">
            Your Health,<nobr />
            <span className="hero-accent"> Managed Smart</span>
          </h1>

          <p className="hero-sub">
            One platform for doctors, patients and receptionists.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="role-selector">
            {["patient", "doctor", "receptionist"].map((r) => (
              <button
                key={r}
                type="button"
                className={`role-btn ${role === r ? "active" : ""}`}
                onClick={() => {
                  setRole(r);
                  setError("");
                }}
              >
                <span className="role-icon">{roleIcons[r]}</span>
                <span className="role-label">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
              </button>
            ))}
          </div>

          <h2 className="auth-heading">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="auth-sub">
            {isLogin ? `Login as ${role}` : `Register as ${role}`}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {!isLogin && role === "patient" && (
              <div className="input-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {!isLogin && role === "doctor" && (
              <div className="input-group">
                <FaStethoscope className="input-icon" />
                <input
                  type="text"
                  placeholder="Specialization"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                />
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="switch-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={switchMode}>
              {isLogin ? " Register" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;