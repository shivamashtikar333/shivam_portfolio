import axios from "axios";

const defaultBackendUrl = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";
const backendUrl = (process.env.REACT_APP_BACKEND_URL || defaultBackendUrl).replace(/\/$/, "");

export const portfolioApi = axios.create({
  baseURL: `${backendUrl}/api`,
  timeout: 12000,
});

export const adminApi = (token) => axios.create({
  baseURL: `${backendUrl}/api/admin`,
  timeout: 12000,
  headers: { Authorization: `Bearer ${token}` },
});
