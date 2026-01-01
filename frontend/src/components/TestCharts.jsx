import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './TestCharts.css';

function TestCharts({ tests }) {
  // آماده‌سازی داده‌ها برای نمودار
  const chartData = useMemo(() => {
    if (!tests || tests.length === 0) return [];

    // گروه‌بندی آزمایش‌ها بر اساس نام
    const testGroups = {};
    
    tests.forEach(test => {
      if (!test.testName || !test.result) return;
      
      const testName = test.testName;
      if (!testGroups[testName]) {
        testGroups[testName] = [];
      }

      // استخراج عدد از نتیجه (اگر ممکن باشد)
      const numericValue = parseFloat(test.result);
      if (!isNaN(numericValue)) {
        testGroups[testName].push({
          date: test.testDate?.jalali || test.testDate?.formatted || 'نامشخص',
          value: numericValue,
          unit: test.unit || '',
          status: test.status
        });
      }
    });

    // تبدیل به آرایه و مرتب‌سازی بر اساس تاریخ
    return Object.entries(testGroups).map(([name, data]) => ({
      testName: name,
      data: data.sort((a, b) => {
        // مرتب‌سازی ساده بر اساس تاریخ
        return a.date.localeCompare(b.date);
      })
    }));
  }, [tests]);

  // آماده‌سازی داده‌ها برای نمودار وضعیت
  const statusData = useMemo(() => {
    const statusCount = {
      normal: 0,
      high: 0,
      low: 0,
      unknown: 0
    };

    tests.forEach(test => {
      const status = test.status || 'unknown';
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status]++;
      }
    });

    return [
      { name: 'نرمال', value: statusCount.normal, color: '#28a745' },
      { name: 'بالا', value: statusCount.high, color: '#dc3545' },
      { name: 'پایین', value: statusCount.low, color: '#ffc107' },
      { name: 'نامشخص', value: statusCount.unknown, color: '#6c757d' }
    ];
  }, [tests]);

  if (tests.length === 0) {
    return (
      <div className="charts-container">
        <div className="empty-state">
          <p>داده‌ای برای نمایش نمودار وجود ندارد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h2>نمودارهای تحلیلی</h2>
      </div>

      {/* نمودار وضعیت آزمایش‌ها */}
      <div className="chart-card">
        <h3>وضعیت کلی آزمایش‌ها</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* نمودارهای روند آزمایش‌ها */}
      {chartData.length > 0 && (
        <div className="charts-grid">
          {chartData.slice(0, 6).map((group, index) => (
            <div key={index} className="chart-card">
              <h3>{group.testName}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={group.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#667eea" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}

      {chartData.length === 0 && (
        <div className="empty-state">
          <p>هیچ داده عددی برای نمایش نمودار یافت نشد</p>
        </div>
      )}
    </div>
  );
}

export default TestCharts;

