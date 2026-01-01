import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TEST_CATEGORIES, groupTestsByCategory, groupBiochemistryByProfile, groupHormoneByProfile } from '../utils/testCategories';
import TestCard from './TestCard';
import './AdmissionDetail.css';

function AdmissionDetail({ admissions, userInfo }) {
  const { admissionId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // پیدا کردن پذیرش مورد نظر
  const admission = useMemo(() => {
    return admissions?.find(a => String(a.id) === String(admissionId) || String(a.admitNumber) === String(admissionId));
  }, [admissions, admissionId]);

  // گروه‌بندی آزمایش‌ها
  const groupedTests = useMemo(() => {
    if (!admission?.tests) return {};
    return groupTestsByCategory(admission.tests);
  }, [admission]);

  // فیلتر آزمایش‌ها بر اساس جستجو
  const filteredTests = useMemo(() => {
    if (!admission?.tests) return [];
    
    let tests = admission.tests;
    
    // فیلتر بر اساس دسته
    if (activeCategory !== 'all') {
      tests = groupedTests[activeCategory] || [];
    }
    
    // فیلتر بر اساس جستجو
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      tests = tests.filter(t => 
        t.testName?.toLowerCase().includes(term) ||
        t.result?.toLowerCase().includes(term)
      );
    }
    
    return tests;
  }, [admission, activeCategory, searchTerm, groupedTests]);

  // تعداد آزمایش در هر دسته
  const categoryCounts = useMemo(() => {
    const counts = { all: admission?.tests?.length || 0 };
    for (const [key, tests] of Object.entries(groupedTests)) {
      counts[key] = tests.length;
    }
    return counts;
  }, [groupedTests, admission]);

  if (!admission) {
    return (
      <div className="admission-detail-container">
        <div className="not-found">
          <div className="not-found-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <h2>پذیرش یافت نشد</h2>
          <p>پذیرش با شماره {admissionId} وجود ندارد</p>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admission-detail-container">
      {/* هدر */}
      <header className="detail-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            بازگشت به داشبورد
          </button>
          
          <div className="admission-info-header">
            <div className="admission-title">
              <h1>جزئیات پذیرش</h1>
              <span className="admission-number-badge">#{admission.admitNumber || admission.id}</span>
            </div>
            
            <div className="admission-meta-info">
              {userInfo?.patientName && (
                <div className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{userInfo.patientName}</span>
                </div>
              )}
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span>{admission.date}</span>
              </div>
              <div className={`status-badge ${admission.status === 'تکمیل شده' ? 'completed' : 'pending'}`}>
                {admission.status === 'تکمیل شده' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                )}
                {admission.status}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* خلاصه آمار */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{admission.testCount}</span>
              <span className="stat-label">کل آزمایش‌ها</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon categories">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">{Object.keys(groupedTests).length}</span>
              <span className="stat-label">دسته‌بندی</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon normal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {admission.tests?.filter(t => !t.isPending && t.status === 'normal').length || 0}
              </span>
              <span className="stat-label">نرمال</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon abnormal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {admission.tests?.filter(t => !t.isPending && (t.status === 'high' || t.status === 'low')).length || 0}
              </span>
              <span className="stat-label">غیرنرمال</span>
            </div>
          </div>
        </div>
      </div>

      {/* بخش جستجو و فیلتر */}
      <div className="filter-section">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="جستجو در آزمایش‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="categories-section">
        <h2>دسته‌بندی آزمایش‌ها</h2>
        <p className="section-desc">آزمایش‌ها در {Object.keys(groupedTests).length} دسته سازماندهی شده‌اند</p>
        
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span className="tab-name">همه</span>
            <span className="tab-count">{categoryCounts.all}</span>
          </button>
          
          {Object.entries(groupedTests).map(([key, tests]) => {
            const category = TEST_CATEGORIES[key];
            return (
              <button
                key={key}
                className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
                style={{ '--category-color': category.color }}
              >
                <span className="tab-name">{category.name}</span>
                <span className="tab-count">{tests.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* لیست آزمایش‌ها */}
      <div className="tests-section">
        {activeCategory === 'all' ? (
          // نمایش همه دسته‌ها
          Object.entries(groupedTests).map(([key, tests]) => {
            const category = TEST_CATEGORIES[key];
            const filteredCategoryTests = searchTerm
              ? tests.filter(t => 
                  t.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.result?.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : tests;
            
            if (filteredCategoryTests.length === 0) return null;
            
            return (
              <div key={key} className="category-section" style={{ '--category-color': category.color }}>
                <div className="category-header">
                  <div className="category-info">
                    <div className="category-icon" style={{ background: `${category.color}15`, color: category.color }}>
                      <CategoryIcon name={category.icon} />
                    </div>
                    <div className="category-text">
                      <h3>{category.name}</h3>
                      <span className="category-name-en">{category.nameEn}</span>
                    </div>
                  </div>
                  <span className="category-count">{filteredCategoryTests.length} آزمایش</span>
                </div>
                
                <div className="category-tests">
                  {filteredCategoryTests.map((test, index) => (
                    <TestCard key={test.id || `${key}-${index}`} test={test} />
                  ))}
                </div>
              </div>
            );
          })
        ) : activeCategory === 'biochemistry' ? (
          // نمایش بیوشیمی با پروفایل‌ها
          <CategoryWithProfiles 
            tests={filteredTests} 
            searchTerm={searchTerm} 
            groupFunction={groupBiochemistryByProfile}
            profileOrder={['glucose', 'lipid', 'renal', 'liver', 'electrolytes', 'cardiac', 'other']}
          />
        ) : activeCategory === 'hormone' ? (
          // نمایش هورمون‌ها با پروفایل‌ها
          <CategoryWithProfiles 
            tests={filteredTests} 
            searchTerm={searchTerm} 
            groupFunction={groupHormoneByProfile}
            profileOrder={['thyroid', 'reproductive', 'adrenal', 'growth', 'metabolic', 'other']}
          />
        ) : (
          // نمایش یک دسته خاص
          <div className="category-section" style={{ '--category-color': TEST_CATEGORIES[activeCategory]?.color }}>
            <div className="category-header">
              <div className="category-info">
                <div 
                  className="category-icon" 
                  style={{ 
                    background: `${TEST_CATEGORIES[activeCategory]?.color}15`, 
                    color: TEST_CATEGORIES[activeCategory]?.color 
                  }}
                >
                  <CategoryIcon name={TEST_CATEGORIES[activeCategory]?.icon} />
                </div>
                <div className="category-text">
                  <h3>{TEST_CATEGORIES[activeCategory]?.name}</h3>
                  <span className="category-name-en">{TEST_CATEGORIES[activeCategory]?.nameEn}</span>
                </div>
              </div>
              <span className="category-count">{filteredTests.length} آزمایش</span>
            </div>
            
            <div className="category-tests">
              {filteredTests.map((test, index) => (
                <TestCard key={test.id || `filtered-${index}`} test={test} />
              ))}
            </div>
          </div>
        )}
        
        {filteredTests.length === 0 && activeCategory !== 'all' && (
          <div className="no-results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <p>آزمایشی با این مشخصات یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت نمایش دسته‌بندی با پروفایل‌ها (بیوشیمی، هورمون، ...)
function CategoryWithProfiles({ tests, searchTerm, groupFunction, profileOrder }) {
  const profiles = useMemo(() => {
    return groupFunction(tests);
  }, [tests, groupFunction]);
  
  return (
    <div className="category-profiles">
      {profileOrder.map(profileKey => {
        const profile = profiles[profileKey];
        if (!profile || profile.tests.length === 0) return null;
        
        // فیلتر بر اساس جستجو
        const filteredTests = searchTerm
          ? profile.tests.filter(t => 
              t.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.result?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : profile.tests;
        
        if (filteredTests.length === 0) return null;
        
        return (
          <div key={profileKey} className="profile-section" style={{ '--profile-color': profile.color }}>
            <div className="profile-header">
              <div className="profile-info">
                <div className="profile-icon" style={{ background: `${profile.color}15`, color: profile.color }}>
                  <ProfileIcon name={profileKey} />
                </div>
                <div className="profile-text">
                  <h4>{profile.name}</h4>
                  <span className="profile-name-en">{profile.nameEn}</span>
                  {profile.description && (
                    <p className="profile-description">{profile.description}</p>
                  )}
                </div>
              </div>
              <span className="profile-count">{filteredTests.length} تست</span>
            </div>
            
            <div className="profile-tests">
              {filteredTests.map((test, index) => (
                <TestCard key={test.id || `${profileKey}-${index}`} test={test} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// آیکون‌های پروفایل‌ها (بیوشیمی و هورمون)
function ProfileIcon({ name }) {
  const icons = {
    // پروفایل‌های بیوشیمی
    glucose: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
        <path d="M12 8v8"/>
        <path d="M8 12h8"/>
      </svg>
    ),
    lipid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    ),
    renal: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.5 4.5-1.5"/>
        <path d="M22 12c0-5.5-4.5-10-10-10"/>
      </svg>
    ),
    liver: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="8"/>
        <path d="M12 4v16"/>
      </svg>
    ),
    electrolytes: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    cardiac: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    // پروفایل‌های هورمونی
    thyroid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v6M8 6l4-4 4 4"/>
        <ellipse cx="12" cy="14" rx="6" ry="8"/>
      </svg>
    ),
    reproductive: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="5"/>
        <path d="M12 13v9"/>
        <path d="M9 18h6"/>
      </svg>
    ),
    adrenal: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    growth: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20V10"/>
        <path d="M18 20V4"/>
        <path d="M6 20v-4"/>
      </svg>
    ),
    metabolic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    other: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>
    )
  };
  
  return icons[name] || icons.other;
}

// کامپوننت آیکون دسته‌بندی
function CategoryIcon({ name }) {
  const icons = {
    blood: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
      </svg>
    ),
    coagulation: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    chemistry: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3h6v7l4 7H5l4-7V3z"/>
        <path d="M6 21h12"/>
      </svg>
    ),
    thyroid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v6M8 6l4-4 4 4"/>
        <ellipse cx="12" cy="14" rx="6" ry="8"/>
      </svg>
    ),
    hormone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    immunity: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    virus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="6"/>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
      </svg>
    ),
    urine: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 2v4M16 2v4"/>
        <path d="M8 6h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"/>
        <path d="M6 12h12"/>
      </svg>
    ),
    fluids: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
        <path d="M8 14h8"/>
        <path d="M9 17h6"/>
      </svg>
    ),
    tumor: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    other: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>
    )
  };
  
  return icons[name] || icons.other;
}

export default AdmissionDetail;

