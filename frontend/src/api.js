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

  const url = `${API_URL}${endpoint}`;
  console.log(`🚀 Dispatching: ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      if (response.ok) return text;
      throw new Error(`Data format error: ${text.substring(0, 50)}...`);
    }

    if (!response.ok) {
        // 💎 Enhanced Error Mapping
        const errorMsg = data.detail || data.message || data.error || `Request failed (${response.status})`;
        console.error(`❌ API Error [${response.status}]: ${errorMsg}`);
        throw new Error(errorMsg);
    }

    // 🛡️ Robust extraction: Handle Lambda body, results array, or direct array
    let result = data;
    if (data.body) {
      result = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
    } else if (data.results && Array.isArray(data.results)) {
      result = data.results;
    } else if (data.data && Array.isArray(data.data)) {
      result = data.data;
    }

    console.log(`✅ Received [${endpoint}]:`, result);
    return result;

  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
        console.error('🌐 Network Failure. Is the backend at localhost:3001 running?');
        throw new Error('Network failure: Backend unreachable');
    }
    throw err;
  }
};