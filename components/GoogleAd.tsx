import React, { useEffect } from 'react';
import AdsensePlaceholder from './AdsensePlaceholder';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '',
  style = { display: 'block' }
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // Use placeholder in development or if API key isn't set (simulating environment where ads shouldn't load)
  // For production, this check should be removed or adjusted.
  if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_ENABLE_ADS) {
      // return <AdsensePlaceholder className={className} />;
      // Uncomment the line above to see placeholders in dev, 
      // otherwise we render the script to test the structure.
  }

  return (
    <div className={`ad-container my-8 ${className}`}>
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client="ca-pub-9543073887536718"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        ></ins>
        <span className="text-[10px] text-gray-400 block text-center mt-1 uppercase tracking-wider">Advertisement</span>
    </div>
  );
};

export default GoogleAd;