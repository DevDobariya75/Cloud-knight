import axios from 'axios';

// ✅ Base URL from .env.production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ------------------------------
// Axios instance for main backend
// ------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// ------------------------------
// Axios instance for Alzheimer predictor
// ------------------------------
const alzheimerApi = axios.create({
  baseURL: `${API_BASE_URL}/alzheimer-predictor`,
  timeout: 20000,
});

// ------------------------------
// Authorization interceptor (main API)
// ------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("idToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// Authorization interceptor (predictor API)
// ------------------------------
alzheimerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("idToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------
// Upload X-ray
// ------------------------------
export async function uploadXray(file) {
  const formData = new FormData();
  formData.append('xray', file);

  const response = await api.post('/screening/xray', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
}

// ------------------------------
// Upload Audio
// ------------------------------
export async function uploadAudioForTranscription(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-input.webm');

  const response = await api.post('/voice/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
}

// ------------------------------
// Memory Assessment
// ------------------------------
export async function runMemoryAssessment(payload) {
  const response = await api.post('/screening/memory', payload);
  return response.data;
}

// ------------------------------
// Alzheimer Prediction
// ------------------------------
export async function getPrediction(payload) {
  const response = await alzheimerApi.post('', payload);
  return response.data;
}

// ------------------------------
// Polly Audio
// ------------------------------
export async function getPollyInstructionsAudio(payload) {
  if (!import.meta.env.VITE_POLLY_API_URL) {
    return null;
  }

  const response = await axios.post(
    import.meta.env.VITE_POLLY_API_URL,
    payload,
    { timeout: 15000 }
  );

  return response.data;
}

// ------------------------------
// Save Assessment
// ------------------------------
export async function saveAssessment(payload) {
  const response = await api.post("/save-assessment", payload);
  return response.data;
}

// ------------------------------
// Get Assessments
// ------------------------------
export async function getAssessments(userId) {
  const response = await api.get(`/assessments/${userId}`);
  return response.data;
}

export default api;