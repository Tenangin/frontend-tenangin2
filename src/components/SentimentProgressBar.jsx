import React from 'react';

const sentimentEmojis = {
  joy: { emoji: '😊', color: 'text-warning', bgColor: '#fff3cd', borderColor: '#ffecb5', label: 'Joy' },
  sad: { emoji: '😢', color: 'text-primary', bgColor: '#cff4fc', borderColor: '#b6effb', label: 'Sad' },
  anger: { emoji: '😠', color: 'text-danger', bgColor: '#f8d7da', borderColor: '#f5c2c7', label: 'Anger' },
  fear: { emoji: '😰', color: 'text-secondary', bgColor: '#e2e3e5', borderColor: '#d3d3d4', label: 'Fear' },
  neutral: { emoji: '😐', color: 'text-muted', bgColor: '#f8f9fa', borderColor: '#dee2e6', label: 'Neutral' },
  love: { emoji: '❤️', color: 'text-danger', bgColor: '#f8d7da', borderColor: '#f5c2c7', label: 'Love' },
};

const getAllSentiments = (sentimentData) => {
  if (!Array.isArray(sentimentData) || sentimentData.length === 0) {
    return [];
  }

  const totalSentiments = sentimentData.length;
  const sentimentCounts = {};

  for (const sentiment of sentimentData) {
    sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
  }

  const processedData = Object.entries(sentimentCounts)
    .map(([sentiment, count]) => {
      const score = count / totalSentiments;
      return [sentiment, score];
    })
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  return processedData;
};

const SentimentProgressBar = ({ sentimentResults, small = false }) => {
  const sentiments = getAllSentiments(sentimentResults);

  if (!sentiments.length) {
    return null;
  }

  const containerStyle = {
    justifyContent: 'flex-start',
  };

  const itemStyle = {
    flex: '1 1 200px',
    minWidth: '180px',
    maxWidth: '250px',
    backgroundColor: '',
    border: '',
    padding: small ? '8px' : '16px',
  };

  const emojiStyle = {
    fontSize: small ? '16px' : '24px',
    display: 'block',
    lineHeight: '1',
  };

  const labelStyle = {
    fontSize: small ? '12px' : '14px',
    marginBottom: small ? '4px' : '8px',
  };

  const progressBarHeight = small ? '4px' : '8px';

  const percentageStyle = {
    fontSize: small ? '12px' : '16px',
  };

  return (
    <div className="d-flex flex-wrap gap-3" style={containerStyle}>
      {sentiments.map(([sentiment, score]) => {
        const sentimentData = sentimentEmojis[sentiment.toLowerCase()];
        if (!sentimentData) return null;
        const percentage = Math.round(score * 100);
        itemStyle.backgroundColor = sentimentData.bgColor;
        itemStyle.border = `2px solid ${sentimentData.borderColor}`;
        return (
          <div
            key={sentiment}
            className="d-flex align-items-start rounded"
            style={itemStyle}
          >
            <div className="me-3" style={{ padding: small ? '0 4px 0 0' : undefined }}>
              <span style={emojiStyle}>
                {sentimentData.emoji}
              </span>
            </div>
            <div className="flex-grow-1">
              <div className={`fw-bold mb-2 ${sentimentData.color}`} style={labelStyle}>
                {sentimentData.label}
              </div>
              <div className="progress mb-2" style={{ height: progressBarHeight }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: sentimentData.color.includes('danger')
                      ? '#dc3545'
                      : sentimentData.color.includes('warning')
                      ? '#ffc107'
                      : sentimentData.color.includes('success')
                      ? '#198754'
                      : sentimentData.color.includes('primary')
                      ? '#0d6efd'
                      : sentimentData.color.includes('info')
                      ? '#0dcaf0'
                      : '#6c757d',
                  }}
                ></div>
              </div>
              <div className="fw-bold text-dark" style={percentageStyle}>
                {percentage}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SentimentProgressBar;
