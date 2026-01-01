import { useState, useEffect } from 'react';
import axios from 'axios';
import TestList from './TestList';
import TestCharts from './TestCharts';
import BioneurologyAnalysis from './BioneurologyAnalysis';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function Dashboard({ token, userInfo, onLogout, onDataLoaded, admissions: propsAdmissions, summary: propsSummary }) {
  const [admissions, setAdmissions] = useState(propsAdmissions || []);
  const [summary, setSummary] = useState(propsSummary || null);
  const [loading, setLoading] = useState(!propsAdmissions?.length);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    // اگر داده‌ها از قبل وجود ندارند، دریافت کن
    if (!propsAdmissions?.length) {
      fetchTests();
    }
  }, [token, userInfo]);

  const fetchTests = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/patient/tests`, {
        token: token,
        nationalId: userInfo?.nationalId,
        password: userInfo?.password
      });

      if (response.data.success) {
        const newAdmissions = response.data.admissions || [];
        const newSummary = response.data.summary || null;
        setAdmissions(newAdmissions);
        setSummary(newSummary);
        // اطلاع به App برای ذخیره داده‌ها
        if (onDataLoaded) {
          onDataLoaded(newAdmissions, newSummary);
        }
      } else {
        setError('خطا در دریافت داده‌ها');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'خطا در ارتباط با سرور';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        setTimeout(() => {
          onLogout();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const allTests = admissions.flatMap(a => a.tests || []);

  // نام کاربر از summary
  const patientName = summary?.patientName;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>پنل نتایج آزمایشگاه</h1>
            <div className="user-info">
              {patientName && (
                <span className="user-name">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {patientName}
                </span>
              )}
              <span className="national-id">کد ملی: {userInfo?.nationalId}</span>
            </div>
          </div>
          <button onClick={onLogout} className="logout-button">
            خروج از حساب
          </button>
        </div>
      </header>

      {summary && !loading && !error && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{summary.totalAdmissions}</span>
              <span className="summary-label">پذیرش</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{summary.totalTests}</span>
              <span className="summary-label">آزمایش</span>
            </div>
          </div>
          <div className="summary-card completed">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{summary.completedCount}</span>
              <span className="summary-label">تکمیل شده</span>
            </div>
          </div>
          <div className="summary-card pending">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="summary-info">
              <span className="summary-value">{summary.pendingCount}</span>
              <span className="summary-label">در انتظار</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            لیست آزمایش‌ها
          </button>
          <button
            className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            نمودارها
          </button>
          <button
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            تحلیل سلامت
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>در حال بارگذاری...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchTests} className="retry-button">
              تلاش مجدد
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'list' && <TestList admissions={admissions} />}
            {activeTab === 'charts' && <TestCharts tests={allTests} />}
            {activeTab === 'analysis' && <BioneurologyAnalysis tests={allTests} />}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
