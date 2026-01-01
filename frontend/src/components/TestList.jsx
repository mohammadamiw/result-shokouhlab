import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestCard from './TestCard';
import './TestList.css';

function TestList({ admissions }) {
  const [expandedAdmission, setExpandedAdmission] = useState(null);
  const navigate = useNavigate();

  if (!admissions || admissions.length === 0) {
    return (
      <div className="test-list-container">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
          </div>
          <p>هیچ آزمایشی یافت نشد</p>
        </div>
      </div>
    );
  }

  const toggleAdmission = (id) => {
    setExpandedAdmission(expandedAdmission === id ? null : id);
  };

  const openAdmissionDetail = (admission, e) => {
    e.stopPropagation();
    navigate(`/admission/${admission.admitNumber || admission.id}`);
  };

  return (
    <div className="test-list-container">
      <div className="test-list-header">
        <h2>تاریخچه آزمایش‌ها</h2>
        <span className="admission-count">{admissions.length} پذیرش</span>
      </div>

      <div className="admissions-list">
        {admissions.map((admission, index) => (
          <div 
            key={admission.id || `admission-${index}`} 
            className={`admission-card ${admission.status === 'در حال انجام' ? 'pending' : 'completed'}`}
          >
            <div 
              className="admission-header"
              onClick={() => toggleAdmission(admission.id)}
            >
              <div className="admission-info">
                {/* شماره پذیرش */}
                <div className="admission-number">
                  <div className="number-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                    </svg>
                  </div>
                  <span className="number-value">{admission.admitNumber || admission.id || '—'}</span>
                </div>

                {/* تاریخ پذیرش */}
                <div className="admission-date">
                  <div className="date-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </div>
                  <span className="date-value">{admission.date || 'نامشخص'}</span>
                </div>

                {/* وضعیت */}
                <div className={`admission-status ${admission.status === 'در حال انجام' ? 'status-pending' : 'status-completed'}`}>
                  {admission.status === 'در حال انجام' ? (
                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  ) : (
                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )}
                  <span className="status-text">{admission.status}</span>
                </div>
              </div>
              
              <div className="admission-meta">
                <span className="test-count">{admission.testCount} آزمایش</span>
                <button 
                  className="view-detail-btn"
                  onClick={(e) => openAdmissionDetail(admission, e)}
                >
                  مشاهده جزئیات
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <span className="expand-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {expandedAdmission === admission.id ? (
                      <path d="M5 15l7-7 7 7"/>
                    ) : (
                      <path d="M19 9l-7 7-7-7"/>
                    )}
                  </svg>
                </span>
              </div>
            </div>

            {expandedAdmission === admission.id && (
              <div className="admission-tests">
                <div className="tests-header">
                  <span>پیش‌نمایش آزمایش‌ها</span>
                  <button 
                    className="view-all-btn"
                    onClick={(e) => openAdmissionDetail(admission, e)}
                  >
                    مشاهده همه با دسته‌بندی
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
                <div className="tests-grid">
                  {admission.tests && admission.tests.length > 0 ? (
                    admission.tests.slice(0, 6).map((test, testIndex) => (
                      <TestCard key={test.id || `test-${index}-${testIndex}`} test={test} />
                    ))
                  ) : (
                    <div className="no-tests">
                      <p>هیچ آزمایشی در این پذیرش ثبت نشده</p>
                    </div>
                  )}
                </div>
                {admission.tests && admission.tests.length > 6 && (
                  <div className="more-tests-hint">
                    <span>و {admission.tests.length - 6} آزمایش دیگر...</span>
                    <button 
                      className="view-all-link"
                      onClick={(e) => openAdmissionDetail(admission, e)}
                    >
                      مشاهده همه
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestList;
