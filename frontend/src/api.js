const API_URL = "/api";

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
      const errorMsg = data.detail || data.message || data.error || `Request failed (${response.status})`;
      console.error(`❌ API Error [${response.status}]: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // 🛡️ Super-Robust Extraction
    let result = data;

    // 1. Handle Lambda/Gateway 'body' wrapper
    if (data.body) {
      result = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
    }

    // 2. If result is STILL an object, try to find a list inside it
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      // Look for common list keys: 'teams', 'members', 'achievements', 'results', 'data'
      const possibleList = result.teams || result.members || result.achievements || result.results || result.data || result.analytics;
      if (Array.isArray(possibleList)) {
        result = possibleList;
      }
    }

    console.log(`✅ Received [${endpoint}]:`, result);
    return result;

  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Network failure: Backend unreachable at ${url}`);
    }
    throw err;
  }
};