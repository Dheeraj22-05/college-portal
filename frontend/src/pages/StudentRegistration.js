import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorizedFetch } from "../utils/api";

const StudentRegistration = () => {

  const [profile, setProfile] = useState(null);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      const profileData = await authorizedFetch("students/profile");
      const duesData = await authorizedFetch("dues/view");

      setProfile(profileData);

      const hasPending = duesData.some(d => d.status === "pending");

      // Redirect if pending dues
      if (hasPending) {
        navigate("/student-dashboard");
      }
    };

    fetchData();

  }, [navigate]);

  const applyRegistration = async () => {

    if (!verified) {
      setMessage("Please verify your details before applying.");
      return;
    }

    const response = await authorizedFetch("registration/apply", "PUT");

    if (response.message) {
      setMessage(response.message);
    }
  };

  if (!profile) return <div>Loading...</div>;

  const nextSemester = profile.current_semester + 1;

  return (
    <div>

      <h2 className="text-4xl font-bold mb-8 dark:text-white">
        Semester Registration
      </h2>

      {message && (
        <div className="mb-6 p-4 bg-indigo-100 text-indigo-700 rounded">
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow max-w-4xl mb-8">

        <div className="grid grid-cols-2 gap-6 text-lg">

          <div><strong>Name:</strong><p>{profile.name}</p></div>
          <div><strong>Register Number:</strong><p>{profile.reg_no}</p></div>
          <div><strong>Department:</strong><p>{profile.department}</p></div>
          <div><strong>Current Semester:</strong><p>Semester {profile.current_semester}</p></div>
          <div><strong>Next Semester:</strong><p>Semester {nextSemester}</p></div>
          <div><strong>Registration Status:</strong><p>{profile.registration_status}</p></div>

        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={verified}
            onChange={() => setVerified(!verified)}
          />
          <span>I verify that all my details are correct.</span>
        </div>

      </div>

      <button
        disabled={!verified}
        onClick={applyRegistration}
        className={`px-6 py-2 rounded-lg text-white ${
          verified
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Confirm & Apply for Registration
      </button>

    </div>
  );
};

export default StudentRegistration;