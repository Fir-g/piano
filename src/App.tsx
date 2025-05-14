import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PianoPage from './pages/PianoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MelodiesPage from './pages/MelodiesPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<PianoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/melodies" 
                element={
                  <ProtectedRoute>
                    <MelodiesPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="bg-white py-4 border-t border-gray-200">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
             🎹 Virtual Piano App © {new Date().getFullYear()} — Made with u ❤️
Let the music of your soul flow with every melody you create. Every tune tells a story! ✨🎶
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;