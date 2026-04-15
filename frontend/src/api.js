const API_URL = "http://localhost:3001";

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!response.ok) {
      throw new Error(`API failed (${response.status}): ${text}`);
    }
    throw new Error(`API returned invalid JSON: ${text}`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  if (data.body) {
    return typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
  }

  return data;
};