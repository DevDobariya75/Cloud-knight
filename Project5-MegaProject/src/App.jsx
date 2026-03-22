import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LoginModalProvider } from './context/LoginModalContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Assessment from './pages/Assessment';
import Result from './pages/Result';
import History from './pages/History';
import PHCFinder from './pages/PHCFinder';

function App() {
  return (
    <AppProvider>
      <LoginModalProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />

              <Route
                path="/assessment"
                element={
                  <ProtectedRoute>
                    <Assessment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route path="/screen" element={<Navigate to="/assessment" replace />} />
              <Route path="/result" element={<Result />} />
              
            <Route
              path="/phc-finder"
              element={
                <ProtectedRoute>
                  <PHCFinder />
                </ProtectedRoute>
              }
            />  

            </Route>
          </Routes>
        </BrowserRouter>
      </LoginModalProvider>
    </AppProvider>
  );
}

export default App;