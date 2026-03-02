const API_BASE = "http://localhost:5000/api";

export const loginUser = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    return { message: "Server not reachable" };
  }
};

export const authorizedFetch = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : null,
    });

    return await response.json();
  } catch (error) {
    return { message: "Server error" };
  }
};