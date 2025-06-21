import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import PatientDetails from "./pages/PatientDetails";
import RevisitPatient from "./pages/RevisitPatient";
import EditPatient from "./pages/EditPatient";
import EditVisit from "./pages/EditVisit";
import Appointments from "./pages/Appointments";
import Analytics from "./pages/Analytics";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router basename="/ReliefPC-Frontend"> {/* 👈 This is the important change */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revisit/:id"
          element={
            <ProtectedRoute>
              <RevisitPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-patient/:id"
          element={
            <ProtectedRoute>
              <EditPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-visit/:visitId"
          element={
            <ProtectedRoute>
              <EditVisit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
