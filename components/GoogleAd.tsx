
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
  height?: string; 
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format = 'auto', 
  layoutKey,
  layout, 
  style, 
  className = '',
  responsive = true,
  showLabel = true,
  height
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    if (isLoaded) return;

    const pushAd = () => {
      try {
        if (window.adsbygoogle && adRef.current && adRef.current.offsetParent !== null) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
          // Standardize loading duration for visual smoothness
          setTimeout(() => setShowSpinner(false), 1500);
        }
      } catch (e) {
        console.error('AdSense error:', e);
        setShowSpinner(false);
      }
    };

    const timer = setTimeout(pushAd, 300);
    const safetyTimer = setTimeout(() => setShowSpinner(false), 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [isLoaded, slot]);

  // MANAGED SIZES: Ensures consistent layout everywhere
  const getMinHeight = () => {
    if (height) return height;
    switch (format) {
      case 'autorelaxed': return '500px'; // Forced height for Multiplex/Recommended grids
      case 'horizontal': return '90px';
      case 'rectangle': return '280px';
      case 'vertical': return '600px';
      case 'fluid': return '320px';
      default: return '280px';
    }
  };

  return (
    <div className={`ad-wrapper w-full overflow-hidden clear-both my-6 ${className}`}>
      {showLabel && (
        <div className="text-[9px] text-gray-400 dark:text-gray-600 text-center uppercase tracking-[0.4em] mb-2 font-black opacity-50">
          Sponsored Recommendations
        </div>
      )}
      <div 
        className="relative bg-gray-50/50 dark:bg-gray-900/40 rounded-3xl flex items-center justify-center border border-gray-100 dark:border-gray-800/60 transition-all duration-500"
        style={{ minHeight: getMinHeight(), ...style }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            minHeight: getMinHeight(),
            textAlign: 'center'
          }}
          data-ad-client="ca-pub-9543073887536718"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
          {...(layout ? { 'data-ad-layout': layout } : {})}
        ></ins>
        
        {showSpinner && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-gray-50/80 dark:bg-gray-950/80 z-10 transition-opacity duration-500 rounded-3xl">
             <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3"></div>
             <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Loading Content</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
