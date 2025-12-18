
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  // Lazy loading logic using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load when within 200px of viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const pushAd = () => {
      try {
        if (window.adsbygoogle && adRef.current && adRef.current.offsetParent !== null) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
          setTimeout(() => setShowSpinner(false), 1200);
        }
      } catch (e) {
        console.error('AdSense lazy-load error:', e);
        setShowSpinner(false);
      }
    };

    const timer = setTimeout(pushAd, 200);
    return () => clearTimeout(timer);
  }, [isVisible, isLoaded, slot]);

  const getMinHeight = () => {
    if (height) return height;
    switch (format) {
      case 'horizontal': return '90px';
      case 'rectangle': return '280px';
      case 'vertical': return '600px';
      case 'fluid': return '300px';
      case 'autorelaxed': return '550px';
      default: return '280px';
    }
  };

  return (
    <div ref={containerRef} className={`ad-wrapper w-full clear-both overflow-hidden my-4 ${className}`}>
      {showLabel && (
        <div className="text-[9px] text-gray-400 dark:text-gray-600 text-center uppercase tracking-[0.4em] mb-2 font-black opacity-30">
          Sponsored
        </div>
      )}
      <div 
        className="relative bg-gray-50/30 dark:bg-gray-900/20 rounded-2xl flex items-center justify-center border border-gray-100/50 dark:border-gray-800/30 transition-all duration-300"
        style={{ minHeight: getMinHeight(), ...style }}
      >
        {isVisible && (
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
        )}
        
        {(showSpinner || !isVisible) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-gray-950/40 z-10 rounded-2xl backdrop-blur-[2px]">
             <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAd;
