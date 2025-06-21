import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUniquePatients: 0,
    totalVisits: 0,
    totalFees: 0,
  });

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30); // Default to 30 days ago
    return d.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/patients/analytics?startDate=${startDate}&endDate=${endDate}`);
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      // Handle error display if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []); // Fetch on initial load

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Clinic Analytics</h1>
          <p style={styles.subtitle}>Measure your clinic's performance over time.</p>
        </div>

        <div style={styles.dateRangePicker}>
          <div>
            <label style={styles.dateLabel}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.dateInput} />
          </div>
          <div>
            <label style={styles.dateLabel}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.dateInput} />
          </div>
          <button onClick={fetchAnalytics} style={styles.fetchButton} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2 style={styles.statValue}>{stats.totalUniquePatients}</h2>
            <p style={styles.statLabel}>Unique Patients</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statValue}>{stats.totalVisits}</h2>
            <p style={styles.statLabel}>Total Visits</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statValue}>₹{stats.totalFees.toLocaleString('en-IN')}</h2>
            <p style={styles.statLabel}>Total Fees Collected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// You can create a new styles object for this page
const styles = {
    container: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontSize: "32px", color: "#d4af37", margin: '0 0 8px 0' },
    subtitle: { fontSize: "16px", color: "#888", margin: '0' },
    dateRangePicker: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', marginBottom: '40px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' },
    dateLabel: { color: '#d4af37', display: 'block', marginBottom: '8px' },
    dateInput: { padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid #d4af37", borderRadius: "12px", color: "#fff", fontSize: "16px" },
    fetchButton: { padding: '12px 24px', background: '#d4af37', border: 'none', borderRadius: '12px', color: '#1a1a1a', fontWeight: 'bold', cursor: 'pointer', height: '54px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' },
    statCard: { background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)", padding: '30px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(212, 175, 55, 0.1)' },
    statValue: { fontSize: '40px', color: '#d4af37', margin: '0 0 10px 0' },
    statLabel: { fontSize: '16px', color: '#888', margin: '0' },
};

export default Analytics; 