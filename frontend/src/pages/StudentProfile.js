import { useEffect, useState } from "react";
import { authorizedFetch } from "../utils/api";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const data = await authorizedFetch("students/profile");
    setProfile(data);
  };

  if (!profile) return <div className="dark:text-white">Loading...</div>;

  return (
    <div>

      <h2 className="text-4xl font-bold mb-8 dark:text-white">
        Student Profile
      </h2>

      {/* FIXED DARK MODE TEXT */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow max-w-3xl text-slate-800 dark:text-white">

        <div className="grid grid-cols-2 gap-6 text-lg">

          <div>
            <strong className="block text-slate-600 dark:text-slate-300">
              Name
            </strong>
            <p className="mt-1 font-medium">{profile.name}</p>
          </div>

          <div>
            <strong className="block text-slate-600 dark:text-slate-300">
              Register Number
            </strong>
            <p className="mt-1 font-medium">{profile.reg_no}</p>
          </div>

          <div>
            <strong className="block text-slate-600 dark:text-slate-300">
              Department
            </strong>
            <p className="mt-1 font-medium">{profile.department}</p>
          </div>

          <div>
            <strong className="block text-slate-600 dark:text-slate-300">
              Current Semester
            </strong>
            <p className="mt-1 font-medium">
              Semester {profile.current_semester}
            </p>
          </div>

          <div>
            <strong className="block text-slate-600 dark:text-slate-300">
              Registration Status
            </strong>
            <p
              className={`mt-1 font-semibold ${
                profile.registration_status === "registered"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {profile.registration_status}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentProfile;