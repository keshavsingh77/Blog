
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
  }, [isLoaded, slot]);

  // Optimized Styling to prevent Cumulative Layout Shift (CLS)
  // These values provide a realistic 'reserved' space for the ad type
  const getMinHeight = () => {
    switch (format) {
      case 'fluid': return '280px';
      case 'horizontal': return '100px';
      case 'vertical': return '600px';
      case 'rectangle': return '250px';
      case 'autorelaxed': return '450px'; // Increased height for Multiplex/Grid ads
      default: return '280px';
    }
  };

  return (
    <div className={`ad-container w-full overflow-hidden clear-both ${className}`}>
      {showLabel && (
        <div className="text-[9px] text-gray-400 dark:text-gray-600 text-center uppercase tracking-[0.3em] mb-1.5 font-black opacity-80">
          Advertisement
        </div>
      )}
      <div 
        className="relative bg-gray-50/30 dark:bg-gray-900/30 rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800/50 transition-all duration-500"
        style={{ minHeight: getMinHeight(), ...style }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            height: '100%',
            textAlign: 'center'
          }}
          data-ad-client="ca-pub-9543073887536718"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
          {...(layout ? { 'data-ad-layout': layout } : {})}
        ></ins>
        
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
             <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-2"></div>
             <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Loading Ad</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
