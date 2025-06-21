import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/white logo.png";

const Login = () => {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.loginWrapper}>
        <div style={styles.leftSection}>
          <div style={styles.brandSection}>
            <div style={styles.logoContainer}>
              <img src={logo} alt="Relief Physiotherapy Logo" style={styles.logoImage} />
            </div>
            <h1 style={styles.brandTitle}>Relief Physiotherapy</h1>
            <h2 style={styles.brandSubtitle}>Clinic Management System</h2>
            <p style={styles.brandDescription}>
              Professional healthcare management platform for modern physiotherapy clinics.
              Streamline patient care, appointments, and medical records with ease.
            </p>
            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🏥</span>
                <span style={styles.featureText}>Patient Management</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>📋</span>
                <span style={styles.featureText}>Treatment Records</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🔒</span>
                <span style={styles.featureText}>Secure Access</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.rightSection}>
          <div style={styles.loginCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.loginTitle}>Welcome Back</h2>
              <p style={styles.loginSubtitle}>Sign in to your account</p>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              {error && <p style={styles.error}>{error}</p>}
              
              <button type="submit" style={styles.loginButton}>
                <span style={styles.buttonText}>Sign In</span>
                <span style={styles.buttonIcon}>→</span>
              </button>
            </form>
            
            <div style={styles.footer}>
              <p style={styles.footerText}>Secure access to patient management system</p>
              <div style={styles.securityBadge}>
                <span style={styles.securityIcon}>🛡️</span>
                <span style={styles.securityText}>SSL Encrypted</span>
              </div>
            </div>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  loginWrapper: {
    width: "90%",
    maxWidth: "1200px",
    display: "flex",
    background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
    overflow: "hidden",
    minHeight: "600px",
  },
  leftSection: {
    flex: "1",
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    padding: "60px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  brandSection: {
    textAlign: "center",
    color: "#1a1a1a",
  },
  logoContainer: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 30px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    padding: "20px",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  brandTitle: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    letterSpacing: "1px",
  },
  brandSubtitle: {
    fontSize: "20px",
    fontWeight: "500",
    margin: "0 0 24px 0",
    opacity: "0.8",
  },
  brandDescription: {
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    opacity: "0.9",
    maxWidth: "400px",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
    fontWeight: "500",
  },
  featureIcon: {
    fontSize: "20px",
  },
  featureText: {
    fontSize: "16px",
  },
  rightSection: {
    flex: "1",
    padding: "60px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginCard: {
    width: "100%",
    maxWidth: "400px",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  loginTitle: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#d4af37",
    margin: "0 0 8px 0",
    letterSpacing: "0.5px",
  },
  loginSubtitle: {
    fontSize: "16px",
    color: "#888",
    margin: "0",
    fontWeight: "300",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#d4af37",
    letterSpacing: "0.5px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "16px",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "18px 20px 18px 50px",
    border: "2px solid rgba(212, 175, 55, 0.2)",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#ffffff",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
  },
  loginButton: {
    background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
    border: "none",
    borderRadius: "12px",
    padding: "18px 24px",
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginTop: "8px",
    boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)",
  },
  buttonText: {
    fontSize: "16px",
    fontWeight: "600",
  },
  buttonIcon: {
    fontSize: "18px",
    transition: "transform 0.3s ease",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "14px",
    textAlign: "center",
    margin: "0",
    padding: "12px 16px",
    background: "rgba(255, 107, 107, 0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(255, 107, 107, 0.2)",
  },
  footer: {
    textAlign: "center",
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(212, 175, 55, 0.1)",
  },
  footerText: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 12px 0",
    fontWeight: "300",
  },
  securityBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#d4af37",
    fontWeight: "500",
  },
  securityIcon: {
    fontSize: "14px",
  },
  securityText: {
    fontSize: "12px",
  },
};

export default Login;
