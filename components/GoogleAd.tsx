
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
    // Prevent double pushing
    if (isLoaded) return;

    const pushAd = () => {
      try {
        if (window.adsbygoogle && adRef.current && adRef.current.offsetParent !== null) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
          // Hide spinner after a delay to allow the ad to actually render
          setTimeout(() => setShowSpinner(false), 2000);
        }
      } catch (e) {
        console.error('AdSense push error:', e);
        setShowSpinner(false);
      }
    };

    const timer = setTimeout(pushAd, 300);
    
    // Safety timeout: if ad doesn't load in 5 seconds, hide spinner anyway
    const safetyTimer = setTimeout(() => setShowSpinner(false), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [isLoaded, slot]);

  const getMinHeight = () => {
    if (height) return height;
    switch (format) {
      case 'fluid': return '280px';
      case 'horizontal': return '90px';
      case 'vertical': return '600px';
      case 'rectangle': return '250px';
      case 'autorelaxed': return '500px'; 
      default: return '280px';
    }
  };

  return (
    <div className={`ad-container w-full overflow-hidden clear-both transition-all duration-300 ${className}`}>
      {showLabel && (
        <div className="text-[9px] text-gray-400 dark:text-gray-600 text-center uppercase tracking-[0.4em] mb-2 font-black opacity-50">
          Sponsored Content
        </div>
      )}
      <div 
        className="relative bg-gray-50/30 dark:bg-gray-900/20 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800/40"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-gray-50/50 dark:bg-gray-900/50 z-10 transition-opacity duration-500">
             <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-2"></div>
             <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Discovery</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
