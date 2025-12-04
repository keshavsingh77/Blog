
import React, { useEffect, useRef, useState } from 'react';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' | 'autorelaxed'; 
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
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Prevent double loading
    if (adLoaded) return;
    
    const element = adRef.current;
    if (!element) return;

    // Function to attempt pushing the ad safely
    const tryPushAd = () => {
       try {
         if (element && element.clientWidth > 0) {
            // CRITICAL CHECK: Fluid ads require at least 250px width.
            // If width is smaller (e.g., hidden or mobile layout issue), we wait.
            if (format === 'fluid' && element.clientWidth < 250) {
                // console.warn(`AdSense: Fluid ad container width (${element.clientWidth}px) is too small. Waiting for layout...`);
                return false; 
            }

            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
            return true;
         }
       } catch (e) {
         console.error('AdSense error:', e);
       }
       return false;
    };

    // 1. Try immediately (in case layout is ready)
    if (tryPushAd()) return;

    // 2. Setup ResizeObserver to detect when container gets dimensions
    // This fixes the race condition where React renders before CSS layout is finalized
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentRect.width > 0) {
                 if (tryPushAd()) {
                     observer.disconnect(); // Stop observing once ad is pushed
                 }
            }
        }
    });

    observer.observe(element);

    // 3. Fallback polling (safety net for browsers with ResizeObserver quirks)
    const intervalId = setInterval(() => {
        if (tryPushAd()) {
            clearInterval(intervalId);
            observer.disconnect();
        }
    }, 1000);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [slot, format, adLoaded]);

  // Robust container styles to ensure the element takes up space immediately
  const containerStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    minWidth: format === 'fluid' ? '250px' : undefined, // Force min-width for fluid ads
    minHeight: format === 'fluid' ? '250px' : '280px',  // Reserve vertical space to prevent CLS
    textAlign: layout === 'in-article' ? 'center' : undefined,
    ...style,
  };

  return (
    <div className={`${className} google-ad-wrapper`} style={{ width: '100%', minHeight: '280px', display: 'block' }}>
      <ins
        ref={adRef}
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
