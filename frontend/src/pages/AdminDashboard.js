import { useEffect, useState } from "react";
import { authorizedFetch } from "../utils/api";

const AdminDashboard = () => {
  const [dues, setDues] = useState([]);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await authorizedFetch("dues/view");
    setDues(data);
  };

  const clearDue = async (id) => {
    await authorizedFetch("dues/clear", "PUT", { due_id: id });
    fetchData();
  };

  const filtered = dues
    .filter(d =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.reg_no?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(d =>
      semester ? Number(d.current_semester) === Number(semester) : true
    )
    .filter(d =>
      status ? d.status === status : true
    );

  const total = filtered.length;
  const pending = filtered.filter(d => d.status === "pending").length;
  const cleared = filtered.filter(d => d.status === "cleared").length;

  return (
    <div className="text-gray-800 dark:text-gray-100">

      {/* TITLE */}
      <h2 className="text-4xl font-bold mb-8">
        Department Clearance Panel
      </h2>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 text-white p-6 rounded-xl shadow">
          <p>Total Records</p>
          <h3 className="text-3xl font-bold">{total}</h3>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-xl shadow">
          <p>Pending</p>
          <h3 className="text-3xl font-bold">{pending}</h3>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <p>Cleared</p>
          <h3 className="text-3xl font-bold">{cleared}</h3>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8 flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search name or register number..."
          className="px-4 py-2 border rounded-lg flex-1 
                     bg-white dark:bg-slate-700 
                     text-gray-800 dark:text-white 
                     border-gray-300 dark:border-slate-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg 
                     bg-white dark:bg-slate-700 
                     text-gray-800 dark:text-white 
                     border-gray-300 dark:border-slate-600"
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="">All Semesters</option>
          <option value="1">Sem 1</option>
          <option value="3">Sem 3</option>
          <option value="5">Sem 5</option>
          <option value="7">Sem 7</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg 
                     bg-white dark:bg-slate-700 
                     text-gray-800 dark:text-white 
                     border-gray-300 dark:border-slate-600"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="cleared">Cleared</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left text-gray-800 dark:text-gray-100">

          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-4">Name</th>
              <th>Reg No</th>
              <th>Student Dept</th>
              <th>Semester</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr
                key={d.id}
                className="border-b border-gray-200 dark:border-slate-700 
                           hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <td className="p-4 font-medium">{d.name}</td>
                <td>{d.reg_no}</td>
                <td>{d.student_department}</td>
                <td>Sem {d.current_semester}</td>
                <td>₹{d.amount}</td>

               <td>
  <span className={
    d.payment_mode === "online"
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : d.payment_mode === "offline"
      ? "text-orange-500 dark:text-orange-400 font-semibold"
      : "text-gray-400"
  }>
    {d.payment_mode === "online"
      ? "Online"
      : d.payment_mode === "offline"
      ? "Offline"
      : "-"}
  </span>
</td>

                <td>
                  <span className={
                    d.status === "cleared"
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : "text-red-500 dark:text-red-400 font-semibold"
                  }>
                    {d.status}
                  </span>
                </td>

                <td>
                  {d.status === "pending" ? (
                    <button
                      onClick={() => clearDue(d.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminDashboard;