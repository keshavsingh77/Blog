
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
  height?: string; // Optional precise height override
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
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoaded, slot]);

  // Optimized Styling to prevent Cumulative Layout Shift (CLS)
  // Values are calibrated to match common AdSense responsive behaviors
  const getMinHeight = () => {
    if (height) return height;
    switch (format) {
      case 'fluid': return '320px';
      case 'horizontal': return '100px';
      case 'vertical': return '600px';
      case 'rectangle': return '280px';
      case 'autorelaxed': return '550px'; // Multiplex ads need more room for the grid
      default: return '280px';
    }
  };

  return (
    <div className={`ad-container w-full overflow-hidden clear-both transition-all duration-300 ${className}`}>
      {showLabel && (
        <div className="text-[10px] text-gray-400 dark:text-gray-600 text-center uppercase tracking-[0.3em] mb-2 font-black opacity-60">
          ADVERTISEMENT
        </div>
      )}
      <div 
        className="relative bg-gray-50/50 dark:bg-gray-900/40 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800/60 transition-all duration-500"
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
        
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
             <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3"></div>
             <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sponsored</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
