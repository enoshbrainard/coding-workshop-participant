import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables to get the API endpoints
  const env = loadEnv(mode, process.cwd(), '');
  let endpoints = {};
  try {
    endpoints = JSON.parse(env.VITE_API_ENDPOINTS || '{}');
  } catch (e) {
    console.warn("Could not parse VITE_API_ENDPOINTS, proxy may not work.");
  }

  const proxyConfig = {};
  Object.keys(endpoints).forEach(name => {
    proxyConfig[`/api/${name}`] = {
      target: endpoints[name],
      changeOrigin: true,
      // Rewrite to strip the /api/{service} part so the backend gets the sub-path
      rewrite: (path) => path.replace(new RegExp(`^/api/${name}`), '')
    };
  });

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: proxyConfig
    }
  }
})
