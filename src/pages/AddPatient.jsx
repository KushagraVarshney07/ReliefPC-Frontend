import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AddPatient = () => {
  // Get today's date in YYYY-MM-DD format for default value
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    condition: "",
    treatment: "",
    visitDate: today, // Set today's date as default
    followUpDate: "",
    diabetes: "",
    amountPaid: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDiabetesDropdown, setShowDiabetesDropdown] = useState(false);
  const navigate = useNavigate();

  // Refs for dropdown containers
  const genderDropdownRef = useRef(null);
  const diabetesDropdownRef = useRef(null);

  const genderOptions = [
    { value: "Male", label: "Male", icon: "👨" },
    { value: "Female", label: "Female", icon: "👩" },
    { value: "Other", label: "Other", icon: "👤" },
  ];

  const diabetesOptions = [
    { value: "No Diabetes", label: "No Diabetes", icon: "✅" },
    { value: "Type 1 Diabetes", label: "Type 1 Diabetes", icon: "🩸" },
    { value: "Type 2 Diabetes", label: "Type 2 Diabetes", icon: "🩸" },
    { value: "Gestational Diabetes", label: "Gestational Diabetes", icon: "🤰" },
    { value: "Prediabetes", label: "Prediabetes", icon: "⚠️" },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setShowGenderDropdown(false);
      }
      if (diabetesDropdownRef.current && !diabetesDropdownRef.current.contains(event.target)) {
        setShowDiabetesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for different field types
    if (name === "age") {
      // Only allow numbers for age
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue === "" || (parseInt(numericValue) >= 0 && parseInt(numericValue) <= 150)) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else if (name === "amountPaid") {
      // Only allow numbers and decimal point for amount
      const numericValue = value.replace(/[^0-9.]/g, "");
      // Prevent multiple decimal points
      const decimalCount = (numericValue.match(/\./g) || []).length;
      if (decimalCount <= 1) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else if (name === "phone") {
      // Only allow numbers and limit to 10 digits for phone
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      // Default handling for other fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender: gender,
    }));
    setShowGenderDropdown(false);
  };

  const handleDiabetesSelect = (diabetes) => {
    setFormData((prev) => ({
      ...prev,
      diabetes: diabetes,
    }));
    setShowDiabetesDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      await api.post("/patients", formData);
      setMessage("Patient added successfully!");
      setTimeout(() => navigate("/patients"), 1500);
    } catch (error) {
      console.error("Error adding patient:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Add New Patient</h1>
              <p style={styles.subtitle}>Register a new patient to the system</p>
            </div>
            <button 
              onClick={() => navigate("/patients")}
              style={styles.backButton}
            >
              ← Back to Patients
            </button>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                {/* Personal Information Section */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Personal Information</h3>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      name="name"
                      placeholder="Enter patient's full name"
                      value={formData.name}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Age</label>
                      <input
                        name="age"
                        type="text"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        style={styles.input}
                        maxLength="3"
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Gender</label>
                      <div style={styles.customDropdown} ref={genderDropdownRef}>
                        <div 
                          style={styles.dropdownHeader}
                          onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        >
                          <span style={styles.dropdownValue}>
                            {formData.gender ? (
                              <>
                                <span style={styles.optionIcon}>
                                  {genderOptions.find(opt => opt.value === formData.gender)?.icon}
                                </span>
                                {formData.gender}
                              </>
                            ) : (
                              "Select Gender"
                            )}
                          </span>
                          <span style={styles.dropdownArrow}>
                            {showGenderDropdown ? "▲" : "▼"}
                          </span>
                        </div>
                        {showGenderDropdown && (
                          <div style={styles.dropdownOptions}>
                            {genderOptions.map((option) => (
                              <div
                                key={option.value}
                                style={styles.dropdownOption}
                                onClick={() => handleGenderSelect(option.value)}
                              >
                                <span style={styles.optionIcon}>{option.icon}</span>
                                <span style={styles.optionLabel}>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Phone Number</label>
                      <input
                        name="phone"
                        type="text"
                        placeholder="Enter 10-digit phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                        maxLength="10"
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Email</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Diabetes Status</label>
                      <div style={styles.customDropdown} ref={diabetesDropdownRef}>
                        <div 
                          style={styles.dropdownHeader}
                          onClick={() => setShowDiabetesDropdown(!showDiabetesDropdown)}
                        >
                          <span style={styles.dropdownValue}>
                            {formData.diabetes ? (
                              <>
                                <span style={styles.optionIcon}>
                                  {diabetesOptions.find(opt => opt.value === formData.diabetes)?.icon}
                                </span>
                                {formData.diabetes}
                              </>
                            ) : (
                              "Select Diabetes Status"
                            )}
                          </span>
                          <span style={styles.dropdownArrow}>
                            {showDiabetesDropdown ? "▲" : "▼"}
                          </span>
                        </div>
                        {showDiabetesDropdown && (
                          <div style={styles.dropdownOptions}>
                            {diabetesOptions.map((option) => (
                              <div
                                key={option.value}
                                style={styles.dropdownOption}
                                onClick={() => handleDiabetesSelect(option.value)}
                              >
                                <span style={styles.optionIcon}>{option.icon}</span>
                                <span style={styles.optionLabel}>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Amount Paid</label>
                      <input
                        name="amountPaid"
                        type="text"
                        placeholder="Enter amount paid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Medical Information</h3>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Condition / Diagnosis</label>
                    <textarea
                      name="condition"
                      placeholder="Describe the patient's condition or diagnosis"
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
                      placeholder="Enter treatment plan or additional notes"
                      value={formData.treatment}
                      onChange={handleChange}
                      style={styles.textarea}
                      rows="4"
                    />
                  </div>
                </div>

                {/* Appointment Information Section */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Appointment Information</h3>
                  <div style={styles.row}>
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
                  {loading ? (
                    <>
                      <span style={styles.loadingSpinner}></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span style={styles.saveIcon}>💾</span>
                      Save Patient
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div style={message.includes("successfully") ? styles.successMessage : styles.errorMessage}>
                  {message}
                </div>
              )}
            </form>
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
  content: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  formCard: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  formGrid: {
    display: "grid",
    gap: "40px",
  },
  section: {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "16px",
    padding: "30px",
    border: "1px solid rgba(212, 175, 55, 0.1)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#d4af37",
    margin: "0 0 24px 0",
    letterSpacing: "0.5px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    marginTop: "15px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#d4af37",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "14px 16px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  customDropdown: {
    position: "relative",
    width: "100%",
  },
  dropdownHeader: {
    padding: "14px 16px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "52px",
    boxSizing: "border-box",
  },
  dropdownValue: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "1",
    overflow: "hidden",
  },
  dropdownArrow: {
    fontSize: "12px",
    color: "#d4af37",
    transition: "transform 0.3s ease",
    flexShrink: 0,
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    marginTop: "4px",
    zIndex: 1000,
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
    maxHeight: "200px",
    overflowY: "auto",
  },
  dropdownOption: {
    padding: "12px 16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
  },
  optionIcon: {
    fontSize: "16px",
    width: "20px",
    textAlign: "center",
    flexShrink: 0,
  },
  optionLabel: {
    fontSize: "14px",
    color: "#ffffff",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  textarea: {
    padding: "14px 16px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
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
    transition: "all 0.3s ease",
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
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)",
  },
  saveIcon: {
    fontSize: "16px",
  },
  loadingSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(26, 26, 26, 0.3)",
    borderTop: "2px solid #1a1a1a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  successMessage: {
    background: "rgba(76, 175, 80, 0.1)",
    border: "1px solid rgba(76, 175, 80, 0.3)",
    color: "#4caf50",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
  },
  errorMessage: {
    background: "rgba(255, 107, 107, 0.1)",
    border: "1px solid rgba(255, 107, 107, 0.3)",
    color: "#ff6b6b",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default AddPatient;
