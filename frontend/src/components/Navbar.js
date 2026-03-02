import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const role = localStorage.getItem("role")?.toLowerCase();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-10 py-5 flex justify-between items-center">

        <div className="text-indigo-600 font-bold text-2xl">
          Portal
        </div>

        <div className="hidden md:flex items-center gap-10 text-slate-700 font-medium text-lg">

          {!token && (
            <>
              <Link to="/">Home</Link>
              <Link to="/student-login">Student</Link>
              <Link to="/admin-login">Admin</Link>
              <Link to="/principal-login">Principal</Link>
            </>
          )}

          {token && (
            <>
              {role === "student" && (
                <Link to="/student-dashboard">Dashboard</Link>
              )}

              {role === "admin" && (
                <Link to="/admin-dashboard">Department</Link>
              )}

              {role === "principal" && (
                <Link to="/principal-dashboard">Principal</Link>
              )}

              {/* 🔔 Notification Bell */}
              <NotificationBell />

              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          )}

        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>
    </nav>
  );
};

export default Navbar;