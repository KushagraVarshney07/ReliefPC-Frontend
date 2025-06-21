import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [allVisits, setAllVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientAndVisits = async () => {
      try {
        setLoading(true);
        // Get the current patient
        const { data: currentPatient } = await api.get(`/patients/${id}`);
        setPatient(currentPatient);

        // Get all visits for this specific patient using name AND phone
        if (currentPatient.name && currentPatient.phone) {
          const { data: visits } = await api.get(`/patients/visits/${encodeURIComponent(currentPatient.name)}/${encodeURIComponent(currentPatient.phone)}`);
          setAllVisits(visits);
        } else {
          // If no name or phone, just show this single visit
          setAllVisits([currentPatient]);
        }
      } catch (err) {
        console.error("Error fetching patient details:", err);
        alert("Failed to load patient details.");
        navigate("/patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientAndVisits();
  }, [id, navigate]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading patient details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Patient Details</h1>
              <p style={styles.subtitle}>Complete visit history for {patient.name}</p>
            </div>
            <div style={styles.headerActions}>
              <button 
                onClick={() => navigate(`/revisit/${patient._id}`)}
                style={styles.revisitButton}
              >
                + Log New Visit
              </button>
              <button 
                onClick={() => navigate("/patients")}
                style={styles.backButton}
              >
                ← Back to Patients
              </button>
            </div>
          </div>
        </div>

        <div style={styles.content}>
          {/* Patient Information Card */}
          <div style={styles.patientInfoCard}>
            <h3 style={styles.sectionTitle}>Patient Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Name:</span>
                <span style={styles.infoValue}>{patient.name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Age:</span>
                <span style={styles.infoValue}>{patient.age} years</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Gender:</span>
                <span style={styles.infoValue}>{patient.gender}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Phone:</span>
                <span style={styles.infoValue}>{patient.phone}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{patient.email || "Not provided"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Diabetes Status:</span>
                <span style={styles.infoValue}>{patient.diabetes || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Visit History */}
          <div style={styles.visitsCard}>
            <div style={styles.visitsHeader}>
              <h3 style={styles.sectionTitle}>Visit History</h3>
              <span style={styles.visitCount}>{allVisits.length} visits</span>
            </div>
            
            {allVisits.length === 0 ? (
              <div style={styles.emptyVisits}>
                <span style={styles.emptyIcon}>📋</span>
                <p style={styles.emptyText}>No visits found for this patient.</p>
              </div>
            ) : (
              <div style={styles.visitsList}>
                {allVisits.map((visit, index) => (
                  <div key={visit._id} style={styles.visitCard}>
                    <div style={styles.visitHeader}>
                      <div style={styles.visitNumber}>
                        <span style={styles.visitBadge}>Visit #{allVisits.length - index}</span>
                        <span style={styles.visitDate}>
                          {new Date(visit.visitDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={styles.visitActions}>
                        <button
                          onClick={() => navigate(`/edit-visit/${visit._id}`)}
                          style={styles.editVisitButton}
                        >
                          ✏️ Edit Visit
                        </button>
                        {visit.amountPaid && (
                          <span style={styles.amountPaid}>
                            ₹{visit.amountPaid}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={styles.visitDetails}>
                      <div style={styles.detailSection}>
                        <h4 style={styles.detailTitle}>Condition / Diagnosis</h4>
                        <p style={styles.detailText}>{visit.condition || "Not specified"}</p>
                      </div>
                      
                      <div style={styles.detailSection}>
                        <h4 style={styles.detailTitle}>Treatment / Notes</h4>
                        <p style={styles.detailText}>{visit.treatment || "No treatment notes"}</p>
                      </div>
                      
                      {visit.followUpDate && (
                        <div style={styles.detailSection}>
                          <h4 style={styles.detailTitle}>Follow-up Date</h4>
                          <p style={styles.detailText}>
                            {new Date(visit.followUpDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)",
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
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  headerActions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  titleSection: {
    flex: "1",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#d4af37",
    margin: "0 0 8px 0",
    letterSpacing: "0.5px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#888",
    margin: "0",
    fontWeight: "300",
  },
  backButton: {
    background: "rgba(212, 175, 55, 0.2)",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    borderRadius: "12px",
    padding: "12px 20px",
    color: "#d4af37",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  revisitButton: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    color: "#1a1a1a",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)",
  },
  content: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  patientInfoCard: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#d4af37",
    margin: "0 0 24px 0",
    letterSpacing: "0.5px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  infoLabel: {
    fontSize: "14px",
    color: "#888",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: "16px",
    color: "#ffffff",
    fontWeight: "500",
  },
  visitsCard: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  visitsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  visitCount: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    color: "#1a1a1a",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  emptyVisits: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#888",
    margin: "0",
  },
  visitsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  visitCard: {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(212, 175, 55, 0.1)",
    transition: "all 0.3s ease",
  },
  visitHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  visitNumber: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  visitBadge: {
    background: "rgba(212, 175, 55, 0.2)",
    color: "#d4af37",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  visitDate: {
    fontSize: "16px",
    color: "#ffffff",
    fontWeight: "500",
  },
  amountPaid: {
    background: "rgba(76, 175, 80, 0.2)",
    color: "#4caf50",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },
  visitDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  detailSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  detailTitle: {
    fontSize: "14px",
    color: "#d4af37",
    fontWeight: "600",
    margin: "0",
  },
  detailText: {
    fontSize: "14px",
    color: "#cccccc",
    margin: "0",
    lineHeight: "1.5",
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
  loadingText: {
    color: "#888",
    marginTop: "16px",
    fontSize: "16px",
  },
  visitActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  editVisitButton: {
    background: 'transparent',
    border: '1px solid rgba(52, 152, 219, 0.4)',
    borderRadius: '8px',
    padding: '6px 10px',
    color: '#3498db',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

export default PatientDetails;
