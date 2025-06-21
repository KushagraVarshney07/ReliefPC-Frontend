import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left} onClick={handleLogoClick}>
        <img src={logo} alt="Relief Physiotherapy Logo" style={styles.logo} />
        <span style={styles.title}>Relief Physiotherapy Clinic</span>
      </div>
      <div style={styles.right}>
        <span style={styles.welcome}>Welcome, {user?.username || "Guest"}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: "linear-gradient(90deg,rgb(0, 0, 0),rgb(229, 193, 15))",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
  logo: {
    height: "48px",
    borderRadius: "8px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "0.7px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  welcome: {
    fontSize: "16px",
    fontWeight: "600",
    color: "black",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    border: "none",
    padding: "8px 16px",
    color: "white",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Navbar;
