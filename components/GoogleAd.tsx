
import React, { useEffect } from 'react';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' | 'autorelaxed'; // Added autorelaxed
  layoutKey?: string; // For In-feed ads
  layout?: string; // For In-article ads
  style?: React.CSSProperties; // Custom styles
  className?: string;
  responsive?: boolean;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format, 
  layoutKey,
  layout, 
  style, 
  className = '',
  responsive = true
}) => {

  useEffect(() => {
    try {
      // Safe push to AdSense
      // We use a small timeout to ensure the DOM element is fully painted by React
      setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 100);
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slot]);

  // Default styles
  const containerStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    minWidth: format === 'fluid' ? '250px' : undefined,
    minHeight: format === 'fluid' ? '250px' : '100px',
    ...style,
  };

  return (
    <div className={`${className} google-ad-wrapper`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <ins
        className="adsbygoogle"
        style={containerStyle}
        data-ad-client="ca-pub-9543073887536718"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      ></ins>
    </div>
  );
};

export default GoogleAd;
