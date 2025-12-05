
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
    if (adLoaded) return;
    const element = adRef.current;
    if (!element) return;

    const tryPushAd = () => {
       try {
         if (element && element.clientWidth > 0) {
            if (format === 'fluid' && element.clientWidth < 250) return false;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdLoaded(true);
            return true;
         }
       } catch (e) {
         console.error('AdSense error:', e);
       }
       return false;
    };

    if (tryPushAd()) return;

    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentRect.width > 0) {
                 if (tryPushAd()) observer.disconnect();
            }
        }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [slot, format, adLoaded]);

  // STRICT CSS to prevent CLS
  const containerStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    minHeight: format === 'fluid' ? '250px' : '280px', // Prevent height collapse
    backgroundColor: '#f9f9f9', // Placeholder color to visualize space
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
