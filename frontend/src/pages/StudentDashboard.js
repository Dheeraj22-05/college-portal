import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorizedFetch } from "../utils/api";
import jsPDF from "jspdf";

const StudentDashboard = () => {

  const [dues, setDues] = useState([]);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const duesResult = await authorizedFetch("dues/view");
      const profileResult = await authorizedFetch("students/profile");
      const historyResult = await authorizedFetch("dues/history");

      setDues(duesResult || []);
      setProfile(profileResult || null);
      setHistory(historyResult || []);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  const downloadReceipt = (due) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("COLLEGE MANAGEMENT SYSTEM", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("College of Engineering Trikkaripur", 105, 28, { align: "center" });

    doc.line(20, 40, 190, 40);

    doc.setFontSize(14);
    doc.text("Fee Clearance Receipt", 20, 55);

    doc.setFontSize(12);
    doc.text(`Student Name: ${profile?.name}`, 20, 70);
    doc.text(`Register No: ${profile?.reg_no}`, 20, 80);
    doc.text(`Department: ${profile?.department}`, 20, 90);
    doc.text(`Semester: ${profile?.current_semester}`, 20, 100);

    doc.line(20, 110, 190, 110);

    doc.text(`Department: ${due.department}`, 20, 125);
    doc.text(`Amount: ₹${due.amount}`, 20, 135);
    doc.text(`Payment Mode: ${due.payment_mode}`, 20, 145);
    doc.text(`Status: ${due.status}`, 20, 155);

    doc.save(`Receipt_${due.department}.pdf`);
  };

  const hasPending = dues.some(d => d.status === "pending");
  const status = profile?.registration_status;

  return (
    <div>

      <h2 className="text-4xl font-bold mb-8 dark:text-white">
        My Current Semester Dues
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto mb-8">

        <table className="w-full text-left text-slate-800 dark:text-white">

          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-4">Department</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {dues.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No dues available.
                </td>
              </tr>
            )}

            {dues.map((d) => (
              <tr key={d.id} className="border-b dark:border-slate-600">

                <td className="p-4">{d.department}</td>
                <td>₹{d.amount}</td>

                <td className="font-semibold text-yellow-400">
                  {d.payment_mode}
                </td>

                <td className={
                  d.status === "cleared"
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }>
                  {d.amount === 0 ? "No Dues" : d.status}
                </td>

                <td>
                  {d.amount === 0 ? (
                    <span className="text-green-500">✓</span>
                  ) : d.status === "cleared" ? (
                    <button
                      onClick={() => downloadReceipt(d)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      Receipt
                    </button>
                  ) : (
                    <span className="text-red-500">
                      Pending - Contact Admin
                    </span>
                  )}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {!hasPending && status === "not_registered" && (
        <button
          onClick={() => navigate("/student-registration")}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Apply for Semester Registration
        </button>
      )}

      {status === "pending_approval" && (
        <div className="text-yellow-500 mt-4">
          Waiting for principal approval.
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {showHistory ? "Hide History" : "View History"}
        </button>

        {showHistory && (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded shadow p-4">
            {history.map((h, index) => (
              <div key={index} className="border-b py-2">
                Semester {h.semester} - {h.department} - ₹{h.amount} - {h.status}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDashboard;