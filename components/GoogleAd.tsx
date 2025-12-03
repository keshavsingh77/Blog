import React, { useEffect } from 'react';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'; // AdSense formats
  layoutKey?: string; // For In-feed ads
  style?: React.CSSProperties; // Custom styles (e.g., width/height for fixed ads)
  className?: string;
  responsive?: boolean;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format, 
  layoutKey, 
  style, 
  className = '',
  responsive = true
}) => {

  useEffect(() => {
    try {
      // Safe push to AdSense
      // We use a small timeout to ensure the DOM element is fully painted by React
      // This helps prevent the 'availableWidth=0' error
      setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 100);
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slot]);

  // Default styles to prevent "availableWidth=0" error
  // We MUST provide display:block and a min-height/width so AdSense sees the element
  const containerStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    minWidth: format === 'fluid' ? '250px' : undefined, // Force min-width for fluid to prevent crash
    minHeight: format === 'fluid' ? '250px' : '100px', // Reserve space so it's not 0px height
    ...style, // Override with specific styles if provided (like the 600x500 ad)
  };

  return (
    <div className={`${className} google-ad-wrapper`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {/* 
         AdSense Unit 
         Publisher ID: ca-pub-9543073887536718
      */}
      <ins
        className="adsbygoogle"
        style={containerStyle}
        data-ad-client="ca-pub-9543073887536718"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      ></ins>
    </div>
  );
};

export default GoogleAd;