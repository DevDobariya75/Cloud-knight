# Setting Up Vite Proxy with AWS API Gateway

When connecting your frontend to the AWS backend, you need to route API requests through a proxy to avoid CORS issues and correctly target your AWS API Gateway.

## Configuration Steps

1. Get your **Invoke URL** from your deployed AWS API Gateway. It should look something like this:
   `https://<your-api-id>.execute-api.<region>.amazonaws.com`

2. Open the `vite.config.js` file in the root of your project.

3. Locate the `server.proxy` configuration and replace the placeholder `'ENTER_YOUR_API_GATEWAY_URL_HERE'` with your actual API Gateway URL for both proxy paths.

### Example `vite.config.js` Configuration:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  // ... other configs
  server: {
    proxy: {
      // 1. Proxy for Alzheimer Predictor specific endpoints
      '/__proxy/alzheimer-predictor': {
        target: 'https://<your-api-id>.execute-api.<region>.amazonaws.com', // Replace with your URL
        changeOrigin: true,
        secure: true,
        rewrite: () => '/prod/alzheimer-predictor'
      },
      // 2. Proxy for general API endpoints
      '/api': {
        target: 'https://<your-api-id>.execute-api.<region>.amazonaws.com', // Replace with your URL
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
```

## How It Works:
* **`/__proxy/alzheimer-predictor`**: Any frontend request made to this path will be automatically forwarded to `https://<your-api-url>/prod/alzheimer-predictor`.
* **`/api`**: Any frontend request starting with `/api` will be forwarded and rewritten to `https://<your-api-url>/prod`.
* **`changeOrigin: true`**: Ensures the host header matches the target API Gateway URL, which is required by AWS.
* **`secure: true`**: Verifies the SSL certificate for the HTTPS connection.