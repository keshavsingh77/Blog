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

const ADS_SCRIPT_ID = 'google-adsense-script';

const injectAdSenseScript = () => {
  if (document.getElementById(ADS_SCRIPT_ID)) return;
  const script = document.createElement('script');
  script.id = ADS_SCRIPT_ID;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9543073887536718";
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [initAttempted, setInitAttempted] = useState(false);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          injectAdSenseScript();
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(currentContainer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || initAttempted) return;

    const tryPush = (retries = 0) => {
      if (retries > 10) return; // Stop after 10 attempts

      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setInitAttempted(true);
        } else {
          // Script not ready, try again in 300ms
          setTimeout(() => tryPush(retries + 1), 300);
        }
      } catch (e) {
        console.warn('AdSense Push Error:', e);
        setInitAttempted(true); // Don't keep retrying if it crashes
      }
    };

    tryPush();
  }, [isVisible, initAttempted]);

  const getMinHeight = () => {
    if (height) return height;
    switch (format) {
      case 'horizontal': return '90px';
      case 'vertical': return '600px';
      case 'rectangle': return '250px';
      default: return '200px';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`ad-container w-full overflow-hidden my-8 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {showLabel && (
        <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center uppercase tracking-[0.3em] mb-3 font-black opacity-40 select-none">
          Advertisement
        </div>
      )}
      
      <div 
        className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
        style={{ minHeight: getMinHeight(), ...style }}
      >
        {isVisible && (
          <ins
            key={`ad-${slot}-${format}`}
            className="adsbygoogle"
            style={{ 
              display: 'block', 
              width: '100%',
              minHeight: getMinHeight(),
            }}
            data-ad-client="ca-pub-9543073887536718"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
            {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
            {...(layout ? { 'data-ad-layout': layout } : {})}
          ></ins>
        )}
        
        {!initAttempted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 border-2 border-blue-600/10 border-t-blue-600/40 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;