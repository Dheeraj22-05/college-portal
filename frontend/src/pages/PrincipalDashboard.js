import { useEffect, useState, useMemo } from "react";
import { authorizedFetch } from "../utils/api";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const PrincipalDashboard = () => {

  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await authorizedFetch("students");
    if (Array.isArray(data)) setStudents(data);
  };

  const isDark = document.documentElement.classList.contains("dark");
  const chartTextColor = isDark ? "#ffffff" : "#374151";

  // ================= ANALYTICS =================

  const totalStudents = students.length;

  const pendingApprovals = students.filter(
    s => s.registration_status === "pending_approval"
  ).length;

  const notRegistered = students.filter(
    s => s.registration_status === "not_registered"
  ).length;

  const graduated = students.filter(
    s => s.current_semester === 8 &&
    s.registration_status === "not_registered"
  ).length;

  const departmentStats = useMemo(() => {
    const map = {};
    students.forEach(s => {
      map[s.department] = (map[s.department] || 0) + 1;
    });
    return map;
  }, [students]);

  const semesterStats = useMemo(() => {
    const map = {};
    students.forEach(s => {
      map[s.current_semester] =
        (map[s.current_semester] || 0) + 1;
    });
    return map;
  }, [students]);

  const registrationStats = useMemo(() => {
    const map = {};
    students.forEach(s => {
      map[s.registration_status] =
        (map[s.registration_status] || 0) + 1;
    });
    return map;
  }, [students]);

  // ================= FILTER =================

  const pending = students.filter(
    s => s.registration_status === "pending_approval"
  );

  const filteredStudents = students.filter(s =>
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.reg_no?.toLowerCase().includes(search.toLowerCase())) &&
    (departmentFilter ? s.department === departmentFilter : true) &&
    (semesterFilter ? Number(s.current_semester) === Number(semesterFilter) : true)
  );

  const filteredApprovals = pending.filter(s =>
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.reg_no?.toLowerCase().includes(search.toLowerCase())) &&
    (departmentFilter ? s.department === departmentFilter : true) &&
    (semesterFilter ? Number(s.current_semester) === Number(semesterFilter) : true)
  );

  // ================= APPROVAL =================

  const approve = async (id) => {
    await authorizedFetch(`registration/approve/${id}`, "PUT");
    fetchStudents();
  };

  const approveAll = async () => {
    const ids = filteredApprovals.map(s => s.id);
    if (!ids.length) return;

    await authorizedFetch("registration/approve-all", "PUT", {
      studentIds: ids
    });

    fetchStudents();
  };

  return (
    <div>

      <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        Principal Student Analytics Dashboard
      </h2>

      {/* ================= TABS ================= */}
      <div className="flex gap-6 mb-8 flex-wrap">
        {["overview", "students", "approvals"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-slate-700 dark:text-white"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-10">

          <div className="grid md:grid-cols-4 gap-6">
            <SummaryCard title="Total Students" value={totalStudents} color="bg-indigo-600" />
            <SummaryCard title="Pending Approvals" value={pendingApprovals} color="bg-yellow-600" />
            <SummaryCard title="Eligible for Registration" value={notRegistered} color="bg-green-600" />
            <SummaryCard title="Graduated (Sem 8)" value={graduated} color="bg-gray-800" />
          </div>

          <ChartCard title="Department Distribution">
  <div className="h-72 flex justify-center items-center">
    <Pie
      data={{
        labels: Object.keys(departmentStats),
        datasets: [{
          data: Object.values(departmentStats),
          backgroundColor: [
            "#6366F1","#10B981","#F59E0B",
            "#EF4444","#3B82F6","#8B5CF6"
          ]
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: chartTextColor }
          }
        }
      }}
    />
  </div>
</ChartCard>

          <ChartCard title="Semester Distribution">
            <Bar
              data={{
                labels: Object.keys(semesterStats).map(s => "Sem " + s),
                datasets: [{
                  label: "Students",
                  data: Object.values(semesterStats),
                  backgroundColor: "#6366F1"
                }]
              }}
              options={{
                plugins: { legend: { labels: { color: chartTextColor } } },
                scales: {
                  x: { ticks: { color: chartTextColor } },
                  y: { ticks: { color: chartTextColor } }
                }
              }}
            />
          </ChartCard>

          <ChartCard title="Registration Status Analysis">
            <Bar
              data={{
                labels: Object.keys(registrationStats),
                datasets: [{
                  label: "Count",
                  data: Object.values(registrationStats),
                  backgroundColor: "#10B981"
                }]
              }}
              options={{
                plugins: { legend: { labels: { color: chartTextColor } } },
                scales: {
                  x: { ticks: { color: chartTextColor } },
                  y: { ticks: { color: chartTextColor } }
                }
              }}
            />
          </ChartCard>

        </div>
      )}

      {/* ================= FILTER PANEL ================= */}
      {(activeTab === "students" || activeTab === "approvals") && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-6 flex flex-wrap gap-4">

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-60"
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Departments</option>
            <option>CS</option>
            <option>DS</option>
            <option>AI</option>
            <option>EEE</option>
            <option>EC</option>
            <option>ME</option>
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s =>
              <option key={s} value={s}>{s}</option>
            )}
          </select>

          {activeTab === "approvals" && (
            <button
              onClick={approveAll}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Approve All (Filtered)
            </button>
          )}
        </div>
      )}

      {/* ================= STUDENTS ================= */}
      {activeTab === "students" && (
        <Table data={filteredStudents} />
      )}

      {/* ================= APPROVALS ================= */}
      {activeTab === "approvals" && (
        <ApprovalTable data={filteredApprovals} approve={approve} />
      )}

    </div>
  );
};

const SummaryCard = ({ title, value, color }) => (
  <div className={`${color} text-white p-6 rounded-xl shadow`}>
    <h3>{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
    <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">
      {title}
    </h3>
    {children}
  </div>
);

const Table = ({ data }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto">
    <table className="w-full text-left dark:text-white">
      <thead className="bg-slate-100 dark:bg-slate-700">
        <tr>
          <th className="p-4">Name</th>
          <th>Reg No</th>
          <th>Dept</th>
          <th>Semester</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(s => (
          <tr key={s.id}>
            <td className="p-4">{s.name}</td>
            <td>{s.reg_no}</td>
            <td>{s.department}</td>
            <td>{s.current_semester}</td>
            <td>{s.registration_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ApprovalTable = ({ data, approve }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto">
    <table className="w-full text-left dark:text-white">
      <thead className="bg-slate-100 dark:bg-slate-700">
        <tr>
          <th className="p-4">Name</th>
          <th>Reg No</th>
          <th>Dept</th>
          <th>Semester</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(s => (
          <tr key={s.id}>
            <td className="p-4">{s.name}</td>
            <td>{s.reg_no}</td>
            <td>{s.department}</td>
            <td>{s.current_semester}</td>
            <td>
              <button
                onClick={() => approve(s.id)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                Approve
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PrincipalDashboard;