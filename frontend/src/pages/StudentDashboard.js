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

      setDues(Array.isArray(duesResult) ? duesResult : []);
      setProfile(profileResult || null);
      setHistory(Array.isArray(historyResult) ? historyResult : []);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setDues([]);
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
    doc.text(`Payment Mode: ${due.payment_mode || "-"}`, 20, 145);
    doc.text(`Status: ${due.status}`, 20, 155);

    doc.save(`Receipt_${due.department}.pdf`);
  };

  // Registration allowed only if NO pending dues
  const hasPending = dues.some(d => d.status === "pending");
  const registrationStatus = profile?.registration_status;

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
  {d.status === "no_dues"
    ? "-"
    : d.payment_mode === "online"
    ? "Online"
    : d.payment_mode === "offline"
    ? "Offline"
    : "-"}
</td>
                <td
                  className={
                    d.status === "cleared" || d.status === "no_dues"
                      ? "text-green-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {d.status === "no_dues" ? "No Dues" : d.status}
                </td>

                <td>
                  {d.status === "no_dues" ? (
                    <span className="text-green-500 font-semibold">
                      ✓ No Dues
                    </span>

                  ) : d.status === "cleared" ? (
                    <button
                      onClick={() => downloadReceipt(d)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                    >
                      Receipt
                    </button>

                  ) : (
                    <button
  onClick={async () => {
    try {
      console.log("Sending request for:", d.id);

      const response = await fetch("http://localhost:5000/api/dues/pay-online", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ due_id: d.id })
      });

      const data = await response.json();
      console.log("Server response:", data);

      fetchData();

    } catch (err) {
      console.error("Payment error:", err);
    }
  }}
  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
>
  Pay Online
</button>
                  )}
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {!hasPending && registrationStatus === "not_registered" && (
        <button
          onClick={() => navigate("/student-registration")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Apply for Semester Registration
        </button>
      )}

      {registrationStatus === "pending_approval" && (
        <div className="text-yellow-500 mt-4">
          Waiting for principal approval.
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
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