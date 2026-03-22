import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Suppress Cognito SDK network errors that don't affect functionality
const originalError = console.error;
console.error = (...args) => {
  // Suppress Cognito 400 errors from token validation
  if (args[0]?.toString().includes('cognito-idp') || 
      args[0]?.toString().includes('Failed to load resource')) {
    return;
  }
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);