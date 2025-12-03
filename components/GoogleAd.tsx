
import React, { useEffect, useRef } from 'react';

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' | 'false'; // 'false' for fixed size
  responsive?: boolean;
  layoutKey?: string; // Prop for In-feed/Native ads
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  layoutKey,
  className = '',
  style
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  const attempts = useRef(0);

  // Construct default style based on format to prevent availableWidth=0 error
  const defaultStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    // Enforce minWidth for fluid ads to satisfy AdSense requirements
    ...(format === 'fluid' ? { minWidth: '250px' } : {})
  };

  const finalStyle = { ...defaultStyle, ...style };

  // Wrapper style to ensure the parent of <ins> also has width
  const wrapperStyle: React.CSSProperties = format === 'fluid' ? { minWidth: '250px', display: 'block', width: '100%' } : { width: '100%' };

  useEffect(() => {
    // Prevent double execution in React Strict Mode or if already loaded
    if (initialized.current) return;

    const tryLoadAd = () => {
        // If unmounted, stop
        if (!adRef.current) return;

        // Check if the element actually has width in the DOM
        // offsetWidth > 0 means it's visible and laid out
        // offsetParent !== null means it's not hidden
        if (adRef.current.offsetWidth > 0 && adRef.current.offsetParent !== null) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                initialized.current = true;
                // Optional: remove data-ad-status if previously failed, though usually not needed
            } catch (e) {
                console.error('AdSense error:', e);
            }
        } else {
            // If width is 0, DOM isn't ready. Retry.
            attempts.current += 1;
            // Stop trying after 5 seconds (50 attempts) to prevent infinite loops
            if (attempts.current < 50) {
                setTimeout(tryLoadAd, 100);
            } else {
                console.warn(`AdSense slot ${slot} failed to gain width after multiple attempts.`);
            }
        }
    };

    // Initial delay to let React commit the render
    const timer = setTimeout(tryLoadAd, 200);

    return () => clearTimeout(timer);
  }, [slot]); // Re-run if slot changes (though typically static)

  return (
    <div className={`ad-container ${className}`} style={wrapperStyle}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={finalStyle}
          data-ad-client="ca-pub-9543073887536718"
          data-ad-slot={slot}
          data-ad-format={format === 'false' ? undefined : format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        ></ins>
        {process.env.NODE_ENV === 'development' && (
             <div className="hidden">Debug: Slot {slot}</div>
        )}
    </div>
  );
};

export default GoogleAd;
