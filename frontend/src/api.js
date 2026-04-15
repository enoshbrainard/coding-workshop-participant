const API_URL = "http://localhost:3001";

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // ❌ if error
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  // 🔥 THIS LINE FIXES EVERYTHING
  if (data.body) {
    return JSON.parse(data.body);
  }

  return data;
};