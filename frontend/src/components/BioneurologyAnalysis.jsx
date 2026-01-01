import { useMemo } from 'react';
import './BioneurologyAnalysis.css';

function BioneurologyAnalysis({ tests }) {
  // تحلیل بیونورولوژی داده‌ها
  const analysis = useMemo(() => {
    if (!tests || tests.length === 0) return null;

    const totalTests = tests.length;
    const normalTests = tests.filter(t => t.status === 'normal').length;
    const abnormalTests = totalTests - normalTests;
    const highTests = tests.filter(t => t.status === 'high').length;
    const lowTests = tests.filter(t => t.status === 'low').length;

    // محاسبه درصدها
    const normalPercentage = ((normalTests / totalTests) * 100).toFixed(1);
    const abnormalPercentage = ((abnormalTests / totalTests) * 100).toFixed(1);

    // تحلیل روند
    const recentTests = tests.slice(0, 10);
    const recentNormal = recentTests.filter(t => t.status === 'normal').length;
    const recentAbnormal = recentTests.length - recentNormal;
    
    let trend = 'stable';
    if (recentAbnormal > recentNormal) {
      trend = 'declining';
    } else if (recentNormal > recentAbnormal * 2) {
      trend = 'improving';
    }

    // گروه‌بندی آزمایش‌ها
    const testCategories = {};
    tests.forEach(test => {
      const category = categorizeTest(test.testName);
      if (!testCategories[category]) {
        testCategories[category] = [];
      }
      testCategories[category].push(test);
    });

    return {
      totalTests,
      normalTests,
      abnormalTests,
      highTests,
      lowTests,
      normalPercentage,
      abnormalPercentage,
      trend,
      testCategories,
      recommendations: generateRecommendations(tests, trend, abnormalTests)
    };
  }, [tests]);

  // دسته‌بندی آزمایش‌ها
  function categorizeTest(testName) {
    if (!testName) return 'سایر';
    
    const name = testName.toLowerCase();
    if (name.includes('خون') || name.includes('cbc') || name.includes('hemoglobin')) {
      return 'خون';
    } else if (name.includes('قند') || name.includes('glucose') || name.includes('sugar')) {
      return 'قند خون';
    } else if (name.includes('کلسترول') || name.includes('cholesterol') || name.includes('lipid')) {
      return 'چربی خون';
    } else if (name.includes('کبد') || name.includes('liver') || name.includes('alt') || name.includes('ast')) {
      return 'کبد';
    } else if (name.includes('کلیه') || name.includes('kidney') || name.includes('creatinine')) {
      return 'کلیه';
    } else if (name.includes('تیروئید') || name.includes('thyroid') || name.includes('tsh')) {
      return 'تیروئید';
    } else {
      return 'سایر';
    }
  }

  // تولید توصیه‌ها
  function generateRecommendations(tests, trend, abnormalCount) {
    const recommendations = [];

    if (trend === 'declining') {
      recommendations.push({
        type: 'warning',
        title: '⚠️ توجه به روند نزولی',
        message: 'تعداد آزمایش‌های غیرنرمال در حال افزایش است. توصیه می‌شود با پزشک خود مشورت کنید.'
      });
    }

    if (abnormalCount > tests.length * 0.3) {
      recommendations.push({
        type: 'important',
        title: '🔴 نیاز به پیگیری',
        message: 'بیش از 30% آزمایش‌های شما خارج از محدوده نرمال است. مراجعه به پزشک ضروری است.'
      });
    }

    const highTests = tests.filter(t => t.status === 'high');
    if (highTests.length > 0) {
      recommendations.push({
        type: 'info',
        title: '📊 آزمایش‌های بالا',
        message: `${highTests.length} آزمایش شما بالاتر از حد نرمال است. رژیم غذایی و سبک زندگی خود را بررسی کنید.`
      });
    }

    const lowTests = tests.filter(t => t.status === 'low');
    if (lowTests.length > 0) {
      recommendations.push({
        type: 'info',
        title: '📉 آزمایش‌های پایین',
        message: `${lowTests.length} آزمایش شما پایین‌تر از حد نرمال است. ممکن است نیاز به مکمل یا تغییر رژیم داشته باشید.`
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: '✅ وضعیت مطلوب',
        message: 'اکثر آزمایش‌های شما در محدوده نرمال است. به رژیم غذایی و ورزش منظم خود ادامه دهید.'
      });
    }

    return recommendations;
  }

  if (!analysis) {
    return (
      <div className="analysis-container">
        <div className="empty-state">
          <p>داده‌ای برای تحلیل وجود ندارد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>🧠 تحلیل بیونورولوژی</h2>
        <p>تحلیل هوشمند نتایج آزمایش‌های شما</p>
      </div>

      {/* آمار کلی */}
      <div className="stats-grid">
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{analysis.normalTests}</div>
          <div className="stat-label">آزمایش نرمال</div>
          <div className="stat-percentage">{analysis.normalPercentage}%</div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{analysis.abnormalTests}</div>
          <div className="stat-label">آزمایش غیرنرمال</div>
          <div className="stat-percentage">{analysis.abnormalPercentage}%</div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">🔴</div>
          <div className="stat-value">{analysis.highTests}</div>
          <div className="stat-label">بالاتر از نرمال</div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">🔵</div>
          <div className="stat-value">{analysis.lowTests}</div>
          <div className="stat-label">پایین‌تر از نرمال</div>
        </div>
      </div>

      {/* روند */}
      <div className="trend-section">
        <h3>📈 روند کلی</h3>
        <div className={`trend-badge trend-${analysis.trend}`}>
          {analysis.trend === 'improving' && '📈 در حال بهبود'}
          {analysis.trend === 'declining' && '📉 در حال کاهش'}
          {analysis.trend === 'stable' && '➡️ پایدار'}
        </div>
      </div>

      {/* دسته‌بندی آزمایش‌ها */}
      <div className="categories-section">
        <h3>📂 دسته‌بندی آزمایش‌ها</h3>
        <div className="categories-grid">
          {Object.entries(analysis.testCategories).map(([category, categoryTests]) => (
            <div key={category} className="category-card">
              <div className="category-name">{category}</div>
              <div className="category-count">{categoryTests.length} آزمایش</div>
              <div className="category-status">
                نرمال: {categoryTests.filter(t => t.status === 'normal').length} | 
                غیرنرمال: {categoryTests.filter(t => t.status !== 'normal').length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* توصیه‌ها */}
      <div className="recommendations-section">
        <h3>💡 توصیه‌های هوشمند</h3>
        <div className="recommendations-list">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card recommendation-${rec.type}`}>
              <div className="recommendation-title">{rec.title}</div>
              <div className="recommendation-message">{rec.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BioneurologyAnalysis;

