import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ label, value }) => {
  const clampedValue = Math.max(0, Math.min(10, Number(value) || 0));

  if (clampedValue > 10 || isNaN(clampedValue)) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
            {label || 'Unknown'}
          </span>
          <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
            Insufficient Data
          </span>
        </div>
      </div>
    );
  }

  const getBarColor = (val) => {
    const isStress = label === 'Stress';
    if (isStress) {
      if (val <= 2.5) return '#EF4444'; // Red
      if (val <= 5) return '#EAB308'; // Yellow
      if (val <= 7.5) return '#3B82F6'; // Blue
      return '#22C55E'; // Green
    }
    if (val <= 2.5) return '#22C55E'; // Green
    if (val <= 5) return '#3B82F6'; // Blue
    if (val <= 7.5) return '#EAB308'; // Yellow
    return '#EF4444'; // Red
  };

  const barColor = getBarColor(clampedValue);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
          {label || 'Unknown'}
        </span>
        <span className="text-lg font-medium text-[var(--mp-custom-gray-600)]">
          {clampedValue.toFixed(1)} / 10
        </span>
      </div>
      <div className="relative h-2 bg-[var(--mp-custom-gray-200)] rounded-lg overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-lg"
          style={{
            width: `${clampedValue * 10}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)`,
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
};

ProgressBar.defaultProps = {
  label: 'Unknown',
  value: 0,
};

export default ProgressBar;