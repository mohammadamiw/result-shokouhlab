/**
 * مثال استفاده از کامپوننت TestCard
 * این فایل فقط برای نمایش نحوه استفاده است و در پروژه اصلی استفاده نمی‌شود
 */

import TestCard from './TestCard';

function TestCardExample() {
  // مثال داده‌های آزمایش
  const exampleTests = [
    {
      id: 'test-1',
      testName: 'FBS',
      result: '86',
      normalRange: '70-100',
      unit: 'mg/dL'
    },
    {
      id: 'test-2',
      testName: 'Cholesterol',
      result: '220',
      normalRange: '<200',
      unit: 'mg/dL'
    },
    {
      id: 'test-3',
      testName: 'Hemoglobin',
      result: '12.5',
      normalRange: '12-16',
      unit: 'g/dL'
    },
    {
      id: 'test-4',
      testName: 'Vitamin D',
      result: '15',
      normalRange: '>30',
      unit: 'ng/mL'
    }
  ];

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'white', marginBottom: '30px', textAlign: 'center' }}>
        مثال استفاده از TestCard
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {exampleTests.map(test => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}

export default TestCardExample;

