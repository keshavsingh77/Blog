
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' | 'autorelaxed'; 
  layoutKey?: string;
  layout?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  showLabel?: boolean;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format = 'auto', 
  layoutKey,
  layout, 
  style, 
  className = '',
  responsive = true,
  showLabel = true
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent double pushing if the component re-renders
    if (isLoaded) return;

    const pushAd = () => {
      try {
        if (window.adsbygoogle && adRef.current && adRef.current.offsetParent !== null) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        }
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    };

    // Initialize with a small delay to ensure DOM is stable
    const timer = setTimeout(() => {
      pushAd();
    }, 150);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Styling to prevent Cumulative Layout Shift (CLS)
  const getMinHeight = () => {
    if (format === 'fluid') return '280px';
    if (format === 'horizontal') return '90px';
    if (format === 'vertical') return '600px';
    return '250px';
  };

  return (
    <div className={`ad-container my-8 w-full overflow-hidden ${className}`}>
      {showLabel && (
        <div className="text-[10px] text-gray-400 dark:text-gray-600 text-center uppercase tracking-[0.2em] mb-2 font-bold">
          Advertisement
        </div>
      )}
      <div 
        className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-800"
        style={{ minHeight: getMinHeight() }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            textAlign: 'center',
            ...style 
          }}
          data-ad-client="ca-pub-9543073887536718"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
          {...(layout ? { 'data-ad-layout': layout } : {})}
        ></ins>
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
