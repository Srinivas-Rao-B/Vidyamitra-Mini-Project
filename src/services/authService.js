// src/services/authService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }
  return res.json();
};

export const logout = () => {
  console.log("User logged out (frontend only)");
};
