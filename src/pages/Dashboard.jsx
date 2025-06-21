import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import BusinessCard from "../components/BusinessCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome back, {user?.username || "Doctor"} 👋</h1>
        <div style={styles.cardContainer}>
          <div style={styles.card} onClick={() => navigate("/patients")}>
            <h2>📋 Patients</h2>
            <p>View and manage patient records.</p>
          </div>
          <div style={styles.card} onClick={() => navigate("/add-patient")}>
            <h2>➕ Add Patient</h2>
            <p>Register a new patient to the system.</p>
          </div>
          <div style={styles.card} onClick={() => navigate("/appointments")}>
            <h2>📅 Appointments</h2>
            <p>View the daily schedule of visits.</p>
          </div>
          <div style={styles.card} onClick={() => navigate("/analytics")}>
            <h2>📊 Analytics</h2>
            <p>View overall clinic performance metrics.</p>
          </div>
        </div>
      </div>

      <div style={styles.businessCardWrapper}>
        <BusinessCard />
      </div>
    </div>
  );
};

const styles = {
    container: {
      padding: "30px",
      backgroundColor: "#0d0d0d", // dark bg
      minHeight: "100vh",
      color: "#ffffff",
    },
    heading: {
      fontSize: "28px",
      marginBottom: "24px",
      color: "#d4af37", // gold heading
    },
    cardContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
      gap: "24px",
    },
    card: {
      background: "#1a1a1a",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(212, 175, 55, 0.2)",
      flex: "1 1 250px",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
      color: "#ffffff",
      border: "1px solid #d4af37",
    },
    businessCardWrapper: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
    },
  };
  

export default Dashboard;
