import './TestCard.css';

function TestCard({ test }) {
  const isPending = test.isPending || 
                    test.result === 'در حال بررسی...' || 
                    test.result?.includes('آماده نمی باشد');

  const getTestStatus = () => {
    if (isPending) {
      return 'pending';
    }

    if (!test.normalRange || !test.result) {
      return 'unknown';
    }

    const result = parseFloat(test.result);
    if (isNaN(result)) {
      return 'unknown';
    }

    const range = test.normalRange.trim();
    
    const dashMatch = range.match(/(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)/);
    if (dashMatch) {
      const min = parseFloat(dashMatch[1]);
      const max = parseFloat(dashMatch[2]);
      if (result < min) return 'low';
      if (result > max) return 'high';
      return 'normal';
    }

    const lessThanMatch = range.match(/<\s*(\d+\.?\d*)/);
    if (lessThanMatch) {
      const max = parseFloat(lessThanMatch[1]);
      return result < max ? 'normal' : 'high';
    }

    const greaterThanMatch = range.match(/>\s*(\d+\.?\d*)/);
    if (greaterThanMatch) {
      const min = parseFloat(greaterThanMatch[1]);
      return result > min ? 'normal' : 'low';
    }

    return 'unknown';
  };

  const status = getTestStatus();

  const statusText = {
    normal: 'نرمال',
    high: 'بالا',
    low: 'پایین',
    pending: 'در حال بررسی',
    unknown: 'نامشخص'
  };

  return (
    <div className={`test-card test-card-${status}`}>
      <div className="test-card-content">
        <div className="test-card-header">
          <h3 className="test-name">{test.testName || 'نامشخص'}</h3>
          <span className={`status-badge status-${status}`}>
            {statusText[status]}
          </span>
        </div>

        <div className="test-card-body">
          <div className="test-result-section">
            <div className={`result-value ${isPending ? 'result-pending' : ''}`}>
              {isPending ? (
                <span className="pending-text">
                  <span className="pending-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </span>
                  در حال بررسی...
                </span>
              ) : (
                <>
                  {test.result || '—'}
                  {test.unit && <span className="result-unit">{test.unit}</span>}
                </>
              )}
            </div>
          </div>

          {test.normalRange && !isPending && (
            <div className="test-range-section">
              <span className="range-label">محدوده نرمال</span>
              <span className="range-value">{test.normalRange}</span>
            </div>
          )}

          {isPending && (
            <div className="pending-message">
              نتیجه این آزمایش هنوز آماده نشده است
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestCard;
