import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentProfile from "./pages/StudentProfile";
import StudentRegistration from "./pages/StudentRegistration";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import PrincipalLogin from "./pages/PrincipalLogin";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}

        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/student-login"
          element={
            <Layout>
              <StudentLogin />
            </Layout>
          }
        />

        <Route
          path="/admin-login"
          element={
            <Layout>
              <AdminLogin />
            </Layout>
          }
        />

        <Route
          path="/principal-login"
          element={
            <Layout>
              <PrincipalLogin />
            </Layout>
          }
        />
{/*---<Route path="/student-dashboard" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />---*/}
<Route path="/student-profile" element={<DashboardLayout><StudentProfile /></DashboardLayout>} />
<Route path="/student-registration" element={<DashboardLayout><StudentRegistration /></DashboardLayout>} />
        {/* ---------- PROTECTED DASHBOARD ROUTES ---------- */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/principal-dashboard"
          element={
            <ProtectedRoute allowedRole="principal">
              <DashboardLayout>
                <PrincipalDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;