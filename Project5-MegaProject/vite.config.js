import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // S3 static hosting root
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
      rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          aws: ['amazon-cognito-identity-js', 'axios']
        }
      }
    }
  },
  server: {
    proxy: {
      '/__proxy/alzheimer-predictor': {
        target: 'ENTER_YOUR_API_GATEWAY_URL_HERE', // e.g., https://your-api-id.execute-api.region.amazonaws.com
        changeOrigin: true,
        secure: true,
        rewrite: () => '/prod/alzheimer-predictor'
      },
      '/api': {
        target: 'ENTER_YOUR_API_GATEWAY_URL_HERE', // e.g., https://your-api-id.execute-api.region.amazonaws.com
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod')
      }
    }
  },
  define: {
    global: 'globalThis'
  }
});