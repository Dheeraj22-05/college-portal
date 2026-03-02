import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const DashboardLayout = ({ children }) => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { dark, setDark } = useContext(ThemeContext);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition">

      {/* Sidebar */}
      <div className={`bg-slate-900 dark:bg-black text-white ${open ? "w-64" : "w-20"} transition-all duration-300`}>

        <div className="p-6 font-bold text-xl border-b border-slate-700">
          CET
        </div>

        <div className="flex flex-col mt-6 space-y-4 px-4">

          {/* STUDENT LINKS */}
          {role === "student" && (
            <>
              <Link
                to="/student-dashboard"
                className="hover:bg-slate-700 p-3 rounded-lg"
              >
                Dashboard
              </Link>

              <Link
                to="/student-profile"
                className="hover:bg-slate-700 p-3 rounded-lg"
              >
                Profile
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="hover:bg-slate-700 p-3 rounded-lg"
            >
              Department
            </Link>
          )}

          {/* PRINCIPAL LINKS */}
          {role === "principal" && (
            <Link
              to="/principal-dashboard"
              className="hover:bg-slate-700 p-3 rounded-lg"
            >
              Principal Panel
            </Link>
          )}

          <button
            onClick={logout}
            className="hover:bg-red-600 p-3 rounded-lg text-left mt-6"
          >
            Logout
          </button>

        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white dark:bg-slate-800 shadow-sm px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">
            {role?.toUpperCase()} DASHBOARD
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setDark(!dark)}
              className="bg-slate-200 dark:bg-slate-700 dark:text-white px-4 py-2 rounded-lg transition"
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Toggle Menu
            </button>
          </div>
        </div>

        <div className="p-10">
          {children}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;