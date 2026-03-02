import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-10 py-32 grid md:grid-cols-2 gap-24 items-center">

        <div>
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            Smart Academic <br /> Management
          </h1>

          <p className="text-slate-600 text-xl mt-8 max-w-xl">
            Streamline student dues clearance, departmental approvals,
            and semester registration through a secure centralized platform.
          </p>

          <div className="mt-12 flex gap-6">
            <Link
              to="/student-login"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg shadow-md hover:bg-indigo-700 transition"
            >
              Student Login
            </Link>

            <Link
              to="/principal-login"
              className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl text-lg hover:bg-indigo-50 transition"
            >
              Admin Access
            </Link>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-14 border border-slate-200">
          <h3 className="text-2xl font-semibold text-slate-800 mb-8">
            Portal Highlights
          </h3>

          <ul className="space-y-6 text-slate-600 text-lg">
            <li>✔ Department-based clearance workflow</li>
            <li>✔ Hierarchical approval system</li>
            <li>✔ Real-time dues tracking</li>
            <li>✔ Automated semester progression</li>
            <li>✔ Secure role-based access</li>
          </ul>
        </div>

      </section>

      {/* FEATURES */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-10 grid md:grid-cols-3 gap-16">

          <div className="text-center">
            <div className="bg-indigo-100 w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-sm">
              S
            </div>
            <h3 className="text-2xl font-semibold mt-8">Student Portal</h3>
            <p className="text-slate-500 mt-4 text-lg">
              View dues and apply for semester registration.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-green-600 text-3xl font-bold shadow-sm">
              A
            </div>
            <h3 className="text-2xl font-semibold mt-8">Admin Dashboard</h3>
            <p className="text-slate-500 mt-4 text-lg">
              Manage department clearances efficiently.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-purple-600 text-3xl font-bold shadow-sm">
              P
            </div>
            <h3 className="text-2xl font-semibold mt-8">Principal Control</h3>
            <p className="text-slate-500 mt-4 text-lg">
              Full institutional approval & monitoring.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;