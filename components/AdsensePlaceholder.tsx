import React from 'react';

interface AdsensePlaceholderProps {
  className?: string;
}

const AdsensePlaceholder: React.FC<AdsensePlaceholderProps> = ({ className }) => {
  return (
    <div
      className={`bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 rounded-lg ${className}`}
    >
      <div className="text-center">
        <p className="font-bold text-lg">Ad Placeholder</p>
        <p className="text-sm">Responsive Ad Unit</p>
      </div>
    </div>
  );
};

export default AdsensePlaceholder;