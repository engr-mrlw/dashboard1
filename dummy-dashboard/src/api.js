import axios from "axios";

const API_BASE = "http://localhost:8000";

export const fetchToken = async () => {
  const res = await axios.get(`${API_BASE}/api/token`);
  return res.data;
};

export const fetchDashboard = async () => {
  const res = await axios.get(`${API_BASE}/api/dashboard`);
  return res.data;
};

