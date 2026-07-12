const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const api = async (path, options = {}) => {
  const token = localStorage.getItem("disaster_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || "Request failed", response.status);
  }
  return data;
};

export const postJson = (path, body) =>
  api(path, { method: "POST", body: JSON.stringify(body) });

export const patchJson = (path, body) =>
  api(path, { method: "PATCH", body: JSON.stringify(body) });
