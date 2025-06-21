import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Appointments = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState(null);

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const fetchAppointments = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/by-date/${date}`);
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setAppointments([]); // Clear appointments on error
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>Daily Appointments</h1>
            <p style={styles.subtitle}>
              View all scheduled visits for a specific day.
            </p>
          </div>
          <div style={styles.datePickerContainer}>
            <label htmlFor="appointment-date" style={styles.dateLabel}>
              Select Date:
            </label>
            <input
              type="date"
              id="appointment-date"
              value={selectedDate}
              onChange={handleDateChange}
              style={styles.dateInput}
            />
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.tableContainer}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📅</span>
                <h3 style={styles.emptyTitle}>No Appointments Found</h3>
                <p style={styles.emptyText}>
                  There are no scheduled appointments for{" "}
                  {new Date(selectedDate).toLocaleDateString()}.
                </p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th
                        style={{ ...styles.tableHeaderCell, ...styles.snoCell }}
                      >
                        S.no
                      </th>
                      <th style={styles.tableHeaderCell}>Patient Name</th>
                      <th
                        style={{ ...styles.tableHeaderCell, ...styles.ageCell }}
                      >
                        Age
                      </th>
                      <th
                        style={{
                          ...styles.tableHeaderCell,
                          ...styles.genderCell,
                        }}
                      >
                        Gender
                      </th>
                      <th style={styles.tableHeaderCell}>Condition</th>
                      <th style={styles.tableHeaderCell}>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((visit, index) => (
                      <tr
                        key={visit._id}
                        style={
                          hoveredRowId === visit._id
                            ? { ...styles.tableRow, ...styles.tableRowHover }
                            : styles.tableRow
                        }
                        onMouseEnter={() => setHoveredRowId(visit._id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        onClick={() => navigate(`/details/${visit._id}`)}
                      >
                        <td style={{ ...styles.tableCell, ...styles.snoCell }}>
                          {index + 1}
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.nameText}>{visit.name}</span>
                        </td>
                        <td style={{ ...styles.tableCell, ...styles.ageCell }}>
                          <span style={styles.ageText}>{visit.age}</span>
                        </td>
                        <td
                          style={{ ...styles.tableCell, ...styles.genderCell }}
                        >
                          <span style={styles.genderBadge}>{visit.gender}</span>
                        </td>
                        <td style={styles.tableCell}>{visit.condition}</td>
                        <td style={styles.tableCell}>{visit.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Re-using styles from PatientList for a consistent look
const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "30px 40px",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  titleSection: {},
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#d4af37",
    margin: "0 0 8px 0",
    letterSpacing: "0.5px",
  },
  subtitle: { fontSize: "16px", color: "#888", margin: "0", fontWeight: "300" },
  datePickerContainer: { display: "flex", alignItems: "center", gap: "10px" },
  dateLabel: { color: "#d4af37", fontSize: "16px", fontWeight: "600" },
  dateInput: {
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
  },
  content: { width: "90%", maxWidth: "1400px", margin: "0 auto" },
  tableContainer: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
    minHeight: "400px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(212, 175, 55, 0.2)",
    borderTop: "4px solid #d4af37",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: { color: "#888", marginTop: "16px", fontSize: "16px" },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "16px" },
  emptyTitle: {
    fontSize: "24px",
    color: "#d4af37",
    margin: "0 0 8px 0",
    fontWeight: "600",
  },
  emptyText: { fontSize: "16px", color: "#888", margin: "0 0 24px 0" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
  },
  tableHeaderCell: {
    padding: "16px 20px",
    textAlign: "left",
    color: "#1a1a1a",
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  snoCell: { width: "70px", textAlign: "center" },
  ageCell: { width: "80px", textAlign: "center" },
  genderCell: { width: "100px" },
  tableRow: {
    borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
    transition: "background 0.2s ease-in-out",
    cursor: "pointer",
  },
  tableRowHover: { background: "rgba(212, 175, 55, 0.05)" },
  tableCell: { padding: "16px 20px", color: "#ffffff", fontSize: "14px" },
  nameText: { fontSize: "16px", fontWeight: "600", color: "#ffffff" },
  ageText: { fontSize: "14px", color: "#ffffff" },
  genderBadge: {
    background: "rgba(212, 175, 55, 0.2)",
    color: "#d4af37",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
    border: "1px solid #444",
  },
};

export default Appointments;
