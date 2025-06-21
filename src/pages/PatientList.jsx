import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const navigate = useNavigate();

  // Refs for dropdown containers
  const genderDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const genderOptions = [
    { value: "", label: "All Genders ", icon: "👥" },
    { value: "Male", label: "Male ", icon: "👨" },
    { value: "Female", label: "Female ", icon: "👩" },
    { value: "Other", label: "Other ", icon: "👤" },
  ];

  const sortOptions = [
    { value: "asc", label: "Visit Date ↑", icon: "📅" },
    { value: "desc", label: "Visit Date ↓", icon: "📅" },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setShowGenderDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/patients");
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (gender) => {
    setGenderFilter(gender);
    setShowGenderDropdown(false);
  };

  const handleSortSelect = (sort) => {
    setSortOrder(sort);
    setShowSortDropdown(false);
  };

  const filteredPatients = patients
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!genderFilter || p.gender === genderFilter)
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.visitDate) - new Date(b.visitDate)
        : new Date(b.visitDate) - new Date(a.visitDate)
    );

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.titleSection}>
              <h1 style={styles.title}>Patient Management</h1>
              <p style={styles.subtitle}>Manage and view all patient records</p>
            </div>
            <div style={styles.statsSection}>
              <div style={styles.statCard}>
                <span style={styles.statNumber}>{patients.length}</span>
                <span style={styles.statLabel}>Total Patients</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statNumber}>{filteredPatients.length}</span>
                <span style={styles.statLabel}>Filtered</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.filtersSection}>
            <div style={styles.searchBox}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search patients by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            
            <div style={styles.filterControls}>
              <div style={styles.customDropdown} ref={genderDropdownRef}>
                <div 
                  style={styles.dropdownHeader}
                  onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <span style={styles.dropdownValue}>
                    {genderFilter ? (
                      <span style={styles.optionLabel}>
                        {genderOptions.find(opt => opt.value === genderFilter)?.label}{" "}
                        <span style={styles.optionIcon}>
                          {genderOptions.find(opt => opt.value === genderFilter)?.icon}
                        </span>
                      </span>
                    ) : (
                      <span style={styles.optionLabel}>
                        All Genders <span style={styles.optionIcon}>👥</span>
                      </span>
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
                        <span style={styles.optionLabel}>
                          {option.label} <span style={styles.optionIcon}>{option.icon}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                style={{
                  background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  color: "#1a1a1a",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Visit Date {sortOrder === "desc" ? "↓" : "↑"}
              </button>
              
              <button 
                onClick={() => navigate("/add-patient")}
                style={styles.addButton}
              >
                <span style={styles.addIcon}>+</span>
                Add Patient
              </button>
            </div>
          </div>

          <div style={styles.tableContainer}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📋</span>
                <h3 style={styles.emptyTitle}>No patients found</h3>
                <p style={styles.emptyText}>
                  {patients.length === 0 
                    ? "No patients have been added yet." 
                    : "No patients match your current filters."
                  }
                </p>
                {patients.length === 0 && (
                  <button 
                    onClick={() => navigate("/add-patient")}
                    style={styles.emptyAddButton}
                  >
                    Add Your First Patient
                  </button>
                )}
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableHeaderCell}>Patient Name</th>
                      <th
                        style={{ ...styles.tableHeaderCell, cursor: "pointer", userSelect: "none" }}
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        title="Sort by Visit Date"
                      >
                        Last Visit Date{" "}
                        <span style={{ fontSize: "14px" }}>
                          {sortOrder === "desc" ? "↓" : "↑"}
                        </span>
                      </th>
                      <th style={styles.tableHeaderCell}>Total Visits</th>
                      <th style={styles.tableHeaderCell}>Condition</th>
                      <th style={styles.tableHeaderCell}>Gender</th>
                      <th style={styles.tableHeaderCell}>Age</th>
                      <th style={styles.tableHeaderCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr 
                        key={patient._id} 
                        style={hoveredRowId === patient._id ? {...styles.tableRow, ...styles.tableRowHover} : styles.tableRow}
                        onMouseEnter={() => setHoveredRowId(patient._id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        onClick={() => navigate(`/details/${patient._id}`)}
                      >
                        <td style={styles.tableCell}>
                          <div style={styles.patientName}>
                            <span style={styles.nameText}>{patient.name}</span>
                            {patient.email && (
                              <span style={styles.emailText}>{patient.email}</span>
                            )}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.dateText}>
                            {new Date(patient.visitDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.totalVisitsBadge}>
                            {patient.totalVisits}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.conditionText}>
                            {patient.condition && patient.condition.length > 40 
                              ? `${patient.condition.substring(0, 40)}...` 
                              : patient.condition
                            }
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.genderBadge}>
                            {patient.gender}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.ageText}>{patient.age} years</span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/details/${patient._id}`);
                              }}
                              style={styles.viewButton}
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-patient/${patient._id}`);
                              }}
                              style={styles.editButton}
                            >
                              ✏️ Edit Info
                            </button>
                          </div>
                        </td>
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
  statsSection: {
    display: "flex",
    gap: "20px",
  },
  statCard: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    padding: "20px 24px",
    borderRadius: "12px",
    textAlign: "center",
    minWidth: "120px",
    boxShadow: "0 8px 20px rgba(212, 175, 55, 0.2)",
  },
  statNumber: {
    display: "block",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#1a1a1a",
    fontWeight: "500",
  },
  content: {
    width: "90%",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  filtersSection: {
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchBox: {
    position: "relative",
    flex: "1",
    minWidth: "300px",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    color: "#888",
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    padding: "14px 20px 14px 50px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
  },
  filterControls: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  customDropdown: {
    position: "relative",
    width: "auto",
  },
  dropdownHeader: {
    padding: "14px 16px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "140px",
    flexShrink: 0,
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
  addButton: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "14px 20px",
    color: "#1a1a1a",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  addIcon: {
    fontSize: "18px",
    fontWeight: "bold",
  },
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
  loadingText: {
    color: "#888",
    marginTop: "16px",
    fontSize: "16px",
  },
  emptyState: {
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
  emptyTitle: {
    fontSize: "24px",
    color: "#d4af37",
    margin: "0 0 8px 0",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: "16px",
    color: "#888",
    margin: "0 0 24px 0",
  },
  emptyAddButton: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "16px 24px",
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
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
  },
  tableRow: {
    borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
    transition: "background 0.2s ease-in-out",
    cursor: "pointer",
  },
  tableRowHover: {
    background: "rgba(212, 175, 55, 0.05)",
  },
  tableCell: {
    padding: "16px 20px",
    color: "#ffffff",
    fontSize: "14px",
  },
  patientName: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  nameText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
  },
  emailText: {
    fontSize: "12px",
    color: "#888",
  },
  dateText: {
    fontSize: "14px",
    color: "#ffffff",
  },
  conditionText: {
    fontSize: "14px",
    color: "#cccccc",
    maxWidth: "200px",
  },
  totalVisitsBadge: {
    background: "rgba(142, 68, 173, 0.2)",
    color: "#8e44ad",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: 'inline-block',
    minWidth: '20px',
    textAlign: 'center'
  },
  genderBadge: {
    background: "rgba(212, 175, 55, 0.2)",
    color: "#d4af37",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  ageText: {
    fontSize: "14px",
    color: "#ffffff",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  viewButton: {
    background: "rgba(212, 175, 55, 0.2)",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#d4af37",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  editButton: {
    background: "rgba(52, 152, 219, 0.2)",
    border: "1px solid rgba(52, 152, 219, 0.3)",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#3498db",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default PatientList;
