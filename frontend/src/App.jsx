import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdmissionDetail from './components/AdmissionDetail';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // بررسی اینکه آیا توکن در localStorage وجود دارد
    const savedToken = localStorage.getItem('lab_token');
    const savedUserInfo = localStorage.getItem('lab_user_info');
    
    if (savedToken && savedUserInfo) {
      setToken(savedToken);
      setUserInfo(JSON.parse(savedUserInfo));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, userInfo) => {
    setToken(token);
    setUserInfo(userInfo);
    setIsAuthenticated(true);
    localStorage.setItem('lab_token', token);
    localStorage.setItem('lab_user_info', JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    setAdmissions([]);
    setSummary(null);
    localStorage.removeItem('lab_token');
    localStorage.removeItem('lab_user_info');
  };

  // ذخیره داده‌های آزمایش‌ها برای استفاده در صفحات مختلف
  const handleDataLoaded = (newAdmissions, newSummary) => {
    setAdmissions(newAdmissions);
    setSummary(newSummary);
    // به‌روزرسانی userInfo با نام بیمار
    if (newSummary?.patientName && userInfo) {
      const updatedUserInfo = { ...userInfo, patientName: newSummary.patientName };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('lab_user_info', JSON.stringify(updatedUserInfo));
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard 
                token={token} 
                userInfo={userInfo} 
                onLogout={handleLogout}
                onDataLoaded={handleDataLoaded}
                admissions={admissions}
                summary={summary}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admission/:admissionId"
          element={
            isAuthenticated ? (
              <AdmissionDetail 
                admissions={admissions} 
                userInfo={userInfo}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;

