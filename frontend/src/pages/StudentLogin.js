import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await loginUser("auth/login", { username, password });

    if (result.token && result.role === "student") {
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      navigate("/student-dashboard");
    } else {
      alert(result.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Student Login</h2>
      <input
        className="w-full border p-2 mb-3"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="w-full border p-2 mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default StudentLogin;