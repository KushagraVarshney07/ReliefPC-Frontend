import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const EditPatient = () => {
  const { id } = useParams(); // This ID is from the latest visit, used to fetch initial data
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const { data } = await api.get(`/patients/${id}`);
        setFormData({
          name: data.name,
          age: data.age,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          diabetes: data.diabetes,
        });
        setOriginalData({ name: data.name, phone: data.phone }); // Store original identifiers
      } catch (err) {
        console.error("Failed to load patient data:", err);
        alert("Could not load patient data.");
        navigate("/patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" || name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      originalName: originalData.name,
      originalPhone: originalData.phone,
      updatedPatientInfo: formData,
    };

    try {
      await api.put("/patients/update-demographics", payload);
      setMessage("Patient information updated successfully!");
      setTimeout(() => navigate("/patients"), 1500);
    } catch (error) {
      console.error("Error updating patient info:", error);
      setMessage("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Patient Information</h1>
          <p style={styles.subtitle}>
            Changes made here will apply to all of {originalData.name}'s visit
            records.
          </p>
        </div>
        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.formCard}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  maxLength="10"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Age</label>
                <input
                  name="age"
                  type="text"
                  value={formData.age}
                  onChange={handleChange}
                  style={styles.input}
                  maxLength="3"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Diabetes Status</label>
                <select
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Diabetes Status</option>
                  <option value="No Diabetes">No Diabetes</option>
                  <option value="Type 1 Diabetes">Type 1 Diabetes</option>
                  <option value="Type 2 Diabetes">Type 2 Diabetes</option>
                  <option value="Gestational Diabetes">
                    Gestational Diabetes
                  </option>
                  <option value="Prediabetes">Prediabetes</option>
                </select>
              </div>
            </div>
            <div style={styles.formActions}>
              <button
                type="button"
                onClick={() => navigate("/patients")}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
            {message && <div style={styles.successMessage}>{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

// Add your styles object here, similar to AddPatient.jsx
const styles = {
  /* Re-use styles from AddPatient or create new ones */
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
  },
  title: { fontSize: "32px", color: "#d4af37", margin: "0 0 8px 0" },
  subtitle: { fontSize: "16px", color: "#888", margin: "0" },
  content: { width: "90%", maxWidth: "900px", margin: "0 auto" },
  formCard: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "40px",
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { color: "#d4af37", fontWeight: "600" },
  input: {
    width: "90%",
    padding: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(212, 175, 55, 0.1)",
  },
  cancelButton: {
    padding: "12px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  submitButton: {
    padding: "12px 24px",
    background: "#d4af37",
    border: "none",
    borderRadius: "12px",
    color: "#1a1a1a",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  successMessage: { marginTop: "20px", textAlign: "center", color: "#4caf50" },
};

export default EditPatient;
