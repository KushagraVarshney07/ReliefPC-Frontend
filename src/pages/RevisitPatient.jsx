import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const RevisitPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [patientInfo, setPatientInfo] = useState(null);
  const [formData, setFormData] = useState({
    condition: "",
    treatment: "",
    visitDate: today,
    followUpDate: "",
    amountPaid: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const { data } = await api.get(`/patients/${id}`);
        setPatientInfo(data);
      } catch (err) {
        console.error("Failed to load patient info:", err);
        alert("Could not load patient data. Redirecting back to patient list.");
        navigate("/patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientInfo();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amountPaid") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      const decimalCount = (numericValue.match(/\./g) || []).length;
      if (decimalCount <= 1) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const newVisitData = {
      name: patientInfo.name,
      age: patientInfo.age,
      gender: patientInfo.gender,
      phone: patientInfo.phone,
      email: patientInfo.email,
      diabetes: patientInfo.diabetes,

      condition: formData.condition,
      treatment: formData.treatment,
      visitDate: formData.visitDate,
      followUpDate: formData.followUpDate,
      amountPaid: formData.amountPaid,
    };

    try {
      await api.post("/patients", newVisitData);

      setMessage("New visit added successfully!");

      setTimeout(() => navigate(`/details/${patientInfo._id}`), 1500);
    } catch (error) {
      console.error("Error adding new visit:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !patientInfo) {
    // A simple loading screen
    return <div>Loading patient data...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Log New Visit for {patientInfo?.name}</h1>
          <p style={styles.subtitle}>
            Patient's personal information is locked. Please add new visit
            details below.
          </p>
        </div>

        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.formCard}>
            {/* Locked Personal Info Section */}
            <div style={styles.lockedSection}>
              <h3 style={styles.sectionTitle}>Patient Information (Locked)</h3>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone:</span>{" "}
                  {patientInfo?.phone}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Age:</span> {patientInfo?.age}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Gender:</span>{" "}
                  {patientInfo?.gender}
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email:</span>{" "}
                  {patientInfo?.email || "N/A"}
                </div>
              </div>
            </div>

            {/* Editable Visit Info Section */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>New Visit Details</h3>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Condition / Diagnosis</label>
                <textarea
                  name="condition"
                  placeholder="Describe the patient's current condition"
                  value={formData.condition}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="4"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Treatment Plan / Notes</label>
                <textarea
                  name="treatment"
                  placeholder="Enter treatment plan for this visit"
                  value={formData.treatment}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="4"
                />
              </div>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Amount Paid (₹)</label>
                  <input
                    name="amountPaid"
                    type="text"
                    placeholder="Enter amount paid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Visit Date</label>
                  <input
                    name="visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Next Follow-up Date</label>
                  <input
                    name="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                onClick={() => navigate(`/details/${id}`)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Visit"}
              </button>
            </div>
            {message && <div style={styles.successMessage}>{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

// You can reuse most of the styles from AddPatient.jsx
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
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#d4af37",
    margin: "0 0 8px 0",
  },
  subtitle: { fontSize: "16px", color: "#888", margin: "0", fontWeight: "300" },
  content: { width: "90%", maxWidth: "1200px", margin: "0 auto" },
  formCard: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  section: {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  lockedSection: {
    background: "rgba(0,0,0,0.1)",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid rgba(212, 175, 55, 0.05)",
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#d4af37",
    margin: "0 0 24px 0",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  infoItem: { fontSize: "16px", color: "#ffffff" },
  infoLabel: { color: "#888", marginRight: "8px" },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "15px",
  },
  label: { fontSize: "14px", fontWeight: "600", color: "#d4af37" },
  input: {
    padding: "14px 16px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
  },
  textarea: {
    padding: "14px 16px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit",
  },
  formActions: {
    display: "flex",
    gap: "16px",
    justifyContent: "flex-end",
    paddingTop: "20px",
    borderTop: "1px solid rgba(212, 175, 55, 0.1)",
  },
  cancelButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "14px 24px",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
  submitButton: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  successMessage: {
    background: "rgba(76, 175, 80, 0.1)",
    border: "1px solid rgba(76, 175, 80, 0.3)",
    color: "#4caf50",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "16px",
    marginTop: "20px",
  },
};

export default RevisitPatient;
