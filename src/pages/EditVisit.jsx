import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const EditVisit = () => {
  const { visitId } = useParams(); // Get the specific visit ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        const { data } = await api.get(`/patients/${visitId}`);
        setFormData({
          condition: data.condition,
          treatment: data.treatment,
          visitDate: new Date(data.visitDate).toISOString().split("T")[0],
          followUpDate: data.followUpDate
            ? new Date(data.followUpDate).toISOString().split("T")[0]
            : "",
          amountPaid: data.amountPaid,
        });
        setPatientInfo(data); // Store the full patient context
      } catch (err) {
        console.error("Failed to load visit data:", err);
        alert("Could not load visit data.");
        navigate("/patients");
      } finally {
        setLoading(false);
      }
    };
    fetchVisitData();
  }, [visitId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call the new backend endpoint to update the single visit
      await api.put(`/patients/${visitId}`, formData);
      setMessage("Visit details updated successfully!");
      // Navigate back to the main details page for that patient
      setTimeout(() => navigate(`/details/${visitId}`), 1500);
    } catch (error) {
      console.error("Error updating visit:", error);
      setMessage("Failed to update visit. Please try again.");
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
          <h1 style={styles.title}>
            Edit Visit Details for {patientInfo.name}
          </h1>
          <p style={styles.subtitle}>
            Editing visit from{" "}
            {new Date(patientInfo.visitDate).toLocaleDateString()}
          </p>
        </div>
        <form onSubmit={handleSubmit} style={styles.formCard}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Condition / Diagnosis</label>
            <textarea
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              style={styles.textarea}
              rows="4"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Treatment / Notes</label>
            <textarea
              name="treatment"
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
              <label style={styles.label}>Follow-up Date</label>
              <input
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate(`/details/${visitId}`)}
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
          {message && <div>{message}</div>}
        </form>
      </div>
    </div>
  );
};

// You can reuse the styles from your other form pages
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
  title: { fontSize: "32px", color: "#d4af37" },
  subtitle: { fontSize: "16px", color: "#888" },
  formCard: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", color: "#d4af37", marginBottom: "8px" },
  input: {
    width: "90%",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #d4af37",
    borderRadius: "8px",
    color: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #d4af37",
    borderRadius: "8px",
    color: "#fff",
    resize: "vertical",
    minHeight: "100px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "30px",
  },
  cancelButton: {
    padding: "12px 24px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  submitButton: {
    padding: "12px 24px",
    background: "#d4af37",
    border: "none",
    borderRadius: "8px",
    color: "#1a1a1a",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default EditVisit;
